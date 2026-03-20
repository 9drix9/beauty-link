import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/pro/dashboard",
          "/pro/appointments",
          "/pro/earnings",
          "/pro/settings",
          "/pro/messages",
          "/my-bookings",
          "/messages",
          "/profile",
          "/checkout/",
          "/review/",
          "/account",
          "/login",
          "/signup",
        ],
      },
    ],
    sitemap: "https://beautylinknetwork.com/sitemap.xml",
  };
}
