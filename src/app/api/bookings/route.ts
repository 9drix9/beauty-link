import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { calculatePriceBreakdown } from "@/lib/pricing";
import { generateBookingReference } from "@/lib/utils";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

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

    // ── Verify PaymentIntent with Stripe ──
    if (!stripe) {
      return NextResponse.json(
        { error: "Payment processing is not configured" },
        { status: 503 }
      );
    }

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (pi.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment has not been completed" },
        { status: 400 }
      );
    }

    // Verify the PaymentIntent was created for this listing and user
    if (pi.metadata.listingId !== listingId) {
      return NextResponse.json(
        { error: "Payment does not match this listing" },
        { status: 400 }
      );
    }

    if (pi.metadata.userId !== user.id) {
      return NextResponse.json(
        { error: "Payment does not belong to this user" },
        { status: 400 }
      );
    }

    // Idempotency: if a booking already exists for this PI, return it
    const existingBooking = await db.booking.findFirst({
      where: { stripePaymentIntentId: paymentIntentId },
    });
    if (existingBooking) {
      return NextResponse.json({ booking: existingBooking }, { status: 200 });
    }

    // Fetch listing for initial validation
    const listing = await db.appointmentListing.findUnique({
      where: { id: listingId },
      include: { professional: true },
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

    const bookingReference =
      pi.metadata.bookingReference || generateBookingReference();
    const pricing = calculatePriceBreakdown(
      listing.originalPrice,
      listing.discountedPrice
    );

    // Use a serializable transaction to prevent race conditions
    const booking = await db.$transaction(
      async (tx) => {
        // Re-check availability inside transaction with row lock
        const [freshListing] = await tx.$queryRaw<
          { id: string; booked_count: number; max_clients: number }[]
        >`
          SELECT id, booked_count, max_clients
          FROM appointment_listings
          WHERE id = ${listingId}
          FOR UPDATE
        `;

        if (
          !freshListing ||
          freshListing.booked_count >= freshListing.max_clients
        ) {
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
        const newBookedCount = freshListing.booked_count + 1;
        await tx.appointmentListing.update({
          where: { id: listingId },
          data: {
            bookedCount: { increment: 1 },
            ...(newBookedCount >= freshListing.max_clients
              ? { status: "BOOKED" }
              : {}),
          },
        });

        // Delete any SlotHold for this listing
        await tx.slotHold.deleteMany({
          where: { appointmentListingId: listingId },
        });

        // Update professional stats
        await tx.professionalProfile.update({
          where: { id: listing.professionalId },
          data: { totalBookings: { increment: 1 } },
        });

        // Create notification for the professional
        await tx.notification.create({
          data: {
            userId: listing.professional.userId,
            type: "BOOKING_CONFIRMED_PRO",
            title: "New Booking Confirmed",
            body: `${user.firstName} ${user.lastName} booked your ${listing.serviceName} appointment.`,
            link: `/pro/appointments`,
          },
        });

        return newBooking;
      },
      { isolationLevel: "Serializable" }
    );

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "NO_SPOTS_AVAILABLE") {
      return NextResponse.json(
        { error: "No spots available — this listing is fully booked" },
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
