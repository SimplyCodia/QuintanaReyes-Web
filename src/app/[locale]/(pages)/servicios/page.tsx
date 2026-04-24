import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/metadata';
import { locales, type Locale } from '@/lib/i18n';
import { ServicesAccordion } from '@/components/sections/ServicesAccordion';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'es') notFound();
  return generatePageMetadata('services', 'es', '/es/servicios');
}

export function generateStaticParams() {
  return [{ locale: 'es' }];
}

export default async function ServiciosPage({ params }: Props) {
  const { locale } = await params;

  if (locale !== 'es') {
    notFound();
  }

  return (
    <div className="pt-20">
      <ServicesAccordion locale="es" />
    </div>
  );
}
