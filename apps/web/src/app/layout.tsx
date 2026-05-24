import type { Metadata } from 'next'
import { Providers } from './providers'
import { AuthProvider } from '@/lib/auth-context'
import { PostHogProvider } from './analytics-provider'
import Navbar from '@/components/Navbar'
import SeedDefaultPages from '@/components/SeedDefaultPages'
import './globals.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: 'Cybrion — AI-Powered Freelance Marketplace',
    template: '%s | Cybrion',
  },
  description: 'The next-generation AI-powered freelance marketplace. Connect with top talent, manage projects, and grow your business.',
  keywords: ['freelance', 'marketplace', 'AI', 'hiring', 'remote work'],
  openGraph: {
    title: 'Cybrion — AI-Powered Freelance Marketplace',
    description: 'The next-generation AI-powered freelance marketplace.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Cybrion',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cybrion — AI-Powered Freelance Marketplace',
    description: 'The next-generation AI-powered freelance marketplace.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-gray-100 antialiased">
        <PostHogProvider>
          <AuthProvider>
            <SeedDefaultPages />
            <Navbar />
            <main className="pt-16 lg:pt-20">{children}</main>
          </AuthProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
