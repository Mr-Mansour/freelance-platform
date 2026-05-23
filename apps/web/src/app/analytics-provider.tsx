'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    capture_pageview: false,
    loaded: (ph) => {
      if (process.env.NODE_ENV !== 'production') ph.opt_out_capturing()
    },
  })
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleRouteChange = () => posthog?.capture('$pageview')
    handleRouteChange()
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
