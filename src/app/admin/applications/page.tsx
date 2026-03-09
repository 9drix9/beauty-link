import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import ApplicationsContent from "./applications-content";

export const metadata = { title: "Applications" };

export default async function ApplicationsPage() {
  await requireAdmin();

  const applications = await db.professionalProfile.findMany({
    orderBy: { applicationSubmittedAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  // Serialize dates for client component
  const serialized = applications.map((app) => ({
    ...app,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
    applicationSubmittedAt: app.applicationSubmittedAt?.toISOString() ?? null,
    approvedAt: app.approvedAt?.toISOString() ?? null,
    rejectedAt: app.rejectedAt?.toISOString() ?? null,
    licenseExpiry: app.licenseExpiry?.toISOString() ?? null,
  }));

  return <ApplicationsContent applications={serialized} />;
}
