import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BeautyLinkLogo } from "@/components/ui/beautylink-logo";

export const metadata: Metadata = {
  title: "Sign up / log in | BeautyLink",
  description: "Sign up or log in to BeautyLink as a customer or beauty professional.",
};

export default function GetStartedPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left side — role selection */}
      <div className="flex w-full flex-col lg:w-1/2">
        {/* Header with logo and back */}
        <div className="flex items-center justify-between p-6">
          <Link
            href="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-body transition-colors hover:bg-background"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Link href="/">
            <BeautyLinkLogo className="text-xl text-dark" />
          </Link>
          <div className="w-10" />
        </div>

        {/* Content — vertically centered */}
        <div className="flex flex-1 flex-col justify-center px-6 pb-16 sm:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <h1 className="text-3xl font-bold text-dark sm:text-4xl">
              Sign up / log in
            </h1>

            <div className="mt-10 space-y-4">
              {/* Customer option */}
              <Link
                href="/login"
                className="group flex items-center justify-between rounded-xl border border-border bg-white px-6 py-5 transition-all hover:border-dark hover:shadow-sm"
              >
                <div>
                  <p className="text-base font-semibold text-dark">
                    BeautyLink for customers
                  </p>
                  <p className="mt-0.5 text-sm text-muted">
                    Book beauty appointments near you
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-dark" />
              </Link>

              {/* Professional option */}
              <Link
                href="/login?intent=pro"
                className="group flex items-center justify-between rounded-xl border border-border bg-white px-6 py-5 transition-all hover:border-dark hover:shadow-sm"
              >
                <div>
                  <p className="text-base font-semibold text-dark">
                    BeautyLink for professionals
                  </p>
                  <p className="mt-0.5 text-sm text-muted">
                    Fill open slots &amp; grow your business
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-dark" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-6 px-6 py-4 text-sm text-muted sm:px-12 lg:px-16">
          <Link href="/help" className="hover:text-dark transition-colors">
            Help and support
          </Link>
        </div>
      </div>

      {/* Right side — hero image (hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80&auto=format&fit=crop')",
          }}
        />
      </div>
    </div>
  );
}
