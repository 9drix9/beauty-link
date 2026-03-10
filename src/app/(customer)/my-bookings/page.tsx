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
        <div className="mb-6 rounded-xl bg-success-light border border-success/20 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-success font-medium">
                Total Saved with BeautyLink
              </p>
              <p className="text-2xl font-bold text-success mt-0.5">
                {formatPrice(totalSaved)}
              </p>
            </div>
            <div className="text-sm text-success">
              Across {completedBookings.length} booking{completedBookings.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      )}

      <MyBookingsContent bookings={serializedBookings} />
    </div>
  );
}
