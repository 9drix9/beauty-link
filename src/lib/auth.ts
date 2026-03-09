import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function getCurrentUser() {
  const { userId } = auth();

  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requirePro() {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { professionalProfile: true },
  });

  if (!user) {
    redirect("/login");
  }

  if (!user.professionalProfile || user.professionalProfile.applicationStatus !== "APPROVED") {
    redirect("/pro/join");
  }

  return user as typeof user & {
    professionalProfile: NonNullable<typeof user.professionalProfile>;
  };
}

export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return user;
}
