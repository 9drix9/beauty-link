import { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { MyBookingsContent } from "./my-bookings-content";

export const metadata: Metadata = {
  title: "My Bookings",
};

export default async function MyBookingsPage() {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  if (!user) {
    redirect("/login");
  }

  const bookings = await db.booking.findMany({
    where: { customerId: user.id },
    orderBy: { appointmentDate: "desc" },
    include: {
      appointmentListing: {
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
      },
    },
  });

  const serializedBookings = bookings.map((booking) => ({
    id: booking.id,
    bookingReference: booking.bookingReference,
    serviceName: booking.serviceName,
    serviceCategory: booking.serviceCategory,
    appointmentDate: booking.appointmentDate.toISOString(),
    appointmentTime: booking.appointmentTime,
    durationMinutes: booking.durationMinutes,
    locationAddress: booking.locationAddress,
    originalPrice: booking.originalPrice,
    discountedPrice: booking.discountedPrice,
    platformFee: booking.platformFee,
    totalCharged: booking.totalCharged,
    status: booking.status,
    createdAt: booking.createdAt.toISOString(),
    appointmentListing: {
      id: booking.appointmentListing.id,
      professional: {
        id: booking.appointmentListing.professional.id,
        displayName: booking.appointmentListing.professional.displayName,
        user: {
          firstName: booking.appointmentListing.professional.user.firstName,
          lastName: booking.appointmentListing.professional.user.lastName,
          profilePhotoUrl:
            booking.appointmentListing.professional.user.profilePhotoUrl,
        },
      },
    },
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-dark">My Bookings</h1>
      <MyBookingsContent bookings={serializedBookings} />
    </div>
  );
}
