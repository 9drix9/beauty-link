import Link from "next/link";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Footer } from "@/components/layout/footer";

function LaunchBanner() {
  return (
    <div className="bg-dark text-white text-center py-2.5 px-4">
      <p className="text-sm font-medium">
        Now Onboarding Founding Stylists{" "}
        <span className="text-white/50 mx-1.5">|</span>{" "}
        <Link
          href="/pro/apply"
          className="underline underline-offset-2 hover:text-accent transition-colors"
        >
          Launching April 2026
        </Link>
      </p>
    </div>
  );
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LaunchBanner />
      <MarketingNav />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
