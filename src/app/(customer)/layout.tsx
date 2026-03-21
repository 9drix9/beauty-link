import { CustomerNav } from "@/components/layout/customer-nav";
import { MobileBottomTabs } from "@/components/layout/mobile-bottom-tabs";
import { Footer } from "@/components/layout/footer";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CustomerNav />
      <main className="min-h-screen pb-20 md:pb-0">{children}</main>
      <MobileBottomTabs />
      <Footer />
    </>
  );
}
