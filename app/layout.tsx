import type { Metadata, Viewport } from "next";
import { Montserrat, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { RecaptchaProvider } from "@/components/providers/recaptcha-provider";
import { DevNotice } from "@/components/dev-notice";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScanPay.cz | Bez terminálu, bez starostí.",
  description: "ScanPay.cz je jednoduchá aplikace pro podniky, která umožňuje přijímat okamžité bankovní platby přes QR kód. Každá platba má unikátní variabilní symbol, takže obsluha vždy snadno ověří, že zákazník zaplatil. Bez platebních terminálů, bez zbytečných poplatků - jen rychlé a bezpečné transakce přímo na váš účet.",
  keywords: ["subscription tracker", "subscription management", "save money on subscriptions", "recurring payments", "digital subscriptions", "subscription alerts", "how to save money on subscriptions", "how to save money on recurring payments", "how to save money on digital subscriptions", "how to save money on subscription alerts"],
  authors: [{ name: "ScanPay.cz" }],
  creator: "ScanPay.cz",
  publisher: "ScanPay.cz",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://scanpay.cz"),
  alternates: {
    canonical: "/",
  },
  // openGraph: {
  //   title: "Dave Gray",
  //   description: "Hello, I'm Dave. 👋 I teach coding and web development skills.",
  //   url: 'https://www.davegray.codes/',
  //   siteName: "Dave Gray's Blog",
  //   type: 'website',
  //   images: [
  //     {
  //       url: 'https://raw.githubusercontent.com/gitdagray/my-blogposts/main/images/og-card.png',
  //       secureUrl: 'https://raw.githubusercontent.com/gitdagray/my-blogposts/main/images/og-card.png',
  //       width: 1200,
  //       height: 630,
  //       alt: 'Preview image for Dave Gray',
  //     }
  //   ]
  // },
  openGraph: {
    title: "ScanPay.cz | Bez terminálu, bez starostí.",
    description: "ScanPay.cz je jednoduchá aplikace pro podniky, která umožňuje přijímat okamžité bankovní platby přes QR kód. Každá platba má unikátní variabilní symbol, takže obsluha vždy snadno ověří, že zákazník zaplatil. Bez platebních terminálů, bez zbytečných poplatků - jen rychlé a bezpečné transakce přímo na váš účet.",
    url: "scanpay.cz",
    siteName: "ScanPay.cz",
    type: "website",
    images: [
          {
            url: 'https://www.scanpay.cz/twitter-image.png',
            secureUrl: 'https://www.scanpay.cz/twitter-image.png',
            width: 1901,
            height: 852,
            alt: 'Twitter preview image for ScanPay.cz',
          }
        ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScanPay.cz | Bez terminálu, bez starostí.",
    description: "ScanPay.cz je jednoduchá aplikace pro podniky, která umožňuje přijímat okamžité bankovní platby přes QR kód. Každá platba má unikátní variabilní symbol, takže obsluha vždy snadno ověří, že zákazník zaplatil. Bez platebních terminálů, bez zbytečných poplatků - jen rychlé a bezpečné transakce přímo na váš účet.",
    images: ["https://www.scanpay.cz/twitter-image.png"],
    creator: "@scanpay.cz",
    site: "@scanpay.cz",
  },
  // facebook: {
  //   appId: "1234567890",
  // },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon/safari-pinned-tab.svg', color: '#7c3aed' },
      { rel: 'manifest', url: '/favicon/site.webmanifest' }
    ]
  },
  applicationName: 'ScanPay.cz',
  appleWebApp: {
    capable: true,
    title: 'ScanPay.cz',
    statusBarStyle: 'default'
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased`}
      >
        <RecaptchaProvider>
          {children}
        </RecaptchaProvider>
        <DevNotice />
        <Analytics />
      </body>
    </html>
  );
}
