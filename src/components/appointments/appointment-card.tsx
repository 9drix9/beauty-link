import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDiscount, getTimeUntil } from "@/lib/utils";
import { Clock, MapPin, Star } from "lucide-react";

interface AppointmentCardProps {
  id: string;
  serviceName: string;
  providerName: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
  startAt: Date;
  launchZone?: string | null;
  rating: number;
  ratingCount: number;
  businessType?: string | null;
  thumbnailUrl?: string | null;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  HAIR: "from-rose-100 via-pink-50 to-fuchsia-100",
  NAILS: "from-violet-100 via-purple-50 to-pink-100",
  LASHES: "from-sky-100 via-indigo-50 to-violet-100",
  MAKEUP: "from-amber-100 via-orange-50 to-rose-100",
  SKINCARE_FACIALS: "from-emerald-100 via-teal-50 to-cyan-100",
};

const CATEGORY_ICONS: Record<string, string> = {
  HAIR: "✂️",
  NAILS: "💅",
  LASHES: "👁️",
  MAKEUP: "💄",
  SKINCARE_FACIALS: "✨",
};

export function AppointmentCard({
  id,
  serviceName,
  providerName,
  category,
  originalPrice,
  discountedPrice,
  startAt,
  launchZone,
  rating,
  ratingCount,
  businessType,
  thumbnailUrl,
}: AppointmentCardProps) {
  const startDate = new Date(startAt);
  const timeUntil = getTimeUntil(startDate);
  const isUrgent = startDate.getTime() - Date.now() < 3 * 60 * 60 * 1000;

  return (
    <Link href={`/appointments/${id}`} className="group">
      <Card className="overflow-hidden hover:shadow-premium-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
        <div
          className={`aspect-[4/3] bg-gradient-to-br ${
            CATEGORY_GRADIENTS[category] || "from-gray-100 to-gray-50"
          } relative overflow-hidden`}
        >
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailUrl}
              alt={serviceName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl opacity-40 group-hover:scale-110 transition-transform duration-500">
                {CATEGORY_ICONS[category] || "✨"}
              </span>
            </div>
          )}

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            {isUrgent ? (
              <Badge variant="danger">Starts {timeUntil}</Badge>
            ) : (
              <div />
            )}
            <Badge variant="premium">
              {formatDiscount(originalPrice, discountedPrice)}
            </Badge>
          </div>
        </div>

        <div className="p-4 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-[15px] text-gray-900 truncate group-hover:text-brand-600 transition-colors">
                {serviceName}
              </h3>
              <p className="text-[13px] text-gray-400 mt-0.5">{providerName}</p>
            </div>
            {ratingCount > 0 && (
              <div className="flex items-center gap-1 text-[13px] flex-shrink-0">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-gray-900">
                  {rating.toFixed(1)}
                </span>
                <span className="text-gray-300">({ratingCount})</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
            <Clock className="h-3 w-3" />
            <span>
              {startDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}{" "}
              at{" "}
              {startDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>

          {(launchZone || businessType) && (
            <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
              <MapPin className="h-3 w-3" />
              <span>
                {launchZone}
                {businessType && launchZone && " · "}
                {businessType && (
                  <span className="capitalize">
                    {businessType.toLowerCase()}
                  </span>
                )}
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(discountedPrice)}
            </span>
            <span className="text-[13px] text-gray-300 line-through">
              {formatPrice(originalPrice)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
