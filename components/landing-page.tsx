'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import {
  ArrowRight,
  ChevronRight,
  DollarSign,
  Users,
  BarChart2,
  Globe,
  Shield,
  Zap
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const features = [
  {
    title: "Split Expenses",
    description: "Easily split bills with friends and track who owes what",
    icon: <DollarSign className="w-6 h-6" />,
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    title: "Group Management",
    description: "Create multiple groups for different occasions",
    icon: <Users className="w-6 h-6" />,
    color: "bg-green-500/10 text-green-500"
  },
  {
    title: "Real-time Analytics",
    description: "Track spending patterns with interactive charts",
    icon: <BarChart2 className="w-6 h-6" />,
    color: "bg-purple-500/10 text-purple-500"
  },
  {
    title: "Multi-currency",
    description: "Support for all major currencies with live conversion",
    icon: <Globe className="w-6 h-6" />,
    color: "bg-orange-500/10 text-orange-500"
  },
  {
    title: "Secure Data",
    description: "Your financial data is encrypted and protected",
    icon: <Shield className="w-6 h-6" />,
    color: "bg-pink-500/10 text-pink-500"
  },
  {
    title: "Quick Actions",
    description: "Add expenses and settle bills in seconds",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-yellow-500/10 text-yellow-500"
  }
];

export function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="relative z-10 flex flex-col items-center text-center gap-8 py-12 md:py-24">
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-black/5 backdrop-blur-xl flex items-center justify-center p-4 md:p-6 border border-white/10">
              <motion.div
                initial={{ rotate: -180 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <Image 
                  src="/logo.png" 
                  alt="XSplitter Logo" 
                  width={120} 
                  height={120} 
                  className="w-20 h-20 md:w-28 md:h-28" 
                  priority
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Text Content */}
          <div className="space-y-6 max-w-3xl">
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Split Expenses <span className="text-primary">Effortlessly</span>
            </motion.h1>
            <motion.p 
              className="mx-auto max-w-[700px] text-base sm:text-lg md:text-xl text-muted-foreground px-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              The smart way to manage shared expenses with friends, family, and roommates.
              Track, split, and settle bills with ease.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={() => router.push("/create-group")}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => router.push("/groups/674087765181ff991a7757f6")}
            >
              Try Demo
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-4 mt-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className={cn("rounded-lg p-3 w-fit mb-4", feature.color)}>
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Dashboard Preview */}
          <motion.div 
            className="relative w-full max-w-5xl mt-12 px-4"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 1 }}
          >
            <div className="relative rounded-lg overflow-hidden border shadow-2xl">
              <Image
                src="/dashboard-preview.png"
                alt="XSplitter Dashboard"
                width={1200}
                height={800}
                className="w-full h-auto"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="XSplitter Logo" 
                width={24} 
                height={24} 
                className="w-6 h-6" 
              />
              <span className="text-sm text-muted-foreground">
                © 2024 XSplitter. All rights reserved.
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 justify-center">
              <Button variant="ghost" size="sm">Privacy</Button>
              <Button variant="ghost" size="sm">Terms</Button>
              <Button variant="ghost" size="sm">Contact</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
