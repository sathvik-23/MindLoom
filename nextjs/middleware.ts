// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets
  if (
    pathname.includes('/_next') ||
    pathname.includes('/api/') ||
    pathname.includes('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Create Supabase client for auth checks
  const requestHeaders = new Headers(request.headers);
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          requestHeaders.append('Set-Cookie', `${name}=${value}; Path=/; HttpOnly; SameSite=Lax`);
        },
        remove(name: string, options: any) {
          requestHeaders.append('Set-Cookie', `${name}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`);
        },
      },
    }
  );

  // Check auth status
  const { data: { session } } = await supabase.auth.getSession();

  // Protect routes
  const protectedRoutes = [
    '/dashboard',
    '/journal',
    '/goals',
    '/insights',
    '/profile',
    '/settings',
  ];
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Redirect if accessing protected routes without authentication
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Redirect if accessing auth pages while logged in
  const authRoutes = ['/auth/signin', '/auth/signup', '/auth/forgot-password'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
