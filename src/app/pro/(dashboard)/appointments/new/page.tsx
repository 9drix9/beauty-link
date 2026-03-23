export const dynamic = "force-dynamic";

import { requirePro } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateListingForm } from "./create-listing-form";
import { QuickPostModal } from "./quick-post-modal";
import { ListingModeSelector } from "./listing-mode-selector";

export const metadata = { title: "Create Listing | BeautyLink Pro" };

export default async function CreateListingPage({
  searchParams,
}: {
  searchParams: { mode?: string; templateId?: string; duplicateId?: string };
}) {
  const user = await requirePro();
  const profile = user.professionalProfile;

  // Fetch templates for this pro
  const templates = await db.serviceTemplate.findMany({
    where: { professionalProfileId: profile.id },
    orderBy: { lastUsedAt: "desc" },
  });

  // Fetch recent listings for "repeat last week" feature
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 14);

  const recentListings = await db.appointmentListing.findMany({
    where: {
      professionalId: profile.id,
      createdAt: { gte: oneWeekAgo },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // If duplicating, fetch source listing
  let sourceListing = null;
  if (searchParams.duplicateId) {
    sourceListing = await db.appointmentListing.findFirst({
      where: {
        id: searchParams.duplicateId,
        professionalId: profile.id,
      },
    });
  }

  // Profile defaults for auto-fill
  const profileDefaults = {
    addressLine1: profile.defaultAddressLine1 || "",
    city: profile.defaultCity || profile.city || "",
    state: profile.defaultState || profile.state || "",
    zipCode: profile.defaultZipCode || "",
    launchZone: profile.defaultLaunchZone || "",
    durationMinutes: profile.defaultDurationMinutes || null,
    portfolioPhotos: profile.portfolioPhotos || [],
  };

  const serializedTemplates = templates.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    lastUsedAt: t.lastUsedAt?.toISOString() || null,
  }));

  const serializedRecent = recentListings.map((l) => ({
    id: l.id,
    serviceName: l.serviceName,
    serviceCategory: l.serviceCategory,
    appointmentDate: l.appointmentDate.toISOString(),
    appointmentTime: l.appointmentTime,
    originalPrice: l.originalPrice,
    discountedPrice: l.discountedPrice,
    durationMinutes: l.durationMinutes,
    isModelCall: l.isModelCall,
  }));

  const serializedSource = sourceListing
    ? {
        ...sourceListing,
        appointmentDate: sourceListing.appointmentDate.toISOString(),
        createdAt: sourceListing.createdAt.toISOString(),
        updatedAt: sourceListing.updatedAt.toISOString(),
      }
    : null;

  const mode = searchParams.mode || (templates.length > 0 ? "choose" : "scratch");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">
          {searchParams.duplicateId
            ? "Duplicate Listing"
            : "Create New Listing"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {templates.length > 0
            ? "Use a template to post in seconds, or create from scratch."
            : "Set up a discounted appointment to attract new clients."}
        </p>
      </div>

      {/* Mode selector — only show if templates exist and not duplicating */}
      {!searchParams.duplicateId && templates.length > 0 && (
        <ListingModeSelector
          mode={mode}
          templateCount={templates.length}
        />
      )}

      {/* Quick Post Modal */}
      {mode === "quick" && templates.length > 0 && (
        <QuickPostModal
          templates={serializedTemplates}
        />
      )}

      {/* Full form (create from scratch or template) */}
      {(mode !== "quick" || templates.length === 0) && (
        <CreateListingForm
          templates={serializedTemplates}
          profileDefaults={profileDefaults}
          selectedTemplateId={searchParams.templateId}
          sourceListing={serializedSource}
          recentListings={serializedRecent}
          mode={mode}
        />
      )}
    </div>
  );
}
