'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from 'next/navigation';
import {
  Users2,
  BarChart3,
  LogOut,
  Menu,
  X,
  Activity,
  PlusCircle,
  LayoutDashboard,
  Loader2,
  ScrollText
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Return only children for login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    } finally {
      setIsLoggingOut(false);
      setIsSidebarOpen(false);
    }
  };

  const navItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin/dashboard',
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      href: '/admin/analytics',
    },
    {
      title: 'Logs',
      icon: ScrollText,
      href: '/admin/logs',
    }
  ];

  return (
    <div>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-6 z-50">
        <div className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="XSplitter Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-xl font-semibold">XSplitter</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className={`fixed left-0 top-0 h-full bg-card border-r border-border p-6 z-40
            ${isSidebarOpen ? 'w-full lg:w-72' : 'hidden lg:block lg:w-72'}`}
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="XSplitter Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-xl font-semibold">XSplitter Admin</span>
            </div>
            
            <div className="space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", 
                    pathname === item.href && "bg-primary/10"
                  )}
                  onClick={() => {
                    router.push(item.href);
                    setIsSidebarOpen(false);
                  }}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              ))}
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:ml-72 pt-16 lg:pt-0">
        {children}
      </div>
    </div>
  );
} 