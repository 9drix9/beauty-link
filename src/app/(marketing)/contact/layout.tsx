import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Desk | BeautyLink",
  description: "Get in touch with the BeautyLink team. We respond within 24 hours.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
