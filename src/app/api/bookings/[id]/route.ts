import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { CANCELLATION_WINDOW_HOURS } from "@/lib/constants";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkId } = auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const booking = await db.booking.findUnique({
      where: { id: params.id },
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
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePhotoUrl: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Verify the booking belongs to the authenticated user (customer or professional)
    const userProfile = await db.professionalProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    const isCustomer = booking.customerId === user.id;
    const isPro = userProfile?.id === booking.professionalId;
    const isAdmin = user.role === "ADMIN";

    if (!isCustomer && !isPro && !isAdmin) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { action, reason } = body;

    if (action !== "cancel") {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    const booking = await db.booking.findUnique({
      where: { id: params.id },
      include: {
        appointmentListing: true,
        professional: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Verify booking belongs to authenticated user
    if (booking.customerId !== user.id) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.status !== "CONFIRMED") {
      return NextResponse.json(
        { error: "Only confirmed bookings can be cancelled" },
        { status: 400 }
      );
    }

    // Check cancellation window — deny if within 24 hours of appointment
    const [hours, minutes] = booking.appointmentTime.split(":").map(Number);
    const appointmentStart = new Date(booking.appointmentDate);
    appointmentStart.setHours(hours, minutes, 0, 0);
    const hoursUntilAppointment =
      (appointmentStart.getTime() - Date.now()) / (1000 * 60 * 60);

    if (hoursUntilAppointment < CANCELLATION_WINDOW_HOURS) {
      return NextResponse.json(
        {
          error: `Cancellations must be made at least ${CANCELLATION_WINDOW_HOURS} hours before the appointment.`,
        },
        { status: 400 }
      );
    }

    // ── Issue Stripe refund ──
    let refundId: string | null = null;
    if (stripe && booking.stripePaymentIntentId) {
      try {
        const refund = await stripe.refunds.create({
          payment_intent: booking.stripePaymentIntentId,
        });
        refundId = refund.id;
      } catch (refundError) {
        console.error("Stripe refund failed:", refundError);
        return NextResponse.json(
          { error: "Failed to process refund. Please contact support." },
          { status: 500 }
        );
      }
    }

    // Cancel the booking and update listing in a transaction
    const updatedBooking = await db.$transaction(async (tx) => {
      const cancelled = await tx.booking.update({
        where: { id: params.id },
        data: {
          status: "CANCELLED_BY_CUSTOMER",
          cancellationReason: reason || null,
          cancelledAt: new Date(),
          refundAmount: booking.totalCharged,
          refundStripeId: refundId,
        },
      });

      // Decrement listing bookedCount and potentially restore LIVE status
      await tx.appointmentListing.update({
        where: { id: booking.appointmentListingId },
        data: {
          bookedCount: { decrement: 1 },
          ...(booking.appointmentListing.status === "BOOKED"
            ? { status: "LIVE" }
            : {}),
        },
      });

      // Create notification for the professional
      await tx.notification.create({
        data: {
          userId: booking.professional.userId,
          type: "BOOKING_CANCELLED_BY_CUSTOMER",
          title: "Booking Cancelled",
          body: `${user.firstName} ${user.lastName} cancelled their ${booking.serviceName} booking (${booking.bookingReference}).`,
          link: `/pro/appointments`,
        },
      });

      return cancelled;
    });

    return NextResponse.json({ booking: updatedBooking });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
