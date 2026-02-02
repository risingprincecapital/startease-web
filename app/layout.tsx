import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ToastProvider } from "./contexts/ToastContext";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StartEase - Complete Business Incorporation Made Simple",
  description: "Launch your business with confidence. We handle the paperwork so you can focus on building your dream.",
  metadataBase: new URL('https://starteaseai.com'),
  openGraph: {
    title: "StartEase - Complete Business Incorporation Made Simple",
    description: "Launch your business with confidence. We handle the paperwork so you can focus on building your dream.",
    url: 'https://starteaseai.com',
    siteName: 'StartEase',
    images: [
      {
        url: '/logo.jpg',
        width: 800,
        height: 800,
        alt: 'StartEase Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "StartEase - Complete Business Incorporation Made Simple",
    description: "Launch your business with confidence. We handle the paperwork so you can focus on building your dream.",
    images: ['/logo.jpg'],
  },
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.BlogQAWidget = {
                config: {
                  apiBaseUrl: "https://fyi-widget-api.elephany.pro/api/v1",
                  apiKey: "pub_CLLAtMQK3j3By4kSN0otTr2neyNPB5FMbzOMMd_eNJY"
                }
              };
            `,
          }}
        />
        <link rel="stylesheet" href="https://assets.elephany.pro/widget.css" />
        <script src="https://assets.elephany.pro/widget.js" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
