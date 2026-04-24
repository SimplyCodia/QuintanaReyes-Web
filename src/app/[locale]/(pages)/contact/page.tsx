import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/metadata';
import { locales, type Locale } from '@/lib/i18n';
import { ContactSection } from '@/components/sections/ContactSection';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  return generatePageMetadata('contact', locale as Locale, `/${locale}/contact`);
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  return (
    <div className="pt-20">
      <ContactSection locale={locale as Locale} />
    </div>
  );
}
