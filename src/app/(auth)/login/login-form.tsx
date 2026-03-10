"use client";

import { SignIn } from "@clerk/nextjs";

export function LoginForm() {
  return (
    <SignIn
      path="/login"
      routing="path"
      signUpUrl="/signup"
      afterSignInUrl="/auth-redirect"
    />
  );
}
