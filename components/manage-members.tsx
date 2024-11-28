'use client';

import { useState } from 'react';
import { FIAT_CURRENCIES, CRYPTO_CURRENCIES } from '@/utils/currency';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Mail,
  Coins,
  Pencil,
  Trash2,
  X,
  Plus,
  Save,
  UserPlus,
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

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
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await onUpdateMember({
          ...editingMember,
          name,
          email,
          preferredCurrency,
        });
        toast.success('Member updated successfully');
      } else {
        await onAddMember({
          name,
          email,
          preferredCurrency,
        });
        toast.success('Member added successfully');
      }
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPreferredCurrency('USD');
    setEditingMember(null);
    setIsAdding(false);
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setName(member.name);
    setEmail(member.email);
    setPreferredCurrency(member.preferredCurrency);
    setIsAdding(true);
  };

  const handleDelete = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      try {
        await onDeleteMember(memberId);
        toast.success('Member removed successfully');
      } catch (error) {
        toast.error('Failed to remove member');
      }
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Group Members</CardTitle>
              <CardDescription>Manage your group members and their preferences</CardDescription>
            </div>
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)} size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isAdding && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="relative">
                    <Users className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-8"
                      placeholder="Enter name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-8"
                      placeholder="Enter email"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Preferred Currency</Label>
                <Select
                  value={preferredCurrency}
                  onValueChange={setPreferredCurrency}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
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
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit">
                  {editingMember ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Member
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Member
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          <ScrollArea className="h-[400px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {member.preferredCurrency}
                        {CRYPTO_CURRENCIES[member.preferredCurrency as keyof typeof CRYPTO_CURRENCIES]?.symbol && 
                          ` (${CRYPTO_CURRENCIES[member.preferredCurrency as keyof typeof CRYPTO_CURRENCIES].symbol})`
                        }
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(member)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(member.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {members.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No members yet. Add your first member to get started!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
} 