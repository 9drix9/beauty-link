import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

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
    const { recipientId, body: messageBody, bookingId } = body;

    if (!recipientId || !messageBody?.trim()) {
      return NextResponse.json(
        { error: "recipientId and body are required" },
        { status: 400 }
      );
    }

    // Verify recipient exists
    const recipient = await db.user.findUnique({
      where: { id: recipientId },
      select: { id: true },
    });

    if (!recipient) {
      return NextResponse.json(
        { error: "Recipient not found" },
        { status: 404 }
      );
    }

    // Sort user IDs alphabetically: smaller = participant1, larger = participant2
    const [p1Id, p2Id] =
      user.id < recipientId
        ? [user.id, recipientId]
        : [recipientId, user.id];

    // Find or create thread
    let thread = await db.messageThread.findUnique({
      where: {
        participant1Id_participant2Id: {
          participant1Id: p1Id,
          participant2Id: p2Id,
        },
      },
    });

    if (!thread) {
      thread = await db.messageThread.create({
        data: {
          participant1Id: p1Id,
          participant2Id: p2Id,
          relatedBookingId: bookingId || null,
        },
      });
    }

    // Determine which participant is the recipient to increment their unread count
    const recipientIsP1 = thread.participant1Id === recipientId;

    // Create message and update thread in a transaction
    const [message] = await db.$transaction([
      db.message.create({
        data: {
          threadId: thread.id,
          senderId: user.id,
          recipientId,
          bookingId: bookingId || null,
          body: messageBody.trim(),
        },
      }),
      db.messageThread.update({
        where: { id: thread.id },
        data: {
          lastMessagePreview: messageBody.trim().substring(0, 100),
          lastMessageAt: new Date(),
          ...(recipientIsP1
            ? { unreadCountP1: { increment: 1 } }
            : { unreadCountP2: { increment: 1 } }),
        },
      }),
    ]);

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId: clerkId } = auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const threads = await db.messageThread.findMany({
      where: {
        OR: [
          { participant1Id: user.id },
          { participant2Id: user.id },
        ],
      },
      orderBy: { lastMessageAt: "desc" },
      include: {
        participant1: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePhotoUrl: true,
          },
        },
        participant2: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePhotoUrl: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    return NextResponse.json({ threads });
  } catch (error) {
    console.error("Error fetching threads:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
