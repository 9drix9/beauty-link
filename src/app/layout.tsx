import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppClerkProvider } from "@/components/providers/clerk-provider";
import {
  OrganizationSchema,
  LocalBusinessSchema,
  WebsiteSchema,
} from "@/components/shared/structured-data";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#3d1a0f",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://beautylinknetwork.com"),
  title: {
    default: "BeautyLink | Great Beauty. Better Prices.",
    template: "%s | BeautyLink",
  },
  description:
    "Book exclusive discounted beauty appointments with verified professionals in Los Angeles. Hair, nails, lashes, makeup, brows, skincare, and more at 10 to 50% off. Free model calls available for beauty students.",
  keywords: [
    "beauty appointments",
    "discounted beauty",
    "last minute beauty",
    "hair salon deals",
    "nail salon deals",
    "lash extensions deals",
    "Los Angeles beauty",
    "beauty marketplace",
    "cheap beauty services",
    "beauty deals near me",
    "makeup artist deals",
    "skincare deals LA",
    "beauty school models",
    "free beauty services",
    "model calls beauty",
    "beauty professionals LA",
    "BeautyLink",
  ],
  authors: [{ name: "BeautyLink, Inc." }],
  creator: "BeautyLink",
  publisher: "BeautyLink",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://beautylinknetwork.com",
    siteName: "BeautyLink",
    title: "BeautyLink | Great Beauty. Better Prices.",
    description:
      "Discover discounted beauty appointments from verified professionals in Los Angeles. 10 to 50% off hair, nails, lashes, makeup, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeautyLink | Great Beauty. Better Prices.",
    description:
      "Discover discounted beauty appointments from verified professionals in Los Angeles.",
    creator: "@beautylinkla",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BeautyLink",
  },
  formatDetection: {
    telephone: false,
  },
  category: "beauty",
  other: {
    "google-site-verification": "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-background text-body overscroll-none">
        <OrganizationSchema />
        <LocalBusinessSchema />
        <WebsiteSchema />
        <AppClerkProvider>
          {children}
        </AppClerkProvider>
      </body>
    </html>
  );
}
