import { Metadata } from "next";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { MyBookingsContent } from "./my-bookings-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Bookings",
};

export default async function MyBookingsPage() {
  const user = await getCurrentUser();

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

  // Calculate total savings
  const completedBookings = bookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "COMPLETED"
  );
  const totalSaved = completedBookings.reduce(
    (sum, b) => sum + (b.originalPrice - b.discountedPrice),
    0
  );

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

      {/* Savings Banner */}
      {totalSaved > 0 && (
        <div className="mb-6 rounded-2xl overflow-hidden bg-gradient-to-r from-accent-light via-[#F9E8EC] to-surface border border-accent-muted/20 px-6 py-5">
          <div className="flex items-center gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <span className="text-xl">✨</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                Your BeautyLink Savings
              </p>
              <p className="text-3xl font-bold text-dark mt-0.5 tracking-tight">
                {formatPrice(totalSaved)}
              </p>
            </div>
            <div className="hidden sm:block shrink-0 text-right">
              <p className="text-2xl font-bold text-dark">
                {completedBookings.length}
              </p>
              <p className="text-xs text-muted">
                {completedBookings.length === 1 ? "booking" : "bookings"}
              </p>
            </div>
          </div>
        </div>
      )}

      <MyBookingsContent bookings={serializedBookings} />
    </div>
  );
}
