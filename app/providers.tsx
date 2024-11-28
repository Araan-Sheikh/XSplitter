'use client';

import { startRateUpdates } from "@/utils/currency";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    startRateUpdates(5); // Update rates every 5 minutes
  }, []);

  return <>{children}</>;
}