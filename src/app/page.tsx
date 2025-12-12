import Link from 'next/link';

import { getSessionFromCookies } from '@/lib/auth';
import { SignOutButton } from './sign-out-button';

const roadmapItems = [
  {
    title: 'App Router-first foundation',
    summary: 'Ready-to-extend routing, layouts, and metadata with sensible defaults.',
    items: [
      'TypeScript strict mode',
      'App directory with shared layout',
      'MDX-ready content targets',
    ],
  },
  {
    title: 'UI + DX tooling',
    summary: 'Tailwind + Prettier + ESLint harmonized for reliable, readable UI code.',
    items: [
      'Tailwind CSS configured for ./src/**/*',
      'Prettier with Tailwind plugin',
      'ESLint on top of core-web-vitals',
    ],
  },
  {
    title: 'Runtime + environment hygiene',
    summary: 'Clear separation of public vs. server-only variables with examples.',
    items: [
      '.env.example with public/server scopes',
      'Node.js 18+ baseline',
      'Next.js scripts for dev/build/lint',
    ],
  },
];

export default async function HomePage() {
  const session = await getSessionFromCookies();

  return (
    <section className="space-y-6">
      <div className="section-card flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">Private by default</p>
          <h2 className="text-xl font-semibold text-white">安全访问已开启</h2>
          <p className="text-sm text-slate-300">
            {session ? `已登录：${session.user.email}` : '未登录状态将被自动重定向至登录页。'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
          <Link
            href="/docs"
            className="rounded-full border border-slate-700/70 px-3 py-1.5 text-slate-100 transition hover:border-blue-400 hover:text-white"
          >
            查看文档
          </Link>
          <SignOutButton />
        </div>
      </div>

      <div className="section-card relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex-1 space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-blue-200/70">App Scaffold</p>
            <h2 className="text-3xl font-semibold text-white lg:text-4xl">
              Next.js + Tailwind starter
            </h2>
            <p className="max-w-2xl text-base text-slate-200/90">
              Opinionated App Router scaffold with TypeScript, Tailwind, ESLint, and Prettier wired
              together. The layout is ready for marketing pages, docs, and authenticated flows
              without extra ceremony.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-blue-100">
              <span className="rounded-full border border-blue-400/40 bg-blue-500/10 px-3 py-1">
                Next.js 14 App Router
              </span>
              <span className="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-3 py-1">
                TypeScript strict
              </span>
              <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1">
                Tailwind CSS
              </span>
              <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1">
                ESLint &amp; Prettier
              </span>
            </div>
            <p className="text-sm text-slate-300">
              Need docs? Jump into{' '}
              <Link href="/docs" className="font-semibold">
                /docs
              </Link>{' '}
              for product context, or start building in
              <span className="code-inline">src/app</span>.
            </p>
          </div>
          <div className="flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-slate-800/60 bg-slate-900/70 p-4 shadow-inner shadow-blue-500/5">
            <h3 className="text-lg font-semibold text-white">What&apos;s configured</h3>
            <ul className="space-y-2 text-sm text-slate-200">
              <li>
                <span className="code-inline">tailwind.config.ts</span> scoped to{' '}
                <span className="code-inline">src/**/*</span>
              </li>
              <li>
                <span className="code-inline">.eslintrc.json</span> +{' '}
                <span className="code-inline">.prettierrc</span> with Tailwind plugin
              </li>
              <li>
                <span className="code-inline">.env.example</span> showing public vs. server-only
                variables
              </li>
              <li>
                Formatting scripts: <span className="code-inline">npm run format[:fix]</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roadmapItems.map((item) => (
          <article key={item.title} className="section-card space-y-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-200/60">{item.title}</p>
              <h3 className="text-xl font-semibold text-white">{item.summary}</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-200/90">
              {item.items.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
