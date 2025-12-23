import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ResponsiveToaster } from "@/components/ui/responsive-toaster";
import { CartProvider } from "@/lib/context/cart-context";
import { FavoritesProvider } from "@/lib/context/favorites-context";
import { MobileNav } from "@/components/mobile-nav";
import {
  STORE_NAME,
  STORE_DESCRIPTION,
  STORE_KEYWORDS,
  STORE_TAGLINE,
} from "@/lib/constants";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://thejasonstore.vercel.app"
  ),
  title: {
    default: `${STORE_NAME} | ${STORE_TAGLINE} - Marketplace Online`,
    template: `%s | ${STORE_NAME}`,
  },
  description: STORE_DESCRIPTION,
  keywords: STORE_KEYWORDS,
  authors: [{ name: STORE_NAME }],
  creator: STORE_NAME,
  publisher: STORE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  generator: "v0.app",
  applicationName: STORE_NAME,
  referrer: "origin-when-cross-origin",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: STORE_NAME,
    title: `${STORE_NAME} | ${STORE_TAGLINE}`,
    description: STORE_DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${STORE_NAME} - Marketplace Online`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${STORE_NAME} | ${STORE_TAGLINE}`,
    description: STORE_DESCRIPTION,
    images: ["/og-image.jpg"],
    creator: "@thejasonstore",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.jpg", sizes: "192x192", type: "image/jpeg" },
      { url: "/icon-512.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
    apple: [{ url: "/icon-192.jpg", sizes: "192x192", type: "image/jpeg" }],
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F59E0B" },
    { media: "(prefers-color-scheme: dark)", color: "#F59E0B" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  alternates: {
    canonical: "/",
    languages: {
      "es-ES": "/",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`font-sans antialiased`}>
        <CartProvider>
          <FavoritesProvider>
            {children}
            <MobileNav />
            <Analytics />
            <ResponsiveToaster />
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
