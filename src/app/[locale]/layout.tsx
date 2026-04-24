import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';
import { ClientLayout } from '@/components/layout/ClientLayout';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <ClientLayout locale={locale as Locale}>{children}</ClientLayout>
  );
}
