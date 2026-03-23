"use client";

import { Suspense, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

function AuthRedirectContent() {
  const { isLoaded, isSignedIn } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      window.location.href = "/login";
      return;
    }

    const intent = searchParams.get("intent");

    if (intent === "pro") {
      // New pro signup — set role to PROFESSIONAL and redirect to apply
      fetch("/api/auth/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "PROFESSIONAL" }),
      })
        .then(() => {
          window.location.href = "/pro/apply";
        })
        .catch(() => {
          window.location.href = "/pro/apply";
        });
      return;
    }

    // Existing user login — route based on their stored role
    fetch("/api/user/pro-status")
      .then((r) => r.json())
      .then((data) => {
        if (data.isPro) {
          window.location.href = "/pro/dashboard";
        } else if (data.isProfessional) {
          // Has professional role but not yet approved
          window.location.href = "/pro/apply";
        } else {
          window.location.href = "/browse";
        }
      })
      .catch(() => {
        window.location.href = "/browse";
      });
  }, [isLoaded, isSignedIn, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <p className="mt-4 text-sm text-muted">Signing you in...</p>
      </div>
    </div>
  );
}

export default function AuthRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
            <p className="mt-4 text-sm text-muted">Signing you in...</p>
          </div>
        </div>
      }
    >
      <AuthRedirectContent />
    </Suspense>
  );
}
