import type { Metadata, Viewport } from 'next';
import { LanguageProvider } from '@/components/LanguageProvider';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: 'Agalaz Fashion — Virtual Try-On',
  description:
    'Upload your photo, pick any clothing and see how it looks on you instantly. AI-powered virtual try-on that respects your real body.',
  keywords: [
    'virtual try-on',
    'AI fashion',
    'try before you buy',
    'clothing AI',
    'Agalaz Fashion',
    'prueba de ropa virtual',
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Agalaz',
  },
  openGraph: {
    title: 'Agalaz Fashion — Virtual Try-On',
    description: 'Try any clothing before you buy. AI that respects your real body.',
    type: 'website',
    siteName: 'Agalaz Fashion',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agalaz Fashion — Virtual Try-On',
    description: 'Try any clothing before you buy. AI that respects your real body.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Agalaz" />
      </head>
      <body className="bg-black text-white antialiased overscroll-none">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
