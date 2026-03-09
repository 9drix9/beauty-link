"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-error mb-2">Something went wrong</p>
      <h1 className="text-2xl font-bold text-dark">
        We hit an unexpected error
      </h1>
      <p className="mt-2 max-w-md text-muted">
        {error.message || "Please try again. If the problem persists, contact support."}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button variant="primary" size="md" onClick={reset}>
          Try Again
        </Button>
        <Button variant="outline" size="md" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </main>
  );
}
