import { Suspense } from 'react';
import Link from 'next/link';

import { AuthForm } from './auth-form';

export const metadata = {
  title: '登录 - Vercel Cloud Drive',
};

export default function LoginPage() {
  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-6 rounded-2xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-lg shadow-blue-500/10">
      <div className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-blue-200/80">账户登录</p>
        <h1 className="text-2xl font-semibold text-white">欢迎回来</h1>
        <p className="text-sm text-slate-300">使用邮箱和密码登录以访问你的云盘空间。</p>
      </div>

      <Suspense fallback={<div className="text-sm text-slate-300">加载中…</div>}>
        <AuthForm mode="login" />
      </Suspense>

      <p className="text-center text-sm text-slate-300">
        还没有账号？{' '}
        <Link href="/register" className="font-semibold text-blue-300 underline-offset-4 hover:underline">
          前往注册
        </Link>
      </p>
    </section>
  );
}
