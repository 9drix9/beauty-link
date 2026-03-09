import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
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

    const { userId: clerkId } = auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const body = await req.json();
    const { listingId } = body;

    if (!listingId) {
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

    // Check for existing active SlotHold by another user
    const existingHold = await db.slotHold.findUnique({
      where: { appointmentListingId: listingId },
    });

    const now = new Date();

    if (existingHold && existingHold.userId !== user.id && existingHold.expiresAt > now) {
      return NextResponse.json(
        { error: "This slot is temporarily held by another user. Please try again shortly." },
        { status: 409 }
      );
    }

    // Create or update the SlotHold
    const holdExpiresAt = new Date(now.getTime() + SLOT_HOLD_MINUTES * 60 * 1000);

    if (existingHold && existingHold.userId === user.id) {
      // Extend existing hold
      await db.slotHold.update({
        where: { id: existingHold.id },
        data: { expiresAt: holdExpiresAt },
      });
    } else if (existingHold) {
      // Expired hold by another user — replace it
      await db.slotHold.update({
        where: { id: existingHold.id },
        data: {
          userId: user.id,
          expiresAt: holdExpiresAt,
        },
      });
    } else {
      // No existing hold — create new
      await db.slotHold.create({
        data: {
          appointmentListingId: listingId,
          userId: user.id,
          expiresAt: holdExpiresAt,
        },
      });
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
    console.error("Error initializing checkout:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
