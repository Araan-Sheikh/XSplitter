'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Users2, Loader2, Briefcase, Home, Calendar, Tag } from 'lucide-react';
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GROUP_TYPES = [
  { 
    id: 'trip', 
    name: 'Trip', 
    description: 'Track expenses for a vacation or journey',
    icon: <Calendar className="w-5 h-5" />
  },
  { 
    id: 'household', 
    name: 'Household', 
    description: 'Share costs with roommates',
    icon: <Home className="w-5 h-5" />
  },
  { 
    id: 'project', 
    name: 'Project', 
    description: 'Track costs for a shared project',
    icon: <Briefcase className="w-5 h-5" />
  },
  { 
    id: 'other', 
    name: 'Other', 
    description: 'Custom group type',
    icon: <Tag className="w-5 h-5" />
  }
];

export default function CreateGroup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    currency: 'USD'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/groups/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdAt: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to create group');

      toast.success('Group created successfully!');
      router.push(`/groups/${data.data._id}`);
    } catch (err) {
      console.error('Error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create group');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container max-w-2xl py-8 space-y-8">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Users2 className="w-8 h-8 text-muted-foreground" />
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Create New Group</CardTitle>
            <CardDescription>
              Set up a new group to start tracking shared expenses
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="type">Group Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select group type" />
                  </SelectTrigger>
                  <SelectContent>
                    {GROUP_TYPES.map(type => (
                      <SelectItem 
                        key={type.id} 
                        value={type.id}
                        className="group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1 rounded-md bg-primary/10 text-primary">
                            {type.icon}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{type.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {type.description}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter a name for your group"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add a brief description of the group's purpose"
                  rows={3}
                />
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
                disabled={isLoading || !formData.name.trim()}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Group'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
} 