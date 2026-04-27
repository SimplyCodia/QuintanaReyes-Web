import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';
import { LegalNotice } from '@/components/sections/LegalNotice';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata() {
  return {
    title: 'Legal Notice | Quintana Reyes & Asociados',
    description: 'Legal notice and terms of use for the Quintana Reyes & Asociados website.',
  };
}

export default async function LegalNoticePage({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  return (
    <div className="pt-20">
      <LegalNotice locale={locale as Locale} />
    </div>
  );
}
