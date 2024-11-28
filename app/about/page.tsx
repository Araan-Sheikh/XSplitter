import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Github, 
  Linkedin, 
  Code2, 
  Rocket, 
  Users, 
  Target,
  ExternalLink,
  Mail
} from "lucide-react";
import Link from "next/link";
import { Navbar } from '@/components/navbar';

const teamMembers = [
  {
    name: "Mohammed Araan",
    role: "Developer",
    github: "https://github.com/Araan-Sheikh",
    linkedin: "https://www.linkedin.com/in/araan-sheikh-523715327",
    image: "https://avatars.githubusercontent.com/u/90261325?v=4"
  },
  {
    name: "Azfar",
    role: "Developer",
    github: "https://github.com/azfar-05",
    linkedin: "https://www.linkedin.com/in/mohammad-azfar-44b133313/",
    image: "https://avatars.githubusercontent.com/u/162698857?v=4"
  },
  {
    name: "Ayham Arif K",
    role: "Developer",
    github: "https://github.com/ayhamarif",
    linkedin: "https://linkedin.com/in/ayhamarif",
    image: "/team/ayham.jpg"
  },
  {
    name: "Mohammed Anfas",
    role: "Designer",
    github: "https://github.com/Sheikh-Anfas",
    linkedin: "https://linkedin.com/in/mohammedanfas",
    image: "/team/anfas.jpg"
  },
  {
    name: "Varshith Pawar HR",
    role: "Mentor",
    github: "https://github.com/VarshithPawarHR",
    linkedin: "https://linkedin.com/in/VarshithPawarHR",
    image: "https://avatars.githubusercontent.com/u/143952673?v=4"
  }
];

const projectHighlights = [
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "Modern Tech Stack",
    description: "Built with Next.js 14, TypeScript, and MongoDB for optimal performance"
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "HACKLOOP S03",
    description: "Developed during the HACKLOOP Season 3 hackathon"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Collaborative Effort",
    description: "Created by a team of passionate developers and designers"
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Problem Solving",
    description: "Addressing real-world group expense management challenges"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="relative border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              About XSplitter
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              A HACKLOOP S03 project revolutionizing group expense management
            </p>
          </div>
        </div>
      </section>

      {/* Project Highlights */}
      <section className="container px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projectHighlights.map((highlight) => (
            <Card key={highlight.title} className="border-2">
              <CardContent className="pt-6">
                <div className="rounded-lg p-3 w-fit bg-primary/10 mb-4">
                  {highlight.icon}
                </div>
                <h3 className="font-semibold mb-2">{highlight.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {highlight.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="container px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Meet Our Team</h2>
          <p className="mt-4 text-muted-foreground">
            The talented individuals behind XSplitter
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.name} className="group overflow-hidden">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {member.name}
                </CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <span>{member.role}</span>
                  <div className="flex gap-2">
                    <Link href={member.github} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon">
                        <Github className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={member.linkedin} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon">
                        <Linkedin className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="border-t bg-muted/50">
        <div className="container px-4 py-16 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-6">
                Have questions or feedback? We'd love to hear from you!
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <Link href="mailto:araan@is-cod.in">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Us
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="https://github.com/Araan-Sheikh/XSplitter" target="_blank">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
} 
