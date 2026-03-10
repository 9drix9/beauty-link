import { Metadata } from "next";
import Link from "next/link";
import {
  CalendarCheck,
  CreditCard,
  Shield,
  UserCheck,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Help Center | BeautyLink",
  description: "Find answers and get help with BeautyLink.",
};

const helpTopics = [
  {
    icon: CalendarCheck,
    title: "Booking & Appointments",
    items: [
      "Browse available appointments on the Browse page",
      "Tap 'Book Now' and complete checkout with secure payment",
      "View your upcoming bookings in My Bookings",
      "Cancel for free up to 24 hours before the appointment",
    ],
  },
  {
    icon: CreditCard,
    title: "Payments & Refunds",
    items: [
      "All payments are processed securely through Stripe",
      "A small service fee is added at checkout",
      "Full refund if you cancel more than 24 hours in advance",
      "Cancellations within 24 hours are non-refundable",
    ],
  },
  {
    icon: UserCheck,
    title: "Your Account",
    items: [
      "Sign up with email or Google",
      "Manage your profile from the account menu",
      "Save favorite professionals for quick rebooking",
      "View your booking history and leave reviews",
    ],
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    items: [
      "All professionals are reviewed and approved before listing",
      "License information is verified when provided",
      "Ratings and reviews help you choose with confidence",
      "Payment is held securely until after your appointment",
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-dark">
          Help Center
        </h1>
        <p className="mt-3 text-muted text-lg">
          Quick answers to common questions about using BeautyLink.
        </p>
      </div>

      <div className="space-y-6">
        {helpTopics.map((topic) => (
          <div
            key={topic.title}
            className="rounded-xl border border-border bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10">
                <topic.icon
                  className="h-4.5 w-4.5 text-accent"
                  aria-hidden="true"
                />
              </div>
              <h2 className="text-lg font-semibold text-dark">{topic.title}</h2>
            </div>
            <ul className="space-y-2 pl-12">
              {topic.items.map((item, idx) => (
                <li key={idx} className="text-sm text-body leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Link
          href="/faq"
          className="flex items-center justify-between rounded-xl border border-border bg-white p-5 shadow-sm transition-all hover:shadow-card hover:-translate-y-0.5 flex-1"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-accent" aria-hidden="true" />
            <span className="font-medium text-dark">View Full FAQ</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
        </Link>

        <Link
          href="/contact"
          className="flex items-center justify-between rounded-xl border border-border bg-white p-5 shadow-sm transition-all hover:shadow-card hover:-translate-y-0.5 flex-1"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-accent" aria-hidden="true" />
            <span className="font-medium text-dark">Contact Support</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
