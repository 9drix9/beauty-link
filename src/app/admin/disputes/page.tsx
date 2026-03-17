export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import DisputesContent from "./disputes-content";

export const metadata = { title: "Disputes" };

export default async function DisputesPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user || user.role !== "ADMIN") redirect("/");

  const disputes = await db.booking.findMany({
    where: {
      OR: [
        { status: "DISPUTED" },
        { disputeOpenedAt: { not: null } },
      ],
    },
    orderBy: { disputeOpenedAt: "desc" },
    include: {
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          profilePhotoUrl: true,
        },
      },
      professional: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              profilePhotoUrl: true,
            },
          },
        },
      },
      appointmentListing: true,
    },
  });

  return <DisputesContent disputes={JSON.parse(JSON.stringify(disputes))} />;
}
