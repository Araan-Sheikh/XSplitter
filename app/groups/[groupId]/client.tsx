'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExpenseSplitterApp } from '@/components/expense-splitter-app';

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
    return data.group;
  } catch (error) {
    return null;
  }
}

export function GroupPageClient({ groupId }: { groupId: string }) {
  const router = useRouter();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      const groupData = await getGroup(groupId);
      setGroup(groupData);
      setLoading(false);
      
      if (!groupData) {
        router.push('/404');
      }
    };

    fetchGroup();
  }, [groupId, router]);

  if (loading) {
    return null; // Let Suspense handle loading state
  }

  if (!group) {
    return null; // Router will handle redirect
  }

  return <ExpenseSplitterApp groupId={groupId} />;
} 