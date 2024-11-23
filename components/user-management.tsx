'use client';

import { useState } from 'react';
import type { Member } from '@/types';
import type { CurrencyCode } from '@/utils/currency';
import { FIAT_CURRENCIES, CRYPTO_CURRENCIES } from '@/utils/currency';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { ObjectId } from 'mongodb';

interface UserManagementProps {
  members: Member[];
  onMemberAdded: (member: Member) => void;
}

export function UserManagement({ members, onMemberAdded }: UserManagementProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferredCurrency, setPreferredCurrency] = useState<CurrencyCode>('USD');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMember: Member = {
  id?: "",
  name,
  email,
  preferredCurrency
};


    onMemberAdded(newMember);
    
    // Reset form
    setName('');
    setEmail('');
    setPreferredCurrency('USD');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="flex-1"
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Select
          value={preferredCurrency}
          onValueChange={(value: CurrencyCode) => setPreferredCurrency(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fiat Currencies</SelectLabel>
              {Object.entries(FIAT_CURRENCIES).map(([code, currency]) => (
                <SelectItem key={code} value={code}>
                  {currency.symbol} {code} - {currency.name}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Cryptocurrencies</SelectLabel>
              {Object.entries(CRYPTO_CURRENCIES).map(([code, currency]) => (
                <SelectItem key={code} value={code}>
                  {currency.symbol} {code} - {currency.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button type="submit">Add Member</Button>
      </div>
    </form>
  );
} 
