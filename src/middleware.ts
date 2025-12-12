import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
];

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith('/_next')) return true;
  if (pathname.startsWith('/favicon')) return true;
  if (pathname.startsWith('/assets')) return true;
  if (pathname.startsWith('/api/auth')) return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get('vcd_session')?.value;
  if (sessionToken) return NextResponse.next();

  if (pathname.startsWith('/api')) {
    return NextResponse.json({ error: '未授权访问' }, { status: 401 });
  }

  const loginUrl = new URL('/login', request.url);
  if (search) {
    loginUrl.searchParams.set('next', `${pathname}${search}`);
  } else {
    loginUrl.searchParams.set('next', pathname);
  }

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
