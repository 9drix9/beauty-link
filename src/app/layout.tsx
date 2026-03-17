import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppClerkProvider } from "@/components/providers/clerk-provider";

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
  title: {
    default: "BeautyLink | Great Beauty. Better Prices.",
    template: "%s | BeautyLink",
  },
  description:
    "Book exclusive discounted appointments with beauty professionals near you, from lash techs and nail artists to stylists and skincare pros.",
  keywords: [
    "beauty appointments",
    "discounted beauty",
    "last minute beauty",
    "hair salon deals",
    "nail salon deals",
    "lash extensions",
    "Los Angeles beauty",
    "beauty marketplace",
  ],
  authors: [{ name: "BeautyLink, Inc." }],
  creator: "BeautyLink",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "BeautyLink",
    title: "BeautyLink | Great Beauty. Better Prices.",
    description:
      "Book exclusive discounted appointments with beauty professionals near you.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeautyLink | Great Beauty. Better Prices.",
    description:
      "Book exclusive discounted appointments with beauty professionals near you.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BeautyLink",
  },
  formatDetection: {
    telephone: false,
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
        <AppClerkProvider>
          {children}
        </AppClerkProvider>
      </body>
    </html>
  );
}
