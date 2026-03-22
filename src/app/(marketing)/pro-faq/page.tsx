"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const proFaqs = [
  {
    question: "How do I get started on BeautyLink?",
    answer:
      "Submit an application through our Apply page. Include your business name, bio, service categories, and portfolio photos. We review applications within 48 hours.",
  },
  {
    question: "How much does it cost to list on BeautyLink?",
    answer:
      "Listing on BeautyLink is completely free. We charge clients a small service fee at checkout. You keep 100% of your listed price.",
  },
  {
    question: "What is the minimum discount I need to offer?",
    answer:
      "Listings must be discounted at least 10% below your regular rate. You set both the original and discounted price, so you are always in control of your earnings.",
  },
  {
    question: "When do I get paid?",
    answer:
      "Payouts are sent within 24 hours after the appointment is completed. Funds are deposited via Stripe directly to your bank account.",
  },
  {
    question: "What are Model Calls?",
    answer:
      "Model Calls let you offer free services for training, portfolio building, or practice. They are a great way for students, trainees, and emerging artists to gain experience and attract new clients.",
  },
  {
    question: "Can I cancel a listing?",
    answer:
      "Yes, you can cancel or pause a listing at any time from your dashboard. If a client has already booked, cancelling may affect your profile rating.",
  },
  {
    question: "Do I need a license to list?",
    answer:
      "A license is not required to create listings, but submitting your license information can help you get approved faster and earns you a verified Licensed badge on your profile.",
  },
  {
    question: "What profile badges can I display?",
    answer:
      "You can select badges like New, Trainee, Student, Emerging Artist, Experienced, or Specialist from your settings. The Licensed badge is awarded by our team after verifying your license.",
  },
  {
    question: "What services can I list?",
    answer:
      "BeautyLink supports hair, nails, makeup, lashes, brows, skincare, hair removal, massage, spray tan, and more. Select your categories when you apply.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Visit our contact page to submit a help request. Our team responds within 24 hours on business days.",
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

export default function ProFAQPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-2xl">
      <h1 className="text-2xl md:text-4xl font-bold text-dark text-center mb-4">
        Professional FAQ
      </h1>
      <p className="text-center text-muted mb-12">
        Common questions for beauty professionals listing on BeautyLink.
      </p>

      <div className="space-y-2">
        {proFaqs.map((faq) => (
          <FaqItem
            key={faq.question}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>

      <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/pro/apply"
          className="inline-flex items-center gap-2 rounded-full bg-dark px-8 py-3.5 text-sm font-semibold text-white shadow-elevated transition-all hover:bg-dark/90 hover:-translate-y-0.5"
        >
          Apply As A Professional
        </Link>
        <Link
          href="/contact"
          className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
        >
          Still have questions? Contact us &rarr;
        </Link>
      </div>
    </div>
  );
}
