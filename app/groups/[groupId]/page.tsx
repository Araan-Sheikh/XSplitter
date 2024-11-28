'use client'

import { Suspense } from 'react';
import { GroupPageClient } from './client';
import Loading from './loading';

export default function GroupPage({ params }: { params: { groupId: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <GroupPageClient groupId={params.groupId} />
    </Suspense>
  );
} 