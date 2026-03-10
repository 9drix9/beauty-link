import { ShieldCheck, BadgeCheck, Award, Zap } from "lucide-react";

interface VerificationBadgesProps {
  isVerified: boolean;
  isTopRated?: boolean;
  responseTime?: string;
  licenseVerified?: boolean;
}

export function VerificationBadges({
  isVerified,
  isTopRated,
  responseTime,
  licenseVerified,
}: VerificationBadgesProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {isVerified && (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
          <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Verified
        </span>
      )}
      {licenseVerified && (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Licensed
        </span>
      )}
      {isTopRated && (
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">
          <Award className="h-3.5 w-3.5" aria-hidden="true" />
          Top Rated
        </span>
      )}
      {responseTime && (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
          <Zap className="h-3.5 w-3.5" aria-hidden="true" />
          {responseTime}
        </span>
      )}
    </div>
  );
}
