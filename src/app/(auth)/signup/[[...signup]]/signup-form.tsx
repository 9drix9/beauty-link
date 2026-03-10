"use client";

import { SignUp } from "@clerk/nextjs";

export function SignUpForm() {
  return (
    <SignUp
      path="/signup"
      routing="path"
      signInUrl="/login"
      fallbackRedirectUrl="/browse"
    />
  );
}
