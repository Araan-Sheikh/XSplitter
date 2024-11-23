'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 sm:px-8 w-full">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg sm:text-2xl font-bold text-primary">XSplitter</h1>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/about")}>About</Button>
            <Button variant="ghost" onClick={() => router.push("/features")}>Features</Button>
            <Button onClick={() => router.push("/create-group")}>Create Group</Button>
          </div>
          <div className="sm:hidden">
            <Button onClick={() => router.push("/menu")}>Menu</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 sm:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 text-center">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
            Welcome to XSplitter
          </h1>
          <Image src="/logo.png" alt="XSplitter Logo" width={150} height={150} className="w-24 sm:w-36" />
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
            Split expenses effortlessly with friends, family, and roommates. Track shared costs and settle debts with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" onClick={() => router.push("/create-group")}>Get Started</Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/groups/674087765181ff991a7757f6")}>Try Demo</Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Why Choose XSplitter?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard title="Easy Splitting" description="Split bills equally or with custom amounts. Support for multiple currencies." icon="💰" />
          <FeatureCard title="Real-time Updates" description="See balances update instantly as expenses are added or modified." icon="⚡" />
          <FeatureCard title="Group Management" description="Create multiple groups for different occasions and manage members easily." icon="👥" />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/50 px-4 sm:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StepCard number="1" title="Create a Group" description="Start by creating a new expense group." />
          <StepCard number="2" title="Add Members" description="Invite your friends to join the group." />
          <StepCard number="3" title="Add Expenses" description="Record shared expenses as they occur." />
          <StepCard number="4" title="Settle Up" description="See who owes what and settle debts easily." />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">© 2024 XSplitter. All rights reserved.</p>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">Privacy</Button>
            <Button variant="ghost" size="sm">Terms</Button>
            <Button variant="ghost" size="sm">Contact</Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="p-4 sm:p-6 border rounded-lg bg-card hover:shadow-lg transition-shadow">
      <div className="text-3xl sm:text-4xl mb-4">{icon}</div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="p-4 sm:p-6 border rounded-lg bg-card hover:shadow-lg transition-shadow">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-lg font-semibold">
        {number}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-center mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-muted-foreground text-center leading-relaxed">{description}</p>
    </div>
  );
}
