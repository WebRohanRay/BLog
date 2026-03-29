import type { Metadata, Viewport } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "@/styles/globals.css";

// ── Fonts ──────────────────────────────────────────────────────
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-lato",
  display: "swap",
  preload: true,
});

// ── Site Metadata ──────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://spiceandsimmer.com"
  ),
  title: {
    default: "Spice & Simmer — Bold Indian-American Fusion Recipes",
    template: "%s | Spice & Simmer",
  },
  description:
    "Fast, flavorful Indian-American fusion recipes for busy home cooks. Step-by-step guides, cook mode, and tips for bold meals in 30 minutes or less.",
  keywords: [
    "Indian-American fusion recipes",
    "easy Indian recipes",
    "fusion cooking",
    "quick Indian meals",
    "butter chicken",
    "Indian tacos",
    "home cooking",
    "30 minute meals",
  ],
  authors: [{ name: "Spice & Simmer" }],
  creator: "Spice & Simmer",
  publisher: "Spice & Simmer",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Spice & Simmer",
    title: "Spice & Simmer — Bold Indian-American Fusion Recipes",
    description:
      "Fast, flavorful Indian-American fusion recipes for busy home cooks.",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Spice & Simmer — Indian-American Fusion Recipes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spice & Simmer",
    description: "Fast, flavorful Indian-American fusion recipes.",
    images: ["/images/og-default.jpg"],
    creator: "@spiceandsimmer",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
  verification: {
    google: "your-google-site-verification-token",
  },
};

// ── Viewport ───────────────────────────────────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f97316" },
    { media: "(prefers-color-scheme: dark)",  color: "#c2410c" },
  ],
};

// ── Root Layout ────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${lato.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* AdSense — add after approval */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="font-body antialiased bg-white text-gray-900">
        {/* Toast notifications */}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1f2937",
              color: "#fff",
              fontFamily: "var(--font-lato)",
              fontSize: "0.875rem",
              fontWeight: "500",
              borderRadius: "0.75rem",
              padding: "0.75rem 1rem",
            },
            success: {
              iconTheme: { primary: "#f97316", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#dc2626", secondary: "#fff" },
            },
          }}
        />

        {/* Main content */}
        {children}

        {/* Structured data — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Spice & Simmer",
              url: process.env.NEXT_PUBLIC_SITE_URL,
              logo: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`,
              sameAs: [
                "https://www.instagram.com/spiceandsimmer",
                "https://www.pinterest.com/spiceandsimmer",
                "https://www.youtube.com/spiceandsimmer",
              ],
            }),
          }}
        />

        {/* Structured data — Website + Sitelinks searchbox */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Spice & Simmer",
              url: process.env.NEXT_PUBLIC_SITE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
