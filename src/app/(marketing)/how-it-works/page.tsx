import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "How It Works | BeautyLink",
};

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-2xl">
      <h1 className="text-3xl md:text-4xl font-bold text-dark text-center">
        How BeautyLink works
      </h1>
      <p className="mt-4 text-center text-muted text-lg">
        Book discounted beauty appointments in three simple steps.
      </p>

      <div className="mt-14 space-y-10">
        <div>
          <h2 className="text-lg font-semibold text-dark">Search</h2>
          <p className="mt-2 text-body leading-relaxed">
            Browse discounted appointments from verified beauty professionals near you. Filter by category, date, price, and location to find exactly what you need.
          </p>
        </div>
        <div className="border-t border-border" />
        <div>
          <h2 className="text-lg font-semibold text-dark">Book instantly</h2>
          <p className="mt-2 text-body leading-relaxed">
            Reserve your spot with secure checkout powered by Stripe. The price you see is the price you pay — no hidden fees. A small 5% service fee is added at checkout.
          </p>
        </div>
        <div className="border-t border-border" />
        <div>
          <h2 className="text-lg font-semibold text-dark">Save 15–50%</h2>
          <p className="mt-2 text-body leading-relaxed">
            Show up at your appointment, get pampered by a licensed professional, and save big on regular prices. After your visit, leave a review to help the community.
          </p>
        </div>
      </div>

      <div className="mt-14 text-center">
        <Button asChild variant="primary" size="lg">
          <Link href="/browse">Browse appointments</Link>
        </Button>
      </div>
    </div>
  );
}
