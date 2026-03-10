import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import UsersContent from "./users-content";

export const dynamic = "force-dynamic";

export const metadata = { title: "Users" };

export default async function UsersPage() {
  await requireAdmin();

  const [users, totalCount] = await Promise.all([
    db.user.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        profilePhotoUrl: true,
      },
    }),
    db.user.count(),
  ]);

  const serialized = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return <UsersContent users={serialized} totalCount={totalCount} />;
}
