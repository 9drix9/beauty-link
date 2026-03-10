import Link from "next/link";
import {
  Search,
  CalendarCheck,
  Sparkles,
  Plus,
  BarChart3,
  Clock,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "How It Works | BeautyLink",
  description:
    "The easiest way to book discounted beauty appointments with verified professionals in Los Angeles.",
};

const customerSteps = [
  {
    number: 1,
    icon: Search,
    title: "Browse",
    description:
      "Search for discounted beauty appointments by service, location, and date.",
  },
  {
    number: 2,
    icon: CalendarCheck,
    title: "Book",
    description:
      "Choose your appointment and pay securely online. Get instant confirmation.",
  },
  {
    number: 3,
    icon: Sparkles,
    title: "Experience",
    description:
      "Show up, enjoy your service, and leave feeling amazing — all at a great price.",
  },
];

const proSteps = [
  {
    number: 1,
    icon: Plus,
    title: "List",
    description:
      "Post your open time slots at a discounted price. Takes about 60 seconds.",
  },
  {
    number: 2,
    icon: BarChart3,
    title: "Get Booked",
    description:
      "Clients in your area discover your deal and book instantly with secure payment.",
  },
  {
    number: 3,
    icon: Clock,
    title: "Get Paid",
    description:
      "Keep 100% of your listed price. Payouts are sent 24 hours after the appointment.",
  },
];

function StepCard({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: number;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-light">
          <Icon className="h-7 w-7 text-accent" aria-hidden="true" />
        </div>
        <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
          {number}
        </span>
      </div>
      <h3 className="text-lg font-bold text-dark">{title}</h3>
      <p className="mt-2 text-sm text-muted leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero header with gradient */}
      <section
        className="py-16 md:py-24 text-center gradient-hero-soft"
      >
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold text-dark">
            How BeautyLink Works
          </h1>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            The easiest way to book discounted beauty appointments with verified
            professionals in Los Angeles.
          </p>
        </div>
      </section>

      {/* For Customers */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-dark">
              For Customers
            </h2>
            <p className="mt-3 text-muted max-w-lg mx-auto">
              Discover available appointments, book instantly, and enjoy premium
              beauty for less.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {customerSteps.map((step) => (
              <StepCard key={step.title} {...step} />
            ))}
          </div>
        </div>
      </section>

      {/* For Professionals */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-dark">
              For Professionals
            </h2>
            <p className="mt-3 text-muted max-w-lg mx-auto">
              Turn empty slots into income. List a deal, get booked, and keep
              every dollar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {proSteps.map((step) => (
              <StepCard key={step.title} {...step} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Browse deals from beauty professionals in your area, or apply to
            list your own.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 rounded-full bg-dark px-8 py-3.5 text-sm font-semibold text-white shadow-elevated transition-all hover:bg-dark/90 hover:-translate-y-0.5"
            >
              Browse Appointments
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/pro/join"
              className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
            >
              Are you a beauty pro? Join free &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
