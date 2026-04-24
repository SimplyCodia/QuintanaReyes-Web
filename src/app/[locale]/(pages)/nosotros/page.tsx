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
  if (locale !== 'es') notFound();
  return generatePageMetadata('about', 'es', '/es/nosotros');
}

export function generateStaticParams() {
  return [{ locale: 'es' }];
}

export default async function NosotrosPage({ params }: Props) {
  const { locale } = await params;

  if (locale !== 'es') {
    notFound();
  }

  return (
    <div className="pt-20">
      <AboutHero locale="es" />
      <AboutValues locale="es" />
      <AboutHistory locale="es" />
      <TeamSection locale="es" />
    </div>
  );
}
