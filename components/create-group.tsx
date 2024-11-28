'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Users, 
  Loader2, 
  FileText, 
  Calendar,
  Tags,
  ChevronRight
} from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GROUP_TYPES = [
  { id: 'trip', name: 'Trip', description: 'Track expenses for a vacation or journey' },
  { id: 'household', name: 'Household', description: 'Share costs with roommates' },
  { id: 'event', name: 'Event', description: 'Manage expenses for a specific event' },
  { id: 'project', name: 'Project', description: 'Track costs for a shared project' },
  { id: 'other', name: 'Other', description: 'Custom group type' }
] as const;

type GroupType = typeof GROUP_TYPES[number]['id'];

export function CreateGroupComponent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [groupType, setGroupType] = useState<GroupType>('other');
  const [error, setError] = useState<string | null>(null);

  const handleCreateGroup = async (e: React.FormEvent) => {
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
          name: groupName,
          description,
          type: groupType,
          createdAt: new Date(),
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Group created successfully!');
        router.push(`/groups/${data.groupId}`);
      } else {
        throw new Error(data.message || 'Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      setError(error instanceof Error ? error.message : 'Failed to create group');
      toast.error('Failed to create group');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 font-semibold">
            <Users className="h-5 w-5" />
            Create New Group
          </div>
        </div>
      </nav>

      <div className="container max-w-2xl py-8 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Create a New Group</h1>
          <p className="text-muted-foreground">
            Set up a new group to start tracking shared expenses with others.
          </p>
        </div>

        <Card>
          <form onSubmit={handleCreateGroup}>
            <CardHeader>
              <CardTitle>Group Details</CardTitle>
              <CardDescription>
                Fill in the basic information about your group
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="groupType">Group Type</Label>
                <Select
                  value={groupType}
                  onValueChange={(value: GroupType) => setGroupType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select group type" />
                  </SelectTrigger>
                  <SelectContent>
                    {GROUP_TYPES.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex flex-col">
                          <span>{type.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {type.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name</Label>
                <div className="relative">
                  <Tags className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="pl-8"
                    placeholder="Enter a memorable name for your group"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <div className="relative">
                  <FileText className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="pl-8 min-h-[100px]"
                    placeholder="Describe the purpose of this group"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 text-sm bg-muted rounded-md">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Group will be created on {new Date().toLocaleDateString()}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading || !groupName.trim()}
                className={cn(
                  "min-w-[140px]",
                  isLoading && "cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Group
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
} 