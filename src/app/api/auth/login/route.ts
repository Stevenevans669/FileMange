import { NextResponse } from 'next/server';

import { handleLogin } from '@/lib/auth';

export async function POST(request: Request) {
  const payload = (await request.json()) as { email?: string; password?: string };
  if (!payload?.email || !payload?.password) {
    return NextResponse.json({ error: '邮箱和密码必填。' }, { status: 400 });
  }

  return handleLogin({ email: payload.email, password: payload.password });
}
