import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';
import { PrivacyPolicy } from '@/components/sections/PrivacyPolicy';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata() {
  return {
    title: 'Privacy Policy | Quintana Reyes & Asociados',
    description: 'Privacy policy and personal data protection of Quintana Reyes & Asociados.',
  };
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  return (
    <div className="pt-20">
      <PrivacyPolicy locale={locale as Locale} />
    </div>
  );
}
