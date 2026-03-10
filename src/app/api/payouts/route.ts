import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getApiUser } from "@/lib/auth";
import { INSTANT_PAYOUT_FEE_RATE } from "@/lib/constants";
import Stripe from "stripe";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    httpClient: Stripe.createFetchHttpClient(),
    timeout: 30000,
  });
}

/**
 * POST /api/payouts
 * Request a payout of available balance to the pro's Stripe Connect account.
 * Body: { type?: "STANDARD" | "INSTANT" }
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

    const profile = await db.professionalProfile.findFirst({
      where: { userId: user.id, applicationStatus: "APPROVED" },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "You must be an approved professional" },
        { status: 403 }
      );
    }

    if (!profile.stripeConnectAccountId || !profile.payoutEnabled) {
      return NextResponse.json(
        { error: "Please set up your payment account first" },
        { status: 400 }
      );
    }

    if (profile.availableBalance <= 0) {
      return NextResponse.json(
        { error: "No available balance to withdraw" },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const payoutType = body.type === "INSTANT" ? "INSTANT" : "STANDARD";

    const amount = profile.availableBalance;
    let instantFee = 0;
    let transferAmount = amount;

    if (payoutType === "INSTANT") {
      instantFee = Math.round(amount * INSTANT_PAYOUT_FEE_RATE);
      transferAmount = amount - instantFee;
    }

    if (transferAmount < 100) {
      // Minimum $1.00
      return NextResponse.json(
        { error: "Minimum payout amount is $1.00" },
        { status: 400 }
      );
    }

    // Use a transaction to prevent double payouts
    const payout = await db.$transaction(async (tx) => {
      // Re-read balance inside transaction
      const freshProfile = await tx.professionalProfile.findUnique({
        where: { id: profile.id },
      });

      if (!freshProfile || freshProfile.availableBalance <= 0) {
        throw new Error("NO_BALANCE");
      }

      const currentAmount = freshProfile.availableBalance;
      let currentTransferAmount = currentAmount;
      let currentInstantFee = 0;

      if (payoutType === "INSTANT") {
        currentInstantFee = Math.round(currentAmount * INSTANT_PAYOUT_FEE_RATE);
        currentTransferAmount = currentAmount - currentInstantFee;
      }

      // Create Stripe Transfer to the connected account
      const transfer = await stripe.transfers.create({
        amount: currentTransferAmount,
        currency: "usd",
        destination: profile.stripeConnectAccountId!,
        metadata: {
          beautylink_profile_id: profile.id,
          payout_type: payoutType,
        },
      });

      // Create payout record
      const newPayout = await tx.payout.create({
        data: {
          professionalId: profile.id,
          amount: currentAmount,
          payoutType,
          instantFee: currentInstantFee > 0 ? currentInstantFee : null,
          stripeTransferId: transfer.id,
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });

      // Zero out available balance, move to pending while transfer settles
      await tx.professionalProfile.update({
        where: { id: profile.id },
        data: {
          availableBalance: 0,
          pendingBalance: { increment: currentTransferAmount },
        },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: user.id,
          type: "PAYOUT_SENT",
          title: "Payout Sent",
          body: `$${(currentTransferAmount / 100).toFixed(2)} has been sent to your bank account.`,
          link: "/pro/earnings",
        },
      });

      return newPayout;
    });

    return NextResponse.json({
      payout: {
        id: payout.id,
        amount: payout.amount,
        transferAmount: payout.amount - (payout.instantFee || 0),
        instantFee: payout.instantFee,
        status: payout.status,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "NO_BALANCE") {
      return NextResponse.json(
        { error: "No available balance to withdraw" },
        { status: 400 }
      );
    }

    console.error("Payout error:", error);
    return NextResponse.json(
      { error: "Failed to process payout" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payouts
 * Returns recent payouts for the logged-in professional.
 */
export async function GET() {
  try {
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

    const payouts = await db.payout.findMany({
      where: { professionalId: profile.id },
      orderBy: { requestedAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ payouts });
  } catch (error) {
    console.error("Payouts list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payouts" },
      { status: 500 }
    );
  }
}
