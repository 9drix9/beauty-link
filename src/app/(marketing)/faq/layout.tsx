import { Metadata } from "next";
import { FAQSchema } from "@/components/shared/structured-data";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about BeautyLink. Learn about booking, payments, cancellations, professional verification, and more.",
  alternates: { canonical: "/faq" },
};

const faqData = [
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
      "Absolutely. All payments are processed securely through Stripe. Your payment information is never stored on our servers.",
  },
  {
    question: "How much can I save?",
    answer:
      "Professionals set their own discounted prices, typically 10 to 50% below their regular rate. The total price is always shown upfront before you pay.",
  },
];

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FAQSchema faqs={faqData} />
      {children}
    </>
  );
}
