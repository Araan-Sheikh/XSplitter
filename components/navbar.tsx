'use client';

import { useState, useEffect } from 'react';
import { Share2, Copy, Check, BarChart2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface NavbarProps {
  groupId: string;
  groupName: string;
}

const teamMembers = [
  {
    name: "Mohammed Araan",
    initials: "MA",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=MohammedAraan"
  },
  {
    name: "Azfar",
    initials: "AZ",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Azfar"
  },
  {
    name: "Ayham Arif K",
    initials: "AA",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=AyhamArif"
  },
  {
    name: "Mohammed Anfas",
    initials: "MA",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=MohammedAnfas"
  }
];

export function Navbar({ groupId, groupName }: NavbarProps) {
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Update share link when dialog opens
  useEffect(() => {
    if (isDialogOpen && groupId) {
      // Use absolute URL with the current origin
      const baseUrl = window.location.origin;
      const joinLink = `${baseUrl}/groups/${groupId}/join`;
      setShareLink(joinLink);
    }
  }, [isDialogOpen, groupId]);

  const copyToClipboard = async () => {
    if (!shareLink) {
      toast.error('Unable to generate share link');
      return;
    }

    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b bg-white dark:bg-gray-950 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {groupName ? (
              <h1 className="text-lg font-semibold">{groupName}</h1>
            ) : (
              <Link href="/" className="text-lg font-semibold">
                ExpenseShare
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Team Members */}
            <div className="flex -space-x-2">
              {teamMembers.map((member) => (
                <Avatar key={member.name} className="border-2 border-background">
                  <AvatarImage src={member.avatarUrl} alt={member.name} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
              ))}
            </div>

            {/* Navigation Links */}
            <Link href="/features">
              <Button variant="ghost" size="sm">
                Features
              </Button>
            </Link>

            <Link href="/about">
              <Button variant="ghost" size="sm">
                About
              </Button>
            </Link>

            {groupId && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center"
                  onClick={() => document.querySelector('[value="analytics"]')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center"
                      disabled={!groupId}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Group
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Share {groupName}</DialogTitle>
                      <DialogDescription>
                        Anyone with this link can join the group
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                      <Input
                        readOnly
                        value={shareLink}
                        className="flex-1"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={copyToClipboard}
                        className="shrink-0"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      This link will allow others to join your group directly
                    </p>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 