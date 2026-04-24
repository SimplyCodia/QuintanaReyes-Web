'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { Locale, locales } from '@/lib/i18n';

interface ClientLayoutProps {
  locale: Locale;
  children: React.ReactNode;
}

export function ClientLayout({ locale: serverLocale, children }: ClientLayoutProps) {
  const pathname = usePathname();

  // Derive locale from pathname so it updates on client navigation
  const pathLocale = pathname.split('/')[1] as Locale;
  const locale = locales.includes(pathLocale) ? pathLocale : serverLocale;

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-[#C9A449] selection:text-white">
      <Header locale={locale} currentPath={pathname} />
      <main className="flex-grow">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
