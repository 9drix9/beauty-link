"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function WaitlistForm({ source = "homepage" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-full bg-success/10 px-6 py-3.5 text-sm font-medium text-success">
        <Check className="h-4 w-4" aria-hidden="true" />
        You&apos;re on the list. We&apos;ll be in touch.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 h-12 rounded-full border border-border bg-white px-5 text-sm text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 rounded-full bg-dark px-6 py-3 text-sm font-semibold text-white shadow-elevated transition-all hover:bg-dark/90 hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none shrink-0"
        >
          {status === "loading" ? "Joining..." : "Join"}
          {status !== "loading" && <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-sm text-error text-center">{errorMsg}</p>
      )}
    </form>
  );
}
