import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getApiUser } from "@/lib/auth";
import { calculatePriceBreakdown } from "@/lib/pricing";
import { generateBookingReference } from "@/lib/utils";
import { SLOT_HOLD_MINUTES } from "@/lib/constants";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY!)
  : null;

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Payment processing is not configured" },
        { status: 503 }
      );
    }

    const user = await getApiUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { listingId } = body;

    if (!listingId || typeof listingId !== "string") {
      return NextResponse.json(
        { error: "listingId is required" },
        { status: 400 }
      );
    }

    const listing = await db.appointmentListing.findUnique({
      where: { id: listingId },
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

    // Check that the appointment is in the future
    const [hours, minutes] = listing.appointmentTime.split(":").map(Number);
    const apptDateTime = new Date(listing.appointmentDate);
    apptDateTime.setHours(hours, minutes, 0, 0);
    if (apptDateTime.getTime() < Date.now()) {
      return NextResponse.json(
        { error: "This appointment has already started" },
        { status: 409 }
      );
    }

    // ── Atomic slot hold using a transaction ──
    const now = new Date();
    const holdExpiresAt = new Date(
      now.getTime() + SLOT_HOLD_MINUTES * 60 * 1000
    );

    const holdResult = await db.$transaction(async (tx) => {
      // First, clean up any expired holds for this listing
      await tx.slotHold.deleteMany({
        where: {
          appointmentListingId: listingId,
          expiresAt: { lt: now },
        },
      });

      const existingHold = await tx.slotHold.findUnique({
        where: { appointmentListingId: listingId },
      });

      if (existingHold) {
        // If held by the same user, extend their hold
        if (existingHold.userId === user.id) {
          await tx.slotHold.update({
            where: { id: existingHold.id },
            data: { expiresAt: holdExpiresAt },
          });
          return { held: true as const };
        }

        // Held by another user and still active — reject
        return { held: false as const };
      }

      await tx.slotHold.create({
        data: {
          appointmentListingId: listingId,
          userId: user.id,
          expiresAt: holdExpiresAt,
        },
      });

      return { held: true as const };
    });

    if (!holdResult.held) {
      return NextResponse.json(
        {
          error:
            "This slot is temporarily held by another user. Please try again shortly.",
        },
        { status: 409 }
      );
    }

    // Calculate pricing
    const pricing = calculatePriceBreakdown(
      listing.originalPrice,
      listing.discountedPrice
    );

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: pricing.totalCharged,
      currency: "usd",
      metadata: {
        listingId,
        userId: user.id,
        bookingReference: generateBookingReference(),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      holdExpiresAt: holdExpiresAt.toISOString(),
      pricing: {
        originalPrice: pricing.originalPrice,
        discountedPrice: pricing.discountedPrice,
        savingsAmount: pricing.savingsAmount,
        savingsPercent: pricing.savingsPercent,
        platformFee: pricing.platformFee,
        totalCharged: pricing.totalCharged,
        providerPayout: pricing.providerPayout,
        promoDiscount: pricing.promoDiscount,
      },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Error initializing checkout:", errMsg, error);
    return NextResponse.json(
      { error: `Checkout failed: ${errMsg}` },
      { status: 500 }
    );
  }
}
