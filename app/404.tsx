import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion, Home, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center pb-2">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <FileQuestion className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center pb-6">
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button 
            variant="outline"
            asChild
          >
            <Link href="/groups" className="space-x-2">
              <Search className="w-4 h-4" />
              <span>Browse Groups</span>
            </Link>
          </Button>
          <Button asChild>
            <Link href="/" className="space-x-2">
              <Home className="w-4 h-4" />
              <span>Go home</span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 