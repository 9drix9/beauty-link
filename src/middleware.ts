import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  // Marketing pages
  "/",
  "/browse",
  "/category/(.*)",
  "/appointment/(.*)",
  "/pro/(.*)",
  "/how-it-works",
  "/model-calls",
  "/faq",
  "/contact",
  "/terms",
  "/privacy",
  "/cookies",
  "/help",

  // Auth pages (catch-all for Clerk multi-step flows)
  "/login(.*)",
  "/signup(.*)",
  "/get-started",
  "/auth-redirect",
  "/forgot-password",
  "/reset-password",

  // Generated assets (icons, manifest)
  "/icon",
  "/apple-icon",
  "/manifest.webmanifest",

  // Public API endpoints
  "/api/appointments(.*)",
  "/api/reviews",
  "/api/webhooks/(.*)",
  "/api/cron/(.*)",
  "/api/seed",
  "/api/analytics",
  "/api/waitlist",
  "/api/contact",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
