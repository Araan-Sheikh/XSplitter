import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

const teamMembers = [
  {
    name: "Mohammed Araan",
    role: "Full Stack Developer",
    github: "https://github.com/Araan-Sheikh",
    linkedin: "https://linkedin.com/in/mohammedaraan",
    image: "/team/araan.jpg" // Add team member images to public/team folder
  },
  {
    name: "Azfar",
    role: "Backend Developer",
    github: "https://github.com/azfar",
    linkedin: "https://linkedin.com/in/azfar",
    image: "/team/azfar.jpg"
  },
  {
    name: "Ayham Arif K",
    role: "Frontend Developer",
    github: "https://github.com/ayhamarif",
    linkedin: "https://linkedin.com/in/ayhamarif",
    image: "/team/ayham.jpg"
  },
  {
    name: "Mohammed Anfas",
    role: "UI/UX Designer",
    github: "https://github.com/mohammedanfas",
    linkedin: "https://linkedin.com/in/mohammedanfas",
    image: "/team/anfas.jpg"
  }
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      {/* Project Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">HACKLOOP S03 Project</h1>
        <p className="text-xl text-muted-foreground">
          Expense Sharing and Management Application
        </p>
      </div>

      {/* Project Details */}
      <Card>
        <CardHeader>
          <CardTitle>About the Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This project was developed as part of HACKLOOP S03, focusing on creating
            a comprehensive solution for group expense management and sharing.
          </p>
          <div className="space-y-2">
            <h3 className="font-semibold">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Real-time expense tracking and sharing</li>
              <li>Multi-currency support with automatic conversion</li>
              <li>Detailed analytics and expense visualization</li>
              <li>Smart settlement suggestions</li>
              <li>Group sharing and collaboration</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Team Section */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.name} className="overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Link
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    <Github className="h-5 w-5" />
                  </Link>
                  <Link
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 