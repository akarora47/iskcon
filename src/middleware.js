import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('admin_token')?.value;

  // Login page — always let through (never redirect, avoids loops)
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
    const res = NextResponse.next();
    res.headers.set('x-pathname', pathname);
    return res;
  }

  // Protect all /admin/* routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      const res = NextResponse.redirect(new URL('/admin/login', request.url));
      res.headers.set('x-pathname', pathname);
      return res;
    }
  }

  const res = NextResponse.next();
  res.headers.set('x-pathname', pathname);
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
