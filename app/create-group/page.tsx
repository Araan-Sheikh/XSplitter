'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateGroup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/groups/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          createdAt: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create group');
      }

      console.log('Group created:', data);
      
      if (data.data && data.data._id) {
        router.push(`/groups/${data.data._id}`);
      } else {
        throw new Error('No group ID received');
      }
    } catch (err) {
      console.error('Error creating group:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Group</h1>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Group Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-primary text-white rounded-md py-2 px-4 
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'}`}
          >
            {isLoading ? 'Creating...' : 'Create Group'}
          </button>
        </form>
      </div>
    </div>
  );
} 