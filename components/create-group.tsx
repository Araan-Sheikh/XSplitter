'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from 'lucide-react'

export function CreateGroupComponent() {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/groups/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: groupName,
          description,
          createdAt: new Date(),
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        router.push(`/groups/${data.groupId}`);
      } else {
        console.error('Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">XSplitter - Create New Group</h1>
        </div>
      </nav>

      {/* Form */}
      <div className="container max-w-md py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New XSplitter Group</CardTitle>
            <CardDescription>Start splitting expenses with your friends</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter group description"
                />
              </div>
              <Button type="submit" className="w-full">
                Create Group
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 