import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth for local development if desired, or just protect /admin
  if (pathname.startsWith('/admin') && process.env.NODE_ENV !== 'development') {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Dashboard"',
        },
      });
    }

    const auth = authHeader.split(' ')[1];
    const decoded = Buffer.from(auth, 'base64').toString();
    const [user, pwd] = decoded.split(':');

    // These should be set in Vercel Environment Variables
    const ADMIN_USER = process.env.ADMIN_USER || 'admin';
    const ADMIN_PASS = process.env.ADMIN_PASS || 'AlanLovesBigBootyFemboys';

    if (user !== ADMIN_USER || pwd !== ADMIN_PASS) {
      return new NextResponse('Invalid credentials', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Dashboard"',
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
