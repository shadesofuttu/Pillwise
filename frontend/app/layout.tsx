import type { Metadata } from 'next';
import { Fraunces } from 'next/font/google';
import { Inter } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PillWise - Medicine Information Assistant',
  description: 'Professional medicine identification and information tool with multilingual support and accessibility features.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-white font-sans text-slate-800 antialiased selection:bg-primary-100 selection:text-primary-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:min-h-[44px] focus:bg-sky-700 focus:text-white focus:font-bold focus:rounded-xl focus:outline-2 focus:outline-white focus:outline-offset-2 focus:border-2 focus:border-sky-900"
          aria-label="Skip to main content"
        >
          Skip to main content
        </a>
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
