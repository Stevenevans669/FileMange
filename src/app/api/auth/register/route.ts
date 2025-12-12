import { NextResponse } from 'next/server';

import { handleRegistration } from '@/lib/auth';

export async function POST(request: Request) {
  const payload = (await request.json()) as { email?: string; password?: string; name?: string };
  if (!payload?.email || !payload?.password) {
    return NextResponse.json({ error: '邮箱和密码必填。' }, { status: 400 });
  }

  return handleRegistration({
    email: payload.email,
    password: payload.password,
    name: payload.name,
  });
}
