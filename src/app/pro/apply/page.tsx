import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import Link from "next/link";
import { ApplyForm } from "./apply-form";

export const metadata = { title: "Apply as a Professional" };

export default async function ApplyPage() {
  const baseUser = await getCurrentUser();

  if (!baseUser) {
    redirect("/signup");
  }

  // Check if user already has a professional profile
  const user = await db.user.findUnique({
    where: { id: baseUser.id },
    include: { professionalProfile: true },
  });

  if (user?.professionalProfile) {
    const { applicationStatus } = user.professionalProfile;

    if (applicationStatus === "APPROVED") {
      redirect("/pro/dashboard");
    }

    if (applicationStatus === "PENDING") {
      return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <Card className="max-w-lg w-full text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                <Clock className="h-8 w-8 text-purple-primary" />
              </div>
              <CardTitle className="text-2xl">Application Under Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="warning" className="text-sm">
                Pending Review
              </Badge>
              <p className="text-muted">
                Your application has been submitted and is currently being
                reviewed by our team. You&apos;ll hear from us within 48 hours.
              </p>
              <p className="text-sm text-muted">
                Submitted on{" "}
                {user.professionalProfile.applicationSubmittedAt?.toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" }
                )}
              </p>
              <Button variant="secondary" asChild>
                <Link href="/browse">Browse Appointments</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Apply as a Professional</h1>
          <p className="text-muted">
            Complete the form below to join BeautyLink as a verified professional.
          </p>
        </div>
        <ApplyForm />
      </div>
    </main>
  );
}
