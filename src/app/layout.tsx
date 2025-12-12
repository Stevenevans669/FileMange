import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vercel Cloud Drive',
  description: 'A modern cloud drive optimized for Vercel deployments.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
