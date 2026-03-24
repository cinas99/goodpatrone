import './globals.css';
import type { Metadata } from 'next';
import SidebarLayout from './components/SidebarLayout';

export const metadata: Metadata = {
  metadataBase: new URL('https://goodpatrone.com'),
  title: {
    default: 'Good Patrone – Free Online Tools',
    template: '%s | Good Patrone',
  },
  description: 'Free online tools: BMI calculator, days between dates, stopwatch with lap tracking, and countdown timer. Fast, no ads, no signup required.',
  keywords: ['BMI calculator', 'days between dates', 'stopwatch online', 'countdown timer', 'free online tools'],
  authors: [{ name: 'Good Patrone', url: 'https://goodpatrone.com' }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://goodpatrone.com',
    siteName: 'Good Patrone',
    title: 'Good Patrone – Free Online Tools',
    description: 'BMI calculator, days between dates, stopwatch, countdown timer. Free, fast, no signup.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Good Patrone – Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Good Patrone – Free Online Tools',
    description: 'BMI calculator, days between dates, stopwatch, countdown timer. Free, fast, no signup.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  manifest: '/site.webmanifest',
  alternates: { canonical: 'https://goodpatrone.com' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* Google AdSense */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5057449440229337"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Good Patrone',
            url: 'https://goodpatrone.com',
            description: 'Free online tools: BMI calculator, days between calculator, stopwatch and countdown timer.',
          })}}
        />
      </head>
      <body>
        <SidebarLayout>{children}</SidebarLayout>

      </body>
    </html>
  );
}
