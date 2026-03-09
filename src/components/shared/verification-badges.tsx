
interface VerificationBadgesProps {
  isVerified: boolean;
  isTopRated?: boolean;
  responseTime?: string;
}

export function VerificationBadges({
  isVerified,
  isTopRated,
  responseTime,
}: VerificationBadgesProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {isVerified && (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          ✓ Verified
        </span>
      )}
      {isTopRated && (
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
          ★ Top Rated
        </span>
      )}
      {responseTime && (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
          ⚡ {responseTime}
        </span>
      )}
    </div>
  );
}
