import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-muted mb-2">404</p>
      <h1 className="text-2xl font-bold text-dark">Page not found</h1>
      <p className="mt-2 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button variant="primary" size="md" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
        <Button variant="outline" size="md" asChild>
          <Link href="/browse">Browse Appointments</Link>
        </Button>
      </div>
    </main>
  );
}
