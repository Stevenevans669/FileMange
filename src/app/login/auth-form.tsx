'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Mode = 'login' | 'register';

type AuthFormProps = {
  mode: Mode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const targetPath = searchParams.get('next') ?? '/';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload: Record<string, string> = { email, password };
    if (mode === 'register') {
      payload.name = name;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const result = (await response.json()) as { error?: string };
      setError(result.error ?? '请求失败，请稍后再试。');
      return;
    }

    startTransition(() => {
      router.push(targetPath);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm text-slate-200" htmlFor="email">
          邮箱
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-slate-700/80 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-1 ring-transparent transition focus:border-blue-500/70 focus:ring-blue-500/40"
        />
      </div>

      {mode === 'register' && (
        <div className="space-y-1">
          <label className="text-sm text-slate-200" htmlFor="name">
            昵称（可选）
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-slate-700/80 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-1 ring-transparent transition focus:border-blue-500/70 focus:ring-blue-500/40"
          />
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm text-slate-200" htmlFor="password">
          密码
        </label>
        <input
          id="password"
          type="password"
          minLength={8}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-slate-700/80 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-1 ring-transparent transition focus:border-blue-500/70 focus:ring-blue-500/40"
        />
        <p className="text-xs text-slate-400">至少 8 位字符，建议混合数字与符号。</p>
      </div>

      {error ? <p className="text-sm text-amber-300">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? '提交中…' : mode === 'login' ? '登录' : '注册并登录'}
      </button>
    </form>
  );
}
