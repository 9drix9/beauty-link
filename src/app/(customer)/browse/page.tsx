import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WaitlistForm } from "@/components/shared/waitlist-form";
import { BrowseContent } from "./browse-content";
import { IS_LAUNCHED } from "@/lib/launch";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse Appointments | BeautyLink",
  description:
    "Browse discounted beauty appointments from top professionals near you.",
};

interface BrowsePageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    date?: string;
    zone?: string;
  }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  if (IS_LAUNCHED) {
    const params = await searchParams;
    return <BrowseContent searchParams={params} />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-sm font-semibold text-accent mb-3">
          Coming Soon
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-dark mb-3">
          Client bookings open April 2026
        </h1>
        <p className="text-body/70 mb-8">
          We&apos;re onboarding our first Founding Stylists now.
          Join the waitlist to be the first to book.
        </p>

        <WaitlistForm source="browse" />

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/pro/apply"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
          >
            Are you a stylist? Apply now
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
