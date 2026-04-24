import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/metadata';
import { locales, type Locale } from '@/lib/i18n';
import { AboutHero } from '@/components/sections/AboutHero';
import { AboutValues } from '@/components/sections/AboutValues';
import { AboutHistory } from '@/components/sections/AboutHistory';
import { TeamSection } from '@/components/sections/TeamSection';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  return generatePageMetadata('about', locale as Locale, `/${locale}/nosotros`);
}

export default async function NosotrosPage({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const lang = locale as Locale;

  return (
    <div className="pt-20">
      <AboutHero locale={lang} />
      <AboutValues locale={lang} />
      <AboutHistory locale={lang} />
      <TeamSection locale={lang} />
    </div>
  );
}
