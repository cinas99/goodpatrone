import './globals.css';
import type { Metadata } from 'next';
import SidebarLayout from './components/SidebarLayout';
import CookieBanner from './components/CookieBanner';

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
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: { canonical: 'https://goodpatrone.com' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Consent Mode v2 — must fire BEFORE any Google scripts */}
        <script
          dangerouslySetInnerHTML={{ __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            // Default: all denied until user chooses
            gtag('consent', 'default', {
              ad_storage: 'denied',
              analytics_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              functionality_storage: 'granted',
              security_storage: 'granted',
              wait_for_update: 500
            });
            // If already consented in a previous session, apply immediately
            var consent = localStorage.getItem('cookie-consent');
            if (consent === 'accepted') {
              gtag('consent', 'update', {
                ad_storage: 'granted',
                analytics_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted'
              });
            }
          `}}
        />

        {/* Preconnect to Google Fonts / AdSense if used */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

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
        <CookieBanner />
      </body>
    </html>
  );
}
