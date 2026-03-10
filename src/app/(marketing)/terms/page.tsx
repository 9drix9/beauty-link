import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | BeautyLink",
  description: "BeautyLink terms of service and conditions of use.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">
        Terms of Service
      </h1>
      <p className="text-sm text-muted mb-10">Last updated: March 10, 2026</p>

      <div className="prose prose-gray max-w-none space-y-8 text-body leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using BeautyLink (&quot;the Platform&quot;), you agree to be
            bound by these Terms of Service. If you do not agree, do not use the
            Platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            2. Description of Service
          </h2>
          <p>
            BeautyLink is a marketplace that connects clients with beauty
            professionals offering discounted appointment slots. We facilitate
            booking and payment but do not directly provide beauty services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            3. User Accounts
          </h2>
          <p>
            You must create an account to book appointments or list services. You
            are responsible for maintaining the confidentiality of your account
            credentials and for all activity under your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            4. Bookings & Payments
          </h2>
          <p>
            All payments are processed through Stripe. A 5% service fee is added
            to each booking. Prices shown on listings are set by professionals
            and include the discounted rate. Full payment is required at the time
            of booking.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            5. Cancellation Policy
          </h2>
          <p>
            Clients may cancel a booking free of charge up to 24 hours before
            the scheduled appointment time. Cancellations made within 24 hours
            of the appointment are non-refundable. Professionals who cancel are
            subject to review and potential account action.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            6. Professional Responsibilities
          </h2>
          <p>
            Professionals are responsible for the accuracy of their listings,
            providing services as described, and complying with all applicable
            local licensing and regulatory requirements. BeautyLink does not
            guarantee the quality of services provided.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            7. Prohibited Conduct
          </h2>
          <p>
            Users may not misuse the Platform, including but not limited to:
            creating fraudulent accounts, manipulating reviews, circumventing
            payment systems, or engaging in harassment of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            8. Limitation of Liability
          </h2>
          <p>
            BeautyLink acts as a marketplace facilitator. We are not liable for
            the quality, safety, or legality of services provided by
            professionals. Our liability is limited to the fees paid to us for
            the specific transaction in question.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            9. Changes to Terms
          </h2>
          <p>
            We may update these terms from time to time. Continued use of the
            Platform after changes constitutes acceptance of the updated terms.
            We will notify users of material changes via email or in-app notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">10. Contact</h2>
          <p>
            Questions about these terms? Contact us at{" "}
            <a
              href="mailto:support@beautylinknetwork.com"
              className="text-accent hover:underline"
            >
              support@beautylinknetwork.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
