export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { WaitlistContent } from "./waitlist-content";

export const metadata = { title: "Mailing List | Admin" };

export default async function AdminWaitlistPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/login");

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user || user.role !== "ADMIN") redirect("/");

  const entries = await db.launchWaitlist.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <WaitlistContent entries={entries} />;
}
