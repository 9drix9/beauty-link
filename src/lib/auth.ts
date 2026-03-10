import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function getCurrentUser() {
  try {
    const { userId } = await auth();

    if (!userId) return null;

    let user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      const clerkUser = await currentUser();
      if (!clerkUser) return null;

      const email =
        clerkUser.emailAddresses.find(
          (e) => e.id === clerkUser.primaryEmailAddressId
        )?.emailAddress ??
        clerkUser.emailAddresses[0]?.emailAddress ??
        "";

      if (!email) return null;

      // Try to find by email first (user may exist from a different auth provider)
      const existingByEmail = await db.user.findUnique({
        where: { email },
      });

      if (existingByEmail) {
        // Update existing user with new clerkId
        user = await db.user.update({
          where: { id: existingByEmail.id },
          data: {
            clerkId: userId,
            firstName: clerkUser.firstName ?? existingByEmail.firstName,
            lastName: clerkUser.lastName ?? existingByEmail.lastName,
            profilePhotoUrl: clerkUser.imageUrl ?? existingByEmail.profilePhotoUrl,
          },
        });
      } else {
        user = await db.user.create({
          data: {
            clerkId: userId,
            firstName: clerkUser.firstName ?? "",
            lastName: clerkUser.lastName ?? "",
            email,
            profilePhotoUrl: clerkUser.imageUrl,
            isEmailVerified:
              clerkUser.emailAddresses.find(
                (e) => e.id === clerkUser.primaryEmailAddressId
              )?.verification?.status === "verified",
          },
        });
      }
    }

    return user;
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requirePro() {
  const baseUser = await getCurrentUser();

  if (!baseUser) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: baseUser.id },
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

/**
 * For API routes: get or auto-create the DB user from Clerk auth.
 * Returns the user or null (caller should return 401).
 */
export async function getApiUser() {
  const { userId } = await auth();
  if (!userId) return null;

  let user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const email =
      clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress ??
      clerkUser.emailAddresses[0]?.emailAddress ??
      "";

    if (!email) return null;

    user = await db.user.upsert({
      where: { clerkId: userId },
      create: {
        clerkId: userId,
        firstName: clerkUser.firstName ?? "",
        lastName: clerkUser.lastName ?? "",
        email,
        profilePhotoUrl: clerkUser.imageUrl,
        isEmailVerified:
          clerkUser.emailAddresses.find(
            (e) => e.id === clerkUser.primaryEmailAddressId
          )?.verification?.status === "verified",
      },
      update: {},
    });
  }

  return user;
}
