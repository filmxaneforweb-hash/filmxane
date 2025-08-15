import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Filmxane - Platforma Streaming a Kurdî',
  description: 'Netflix tarzı Kürtçe film ve dizi izleme platformu',
  keywords: 'kurdî, fîlm, rêzefîlm, streaming, netflix',
  authors: [{ name: 'Filmxane Team' }],
  // Remove viewport from metadata to fix Next.js warning
  // Add more metadata for better SEO
  openGraph: {
    title: 'Filmxane - Platforma Streaming a Kurdî',
    description: 'Netflix tarzı Kürtçe film ve dizi izleme platformu',
    type: 'website',
    locale: 'ku_TR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Filmxane - Platforma Streaming a Kurdî',
    description: 'Netflix tarzı Kürtçe film ve dizi izleme platformu',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ku" dir="ltr" data-scroll-behavior="smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-sans bg-black text-white antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f1f1f',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: '8px',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
