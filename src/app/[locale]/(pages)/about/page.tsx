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
  if (locale !== 'en') notFound();
  return generatePageMetadata('about', 'en', '/en/about');
}

export function generateStaticParams() {
  return [{ locale: 'en' }];
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;

  if (locale !== 'en') {
    notFound();
  }

  return (
    <div className="pt-20">
      <AboutHero locale="en" />
      <AboutValues locale="en" />
      <AboutHistory locale="en" />
      <TeamSection locale="en" />
    </div>
  );
}
