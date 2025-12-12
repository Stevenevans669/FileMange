import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { and, eq, gt } from 'drizzle-orm';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

import { db, sessions, users } from './db';

const SESSION_COOKIE_NAME = 'vcd_session';
const SESSION_TTL_DAYS = 7;

export type SessionContext = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
};

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hashed = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hashed}`;
}

function verifyPassword(password: string, hashedValue: string): boolean {
  const [salt, storedHash] = hashedValue.split(':');
  if (!salt || !storedHash) return false;
  const derived = scryptSync(password, salt, 64);
  const stored = Buffer.from(storedHash, 'hex');
  if (derived.length !== stored.length) return false;
  return timingSafeEqual(derived, stored);
}

async function createSession(userId: string) {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(sessions).values({
    userId,
    sessionToken: token,
    expiresAt,
  });
  return { token, expiresAt };
}

export async function getSessionFromCookies(cookieStore?: ReturnType<typeof cookies>) {
  const store = cookieStore ?? cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const record = await db.query.sessions.findFirst({
    where: and(eq(sessions.sessionToken, token), gt(sessions.expiresAt, new Date())),
    with: { user: true },
  });

  if (!record?.user || !record.user.isActive) {
    return null;
  }

  return {
    token,
    user: {
      id: record.user.id,
      email: record.user.email,
      name: record.user.name,
    },
  } satisfies SessionContext;
}

export async function signOut(cookieStore?: ReturnType<typeof cookies>) {
  const store = cookieStore ?? cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return;

  await db.delete(sessions).where(eq(sessions.sessionToken, token));
}

function buildSessionCookie(token: string, expiresAt: Date) {
  return {
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    path: '/',
  };
}

export async function handleRegistration(payload: {
  email: string;
  password: string;
  name?: string;
}) {
  const email = payload.email.trim().toLowerCase();
  if (!email || !payload.password || payload.password.length < 8) {
    return NextResponse.json({ error: '邮箱和至少 8 位密码必填。' }, { status: 400 });
  }

  const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existingUser) {
    return NextResponse.json({ error: '该邮箱已注册。' }, { status: 409 });
  }

  const user = await db
    .insert(users)
    .values({
      email,
      passwordHash: hashPassword(payload.password),
      name: payload.name?.trim() || null,
    })
    .returning()
    .then((rows) => rows[0]);

  const session = await createSession(user.id);
  const response = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
  });
  response.cookies.set(buildSessionCookie(session.token, session.expiresAt));
  return response;
}

export async function handleLogin(payload: { email: string; password: string }) {
  const email = payload.email.trim().toLowerCase();
  if (!email || !payload.password) {
    return NextResponse.json({ error: '邮箱和密码必填。' }, { status: 400 });
  }

  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!user || !verifyPassword(payload.password, user.passwordHash) || !user.isActive) {
    return NextResponse.json({ error: '邮箱或密码错误。' }, { status: 401 });
  }

  const session = await createSession(user.id);
  const response = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
  });
  response.cookies.set(buildSessionCookie(session.token, session.expiresAt));
  return response;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    maxAge: 0,
    path: '/',
  });
}
