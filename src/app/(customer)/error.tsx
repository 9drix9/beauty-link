"use client";

import { Button } from "@/components/ui/button";

export default function CustomerError({
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
      <Button variant="primary" size="lg" onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}
