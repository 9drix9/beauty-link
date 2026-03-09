import { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { MessagesContent } from "./messages-content";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function MessagesPage() {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  if (!user) {
    redirect("/login");
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
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-dark">Messages</h1>
      <MessagesContent threads={serializedThreads} currentUserId={user.id} />
    </div>
  );
}
