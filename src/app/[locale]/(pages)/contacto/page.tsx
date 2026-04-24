import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/metadata';
import { locales, type Locale } from '@/lib/i18n';
import { ContactSection } from '@/components/sections/ContactSection';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'es') notFound();
  return generatePageMetadata('contact', 'es', '/es/contacto');
}

export function generateStaticParams() {
  return [{ locale: 'es' }];
}

export default async function ContactoPage({ params }: Props) {
  const { locale } = await params;

  if (locale !== 'es') {
    notFound();
  }

  return (
    <div className="pt-20">
      <ContactSection locale="es" />
    </div>
  );
}
