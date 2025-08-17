import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { AuthProvider } from '@/contexts/AuthContext'
import { ContentProvider } from '@/contexts/ContentContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Filmxane - Kurdish Cinema Platform',
  description: 'The ultimate Kurdish cinema platform with movies, series, and exclusive content',
  keywords: 'Kurdish, cinema, movies, series, film, entertainment',
  authors: [{ name: 'Filmxane Team' }],
  creator: 'Filmxane',
  publisher: 'Filmxane',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://filmxane.com'),
  openGraph: {
    title: 'Filmxane - Kurdish Cinema Platform',
    description: 'The ultimate Kurdish cinema platform with movies, series, and exclusive content',
    url: 'https://filmxane.com',
    siteName: 'Filmxane',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Filmxane - Kurdish Cinema Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Filmxane - Kurdish Cinema Platform',
    description: 'The ultimate Kurdish cinema platform with movies, series, and exclusive content',
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <AuthProvider>
          <ContentProvider>
            <Navigation />
            <main className="min-h-screen">
              {children}
            </main>
          </ContentProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
