import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

export const metadata = { title: "For Professionals — BeautyLink" };

const requirements = [
  "Valid professional license (cosmetology, esthetics, nail tech, etc.)",
  "At least 3 portfolio photos",
  "Professional workspace (salon, suite, or home studio)",
  "Located in Greater Los Angeles (expanding soon)",
];

export default function JoinPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient text-white py-20 md:py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Fill your empty chair.
            <br />
            Keep every dollar.
          </h1>
          <p className="text-lg text-white/85 max-w-xl mx-auto mb-8">
            List your open slots at a discount. We charge customers a 5% fee — you keep 100% of your price.
          </p>
          <Button variant="cta" size="xl" asChild>
            <Link href="/pro/apply">
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      {/* How it works — simple */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-baseline gap-4">
            <span className="text-sm font-semibold text-purple-primary shrink-0">Apply</span>
            <p className="text-body">Submit your license and portfolio. We verify within 48 hours.</p>
          </div>
          <div className="border-t border-border" />
          <div className="flex items-baseline gap-4">
            <span className="text-sm font-semibold text-purple-primary shrink-0">List</span>
            <p className="text-body">Post discounted appointments anytime you have open slots.</p>
          </div>
          <div className="border-t border-border" />
          <div className="flex items-baseline gap-4">
            <span className="text-sm font-semibold text-purple-primary shrink-0">Earn</span>
            <p className="text-body">Clients book instantly. You get paid within 24 hours after the appointment.</p>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-dark mb-6">Requirements</h2>
          <ul className="space-y-3">
            {requirements.map((req) => (
              <li key={req} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-body">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Bottom CTA — minimal */}
      <section className="py-12 px-4 border-t border-border text-center">
        <p className="text-body text-muted mb-4">
          Join hundreds of beauty professionals growing their business with BeautyLink.
        </p>
        <Button variant="cta" size="lg" asChild>
          <Link href="/pro/apply">
            Apply Now
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </section>
    </main>
  );
}
