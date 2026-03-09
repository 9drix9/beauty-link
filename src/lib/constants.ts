// ============================================================
// BeautyLink — Application Constants
// ============================================================

export const PLATFORM_NAME = "BeautyLink";
export const PLATFORM_TAGLINE = "Great Beauty. Better Prices.";
export const PLATFORM_DESCRIPTION =
  "Book exclusive discounted appointments with beauty professionals near you.";

// Business Logic
export const PLATFORM_FEE_RATE = 0.05; // 5% added on top, paid by customer
export const CANCELLATION_WINDOW_HOURS = 24;
export const PAYOUT_HOLD_HOURS = 24;
export const AUTO_COMPLETE_HOURS = 48; // Auto-complete after appointment end
export const NO_SHOW_WINDOW_HOURS = 48;
export const SLOT_HOLD_MINUTES = 10;
export const SESSION_EXPIRY_DAYS = 30;
export const MIN_DISCOUNT_PERCENT = 15; // Discounted must be >= 15% below original
export const MIN_LISTING_PRICE_CENTS = 1000; // $10.00 minimum
export const MAX_LISTING_PRICE_CENTS = 999900; // $9,999.00 maximum
export const MAX_CLIENTS_PER_LISTING = 3;
export const MIN_PORTFOLIO_PHOTOS = 3;
export const MAX_PORTFOLIO_PHOTOS = 10;
export const MAX_SPECIALTIES = 15;
export const MAX_WHATS_INCLUDED = 5;
export const INSTANT_PAYOUT_FEE_RATE = 0.015; // 1.5%
export const TAX_1099_THRESHOLD_CENTS = 60000; // $600.00

// Service Categories (ordered for display)
export const SERVICE_CATEGORIES = [
  { value: "HAIR", label: "Hair", icon: "Scissors" },
  { value: "NAILS", label: "Nails", icon: "Paintbrush" },
  { value: "MAKEUP", label: "Makeup", icon: "Sparkles" },
  { value: "LASHES", label: "Lashes", icon: "Eye" },
  { value: "BROWS", label: "Brows", icon: "PenTool" },
  { value: "SKINCARE", label: "Skincare", icon: "Leaf" },
  { value: "HAIR_REMOVAL", label: "Hair Removal", icon: "Zap" },
  { value: "MASSAGE", label: "Massage", icon: "Hand" },
  { value: "SPRAY_TAN", label: "Spray Tan", icon: "Sun" },
  { value: "OTHER", label: "Other", icon: "Grid" },
] as const;

// Sub-categories per service
export const SUB_CATEGORIES: Record<string, string[]> = {
  HAIR: ["Cut & Style", "Color", "Blowout", "Balayage", "Braids & Locs", "Natural Hair", "Extensions", "Keratin"],
  NAILS: ["Manicure", "Pedicure", "Gel", "Acrylic", "Dip Powder", "Press-On", "Nail Art"],
  LASHES: ["Classic", "Hybrid", "Volume", "Mega Volume", "Lash Lift & Tint"],
  MAKEUP: ["Full Glam", "Natural", "Bridal", "Airbrush", "Makeup Lesson"],
  BROWS: ["Microblading", "Lamination", "Tinting", "Threading", "Waxing", "Ombre Powder"],
  SKINCARE: ["Facial", "Chemical Peel", "Microdermabrasion", "Hydrafacial", "LED Therapy"],
  HAIR_REMOVAL: ["Waxing", "Sugaring", "Threading", "Laser"],
  MASSAGE: ["Swedish", "Deep Tissue", "Sports", "Hot Stone", "Prenatal"],
  SPRAY_TAN: ["Custom Airbrush", "Express", "Competition"],
};

// Launch Zones (Phase 1 — West Los Angeles)
export const LAUNCH_ZONES = [
  "UCLA / Westwood",
  "LMU / Westchester",
  "West Los Angeles",
  "Santa Monica",
  "Beverly Hills",
  "Hollywood",
] as const;

// Work Settings
export const WORK_SETTINGS = [
  { value: "SALON_SUITE", label: "Salon Suite" },
  { value: "CHAIR_RENTAL", label: "Chair Rental" },
  { value: "HOME_STUDIO", label: "Home Studio" },
  { value: "MOBILE", label: "Mobile" },
  { value: "SALON_EMPLOYEE", label: "Salon Employee" },
] as const;

// Years of Experience Options
export const YEARS_EXPERIENCE_OPTIONS = [
  { value: "UNDER_1", label: "Less than 1 year" },
  { value: "ONE_TO_THREE", label: "1–3 years" },
  { value: "THREE_TO_FIVE", label: "3–5 years" },
  { value: "FIVE_TO_TEN", label: "5–10 years" },
  { value: "TEN_PLUS", label: "10+ years" },
] as const;

// License Types
export const LICENSE_TYPES = [
  { value: "COSMETOLOGY", label: "Cosmetology" },
  { value: "ESTHETICS", label: "Esthetics" },
  { value: "NAIL_TECH", label: "Nail Technology" },
  { value: "MASSAGE_THERAPY", label: "Massage Therapy" },
  { value: "BARBERING", label: "Barbering" },
  { value: "OTHER", label: "Other" },
] as const;

// Duration options (for listing creation)
export const DURATION_OPTIONS = [
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 75, label: "1 hour 15 min" },
  { value: 90, label: "1 hour 30 min" },
  { value: 120, label: "2 hours" },
  { value: 150, label: "2 hours 30 min" },
  { value: 180, label: "3 hours" },
  { value: 210, label: "3 hours 30 min" },
  { value: 240, label: "4 hours" },
] as const;

// Notification Types (for filtering/routing)
export const NOTIFICATION_TYPES = {
  BOOKING_CONFIRMED: { icon: "CheckCircle", color: "success" },
  BOOKING_REMINDER_CUSTOMER: { icon: "Clock", color: "info" },
  BOOKING_CANCELLED_BY_PRO: { icon: "XCircle", color: "error" },
  BOOKING_CANCELLED_BY_CUSTOMER: { icon: "XCircle", color: "warning" },
  NEW_MESSAGE: { icon: "MessageCircle", color: "purple" },
  REVIEW_REMINDER: { icon: "Star", color: "orange" },
  NEW_REVIEW: { icon: "Star", color: "success" },
  PAYOUT_SENT: { icon: "DollarSign", color: "success" },
  PAYOUT_FAILED: { icon: "AlertTriangle", color: "error" },
  APPLICATION_APPROVED: { icon: "CheckCircle", color: "success" },
  APPLICATION_REJECTED: { icon: "XCircle", color: "error" },
  WAITLIST_SLOT_OPENED: { icon: "Bell", color: "orange" },
} as const;

// Sort Options for Browse
export const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "soonest", label: "Soonest Available" },
  { value: "rating", label: "Highest Rated" },
  { value: "nearest", label: "Nearest First" },
] as const;

// Date filter quick picks
export const DATE_FILTERS = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "weekend", label: "This Weekend" },
  { value: "any", label: "Any Date" },
] as const;

// Distance filter options
export const DISTANCE_OPTIONS = [
  { value: 5, label: "5 mi" },
  { value: 10, label: "10 mi" },
  { value: 25, label: "25 mi" },
  { value: 50, label: "50 mi" },
  { value: -1, label: "Any Distance" },
] as const;
