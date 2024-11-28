'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Users2, Loader2, Briefcase, Home, Calendar, Tag, Coins } from 'lucide-react';
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FIAT_CURRENCIES, CRYPTO_CURRENCIES, type CurrencyCode } from '@/utils/currency';

const GROUP_TYPES = [
  { 
    id: 'trip', 
    name: 'Trip', 
    description: 'Track expenses for a vacation or journey',
    icon: <Calendar className="w-5 h-5" />,
    color: 'bg-blue-500/10 text-blue-500'
  },
  { 
    id: 'household', 
    name: 'Household', 
    description: 'Share costs with roommates',
    icon: <Home className="w-5 h-5" />,
    color: 'bg-green-500/10 text-green-500'
  },
  { 
    id: 'project', 
    name: 'Project', 
    description: 'Track costs for a shared project',
    icon: <Briefcase className="w-5 h-5" />,
    color: 'bg-purple-500/10 text-purple-500'
  },
  { 
    id: 'other', 
    name: 'Other', 
    description: 'Custom group type',
    icon: <Tag className="w-5 h-5" />,
    color: 'bg-orange-500/10 text-orange-500'
  }
];

export default function CreateGroup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    currency: 'USD' as CurrencyCode
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type) {
      toast.error('Please select a group type');
      return;
    }
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
    <div className="min-h-screen bg-background px-4 sm:px-6">
      <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2 h-8 sm:h-9"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <Users2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full"
        >
          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-2 sm:space-y-4 p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl">Create New Group</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Set up a new group to start tracking shared expenses
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 sm:space-y-8 p-4 sm:p-6">
                {/* Group Type Selection */}
                <div className="space-y-3 sm:space-y-4">
                  <Label className="text-sm sm:text-base font-medium">Choose Group Type</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {GROUP_TYPES.map(type => (
                      <motion.div
                        key={type.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, type: type.id })}
                          className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all ${
                            formData.type === type.id 
                              ? 'border-primary bg-primary/5' 
                              : 'border-transparent hover:border-primary/20'
                          }`}
                        >
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className={`p-2 sm:p-3 rounded-md ${type.color}`}>
                              {type.icon}
                            </div>
                            <div className="text-left">
                              <h3 className="font-semibold text-sm sm:text-base">{type.name}</h3>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                {type.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Group Details */}
                <div className="space-y-3 sm:space-y-4">
                  <Label className="text-sm sm:text-base font-medium">Group Details</Label>
                  <Card className="border border-input">
                    <CardContent className="p-3 sm:p-6 space-y-4 sm:space-y-6">
                      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm">Group Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter group name"
                            required
                            className="h-8 sm:h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currency" className="text-sm">Base Currency</Label>
                          <Select
                            value={formData.currency}
                            onValueChange={(value: CurrencyCode) => 
                              setFormData({ ...formData, currency: value })}
                          >
                            <SelectTrigger id="currency" className="h-8 sm:h-9 text-sm">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD" className="text-sm">
                                <div className="flex items-center gap-2">
                                  <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span>USD - US Dollar</span>
                                </div>
                              </SelectItem>
                              {/* Add more currencies */}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Add a brief description"
                          rows={3}
                          className="resize-none text-sm"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-2 p-4 sm:p-6 bg-muted/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="h-8 sm:h-9 text-sm"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isLoading || !formData.name.trim() || !formData.type}
                  className="h-8 sm:h-9 text-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Group'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 