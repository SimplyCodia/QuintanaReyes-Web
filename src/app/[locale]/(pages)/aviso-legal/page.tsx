import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';
import { LegalNotice } from '@/components/sections/LegalNotice';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata() {
  return {
    title: 'Aviso Legal | Quintana Reyes & Asociados',
    description: 'Aviso legal y terminos de uso del sitio web de Quintana Reyes & Asociados.',
  };
}

export default async function AvisoLegalPage({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  return (
    <div className="pt-20">
      <LegalNotice locale={locale as Locale} />
    </div>
  );
}
