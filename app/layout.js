import Head from 'next/head';
import { Inter, Prompt } from 'next/font/google';
import './globals.css';
import Header from './Pages/Header';
import Footer from './Pages/Footer';
import 'animate.css';

const inter = Inter({ subsets: ['latin'] });
const prompt = Prompt({ subsets: ['latin'], weight: '400' });

export const metadata = {
  metadataBase: new URL('https://edhotel.vercel.app'),
  title: {
    default: 'EdHotel - Premium Hotel Management System',
    template: '%s | EdHotel'
  },
  description: 'EdHotel is a cutting-edge hotel management application designed to streamline operations and elevate guest experiences. Manage bookings, streamline guest interactions, and optimize hotel operations with ease.',
  applicationName: 'EdHotel',
  authors: [{ name: 'Abdellah Edaoudi', url: 'https://abdellah-edaoudi.vercel.app' }],
  generator: 'Next.js',
  keywords: [
    'EdHotel', 'hotel management', 'hospitality software', 'guest management', 'booking system',
    'streamline operations', 'guest experience', 'optimize hotel', 'hotel software', 'hotel booking',
    'hotel operations', 'hotel technology', 'property management system', 'PMS', 'hotel CRM',
    'hotel reservations', 'hotel marketing', 'hotel automation', 'hotel revenue management',
    'hotel guest satisfaction', 'hotel staff management', 'hotel analytics', 'hotel reporting',
    'hotel administration', 'hotel technology solutions', 'hotel front desk software',
    'online booking system', 'hotel digital marketing', 'hotel maintenance management',
    'hotel room management', 'hotel housekeeping management', 'hotel inventory management',
    'hotel pricing strategy', 'hotel loyalty program', 'hotel customer service', 'hotel check-in',
    'hotel check-out', 'hotel property management', 'hotel room rates', 'hotel occupancy management',
    'hotel distribution strategy', 'hotel channel management', 'hotel API integration',
    'hotel cloud software', 'hotel mobile app', 'hotel operations software', 'hotel business intelligence',
    'hotel POS system', 'hotel workflow automation', 'hotel guest feedback'
  ],
  referrer: 'origin-when-cross-origin',
  creator: 'Abdellah Edaoudi',
  publisher: 'EdHotel Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/Images/logo.png',
    shortcut: '/Images/logo.png',
    apple: '/Images/logo.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/Images/logo.png',
    },
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'EdHotel - Premium Hotel Management System',
    description: 'EdHotel provides comprehensive solutions for hotel management, offering tools to enhance efficiency, guest satisfaction, and operational performance.',
    url: 'https://edhotel.vercel.app',
    siteName: 'EdHotel',
    images: [
      {
        url: 'https://res.cloudinary.com/dynprvsfg/image/upload/v1717421518/wprm2rcy3qvhn1jvc1wk.png',
        alt: 'EdHotel Dashboard Preview',
      },
      {
        url: 'https://res.cloudinary.com/dynprvsfg/image/upload/v1717421518/wprm2rcy3qvhn1jvc1wk.png',
        alt: 'EdHotel Dashboard Large',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EdHotel - Premium Hotel Management System',
    description: 'EdHotel is a cutting-edge hotel management application designed to streamline operations and elevate guest experiences.',
    site: '@edhotel',
    creator: '@edaoudi_abdellah',
    images: ['https://res.cloudinary.com/dynprvsfg/image/upload/v1717421518/wprm2rcy3qvhn1jvc1wk.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
};

export const viewport = {
  themeColor: 'black',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="canonical" href="https://edhotel.vercel.app" />
        <meta name="google-site-verification" content="your-verification-code" />
      </head>
      <body className={`${prompt.className}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Hotel",
              "name": "EdHotel",
              "description": "Premium Hotel Management System",
              "url": "https://edhotel.vercel.app",
              "logo": "https://edhotel.vercel.app/Images/logo.png",
              "image": "https://res.cloudinary.com/dynprvsfg/image/upload/v1717421518/wprm2rcy3qvhn1jvc1wk.png",
              "telephone": "+212607071966",
              "email": "abdellahedaoudi80@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Hay Lwahda 1",
                "addressLocality": "Laayoune",
                "addressRegion": "Laayoune",
                "postalCode": "70000",
                "addressCountry": "MA"
              },
              "sameAs": [
                "https://www.linkedin.com/in/abdellah-edaoudi-0bbba02a5/",
                "https://abdellah-edaoudi.vercel.app",
                "https://www.instagram.com/edaoudi_abdellah/",
                "https://www.tiktok.com/@edaoudi_abdellah"
              ],
              "priceRange": "$$",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "4657"
              }
            })
          }}
        />
        <div className="sticky top-0 z-50">
          <Header />
        </div>
        {children}
        <Footer />
      </body>
    </html>
  );
}
