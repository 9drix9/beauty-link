"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { IS_LAUNCHED } from "@/lib/launch";

const faqs = [
  {
    question: "How do I book an appointment?",
    answer:
      "Browse available deals near you, pick a service you like, and book instantly with secure payment. No DMs, no back-and-forth. Just tap, pay, and show up.",
  },
  {
    question: "Are all professionals verified?",
    answer:
      "Yes. Every professional on BeautyLink is reviewed and approved before they can list. We review portfolios, monitor ratings, and verify license information when provided.",
  },
  {
    question: "What if I need to cancel?",
    answer:
      "You can cancel for free up to 24 hours before your appointment. Cancellations within 24 hours of the appointment time are non-refundable to protect our professionals' time.",
  },
  {
    question: "Is my payment secure?",
    answer:
      "Absolutely. All payments are processed securely through Stripe. Your payment information is never stored on our servers. Funds are held safely until after your appointment is completed.",
  },
  {
    question: "Have more questions?",
    answer:
      "Reach out to our support team at support@beautylinknetwork.com and we'll get back to you within 24 hours.",
  },
  {
    question: "How much can I save?",
    answer:
      "Professionals set their own discounted prices, typically 15 to 50% below their regular rate. The total price is always shown upfront before you pay.",
  },
];

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="w-full rounded-xl border border-border bg-white px-5 py-4 text-left transition-all hover:border-accent/30 hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-dark pr-4">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted transition-transform duration-200",
            isOpen && "rotate-180 text-accent"
          )}
          aria-hidden="true"
        />
      </div>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-96 mt-3" : "max-h-0"
        )}
      >
        <p className="text-sm text-muted leading-relaxed">{answer}</p>
      </div>
    </button>
  );
}

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-2xl">
      <h1 className="text-2xl md:text-4xl font-bold text-dark text-center mb-12">
        Frequently Asked Questions
      </h1>

      <div className="space-y-2">
        {faqs.map((faq) => (
          <FaqItem
            key={faq.question}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link
          href={IS_LAUNCHED ? "/browse" : "/pro/apply"}
          className="inline-flex items-center gap-2 rounded-full bg-dark px-8 py-3.5 text-sm font-semibold text-white shadow-elevated transition-all hover:bg-dark/90 hover:-translate-y-0.5"
        >
          {IS_LAUNCHED ? "Browse Appointments" : "Become a Founding Stylist"}
        </Link>
        <p className="mt-4">
          <Link
            href="/pro/join"
            className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
          >
            {IS_LAUNCHED ? "Are you a beauty pro? Learn more" : "Learn more about listing"} &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
