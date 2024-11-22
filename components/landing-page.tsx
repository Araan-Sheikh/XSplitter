'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-primary">XSplitter</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push('/about')}>About</Button>
            <Button variant="ghost" onClick={() => router.push('/features')}>Features</Button>
            <Button onClick={() => router.push('/create-group')}>Create Group</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center space-y-8 py-24 md:py-32">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Welcome to XSplitter
          </h1>
          <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Split expenses effortlessly with friends, family, and roommates. Track shared costs and settle debts with ease.
          </p>
        </div>
        <div className="flex flex-col gap-4 min-[400px]:flex-row">
          <Button size="lg" onClick={() => router.push('/create-group')}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push('/groups/674087765181ff991a7757f6')}>
            Try Demo
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 space-y-8">
        <h2 className="text-3xl font-bold text-center">Why Choose XSplitter?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Easy Splitting"
            description="Split bills equally or with custom amounts. Support for multiple currencies."
            icon="💰"
          />
          <FeatureCard
            title="Real-time Updates"
            description="See balances update instantly as expenses are added or modified."
            icon="⚡"
          />
          <FeatureCard
            title="Group Management"
            description="Create multiple groups for different occasions and manage members easily."
            icon="👥"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container py-12 space-y-8 bg-muted/50">
        <h2 className="text-3xl font-bold text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StepCard
            number="1"
            title="Create a Group"
            description="Start by creating a new expense group"
          />
          <StepCard
            number="2"
            title="Add Members"
            description="Invite your friends to join the group"
          />
          <StepCard
            number="3"
            title="Add Expenses"
            description="Record shared expenses as they occur"
          />
          <StepCard
            number="4"
            title="Settle Up"
            description="See who owes what and settle debts easily"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 XSplitter. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">Privacy</Button>
            <Button variant="ghost" size="sm">Terms</Button>
            <Button variant="ghost" size="sm">Contact</Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="p-6 border rounded-lg space-y-2">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="p-6 border rounded-lg space-y-2 text-center">
      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  )
} 
