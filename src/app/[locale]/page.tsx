import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/metadata';
import { locales, type Locale } from '@/lib/i18n';
import { HeroCarousel } from '@/components/sections/HeroCarousel';
import { FirmIntro } from '@/components/sections/FirmIntro';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { Differentiators } from '@/components/sections/Differentiators';
import { PracticeAreasPreview } from '@/components/sections/PracticeAreasPreview';
import { TeamSection } from '@/components/sections/TeamSection';
import { QuoteSection } from '@/components/sections/QuoteSection';
import { ContactSection } from '@/components/sections/ContactSection';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  return generatePageMetadata('home', locale as Locale, `/${locale}`);
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const lang = locale as Locale;

  return (
    <>
      <HeroCarousel locale={lang} />
      <FirmIntro locale={lang} />
      <WhyChooseUs locale={lang} />
      <Differentiators locale={lang} />
      <PracticeAreasPreview locale={lang} />
      <TeamSection locale={lang} />
      <QuoteSection locale={lang} />
      <ContactSection locale={lang} />
    </>
  );
}
