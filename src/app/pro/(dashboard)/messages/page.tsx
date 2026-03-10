import { Metadata } from "next";

import { requirePro } from "@/lib/auth";
import { db } from "@/lib/db";
import { MessagesContent } from "@/app/(customer)/messages/messages-content";

export const metadata: Metadata = {
  title: "Messages | BeautyLink Pro",
};

export default async function ProMessagesPage() {
  const user = await requirePro();

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
    },
  });

  const serializedThreads = threads.map((thread) => ({
    id: thread.id,
    participant1: thread.participant1,
    participant2: thread.participant2,
    participant1Id: thread.participant1Id,
    participant2Id: thread.participant2Id,
    lastMessagePreview: thread.lastMessagePreview,
    lastMessageAt: thread.lastMessageAt?.toISOString() ?? null,
    unreadCountP1: thread.unreadCountP1,
    unreadCountP2: thread.unreadCountP2,
  }));

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-dark">Messages</h1>
      <MessagesContent threads={serializedThreads} currentUserId={user.id} />
    </div>
  );
}
