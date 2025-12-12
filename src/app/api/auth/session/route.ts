import { NextResponse } from 'next/server';

import { clearSessionCookie, getSessionFromCookies, signOut } from '@/lib/auth';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: session.user,
  });
}

export async function DELETE() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ success: true });
  }

  await signOut();
  const response = NextResponse.json({ success: true });
  clearSessionCookie(response);
  return response;
}
