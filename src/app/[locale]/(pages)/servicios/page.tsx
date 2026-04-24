import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/metadata';
import { locales, type Locale } from '@/lib/i18n';
import { ServicesAccordion } from '@/components/sections/ServicesAccordion';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  return generatePageMetadata('services', locale as Locale, `/${locale}/servicios`);
}

export default async function ServiciosPage({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  return (
    <div className="pt-20">
      <ServicesAccordion locale={locale as Locale} />
    </div>
  );
}
