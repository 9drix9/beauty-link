import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    // Marketing pages
    "/",
    "/browse",
    "/category/(.*)",
    "/appointment/(.*)",
    "/how-it-works",
    "/faq",
    "/contact",
    "/terms",
    "/privacy",
    "/cookies",
    "/help",

    // Pro public pages (join + apply only)
    "/pro/join",
    "/pro/apply",

    // Auth pages
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",

    // Public API endpoints (read-only)
    "/api/appointments",
    "/api/appointments/(.*)",
    "/api/reviews",

    // Webhooks (verified by their own signature checks)
    "/api/webhooks/(.*)",
  ],

  // Routes completely ignored by Clerk (no auth context injected)
  ignoredRoutes: [
    "/api/webhooks/stripe",
    "/api/webhooks/clerk",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
