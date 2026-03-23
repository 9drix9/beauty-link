import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Log In",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { intent?: string };
}) {
  const isPro = searchParams.intent === "pro";

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      {isPro && (
        <div className="mb-4 rounded-full bg-accent-light px-4 py-1.5 text-xs font-semibold text-accent">
          For Professionals
        </div>
      )}
      <LoginForm intent={isPro ? "pro" : "customer"} />
      <p className="mt-4 text-center text-xs text-muted">
        <Link href="/get-started" className="text-accent hover:underline">
          &larr; Choose a different account type
        </Link>
      </p>
    </div>
  );
}
