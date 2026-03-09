import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  MapPin,
  Star,
  Shield,
  ArrowLeft,
  Calendar,
  User,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

export default function AppointmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Demo data - will be replaced with DB fetch
  const appointment = {
    id: params.id,
    serviceName: "Balayage Highlights",
    description:
      "Full balayage highlight service including toner and blowout. Perfect for achieving a natural, sun-kissed look with seamless color transitions. Includes consultation, color application, processing, toner, and a polished blowout finish.",
    providerName: "Sarah Mitchell",
    providerBio:
      "Licensed cosmetologist with 8 years of experience specializing in color, balayage, and precision cuts. Trained at Vidal Sassoon Academy.",
    rating: 4.8,
    ratingCount: 24,
    verified: true,
    businessType: "Salon",
    category: "HAIR",
    originalPrice: 18000,
    discountedPrice: 12600,
    startAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    endAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    durationMinutes: 120,
    launchZone: "UCLA / Westwood",
    cancellationPolicy:
      "Free cancellation up to 24 hours before the appointment. Under 24 hours is non-refundable.",
  };

  const discount = Math.round(
    ((appointment.originalPrice - appointment.discountedPrice) /
      appointment.originalPrice) *
      100
  );

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/appointments"
        className="inline-flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-900 transition-colors mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to browse
      </Link>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Main content - 3 cols */}
        <div className="lg:col-span-3 space-y-8 animate-fade-in-up">
          {/* Image */}
          <div className="aspect-[16/10] rounded-2xl bg-gradient-to-br from-rose-100 via-pink-50 to-fuchsia-100 flex items-center justify-center overflow-hidden">
            <span className="text-7xl opacity-30">✂️</span>
          </div>

          {/* Title */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="premium">{discount}% off</Badge>
              <Badge>Hair</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {appointment.serviceName}
            </h1>
            <p className="mt-3 text-[15px] text-gray-500 leading-relaxed">
              {appointment.description}
            </p>
          </div>

          {/* Provider */}
          <Card className="hover:shadow-premium-lg transition-shadow duration-300">
            <CardContent className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-500 flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-900">
                    {appointment.providerName}
                  </h3>
                  {appointment.verified && (
                    <Badge variant="success">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[13px] text-gray-400 mt-1.5">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-gray-900">
                      {appointment.rating}
                    </span>
                    <span>({appointment.ratingCount} reviews)</span>
                  </div>
                  <span className="text-gray-200">|</span>
                  <span>{appointment.businessType}</span>
                </div>
                <p className="text-[14px] text-gray-500 mt-3 leading-relaxed">
                  {appointment.providerBio}
                </p>
                <div className="mt-4 flex gap-2">
                  <Link href={`/providers/${appointment.id}`}>
                    <Button variant="outline" size="sm">
                      View profile
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                    Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardContent>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                  Cancellation Policy
                </h3>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  {appointment.cancellationPolicy}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
                  What&apos;s Included
                </h3>
                <ul className="space-y-2">
                  {[
                    "Color consultation",
                    "Balayage application & processing",
                    "Toner & gloss",
                    "Blowout finish",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-[14px] text-gray-600"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking sidebar - 2 cols */}
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <Card className="shadow-premium-lg animate-fade-in">
              <CardContent className="space-y-6">
                {/* Price */}
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                      ${(appointment.discountedPrice / 100).toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-300 line-through">
                      ${(appointment.originalPrice / 100).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[13px] text-brand-600 font-semibold mt-1">
                    You save ${((appointment.originalPrice - appointment.discountedPrice) / 100).toFixed(2)}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100" />

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-gray-900">
                        {appointment.startAt.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-[13px] text-gray-400 mt-0.5">
                        {appointment.startAt.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {appointment.endAt.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-gray-900">
                        {appointment.durationMinutes} minutes
                      </p>
                      <p className="text-[13px] text-gray-400 mt-0.5">
                        Service duration
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-gray-900">
                        {appointment.launchZone}
                      </p>
                      <p className="text-[13px] text-gray-400 mt-0.5">
                        Exact address shared after booking
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100" />

                {/* CTA */}
                <Button className="w-full" size="lg">
                  Book now
                </Button>

                <div className="flex items-center justify-center gap-2 text-[12px] text-gray-400">
                  <Shield className="h-3 w-3" />
                  <span>Secure payment via Stripe</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
