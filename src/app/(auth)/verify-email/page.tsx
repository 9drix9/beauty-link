import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-md text-center">
      <h1 className="text-2xl font-bold tracking-tight mb-4">
        Check Your Email
      </h1>
      <p className="text-muted mb-6">
        We&apos;ve sent a verification link to your email address. Click the
        link to verify your account.
      </p>
      <Link
        href="/login"
        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
      >
        Back to Log In
      </Link>
    </div>
  );
}
