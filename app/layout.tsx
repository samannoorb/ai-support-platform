import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import { ToastProvider } from '@/components/ui/toast'
import MainLayout from '@/components/layout/main-layout'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'SupportAI - AI-Powered Customer Support Platform',
  description: 'Advanced customer support platform with AI-powered ticket classification, real-time chat, and intelligent response suggestions.',
  keywords: ['customer support', 'AI', 'help desk', 'ticketing system', 'live chat'],
  authors: [{ name: 'SupportAI Team' }],
  creator: 'SupportAI',
  publisher: 'SupportAI',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://supportai.com',
    title: 'SupportAI - AI-Powered Customer Support Platform',
    description: 'Advanced customer support platform with AI-powered ticket classification, real-time chat, and intelligent response suggestions.',
    siteName: 'SupportAI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SupportAI Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SupportAI - AI-Powered Customer Support Platform',
    description: 'Advanced customer support platform with AI-powered ticket classification, real-time chat, and intelligent response suggestions.',
    images: ['/og-image.jpg'],
    creator: '@supportai',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#3b82f6',
      },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <ToastProvider>
            <MainLayout>
              {children}
            </MainLayout>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
