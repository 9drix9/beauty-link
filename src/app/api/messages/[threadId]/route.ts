import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getApiUser } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const user = await getApiUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threadId } = params;

    // Verify user is a participant
    const thread = await db.messageThread.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    if (thread.participant1Id !== user.id && thread.participant2Id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all messages in the thread
    const messages = await db.message.findMany({
      where: { threadId },
      orderBy: { createdAt: "asc" },
    });

    // Mark unread messages sent to this user as read
    const now = new Date();
    await db.message.updateMany({
      where: {
        threadId,
        recipientId: user.id,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: now,
      },
    });

    // Reset unread count for this user on the thread
    const isP1 = thread.participant1Id === user.id;
    await db.messageThread.update({
      where: { id: threadId },
      data: isP1 ? { unreadCountP1: 0 } : { unreadCountP2: 0 },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching thread messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
