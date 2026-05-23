'use client'

import dynamic from 'next/dynamic'

const ClerkProviders = dynamic(() => import('./clerk-provider'), { ssr: false })

const clerkKey = typeof process !== 'undefined'
  ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  : ''

export function Providers({ children }: { children: React.ReactNode }) {
  if (!clerkKey || clerkKey === 'pk_test_dummy') {
    return <>{children}</>
  }

  return <ClerkProviders>{children}</ClerkProviders>
}
