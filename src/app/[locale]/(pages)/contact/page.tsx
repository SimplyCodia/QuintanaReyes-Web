import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/metadata';
import { locales, type Locale } from '@/lib/i18n';
import { ContactSection } from '@/components/sections/ContactSection';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'en') notFound();
  return generatePageMetadata('contact', 'en', '/en/contact');
}

export function generateStaticParams() {
  return [{ locale: 'en' }];
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;

  if (locale !== 'en') {
    notFound();
  }

  return (
    <div className="pt-20">
      <ContactSection locale="en" />
    </div>
  );
}
