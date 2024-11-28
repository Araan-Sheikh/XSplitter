'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center pb-2">
          <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl">Something went wrong!</CardTitle>
        </CardHeader>
        <CardContent className="text-center pb-6">
          <p className="text-muted-foreground">
            {error.message || "We couldn't load this page. Please try again."}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button 
            variant="outline"
            onClick={reset}
            className="space-x-2"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Try again</span>
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