import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin routes require ADMIN or SUPER_ADMIN role
    if (pathname.startsWith('/admin')) {
      if (token?.role !== 'ADMIN' && token?.role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only run middleware on matched routes if a token exists
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Account and admin routes require authentication
        if (pathname.startsWith('/account') || pathname.startsWith('/admin')) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/account/:path*', '/admin/:path*'],
};
