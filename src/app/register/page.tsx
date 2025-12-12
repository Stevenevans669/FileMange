import { Suspense } from 'react';
import Link from 'next/link';

import { AuthForm } from '../login/auth-form';

export const metadata = {
  title: '注册 - Vercel Cloud Drive',
};

export default function RegisterPage() {
  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-6 rounded-2xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-lg shadow-blue-500/10">
      <div className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-200/80">创建账号</p>
        <h1 className="text-2xl font-semibold text-white">开启你的云盘</h1>
        <p className="text-sm text-slate-300">填写邮箱和至少 8 位密码，我们会为你创建一个新账户。</p>
      </div>

      <Suspense fallback={<div className="text-sm text-slate-300">加载中…</div>}>
        <AuthForm mode="register" />
      </Suspense>

      <p className="text-center text-sm text-slate-300">
        已有账号？{' '}
        <Link href="/login" className="font-semibold text-blue-300 underline-offset-4 hover:underline">
          前往登录
        </Link>
      </p>
    </section>
  );
}
