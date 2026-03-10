import { Metadata } from "next";
import { Mail, Clock, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | BeautyLink",
  description: "Get in touch with the BeautyLink team.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-dark">
          Contact Us
        </h1>
        <p className="mt-3 text-muted text-lg">
          Have a question or need help? We&apos;re here for you.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
              <Mail className="h-5 w-5 text-accent" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-semibold text-dark">Email Support</h2>
              <p className="mt-1 text-sm text-muted">
                For general inquiries, account help, or booking issues.
              </p>
              <a
                href="mailto:support@beautylinknetwork.com"
                className="mt-2 inline-block text-sm font-medium text-accent hover:underline"
              >
                support@beautylinknetwork.com
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
              <Clock className="h-5 w-5 text-accent" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-semibold text-dark">Response Time</h2>
              <p className="mt-1 text-sm text-muted">
                We typically respond within 24 hours on business days. For urgent
                booking issues, include your booking ID in the subject line.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
              <MapPin className="h-5 w-5 text-accent" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-semibold text-dark">Service Area</h2>
              <p className="mt-1 text-sm text-muted">
                BeautyLink currently serves the Greater Los Angeles area,
                including West LA, Santa Monica, Beverly Hills, Hollywood,
                Westwood, and Westchester.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center rounded-2xl bg-background p-8">
        <h2 className="text-xl font-bold text-dark mb-2">
          Professional Inquiries
        </h2>
        <p className="text-muted mb-4">
          Interested in listing your services on BeautyLink? Visit our
          professional page or email us directly.
        </p>
        <a
          href="mailto:pros@beautylinknetwork.com"
          className="inline-flex items-center text-sm font-semibold text-accent hover:underline"
        >
          pros@beautylinknetwork.com
        </a>
      </div>
    </div>
  );
}
