import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart2, PieChart, Users, DollarSign, RefreshCcw, Share2,
  Calculator, Clock, Globe, Shield, Smartphone, Zap,
  ArrowRight, ChevronRight
} from "lucide-react";
import { Navbar } from '@/components/navbar';

const features = [
  {
    title: "Real-time Tracking",
    description: "Track expenses instantly with live updates across all members",
    icon: <Clock className="w-12 h-12" />,
    color: "bg-blue-50 text-blue-500 dark:bg-blue-950 dark:text-blue-400"
  },
  {
    title: "Multi-currency",
    description: "Handle expenses in any currency with automatic conversions",
    icon: <Globe className="w-12 h-12" />,
    color: "bg-green-50 text-green-500 dark:bg-green-950 dark:text-green-400"
  },
  {
    title: "Smart Settlement",
    description: "Get intelligent suggestions for minimal transactions",
    icon: <Calculator className="w-12 h-12" />,
    color: "bg-purple-50 text-purple-500 dark:bg-purple-950 dark:text-purple-400"
  },
  {
    title: "Group Management",
    description: "Create and manage multiple groups for different purposes",
    icon: <Users className="w-12 h-12" />,
    color: "bg-orange-50 text-orange-500 dark:bg-orange-950 dark:text-orange-400"
  },
  {
    title: "Expense Analytics",
    description: "Visualize spending patterns with interactive charts",
    icon: <BarChart2 className="w-12 h-12" />,
    color: "bg-pink-50 text-pink-500 dark:bg-pink-950 dark:text-pink-400"
  },
  {
    title: "Category Insights",
    description: "Track expenses by categories with detailed breakdowns",
    icon: <PieChart className="w-12 h-12" />,
    color: "bg-yellow-50 text-yellow-500 dark:bg-yellow-950 dark:text-yellow-400"
  },
  {
    title: "Quick Sharing",
    description: "Share group links instantly with your friends",
    icon: <Share2 className="w-12 h-12" />,
    color: "bg-indigo-50 text-indigo-500 dark:bg-indigo-950 dark:text-indigo-400"
  },
  {
    title: "Flexible Splits",
    description: "Split bills equally or with custom ratios",
    icon: <DollarSign className="w-12 h-12" />,
    color: "bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400"
  },
  {
    title: "Auto Sync",
    description: "Keep everything in sync across all devices",
    icon: <RefreshCcw className="w-12 h-12" />,
    color: "bg-cyan-50 text-cyan-500 dark:bg-cyan-950 dark:text-cyan-400"
  },
  {
    title: "Secure Data",
    description: "Your financial data is encrypted and protected",
    icon: <Shield className="w-12 h-12" />,
    color: "bg-teal-50 text-teal-500 dark:bg-teal-950 dark:text-teal-400"
  },
  {
    title: "Mobile Ready",
    description: "Access your expenses on any device, anywhere",
    icon: <Smartphone className="w-12 h-12" />,
    color: "bg-emerald-50 text-emerald-500 dark:bg-emerald-950 dark:text-emerald-400"
  },
  {
    title: "Quick Actions",
    description: "Add expenses and settle bills in seconds",
    icon: <Zap className="w-12 h-12" />,
    color: "bg-violet-50 text-violet-500 dark:bg-violet-950 dark:text-violet-400"
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Powerful Features
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Everything you need to manage group expenses efficiently and hassle-free
            </p>
          </div>
        </div>
        <div className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="container px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="group relative overflow-hidden transition-all hover:shadow-lg">
              <CardHeader>
                <div className={`rounded-lg p-3 w-fit ${feature.color}`}>
                  {feature.icon}
                </div>
                <CardTitle className="mt-4">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50 transform scale-x-0 transition-transform group-hover:scale-x-100" />
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50">
        <div className="container px-4 py-16 sm:px-6 lg:px-8">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-2xl font-bold sm:text-3xl">
                  Ready to Get Started?
                </h2>
                <p className="mt-4 text-primary-foreground/90">
                  Join thousands of users who are already managing their group expenses efficiently.
                </p>
                <Button 
                  size="lg"
                  variant="secondary"
                  className="mt-8"
                  asChild
                >
                  <a href="/create-group">
                    Create Your First Group
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
} 