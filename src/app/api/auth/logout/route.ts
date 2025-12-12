import { NextResponse } from 'next/server';

import { clearSessionCookie, signOut } from '@/lib/auth';

export async function POST() {
  await signOut();
  const response = NextResponse.json({ success: true });
  clearSessionCookie(response);
  return response;
}
