import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart2,
  PieChart,
  Users,
  DollarSign,
  RefreshCcw,
  Share2,
  Calculator,
  Clock,
  Globe,
  Shield,
  Smartphone,
  Zap
} from "lucide-react";

const features = [
  {
    title: "Real-time Expense Tracking",
    description: "Track expenses as they happen with instant updates across all group members.",
    icon: <Clock className="w-12 h-12 text-primary" />
  },
  {
    title: "Multi-currency Support",
    description: "Handle expenses in different currencies with automatic conversion rates.",
    icon: <Globe className="w-12 h-12 text-primary" />
  },
  {
    title: "Smart Settlement",
    description: "Get intelligent suggestions for settling debts with minimum transactions.",
    icon: <Calculator className="w-12 h-12 text-primary" />
  },
  {
    title: "Group Sharing",
    description: "Create and manage multiple groups for different occasions or circles.",
    icon: <Users className="w-12 h-12 text-primary" />
  },
  {
    title: "Expense Analytics",
    description: "Visualize spending patterns with interactive charts and graphs.",
    icon: <BarChart2 className="w-12 h-12 text-primary" />
  },
  {
    title: "Category Tracking",
    description: "Organize expenses by categories with detailed pie charts.",
    icon: <PieChart className="w-12 h-12 text-primary" />
  },
  {
    title: "Easy Sharing",
    description: "Share group links instantly with friends to join the expense group.",
    icon: <Share2 className="w-12 h-12 text-primary" />
  },
  {
    title: "Split Options",
    description: "Split bills equally or with custom ratios among group members.",
    icon: <DollarSign className="w-12 h-12 text-primary" />
  },
  {
    title: "Auto Sync",
    description: "All expenses and settlements automatically sync across devices.",
    icon: <RefreshCcw className="w-12 h-12 text-primary" />
  },
  {
    title: "Secure Transactions",
    description: "Your financial data is encrypted and securely stored.",
    icon: <Shield className="w-12 h-12 text-primary" />
  },
  {
    title: "Mobile Friendly",
    description: "Access your expenses on any device with our responsive design.",
    icon: <Smartphone className="w-12 h-12 text-primary" />
  },
  {
    title: "Quick Actions",
    description: "Add expenses and settle bills with just a few clicks.",
    icon: <Zap className="w-12 h-12 text-primary" />
  }
];

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header Section */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl font-bold">Features</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover all the powerful features that make expense sharing and management effortless with our application.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card key={feature.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                {feature.icon}
                <CardTitle>{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="mb-6">
              Join now and experience the easiest way to manage group expenses.
            </p>
            <a href="/create-group" className="inline-block">
              <button className="bg-background text-primary px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
                Create Group
              </button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 