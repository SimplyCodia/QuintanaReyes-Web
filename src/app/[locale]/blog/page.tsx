import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/metadata';
import { locales, type Locale } from '@/lib/i18n';
import { BlogList } from '@/components/sections/BlogList';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  return generatePageMetadata('blog', locale as Locale, `/${locale}/blog`);
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  return <BlogList locale={locale as Locale} />;
}
