import { Inter, Prompt } from 'next/font/google';
import './globals.css';
import { MyProvider } from './context/Mycontext';
import { ToastProvider } from './Components/toast';

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
    'EdHotel',
    'Hotel Management System',
    'PMS',
    'Hospitality Software',
    'Online Booking',
    'Guest Experience',
    'Hotel Operations',
    'Property Management'
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="canonical" href="https://edhotel.vercel.app" />
        <meta name="google-site-verification" content="your-verification-code" />
      </head>
      <body className={`${prompt.className}`}>
        <ToastProvider>
          <MyProvider>
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

            {children}
          </MyProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
