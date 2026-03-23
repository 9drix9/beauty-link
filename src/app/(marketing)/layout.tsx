import Link from "next/link";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Footer } from "@/components/layout/footer";
import { IS_LAUNCHED } from "@/lib/launch";

function LaunchBanner() {
  return (
    <div className="bg-dark text-white text-center py-2.5 px-4">
      <p className="text-sm font-medium">
        <Link
          href="/pro/join"
          className="hover:text-accent transition-colors"
        >
          Now onboarding a curated group of founding stylists
        </Link>
        {" "}<span className="text-white/50 mx-1.5">|</span>{" "}
        Launching May 2026
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
      {!IS_LAUNCHED && <LaunchBanner />}
      <MarketingNav />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
