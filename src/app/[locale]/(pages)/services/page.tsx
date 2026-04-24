import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/metadata';
import { locales, type Locale } from '@/lib/i18n';
import { ServicesAccordion } from '@/components/sections/ServicesAccordion';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'en') notFound();
  return generatePageMetadata('services', 'en', '/en/services');
}

export function generateStaticParams() {
  return [{ locale: 'en' }];
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;

  if (locale !== 'en') {
    notFound();
  }

  return (
    <div className="pt-20">
      <ServicesAccordion locale="en" />
    </div>
  );
}
