export const PLATFORM_NAME = "BeautyLink";

export const SERVICE_CATEGORIES = [
  { value: "HAIR", label: "Hair" },
  { value: "NAILS", label: "Nails" },
  { value: "LASHES", label: "Lashes" },
  { value: "MAKEUP", label: "Makeup" },
  { value: "SKINCARE_FACIALS", label: "Skincare / Facials" },
] as const;

export const BUSINESS_TYPES = [
  { value: "SALON", label: "Salon" },
  { value: "SUITE", label: "Suite" },
  { value: "MOBILE", label: "Mobile" },
  { value: "HOME", label: "Home" },
] as const;

export const LAUNCH_ZONES = [
  "UCLA / Westwood",
  "LMU / Westchester",
  "West Los Angeles",
  "Santa Monica",
  "Beverly Hills",
  "Hollywood",
] as const;

export const DEFAULT_TAKE_RATE = 0.15; // 15%

export const CANCELLATION_WINDOW_HOURS = 24;

export const PAYOUT_HOLD_HOURS = 24;
