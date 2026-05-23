'use client'

import { ClerkProvider } from '@clerk/nextjs'

export default function ClerkProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: 'bg-cyan-600 hover:bg-cyan-700',
          card: 'bg-gray-900 border border-gray-800',
          headerTitle: 'text-white',
          headerSubtitle: 'text-gray-400',
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}
