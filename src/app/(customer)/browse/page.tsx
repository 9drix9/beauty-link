import { Metadata } from "next";
import { DemoBrowse } from "./demo-browse";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse Appointments | BeautyLink",
  description:
    "Browse discounted beauty appointments from top professionals near you.",
};

// Show demo marketplace preview until real listings exist
// To switch to live mode, import BrowseContent and IS_LAUNCHED, then:
//   if (IS_LAUNCHED) return <BrowseContent searchParams={params} />;
export default async function BrowsePage() {
  return <DemoBrowse />;
}
