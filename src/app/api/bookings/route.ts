import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { calculatePriceBreakdown } from "@/lib/pricing";
import { generateBookingReference } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const body = await req.json();
    const { listingId, paymentIntentId } = body;

    if (!listingId || !paymentIntentId) {
      return NextResponse.json(
        { error: "listingId and paymentIntentId are required" },
        { status: 400 }
      );
    }

    // Fetch listing outside transaction for initial validation
    const listing = await db.appointmentListing.findUnique({
      where: { id: listingId },
      include: {
        professional: true,
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    if (listing.status !== "LIVE") {
      return NextResponse.json(
        { error: "Listing is no longer available" },
        { status: 409 }
      );
    }

    if (listing.bookedCount >= listing.maxClients) {
      return NextResponse.json(
        { error: "No spots available" },
        { status: 409 }
      );
    }

    const bookingReference = generateBookingReference();
    const pricing = calculatePriceBreakdown(
      listing.originalPrice,
      listing.discountedPrice
    );

    // Use a transaction for atomicity
    const booking = await db.$transaction(async (tx) => {
      // Re-check availability inside transaction
      const freshListing = await tx.appointmentListing.findUnique({
        where: { id: listingId },
      });

      if (!freshListing || freshListing.bookedCount >= freshListing.maxClients) {
        throw new Error("NO_SPOTS_AVAILABLE");
      }

      // Create the booking with snapshot fields
      const newBooking = await tx.booking.create({
        data: {
          bookingReference,
          appointmentListingId: listingId,
          customerId: user.id,
          professionalId: listing.professionalId,
          serviceName: listing.serviceName,
          serviceCategory: listing.serviceCategory,
          appointmentDate: listing.appointmentDate,
          appointmentTime: listing.appointmentTime,
          timezone: listing.timezone,
          durationMinutes: listing.durationMinutes,
          locationAddress: listing.locationAddress,
          originalPrice: pricing.originalPrice,
          discountedPrice: pricing.discountedPrice,
          platformFee: pricing.platformFee,
          totalCharged: pricing.totalCharged,
          stripePaymentIntentId: paymentIntentId,
          status: "CONFIRMED",
        },
      });

      // Increment bookedCount
      const newBookedCount = freshListing.bookedCount + 1;
      await tx.appointmentListing.update({
        where: { id: listingId },
        data: {
          bookedCount: { increment: 1 },
          ...(newBookedCount >= freshListing.maxClients
            ? { status: "BOOKED" }
            : {}),
        },
      });

      // Delete any SlotHold for this listing
      await tx.slotHold.deleteMany({
        where: { appointmentListingId: listingId },
      });

      // Create notification for the professional
      await tx.notification.create({
        data: {
          userId: listing.professional.userId,
          type: "BOOKING_CONFIRMED_PRO",
          title: "New Booking Confirmed",
          body: `${user.firstName} ${user.lastName} booked your ${listing.serviceName} appointment on ${listing.appointmentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${listing.appointmentTime}.`,
          link: `/pro/bookings/${newBooking.id}`,
        },
      });

      return newBooking;
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "NO_SPOTS_AVAILABLE") {
      return NextResponse.json(
        { error: "No spots available" },
        { status: 409 }
      );
    }

    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
