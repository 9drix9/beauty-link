export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import BannersContent from "./banners-content";

export const metadata = { title: "Banners" };

export default async function BannersPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user || user.role !== "ADMIN") redirect("/");

  const banners = await db.sitewideBanner.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <BannersContent banners={JSON.parse(JSON.stringify(banners))} />;
}
