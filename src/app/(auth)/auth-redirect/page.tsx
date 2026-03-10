"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export default function AuthRedirectPage() {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    // Force a hard navigation to /browse so server components get fresh auth
    if (isSignedIn) {
      window.location.href = "/browse";
    } else {
      window.location.href = "/login";
    }
  }, [isLoaded, isSignedIn]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <p className="mt-4 text-sm text-muted">Signing you in...</p>
      </div>
    </div>
  );
}
