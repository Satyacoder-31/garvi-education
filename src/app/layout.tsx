import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { MetaPixel } from '@/components/analytics/meta-pixel';
import { CustomCursor } from '@/components/custom-cursor';
import { PageLoader } from '@/components/page-loader';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Garvi Education | Online School Management Workshop (Rewa, MP)',
  description:
    'Join our practical online workshop to explore smarter approaches to school administration, student records, fee management, attendance, and everyday school operations. Registration fee: ₹199.',
  keywords: [
    'Garvi Education',
    'School Management Workshop',
    'Rewa School Administration',
    'Online School Software Training',
    'Principal Management Workshop',
    'Madhya Pradesh School Leaders',
  ],
  authors: [{ name: 'Garvi Education', url: 'https://garvieducation.com' }],
  metadataBase: new URL('https://garvieducation.com'),
  openGraph: {
    title: 'Transform the Way You Manage Your School | Garvi Education',
    description:
      'Practical 2-hour online workshop for School Owners, Principals, and Administrators. Registration fee: ₹199.',
    url: 'https://garvieducation.com',
    siteName: 'Garvi Education',
    images: [
      {
        url: '/images/hero-administrator.jpg',
        width: 1200,
        height: 630,
        alt: 'Garvi Education School Management Workshop',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Garvi Education | Online School Management Workshop',
    description:
      'Explore smarter approaches to school administration, attendance, and fee tracking. Register for ₹199.',
    images: ['/images/hero-administrator.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
        {/* Full-screen Loading Animation & Top Bar Glide on every refresh */}
        <PageLoader />
        {/* Bespoke Interactive Hover Cursor */}
        <CustomCursor />
        <MetaPixel />
        {children}
        {/* Razorpay Checkout Script */}
        <Script
          id="razorpay-checkout"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
