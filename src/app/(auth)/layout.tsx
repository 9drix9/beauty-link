import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Link href="/" className="mb-8 block text-center">
        <span className="text-3xl font-bold text-accent">BeautyLink</span>
      </Link>
      {children}
    </div>
  );
}
