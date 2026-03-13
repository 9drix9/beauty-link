import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { db } from "@/lib/db";
import { IS_LAUNCHED } from "@/lib/launch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckoutContent } from "./checkout-content";

export const metadata: Metadata = {
  title: "Checkout",
};

interface CheckoutPageProps {
  params: { appointmentId: string };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  // Disable checkout in pre-launch mode
  if (!IS_LAUNCHED) {
    redirect("/browse");
  }
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true, email: true, firstName: true, lastName: true },
  });

  if (!user) {
    redirect("/login");
  }

  const listing = await db.appointmentListing.findUnique({
    where: { id: params.appointmentId },
    include: {
      professional: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              profilePhotoUrl: true,
            },
          },
        },
      },
    },
  });

  if (!listing || listing.status !== "LIVE" || listing.bookedCount >= listing.maxClients) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <Card>
          <CardContent className="p-8 space-y-4">
            <AlertCircle className="mx-auto h-12 w-12 text-error" />
            <h1 className="text-xl font-bold text-dark">
              {!listing
                ? "Appointment Not Found"
                : listing.status !== "LIVE"
                  ? "Appointment No Longer Available"
                  : "Fully Booked"}
            </h1>
            <p className="text-muted">
              {!listing
                ? "We couldn't find the appointment you're looking for."
                : listing.status !== "LIVE"
                  ? "This appointment listing is no longer active."
                  : "All spots for this appointment have been taken."}
            </p>
            <Button variant="primary" asChild>
              <Link href="/browse">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse Appointments
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const serializedListing = {
    id: listing.id,
    serviceName: listing.serviceName,
    serviceCategory: listing.serviceCategory,
    description: listing.description,
    appointmentDate: listing.appointmentDate.toISOString(),
    appointmentTime: listing.appointmentTime,
    durationMinutes: listing.durationMinutes,
    originalPrice: listing.originalPrice,
    discountedPrice: listing.discountedPrice,
    maxClients: listing.maxClients,
    bookedCount: listing.bookedCount,
    locationAddress: listing.locationAddress,
    launchZone: listing.launchZone,
    professional: {
      id: listing.professional.id,
      displayName: listing.professional.displayName,
      avgRating: listing.professional.avgRating,
      user: {
        firstName: listing.professional.user.firstName,
        lastName: listing.professional.user.lastName,
        profilePhotoUrl: listing.professional.user.profilePhotoUrl,
      },
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <CheckoutContent
        listing={serializedListing}
        userId={user.id}
        userEmail={user.email}
      />
    </div>
  );
}
