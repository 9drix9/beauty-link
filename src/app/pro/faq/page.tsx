"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Footer } from "@/components/layout/footer";
import { IS_LAUNCHED } from "@/lib/launch";

const proFaqs = [
  {
    question: "Who can join BeautyLink?",
    answer:
      "Licensed beauty professionals including cosmetologists, estheticians, nail technicians, lash artists, makeup artists, massage therapists, and barbers. You must have a valid professional license to join.",
  },
  {
    question: "How does pricing work?",
    answer:
      "You set your own discounted prices for each appointment listing. A 5% BeautyLink service fee is added at checkout and paid by the customer \u2014 you receive 100% of your listed price with no deductions.",
  },
  {
    question: "When do I get paid?",
    answer:
      "Payouts are released 24 hours after you mark an appointment as completed. You can choose instant payout (1.5% fee) or standard bank transfer (free, arrives in 2 business days).",
  },
  {
    question: "Is there a contract or monthly fee?",
    answer:
      "No contracts, no monthly fees. BeautyLink is completely free to join. You only pay when you get paid (and even then, you keep 100% \u2014 the fee is customer-side).",
  },
  {
    question: "How do clients find me?",
    answer:
      "Your profile appears in search results when clients browse for your service category and location. You can also share your profile link directly on social media.",
  },
  {
    question: "What if a client doesn\u2019t show up?",
    answer:
      "Report no-shows within 48 hours of the appointment time. You\u2019ll still receive your full payout for customer no-shows. Repeat no-show customers are flagged for review.",
  },
  {
    question: "Can I list regular openings or only last-minute cancellations?",
    answer:
      "You can list any appointment slot you\u2019re willing to discount, whether it\u2019s a last-minute cancellation, a gap in your schedule, or a regular opening you want to fill. BeautyLink is designed to help you earn revenue from any available time slot, not just emergencies. If you have availability and want to attract new clients, you can list it.",
  },
  {
    question: "Is there a minimum discount required to list on BeautyLink?",
    answer:
      "Yes. All listings must be discounted at least 10% from your standard rate. This ensures that every appointment on BeautyLink offers genuine value to clients and keeps the platform competitive. For example, if you normally charge $100 for a service, your BeautyLink listing price must be $90 or lower.",
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
    <>
      <MarketingNav />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-2xl">
          <h1 className="text-2xl md:text-4xl font-bold text-dark text-center mb-3">
            Professional FAQ
          </h1>
          <p className="text-center text-muted mb-12">
            Everything you need to know about listing on BeautyLink.
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

          <div className="mt-14 text-center">
            <Link
              href="/pro/apply"
              className="inline-flex items-center gap-2 rounded-full bg-dark px-8 py-3.5 text-sm font-semibold text-white shadow-elevated transition-all hover:bg-dark/90 hover:-translate-y-0.5"
            >
              {IS_LAUNCHED ? "Apply Now" : "Apply as Founding Stylist"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <p className="mt-4">
              <Link
                href="/faq"
                className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
              >
                View General FAQ &rarr;
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
