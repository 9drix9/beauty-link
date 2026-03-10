import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { calculatePriceBreakdown } from "@/lib/pricing";
import { generateBookingReference } from "@/lib/utils";
import { logger } from "@/lib/logger";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.error("WEBHOOK_SIGNATURE_FAILED", { error: message });
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const { listingId, userId, bookingReference } = pi.metadata;

        if (!listingId || !userId) {
          logger.error("WEBHOOK_MISSING_METADATA", { paymentIntentId: pi.id });
          break;
        }

        // Idempotency: skip if booking already exists for this PaymentIntent
        const existing = await db.booking.findFirst({
          where: { stripePaymentIntentId: pi.id },
        });
        if (existing) {
          logger.info("WEBHOOK_IDEMPOTENT_SKIP", { paymentIntentId: pi.id, existingBookingId: existing.id });
          break;
        }

        await db.$transaction(
          async (tx) => {
            // Lock the listing row to prevent overbooking
            const [listing] = await tx.$queryRaw<
              {
                id: string;
                professional_id: string;
                service_category: string;
                service_name: string;
                description: string | null;
                appointment_date: Date;
                appointment_time: string;
                timezone: string;
                duration_minutes: number;
                original_price: number;
                discounted_price: number;
                location_address: string | null;
                max_clients: number;
                booked_count: number;
                status: string;
              }[]
            >`
              SELECT * FROM appointment_listings
              WHERE id = ${listingId}
              FOR UPDATE
            `;

            if (!listing || listing.booked_count >= listing.max_clients) {
              logger.warn("WEBHOOK_LISTING_UNAVAILABLE", { listingId, paymentIntentId: pi.id, action: "refund" });
              // Refund the payment since we can't fulfill it
              await stripe.refunds.create({ payment_intent: pi.id });
              return;
            }

            if (listing.status !== "LIVE" && listing.status !== "BOOKED") {
              logger.warn("WEBHOOK_LISTING_WRONG_STATUS", { listingId, status: listing.status, paymentIntentId: pi.id, action: "refund" });
              await stripe.refunds.create({ payment_intent: pi.id });
              return;
            }

            const pricing = calculatePriceBreakdown(
              listing.original_price,
              listing.discounted_price
            );

            // Get pro's userId for notification
            const profile = await tx.professionalProfile.findUnique({
              where: { id: listing.professional_id },
              select: { userId: true },
            });

            const ref = bookingReference || generateBookingReference();

            await tx.booking.create({
              data: {
                bookingReference: ref,
                appointmentListingId: listingId,
                customerId: userId,
                professionalId: listing.professional_id,
                serviceName: listing.service_name,
                serviceCategory: listing.service_category as never,
                appointmentDate: listing.appointment_date,
                appointmentTime: listing.appointment_time,
                timezone: listing.timezone,
                durationMinutes: listing.duration_minutes,
                locationAddress: listing.location_address,
                originalPrice: pricing.originalPrice,
                discountedPrice: pricing.discountedPrice,
                platformFee: pricing.platformFee,
                totalCharged: pricing.totalCharged,
                stripePaymentIntentId: pi.id,
                status: "CONFIRMED",
              },
            });

            const newBookedCount = listing.booked_count + 1;
            await tx.appointmentListing.update({
              where: { id: listingId },
              data: {
                bookedCount: { increment: 1 },
                ...(newBookedCount >= listing.max_clients
                  ? { status: "BOOKED" }
                  : {}),
              },
            });

            // Clean up slot hold
            await tx.slotHold.deleteMany({
              where: { appointmentListingId: listingId },
            });

            // Update professional stats
            await tx.professionalProfile.update({
              where: { id: listing.professional_id },
              data: { totalBookings: { increment: 1 } },
            });

            // Notify professional
            if (profile) {
              await tx.notification.create({
                data: {
                  userId: profile.userId,
                  type: "BOOKING_CONFIRMED_PRO",
                  title: "New Booking",
                  body: `New booking for ${listing.service_name} (${ref})`,
                  link: `/pro/appointments`,
                },
              });
            }
          },
          { isolationLevel: "Serializable" }
        );

        logger.info("BOOKING_CREATED", {
          paymentIntentId: pi.id,
          listingId,
          customerId: userId,
          bookingReference: bookingReference || "generated",
        });

        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const { listingId } = pi.metadata;

        // Release the slot hold on payment failure
        if (listingId) {
          await db.slotHold.deleteMany({
            where: { appointmentListingId: listingId },
          });
        }

        logger.warn("PAYMENT_FAILED", { paymentIntentId: pi.id, listingId });
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const piId = typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id;

        if (piId) {
          const booking = await db.booking.findFirst({
            where: { stripePaymentIntentId: piId },
          });

          if (booking && booking.status === "CONFIRMED") {
            await db.booking.update({
              where: { id: booking.id },
              data: {
                status: "REFUNDED",
                refundAmount: charge.amount_refunded,
              },
            });
          }
        }
        break;
      }

      case "account.updated": {
        // Stripe Connect account was updated (onboarding completed, etc.)
        const account = event.data.object as Stripe.Account;
        const connectAccountId = account.id;

        const profile = await db.professionalProfile.findFirst({
          where: { stripeConnectAccountId: connectAccountId },
        });

        if (profile) {
          await db.professionalProfile.update({
            where: { id: profile.id },
            data: {
              payoutEnabled: account.payouts_enabled ?? false,
              bankAccountLast4:
                account.external_accounts?.data?.[0]?.last4 ||
                profile.bankAccountLast4,
            },
          });
        }
        break;
      }

      default:
        // Unhandled event — acknowledge
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    logger.error("WEBHOOK_HANDLER_ERROR", { eventType: event.type, error: err instanceof Error ? err.message : "Unknown error" });
    return NextResponse.json(
      { error: "Webhook handler error" },
      { status: 500 }
    );
  }
}
