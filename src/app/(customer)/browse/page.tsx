import { Metadata } from "next";
import { BrowseContent } from "./browse-content";
import { DemoBrowse } from "./demo-browse";
import { IS_LAUNCHED } from "@/lib/launch";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse Appointments | BeautyLink",
  description:
    "Browse discounted beauty appointments from top professionals near you.",
};

interface BrowsePageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    date?: string;
    zone?: string;
  }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  if (IS_LAUNCHED) {
    const params = await searchParams;
    return <BrowseContent searchParams={params} />;
  }

  return <DemoBrowse />;
}
