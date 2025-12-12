'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleSignOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    startTransition(() => {
      router.push('/login');
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      className="rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-sm font-semibold text-rose-100 transition hover:border-rose-400 hover:text-white disabled:opacity-70"
    >
      {isPending ? '退出中…' : '退出登录'}
    </button>
  );
}
