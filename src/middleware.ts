import NextAuth from 'next-auth'
import { authConfig } from '@/../auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

// Public routes (no auth required)
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/verify-email',
  '/reset-password',
]

// Protected routes (auth required)
const protectedRoutes = [
  '/dashboard',
  '/resume/builder',
  '/resume/tailor',
  '/job-description',
  '/settings',
]

function isPublicRoute(pathname: string) {
  return publicRoutes.some(route => pathname === route || pathname.startsWith('/api/auth/'))
}

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some(route => pathname.startsWith(route))
}

export default auth(async function middleware(req) {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Check protected routes
  if (isProtectedRoute(pathname) && !isLoggedIn) {
    // Save intended destination
    const callbackUrl = encodeURIComponent(pathname + req.nextUrl.search)
    const loginUrl = new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
