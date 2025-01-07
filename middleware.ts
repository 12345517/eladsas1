import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  })

  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password'
  ]

  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isPublicPath && !token) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (request.nextUrl.pathname.startsWith('/admin') && token?.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isPublicPath && !token?.isApproved) {
    return NextResponse.redirect(new URL('/pending-approval', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/admin/:path*',
    '/backoffice/:path*',
    '/auth/:path*'
  ]
}