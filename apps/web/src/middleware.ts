const isPublicRoute = (req: { nextUrl: { pathname: string } }) => {
  const publicPaths = ['/', '/sign-in', '/sign-up', '/api/webhooks', '/_next']
  return publicPaths.some(p => req.nextUrl.pathname.startsWith(p))
}

export default async function middleware(req: { nextUrl: { pathname: string }; url: string | URL | Request }) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const isLocalDev = !clerkKey || clerkKey === 'pk_test_dummy'

  if (isLocalDev) return

  if (!isPublicRoute(req)) {
    const { pathname } = req.nextUrl
    if (!pathname.startsWith('/sign-in') && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
      return Response.redirect(new URL('/sign-in', req.url as string))
    }
  }
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
