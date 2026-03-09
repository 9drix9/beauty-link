import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import FeaturedContent from "./featured-content";

export const metadata = { title: "Featured Professionals" };

export default async function FeaturedPage() {
  const { userId: clerkId } = auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user || user.role !== "ADMIN") redirect("/");

  const professionals = await db.professionalProfile.findMany({
    where: { applicationStatus: "APPROVED" },
    orderBy: [{ isFeatured: "desc" }, { avgRating: "desc" }],
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          profilePhotoUrl: true,
        },
      },
    },
  });

  return (
    <FeaturedContent
      professionals={JSON.parse(JSON.stringify(professionals))}
    />
  );
}
