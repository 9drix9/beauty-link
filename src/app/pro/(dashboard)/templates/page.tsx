export const dynamic = "force-dynamic";

import { requirePro } from "@/lib/auth";
import { db } from "@/lib/db";
import { TemplatesContent } from "./templates-content";

export const metadata = { title: "Service Templates | BeautyLink Pro" };

export default async function TemplatesPage() {
  const user = await requirePro();
  const profile = user.professionalProfile;

  const templates = await db.serviceTemplate.findMany({
    where: { professionalProfileId: profile.id },
    orderBy: { updatedAt: "desc" },
  });

  const serializedTemplates = templates.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    lastUsedAt: t.lastUsedAt?.toISOString() || null,
  }));

  return <TemplatesContent templates={serializedTemplates} />;
}
