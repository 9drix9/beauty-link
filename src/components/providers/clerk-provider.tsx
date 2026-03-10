"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function AppClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/browse"
      signUpFallbackRedirectUrl="/browse"
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
      {children}
    </ClerkProvider>
  );
}
