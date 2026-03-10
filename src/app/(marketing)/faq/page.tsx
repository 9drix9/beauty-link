"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What is BeautyLink?",
    answer:
      "BeautyLink is a marketplace for discounted beauty appointments. Licensed beauty professionals list their open time slots at reduced prices, and clients book them at significant savings — everyone wins.",
  },
  {
    question: "How does pricing work?",
    answer:
      "Professionals set their own discounted price — at least 15% below their regular rate. A small 5% service fee is added at checkout to keep the platform running. The total price is always shown upfront — no surprises.",
  },
  {
    question: "How do I book an appointment?",
    answer:
      "Browse available deals near you, pick a service you like, and book instantly with secure payment. No DMs, no back-and-forth — just tap, pay, and show up.",
  },
  {
    question: "Is there a cancellation policy?",
    answer:
      "You can cancel for free up to 24 hours before your appointment. Cancellations within 24 hours of the appointment time are non-refundable to protect our professionals' time.",
  },
  {
    question: "How do professionals get paid?",
    answer:
      "Professionals keep 100% of their listed price. Payouts are released 24 hours after the appointment is completed. Instant payouts are available for a small 1.5% fee.",
  },
  {
    question: "How do I become a provider on BeautyLink?",
    answer:
      "Apply through our stylist application page. You'll need to provide your professional details, service information, and license info. Once approved, you can start listing discounted appointments right away.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We currently serve the Greater Los Angeles area, including West LA, Santa Monica, Beverly Hills, Hollywood, Westwood, and Westchester. We're expanding to new areas soon.",
  },
  {
    question: "Are the professionals verified?",
    answer:
      "Yes. Every professional on BeautyLink is reviewed before they can list. We verify license information, review portfolios, and monitor ratings. You can also read reviews from other clients before booking.",
  },
  {
    question: "What types of services are available?",
    answer:
      "BeautyLink covers Hair, Nails, Makeup, Lashes, Brows, Spa & Skincare services, and more. Each category includes a range of specific treatments — from blowouts and balayage to gel manicures and hydrafacials.",
  },
  {
    question: "Is my payment secure?",
    answer:
      "Absolutely. All payments are processed securely through Stripe. Your payment information is never stored on our servers. Funds are held safely until after your appointment is completed.",
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
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-accent"
      >
        <span className="text-base font-semibold text-dark pr-4">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted transition-transform duration-200",
            isOpen && "rotate-180 text-accent"
          )}
          aria-hidden="true"
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        )}
      >
        <p className="text-body leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-dark">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-muted text-lg">
          Everything you need to know about BeautyLink.
        </p>
      </div>

      <div className="divide-y-0">
        {faqs.map((faq) => (
          <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
        ))}
      </div>

      <div className="mt-12 text-center rounded-2xl bg-background p-8">
        <h2 className="text-xl font-bold text-dark mb-2">
          Still have questions?
        </h2>
        <p className="text-muted mb-4">
          Reach out to our support team and we&apos;ll get back to you within 24 hours.
        </p>
        <a
          href="mailto:support@beautylinknetwork.com"
          className="inline-flex items-center text-sm font-semibold text-accent hover:underline"
        >
          support@beautylinknetwork.com
        </a>
      </div>
    </div>
  );
}
