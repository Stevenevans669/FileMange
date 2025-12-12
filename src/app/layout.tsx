import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vercel Cloud Drive',
  description: 'A modern cloud drive optimized for Vercel deployments.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className="min-h-screen bg-grid-light bg-[length:32px_32px]">
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_45%)]" />
        <div className="relative flex min-h-screen flex-col px-4 pb-10 pt-8 sm:px-6 lg:px-10">
          <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 rounded-2xl border border-slate-800/60 bg-slate-950/70 px-4 py-3 shadow-md shadow-blue-500/10 backdrop-blur">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-blue-200/80">
                Vercel Cloud Drive
              </p>
              <h1 className="text-xl font-semibold text-white">
                App Router + TypeScript foundation
              </h1>
            </div>
            <span className="rounded-full border border-blue-400/40 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
              Scaffold Ready
            </span>
          </header>
          <main className="mx-auto mt-6 flex w-full max-w-5xl grow flex-col gap-6 lg:mt-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
