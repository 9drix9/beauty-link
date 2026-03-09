import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md text-center">
      <h1 className="text-2xl font-bold tracking-tight mb-4">
        Reset Password
      </h1>
      <p className="text-muted mb-6">
        To reset your password, use the &ldquo;Forgot password?&rdquo; link on
        the login page. Clerk will guide you through the password reset process.
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
