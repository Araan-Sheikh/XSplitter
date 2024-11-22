'use client';

import { useState } from 'react';
import { FIAT_CURRENCIES, CRYPTO_CURRENCIES } from '@/utils/currency';

interface Member {
  id: string;
  name: string;
  email: string;
  preferredCurrency: string;
}

interface ManageMembersProps {
  members: Member[];
  onAddMember: (member: Omit<Member, 'id'>) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (memberId: string) => void;
}

export function ManageMembers({ members, onAddMember, onUpdateMember, onDeleteMember }: ManageMembersProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferredCurrency, setPreferredCurrency] = useState('USD');
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      onUpdateMember({
        ...editingMember,
        name,
        email,
        preferredCurrency,
      });
      setEditingMember(null);
    } else {
      onAddMember({
        name,
        email,
        preferredCurrency,
      });
    }
    setName('');
    setEmail('');
    setPreferredCurrency('USD');
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setName(member.name);
    setEmail(member.email);
    setPreferredCurrency(member.preferredCurrency);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">
        {editingMember ? 'Edit Member' : 'Add New Member'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Currency *
          </label>
          <select
            value={preferredCurrency}
            onChange={(e) => setPreferredCurrency(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          >
            <optgroup label="Fiat Currencies">
              {Object.entries(FIAT_CURRENCIES).map(([code, { name }]) => (
                <option key={code} value={code}>
                  {code} - {name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Cryptocurrencies">
              {Object.entries(CRYPTO_CURRENCIES).map(([code, { name, symbol }]) => (
                <option key={code} value={code}>
                  {code} - {name} ({symbol})
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white rounded-md py-2 px-4 hover:bg-primary-dark"
        >
          {editingMember ? 'Update Member' : 'Add Member'}
        </button>

        {editingMember && (
          <button
            type="button"
            onClick={() => {
              setEditingMember(null);
              setName('');
              setEmail('');
              setPreferredCurrency('USD');
            }}
            className="w-full mt-2 bg-gray-100 text-gray-700 rounded-md py-2 px-4 hover:bg-gray-200"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Current Members</h3>
        <div className="space-y-4">
          {members.map(member => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 className="font-medium">{member.name}</h4>
                <p className="text-sm text-gray-500">{member.email}</p>
                <p className="text-sm text-gray-500">
                  Currency: {member.preferredCurrency} 
                  {CRYPTO_CURRENCIES[member.preferredCurrency as keyof typeof CRYPTO_CURRENCIES]?.symbol && 
                    ` (${CRYPTO_CURRENCIES[member.preferredCurrency as keyof typeof CRYPTO_CURRENCIES].symbol})`
                  }
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteMember(member.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 