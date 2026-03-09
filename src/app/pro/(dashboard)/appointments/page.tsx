import { requirePro } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProListingsContent } from "./pro-listings-content";

export const metadata = { title: "My Listings" };

export default async function AppointmentsPage() {
  const user = await requirePro();
  const profile = user.professionalProfile;

  const listings = await db.appointmentListing.findMany({
    where: { professionalId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  // Serialize dates for client component
  const serializedListings = listings.map((listing) => ({
    ...listing,
    appointmentDate: listing.appointmentDate.toISOString(),
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
  }));

  return <ProListingsContent listings={serializedListings} />;
}
