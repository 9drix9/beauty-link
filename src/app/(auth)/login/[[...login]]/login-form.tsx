"use client";

import { SignIn } from "@clerk/nextjs";

interface LoginFormProps {
  intent: "customer" | "pro";
}

export function LoginForm({ intent }: LoginFormProps) {
  const redirectUrl =
    intent === "pro" ? "/auth-redirect?intent=pro" : "/auth-redirect";

  return (
    <SignIn
      path="/login"
      routing="path"
      signUpUrl={intent === "pro" ? "/signup?intent=pro" : "/signup"}
      fallbackRedirectUrl={redirectUrl}
    />
  );
}
