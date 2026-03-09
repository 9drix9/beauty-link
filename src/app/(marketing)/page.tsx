import Link from "next/link";
import { Scissors, Paintbrush, Sparkles, Eye, Droplets, PenTool, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "@/components/shared/hero-search";

export const metadata = {
  title: "BeautyLink — Book Beauty & Wellness Near You",
};

const categories = [
  { label: "Hair", value: "hair", icon: Scissors, bg: "bg-purple-light" },
  { label: "Nails", value: "nails", icon: Paintbrush, bg: "bg-orange-light" },
  { label: "Makeup", value: "makeup", icon: Sparkles, bg: "bg-pink-50" },
  { label: "Lashes", value: "lashes", icon: Eye, bg: "bg-blue-50" },
  { label: "Brows", value: "brows", icon: PenTool, bg: "bg-amber-50" },
  { label: "Skincare", value: "skincare", icon: Droplets, bg: "bg-green-50" },
];

const stats = [
  { value: "15–50%", label: "Average Savings" },
  { value: "100%", label: "Verified Professionals" },
  { value: "5%", label: "Flat Service Fee" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero — Search First */}
      <section className="bg-white pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark tracking-tight leading-[1.1]">
            Book beauty & wellness
            <br className="hidden sm:block" />
            near you
          </h1>
          <p className="mt-4 text-lg text-muted max-w-lg mx-auto">
            Discounted last-minute appointments from licensed professionals in Greater Los Angeles.
          </p>
          <div className="mt-8">
            <HeroSearch />
          </div>
          <p className="mt-4 text-sm text-muted">
            <Link href="/browse" className="text-purple-primary hover:underline font-medium">
              Browse all appointments
            </Link>
            {" · "}
            <Link href="/pro/join" className="hover:underline">
              For professionals
            </Link>
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-dark">
              Explore by category
            </h2>
            <Link
              href="/browse"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-purple-primary hover:underline"
            >
              View all
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={`/category/${cat.value}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-6 text-center transition-all hover:shadow-card hover:-translate-y-0.5"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${cat.bg}`}>
                  <cat.icon className="h-5 w-5 text-dark" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium text-dark">{cat.label}</span>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/browse"
              className="text-sm font-medium text-purple-primary hover:underline"
            >
              View all categories →
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-14 bg-white border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-dark">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-dark text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Search",
                description: "Find discounted appointments from verified beauty professionals near you.",
              },
              {
                step: "2",
                title: "Book instantly",
                description: "Choose your time, pay securely online. No back-and-forth needed.",
              },
              {
                step: "3",
                title: "Save 15–50%",
                description: "Enjoy premium beauty services at a fraction of the regular price.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-purple-primary text-white text-sm font-bold">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-dark">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional CTA */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-dark">
              Partner with BeautyLink
            </h2>
            <p className="mt-3 text-muted text-lg">
              List your open slots, reach new clients, and keep 100% of your earnings. We only charge customers a small 5% service fee.
            </p>
            <div className="mt-6">
              <Button asChild variant="primary" size="lg">
                <Link href="/pro/join">Learn more</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
