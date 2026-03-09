import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { CategoryContent } from "./category-content";

// Map slug to enum value: "hair-removal" -> "HAIR_REMOVAL", "hair" -> "HAIR"
function slugToCategory(slug: string): string {
  return slug.toUpperCase().replace(/-/g, "_");
}

function getCategoryLabel(categoryValue: string): string | null {
  const found = SERVICE_CATEGORIES.find((c) => c.value === categoryValue);
  return found ? found.label : null;
}

interface CategoryPageProps {
  params: Promise<{ service: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { service } = await params;
  const categoryValue = slugToCategory(service);
  const label = getCategoryLabel(categoryValue);

  if (!label) {
    return { title: "Category Not Found | BeautyLink" };
  }

  return {
    title: `${label} Appointments | BeautyLink`,
    description: `Browse discounted ${label.toLowerCase()} appointments from top beauty professionals near you.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { service } = await params;
  const categoryValue = slugToCategory(service);
  const label = getCategoryLabel(categoryValue);

  if (!label) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Category Header */}
        <div>
          <h1 className="text-h2 text-dark">{label}</h1>
          <p className="text-muted mt-1">
            Browse discounted {label.toLowerCase()} appointments from top
            professionals
          </p>
        </div>

        <CategoryContent category={categoryValue} categoryLabel={label} />
      </div>
    </div>
  );
}
