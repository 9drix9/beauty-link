"use client";

import { useEffect, useRef } from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";

function AuthWatcher({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const wasSignedOut = useRef(true);

  useEffect(() => {
    if (!isLoaded) return;

    // If we transition from signed-out to signed-in, force a hard reload
    // to ensure server components get fresh auth context
    if (isSignedIn && wasSignedOut.current) {
      wasSignedOut.current = false;
      // Only reload if we're not already on the auth pages
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/signup" && path !== "/auth-redirect") {
        window.location.reload();
        return;
      }
    }

    if (!isSignedIn) {
      wasSignedOut.current = true;
    }
  }, [isLoaded, isSignedIn]);

  return <>{children}</>;
}

export function AppClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      afterSignInUrl="/browse"
      afterSignUpUrl="/browse"
      appearance={{
        variables: {
          colorPrimary: "#6A1B9A",
          colorTextOnPrimaryBackground: "#FFFFFF",
          colorBackground: "#FFFFFF",
          colorInputBackground: "#FFFFFF",
          colorInputText: "#1A1A2E",
          borderRadius: "8px",
          fontFamily: "Inter, sans-serif",
        },
        elements: {
          formButtonPrimary: "bg-accent hover:bg-accent-hover text-white",
          card: "shadow-card rounded-xl",
          headerTitle: "text-dark font-bold",
          headerSubtitle: "text-muted",
        },
      }}
    >
      <AuthWatcher>{children}</AuthWatcher>
    </ClerkProvider>
  );
}
