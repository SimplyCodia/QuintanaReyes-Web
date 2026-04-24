'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { Locale } from '@/lib/i18n';

interface ClientLayoutProps {
  locale: Locale;
  children: React.ReactNode;
}

export function ClientLayout({ locale, children }: ClientLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-[#C9A449] selection:text-white">
      <Header locale={locale} currentPath={pathname} />
      <main className="flex-grow">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
