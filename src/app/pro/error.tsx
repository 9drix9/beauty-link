"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-h2 text-dark mb-3">Something went wrong</h1>
      <p className="text-body text-muted mb-6 max-w-md">
        {error.message || "We couldn't load this page. Please try again."}
      </p>
      <div className="flex gap-3">
        <Button variant="primary" size="lg" onClick={reset}>
          Try Again
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/pro/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
