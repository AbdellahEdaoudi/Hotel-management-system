import Head from 'next/head';
import { Inter, Prompt } from 'next/font/google';
import './globals.css';
import Header from './Pages/Header';
import Footer from './Pages/Footer';
import 'animate.css';

const inter = Inter({ subsets: ['latin'] });
const prompt = Prompt({ subsets: ['latin'], weight: '400' });
export const metadata = {
  icons: {
    src: "/LogoFooter.png",
    className: "rounded-md"
  },
  title: 'EdHotel',
  description:
    'EdHotel is a cutting-edge hotel management application designed to streamline operations and elevate guest experiences. Manage bookings, streamline guest interactions, and optimize hotel operations with ease. EdHotel offers a comprehensive suite of tools including booking management, guest communication, and operational efficiency solutions.',
  keywords:
    'EdHotel, hotel management, hospitality software, guest management, booking system, streamline operations, guest experience, optimize hotel, hotel software, hotel booking, hotel operations, hotel technology, property management system, PMS, hotel CRM, hotel reservations, hotel marketing, hotel automation, hotel revenue management, hotel guest satisfaction, hotel staff management, hotel analytics, hotel reporting, hotel administration, hotel technology solutions, hotel front desk software, online booking system, hotel digital marketing, hotel maintenance management, hotel room management, hotel housekeeping management, hotel inventory management, hotel pricing strategy, hotel loyalty program, hotel customer service, hotel check-in, hotel check-out, hotel property management, hotel room rates, hotel occupancy management, hotel distribution strategy, hotel channel management, hotel API integration, hotel cloud software, hotel mobile app, hotel operations software, hotel business intelligence, hotel POS system, hotel workflow automation, hotel guest feedback',
  author: 'َAbdellah Edaoudi',
  datePublished: '2024-06-04',
  image:
    'https://res.cloudinary.com/dynprvsfg/image/upload/v1717421518/wprm2rcy3qvhn1jvc1wk.png',
  url: 'https://edhotel.vercel.app',
  organization: {
    '@type': 'Organization',
    name: 'EdHotel',
    logo:
      'https://res.cloudinary.com/dynprvsfg/image/upload/v1717421518/wprm2rcy3qvhn1jvc1wk.png',
    url: 'https://edhotel.vercel.app',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: '+212607071966',
      email: 'abdellahedaoudi80@gmail.com',
      areaServed: {
        '@type': 'Place',
        name: 'Laayoune, Morocco',
      },
    },
    sameAs: [
      'https://www.linkedin.com/in/abdellah-edaoudi-0bbba02a5/',
      'https://ed-portfolioo.vercel.app',
      'https://www.instagram.com/edaoudi_abdellah/',
      'https://www.tiktok.com/@edaoudi_quran',
    ],
    description:
      'EdHotel provides comprehensive solutions for hotel management, offering tools to enhance efficiency, guest satisfaction, and operational performance.',
    foundingDate: '2024-01-01',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Hay Lwahda 1',
      addressLocality: 'Laayoune',
      addressRegion: 'Laayoune',
      postalCode: '70000',
      addressCountry: 'Morocco',
    },
  },
  provider: {
    '@type': 'Organization',
    name: 'EdHotel Inc.',
    legalName: 'EdHotel Solutions Inc.',
    url: 'https://edhotel.vercel.app',
    foundingDate: '2024-01-01',
    founders: [
      {
        '@type': 'Person',
        name: 'َAbdellah Edaoudi',
        sameAs: 'https://www.linkedin.com/in/abdellah-edaoudi-0bbba02a5/',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Hay Lwahda 1',
      addressLocality: 'Laayoune',
      addressRegion: 'Laayoune',
      postalCode: '70000',
      addressCountry: 'Morocco',
    },
  },
};

export default function RootLayout({ children }) {
  return (
      <html lang="en" className="scroll-smooth">
        <body className={`${prompt.className}`}>
          <div className="sticky top-0 z-50">
            <Header />
          </div>
          {children}
          <Footer />
        </body>
      </html>
  );
}
