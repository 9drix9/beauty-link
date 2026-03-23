import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage({
  searchParams,
}: {
  searchParams: { intent?: string };
}) {
  const isPro = searchParams.intent === "pro";

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      {isPro && (
        <div className="mb-4 rounded-full bg-accent-light px-4 py-1.5 text-xs font-semibold text-accent">
          Signing up as a Professional
        </div>
      )}
      <SignUpForm intent={isPro ? "pro" : "customer"} />
      <p className="mt-4 text-center text-xs text-muted">
        By signing up, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-primary">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-primary">
          Privacy Policy
        </Link>
        .
      </p>
      <p className="mt-3 text-center text-xs text-muted">
        <Link href="/get-started" className="text-accent hover:underline">
          &larr; Choose a different account type
        </Link>
      </p>
    </div>
  );
}
