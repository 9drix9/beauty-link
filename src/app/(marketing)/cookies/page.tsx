import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | BeautyLink",
  description: "How BeautyLink uses cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">
        Cookie Policy
      </h1>
      <p className="text-sm text-muted mb-10">Last updated: March 10, 2026</p>

      <div className="prose prose-gray max-w-none space-y-8 text-body leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            What Are Cookies
          </h2>
          <p>
            Cookies are small text files stored on your device when you visit a
            website. They help the site remember your preferences and improve
            your experience.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            Cookies We Use
          </h2>

          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-border p-4">
              <h3 className="font-semibold text-dark">Essential Cookies</h3>
              <p className="mt-1 text-sm">
                Required for the Platform to function. These handle
                authentication (via Clerk), session management, and security.
                They cannot be disabled.
              </p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <h3 className="font-semibold text-dark">Analytics Cookies</h3>
              <p className="mt-1 text-sm">
                We collect basic usage data (page views, feature interactions)
                to understand how the Platform is used and improve the
                experience. This data is anonymous and aggregated.
              </p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <h3 className="font-semibold text-dark">Payment Cookies</h3>
              <p className="mt-1 text-sm">
                Stripe may set cookies to process payments securely and prevent
                fraud. These are governed by Stripe&apos;s own cookie policy.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            Third-Party Cookies
          </h2>
          <p>
            We do not use advertising cookies or sell data to third parties. The
            only third-party cookies on BeautyLink come from our authentication
            provider (Clerk) and payment processor (Stripe), both of which are
            necessary for the Platform to function.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">
            Managing Cookies
          </h2>
          <p>
            You can manage cookies through your browser settings. Note that
            disabling essential cookies may prevent you from using certain
            features like signing in or completing bookings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-dark mb-3">Contact</h2>
          <p>
            Questions about our cookie practices? Contact us at{" "}
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
