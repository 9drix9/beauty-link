"use client";

import { SignUp } from "@clerk/nextjs";

interface SignUpFormProps {
  intent: "customer" | "pro";
}

export function SignUpForm({ intent }: SignUpFormProps) {
  // Pro signups redirect to /auth-redirect?intent=pro which routes to /pro/apply
  // Customer signups redirect to /auth-redirect which routes to /browse
  const redirectUrl =
    intent === "pro" ? "/auth-redirect?intent=pro" : "/auth-redirect";

  return (
    <SignUp
      path="/signup"
      routing="path"
      signInUrl="/login"
      fallbackRedirectUrl={redirectUrl}
    />
  );
}
