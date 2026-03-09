import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/browse",
    "/category/(.*)",
    "/appointment/(.*)",
    "/pro/(.*)", // pro/join and pro/apply are public; pro/(dashboard) protected via layout
    "/how-it-works",
    "/faq",
    "/contact",
    "/terms",
    "/privacy",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/api/webhooks/(.*)",
    "/api/appointments",
    "/api/appointments/(.*)",
    "/api/providers/(.*)",
  ],
  
  // Routes that can be accessed by both logged in and logged out users
  ignoredRoutes: [
    "/api/webhooks/stripe",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
