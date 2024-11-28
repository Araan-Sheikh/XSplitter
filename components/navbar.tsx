'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <Image 
            src="/logo.png" 
            alt="XSplitter Logo" 
            width={32} 
            height={32} 
            className="w-8 h-8" 
          />
          <span className="text-xl font-bold text-primary">XSplitter</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Button variant="ghost" onClick={() => router.push("/about")}>About</Button>
          <Button variant="ghost" onClick={() => router.push("/features")}>Features</Button>
          <Button onClick={() => router.push("/create-group")}>Get Started</Button>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <motion.div 
          className="md:hidden border-t"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => { setMenuOpen(false); router.push("/about"); }}>
              About
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => { setMenuOpen(false); router.push("/features"); }}>
              Features
            </Button>
            <Button className="w-full justify-start" onClick={() => { setMenuOpen(false); router.push("/create-group"); }}>
              Get Started
            </Button>
          </div>
        </motion.div>
      )}
    </nav>
  );
} 