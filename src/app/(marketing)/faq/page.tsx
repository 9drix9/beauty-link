export const metadata = {
  title: "FAQ",
};

const faqs = [
  {
    question: "What is BeautyLink?",
    answer:
      "BeautyLink is a marketplace for discounted beauty appointments. Licensed beauty professionals list their open time slots at reduced prices, and clients book them at significant savings — everyone wins.",
  },
  {
    question: "How does pricing work?",
    answer:
      "Professionals list their appointments at 15% or more below their normal price. A 5% service fee is added at checkout to keep the platform running. The total price is always shown upfront — no surprises.",
  },
  {
    question: "Is there a cancellation policy?",
    answer:
      "You can cancel for free up to 24 hours before your appointment. Cancellations within 24 hours of the appointment time are non-refundable to protect our professionals' time.",
  },
  {
    question: "How do I become a provider?",
    answer:
      "Apply at our provider sign-up page. You'll need to verify your professional license (cosmetology, esthetics, nail technology, etc.) and complete a brief profile. Once approved, you can start listing appointments right away.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We currently serve the Greater Los Angeles area, including West LA, Santa Monica, Beverly Hills, Hollywood, Westwood, and Westchester. We're expanding to new areas soon.",
  },
  {
    question: "Is BeautyLink safe?",
    answer:
      "Yes. All providers are verified with a valid professional license. Payments are processed securely through Stripe, and funds are held until after your appointment is completed. You can also read reviews from other clients before booking.",
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold text-dark text-center">
        Frequently Asked Questions
      </h1>

      <div className="mt-12 space-y-10">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h2 className="text-xl font-semibold text-dark">
              {faq.question}
            </h2>
            <p className="mt-2 text-body leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
