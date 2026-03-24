import Link from "next/link";
import { BeautyLinkLogo } from "@/components/ui/beautylink-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Link href="/" className="mb-8 block text-center">
        <BeautyLinkLogo className="text-3xl text-dark" />
      </Link>
      {children}
    </div>
  );
}
