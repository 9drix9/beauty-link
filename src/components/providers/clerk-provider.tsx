"use client";

import { useEffect } from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";

function AuthWatcher({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      // Check if we just completed sign-in and need a hard reload
      const needsReload = sessionStorage.getItem("clerk_needs_reload");
      if (needsReload === "1") {
        sessionStorage.removeItem("clerk_needs_reload");
        window.location.reload();
        return;
      }
    }

    if (!isSignedIn) {
      // Mark that the next sign-in should trigger a reload
      sessionStorage.setItem("clerk_needs_reload", "1");
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
