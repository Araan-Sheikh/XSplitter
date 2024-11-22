'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CreateGroupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name'),
        description: formData.get('description'),
        createdAt: new Date().toISOString()
      };

      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create group');
      }

      const result = await response.json();
      console.log('Group created:', result);

      if (result.data && result.data._id) {
        // Wait a moment before redirecting
        await new Promise(resolve => setTimeout(resolve, 100));
        const groupPath = `/groups/${result.data._id}`;
        console.log('Redirecting to:', groupPath);
        router.push(groupPath);
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (err) {
      console.error('Error creating group:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Group Name *
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        {isLoading ? 'Creating...' : 'Create Group'}
      </button>
    </form>
  );
} 