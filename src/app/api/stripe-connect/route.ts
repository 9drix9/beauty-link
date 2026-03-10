import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getApiUser } from "@/lib/auth";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    httpClient: Stripe.createFetchHttpClient(),
    timeout: 30000,
  });
}

/**
 * POST /api/stripe-connect
 * Creates a Stripe Connect Express account and returns an onboarding link.
 */
export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
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

    // Verify user is an approved pro
    const profile = await db.professionalProfile.findFirst({
      where: { userId: user.id, applicationStatus: "APPROVED" },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "You must be an approved professional" },
        { status: 403 }
      );
    }

    let accountId = profile.stripeConnectAccountId;

    // Create a new Connect account if one doesn't exist
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "US",
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "individual",
        individual: {
          first_name: user.firstName || undefined,
          last_name: user.lastName || undefined,
          email: user.email,
        },
        metadata: {
          beautylink_user_id: user.id,
          beautylink_profile_id: profile.id,
        },
      });

      accountId = account.id;

      // Save the Connect account ID
      await db.professionalProfile.update({
        where: { id: profile.id },
        data: { stripeConnectAccountId: accountId },
      });
    }

    // Generate an account onboarding link
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "https://beautylinknetwork.com";

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/pro/settings?stripe=refresh`,
      return_url: `${origin}/pro/settings?stripe=success`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error("Stripe Connect error:", JSON.stringify({
      message: error instanceof Error ? error.message : String(error),
      type: error instanceof Stripe.errors.StripeError ? error.type : "unknown",
      code: error instanceof Stripe.errors.StripeError ? error.code : undefined,
    }));

    const message =
      error instanceof Stripe.errors.StripeError
        ? error.message
        : "Failed to set up payment account";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/stripe-connect
 * Returns the current Connect account status.
 */
export async function GET() {
  try {
    const stripe = getStripe();
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

    const profile = await db.professionalProfile.findFirst({
      where: { userId: user.id, applicationStatus: "APPROVED" },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "You must be an approved professional" },
        { status: 403 }
      );
    }

    if (!profile.stripeConnectAccountId) {
      return NextResponse.json({
        connected: false,
        payoutEnabled: false,
      });
    }

    // Fetch the account from Stripe to check status
    const account = await stripe.accounts.retrieve(
      profile.stripeConnectAccountId
    );

    const payoutsEnabled = account.payouts_enabled ?? false;
    const chargesEnabled = account.charges_enabled ?? false;
    const detailsSubmitted = account.details_submitted ?? false;

    // Update local state if it changed
    if (payoutsEnabled !== profile.payoutEnabled) {
      await db.professionalProfile.update({
        where: { id: profile.id },
        data: {
          payoutEnabled: payoutsEnabled,
          bankAccountLast4: account.external_accounts?.data?.[0]?.last4 || profile.bankAccountLast4,
        },
      });
    }

    return NextResponse.json({
      connected: true,
      payoutEnabled: payoutsEnabled,
      chargesEnabled,
      detailsSubmitted,
      bankLast4: account.external_accounts?.data?.[0]?.last4 || null,
    });
  } catch (error) {
    console.error("Stripe Connect status error:", error);
    return NextResponse.json(
      { error: "Failed to check payment account status" },
      { status: 500 }
    );
  }
}
