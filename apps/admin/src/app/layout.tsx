import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cybrion Command Center',
  description: 'Admin dashboard for Cybrion marketplace',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
