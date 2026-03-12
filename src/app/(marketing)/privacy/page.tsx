import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | BeautyLink",
  description: "How BeautyLink collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-muted mb-10">Last updated: March 10, 2026</p>

      <div className="prose prose-gray max-w-none space-y-8 text-body leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            1. Information We Collect
          </h2>
          <p>
            We collect information you provide when creating an account (name,
            email, profile photo), booking appointments (payment details
            processed by Stripe), and using the Platform (browsing activity,
            device information).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            2. How We Use Your Information
          </h2>
          <p>We use your information to:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Process bookings and payments</li>
            <li>Connect you with beauty professionals</li>
            <li>Send booking confirmations and reminders</li>
            <li>Improve the Platform and user experience</li>
            <li>Prevent fraud and ensure safety</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            3. Payment Information
          </h2>
          <p>
            Payment processing is handled entirely by Stripe. We never store
            your credit card number, CVV, or full payment details on our
            servers. Stripe&apos;s privacy policy governs the handling of your
            payment information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            4. Information Sharing
          </h2>
          <p>
            We do not sell your personal information. We share information only
            as needed to facilitate bookings (e.g., your name with the
            professional you booked), process payments (Stripe), and comply with
            legal obligations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            5. Data Security
          </h2>
          <p>
            We use industry-standard security measures including encryption in
            transit (TLS), secure authentication through Clerk, and access
            controls to protect your data. No method of transmission over the
            internet is 100% secure, but we take reasonable precautions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            6. Your Rights
          </h2>
          <p>
            You may access, update, or delete your personal information at any
            time through your account settings. To request a full data export or
            account deletion, contact us at{" "}
            <a
              href="mailto:team@beautylinknetwork.com"
              className="text-accent hover:underline"
            >
              team@beautylinknetwork.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            7. Cookies & Analytics
          </h2>
          <p>
            We use essential cookies for authentication and session management.
            We collect basic analytics data (page views, feature usage) to
            improve the Platform. See our{" "}
            <a href="/cookies" className="text-accent hover:underline">
              Cookie Policy
            </a>{" "}
            for details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            8. Changes to This Policy
          </h2>
          <p>
            We may update this policy from time to time. We will notify you of
            material changes via email or in-app notice. Continued use of the
            Platform after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">9. Contact</h2>
          <p>
            Questions about privacy? Contact us at{" "}
            <a
              href="mailto:team@beautylinknetwork.com"
              className="text-accent hover:underline"
            >
              team@beautylinknetwork.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
