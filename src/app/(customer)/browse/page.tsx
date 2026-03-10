import { Metadata } from "next";
import { BrowseContent } from "./browse-content";

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
  const params = await searchParams;
  return <BrowseContent searchParams={params} />;
}
