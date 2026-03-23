import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional FAQ",
  description:
    "Frequently asked questions for beauty professionals on BeautyLink. Learn about listing, pricing, payouts, model calls, badges, and more.",
  alternates: { canonical: "/pro-faq" },
};

export default function ProFaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
