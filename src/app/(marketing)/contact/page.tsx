"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Send,
  CheckCircle,
  Clock,
  MapPin,
  MessageSquare,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

const CATEGORIES = [
  { value: "general", label: "General Inquiry" },
  { value: "booking", label: "Booking Help" },
  { value: "account", label: "Account Issue" },
  { value: "payments", label: "Payments & Refunds" },
  { value: "professional", label: "Professional Inquiry" },
  { value: "feedback", label: "Feedback" },
  { value: "other", label: "Other" },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reference, setReference] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, category }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setReference(data.reference || "");
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-light mb-6">
            <CheckCircle className="h-8 w-8 text-success" aria-hidden="true" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-dark mb-3">
            Message Sent
          </h1>
          <p className="text-body/70 mb-2">
            Thank you for reaching out. We have received your message and will get back to you within 24 hours.
          </p>
          {reference && (
            <p className="text-sm text-muted mb-8">
              Your reference number: <span className="font-semibold text-dark">#{reference}</span>
            </p>
          )}
          <p className="text-sm text-muted mb-8">
            A confirmation email has been sent to <span className="font-semibold">{email}</span>.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-dark px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-dark/90"
            >
              Back To Home
            </Link>
            <Link
              href="/help"
              className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3 text-sm font-semibold text-body transition-all hover:bg-background"
            >
              Help Center
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-dark">
          Help Desk
        </h1>
        <p className="mt-3 text-muted text-lg">
          Have a question or need help? Send us a message and we will get back to you within 24 hours.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left: Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name + Email */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-dark mb-1.5">
                  Your Name *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark mb-1.5">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-dark mb-1.5">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-dark mb-1.5">
                Subject *
              </label>
              <input
                id="subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What can we help you with?"
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-dark mb-1.5">
                Message *
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your question or issue in detail..."
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
              />
              <p className="mt-1 text-xs text-muted text-right">
                {message.length}/2000
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-error/20 bg-error-light px-4 py-3 text-sm text-error">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-dark px-8 py-3.5 text-[15px] font-semibold text-white shadow-elevated transition-all hover:bg-dark/90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Info Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10">
                <Clock className="h-4 w-4 text-accent" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-dark text-sm">Response Time</h3>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              We typically respond within 24 hours on business days. For urgent booking issues, include your booking reference.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10">
                <MessageSquare className="h-4 w-4 text-accent" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-dark text-sm">Auto Reply</h3>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              You will receive an automatic confirmation email with your reference number after submitting.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10">
                <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-dark text-sm">Service Area</h3>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              BeautyLink currently serves the Los Angeles area including West LA, Santa Monica, Beverly Hills, and Westwood.
            </p>
          </div>

          <Link
            href="/help"
            className="flex items-center justify-between rounded-xl border border-border bg-white p-5 shadow-sm transition-all hover:shadow-card hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="font-medium text-dark text-sm">Help Center</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
          </Link>

          <Link
            href="/faq"
            className="flex items-center justify-between rounded-xl border border-border bg-white p-5 shadow-sm transition-all hover:shadow-card hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="font-medium text-dark text-sm">FAQ</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
