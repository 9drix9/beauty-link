import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppClerkProvider } from "@/components/providers/clerk-provider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#6A1B9A",
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
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-background text-body overscroll-none">
        <AppClerkProvider>
          {children}
        </AppClerkProvider>
      </body>
    </html>
  );
}
