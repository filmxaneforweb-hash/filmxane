import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { AuthProvider } from '@/contexts/AuthContext'
import { ContentProvider } from '@/contexts/ContentContext'
import { SettingsProvider } from '@/contexts/SettingsContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Filmxane - Platforma Sînema ya Kurdî',
  description: 'Platforma herî baş a sînema ya kurdî bi fîlm, rêzefîlm û naveroka taybet',
  keywords: 'kurdî, sînema, fîlm, rêzefîlm, fîlm, şahî',
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
    title: 'Filmxane - Platforma Sînema ya Kurdî',
    description: 'Platforma herî baş a sînema ya kurdî bi fîlm, rêzefîlm û naveroka taybet',
    url: 'https://filmxane.com',
    siteName: 'Filmxane',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Filmxane - Platforma Sînema ya Kurdî',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Filmxane - Platforma Sînema ya Kurdî',
    description: 'Platforma herî baş a sînema ya kurdî bi fîlm, rêzefîlm û naveroka taybet',
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
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="192x192" href="/web-app-manifest-192x192.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Filmxane" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <SettingsProvider>
          <AuthProvider>
            <ContentProvider>
              <Navigation />
              <main className="min-h-screen">
                {children}
              </main>
            </ContentProvider>
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}
