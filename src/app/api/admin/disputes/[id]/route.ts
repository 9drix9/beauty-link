import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { clerkId } });
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { outcome, refundAmount, reason } = body as {
      outcome: "FULL_REFUND" | "PARTIAL_REFUND" | "NO_ACTION";
      refundAmount?: number;
      reason?: string;
    };

    if (!["FULL_REFUND", "PARTIAL_REFUND", "NO_ACTION"].includes(outcome)) {
      return NextResponse.json(
        { error: "Invalid outcome. Must be FULL_REFUND, PARTIAL_REFUND, or NO_ACTION." },
        { status: 400 }
      );
    }

    const booking = await db.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.disputeOutcome) {
      return NextResponse.json(
        { error: "Dispute has already been resolved" },
        { status: 400 }
      );
    }

    let finalRefundAmount: number | null = null;
    if (outcome === "FULL_REFUND") {
      finalRefundAmount = booking.totalCharged;
    } else if (outcome === "PARTIAL_REFUND") {
      if (refundAmount === undefined || refundAmount <= 0) {
        return NextResponse.json(
          { error: "Partial refund requires a valid refundAmount" },
          { status: 400 }
        );
      }
      if (refundAmount > booking.totalCharged) {
        return NextResponse.json(
          { error: "Refund amount cannot exceed total charged" },
          { status: 400 }
        );
      }
      finalRefundAmount = refundAmount;
    }

    const updatedBooking = await db.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id: params.id },
        data: {
          disputeOutcome: outcome,
          disputeResolvedAt: new Date(),
          status: outcome === "NO_ACTION" ? "COMPLETED" : "DISPUTED",
          ...(finalRefundAmount !== null && {
            refundAmount: finalRefundAmount,
          }),
        },
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          professional: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      await tx.adminAction.create({
        data: {
          adminUserId: user.id,
          actionType: "RESOLVE_DISPUTE",
          targetType: "BOOKING",
          targetId: params.id,
          reason: reason || null,
          metadataJson: JSON.stringify({
            outcome,
            refundAmount: finalRefundAmount,
            bookingReference: booking.bookingReference,
          }),
        },
      });

      return updated;
    });

    return NextResponse.json({ booking: updatedBooking });
  } catch (error) {
    console.error("Error resolving dispute:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
