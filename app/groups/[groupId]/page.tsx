'use client'

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ExpenseSplitterApp } from '@/components/expense-splitter-app';
import Loading from './loading';

async function getGroup(groupId: string) {
  try {
    const response = await fetch(`/api/groups/${groupId}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched group data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching group:', error);
    return null;
  }
}

export default async function GroupPage({ params }: { params: { groupId: string } }) {
  console.log('Fetching group with ID:', params.groupId);
  const group = await getGroup(params.groupId);

  if (!group) {
    console.log('Group not found, redirecting to 404');
    notFound();
  }

  return (
    <Suspense fallback={<Loading />}>
      <ExpenseSplitterApp groupId={params.groupId} />
    </Suspense>
  );
} 