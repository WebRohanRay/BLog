import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Source_Sans_3 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const sourceSans = Source_Sans_3({ 
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Spice & Simmer | Indian Flavors, Global Inspirations',
    template: '%s | Spice & Simmer',
  },
  description: 'Discover bold, flavorful recipes that blend Indian culinary traditions with flavors from around the world. Easy weeknight dinners, meal prep ideas, and global comfort food.',
  keywords: ['indian recipes', 'global fusion', 'easy recipes', 'weeknight dinners', 'world cuisine', 'Indian fusion cooking'],
  authors: [{ name: 'Admin' }],
  creator: 'Spice & Simmer',
  publisher: 'Spice & Simmer',
  other: {
    'google-adsense-account': 'ca-pub-7594101639104127',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://spiceandsimmer.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Spice & Simmer',
    title: 'Spice & Simmer | Indian Flavors, Global Inspirations',
    description: 'Bold, flavorful recipes that blend Indian culinary traditions with flavors from around the world.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Spice & Simmer - Indian Flavors, Global Inspirations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spice & Simmer | Indian Flavors, Global Inspirations',
    description: 'Bold, flavorful recipes that blend Indian culinary traditions with flavors from around the world.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e86a33' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1412' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        {children}
        <Toaster position="bottom-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
