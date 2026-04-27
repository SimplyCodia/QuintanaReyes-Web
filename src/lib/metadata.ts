import type { Metadata } from 'next';
import { Locale } from './i18n';
import { seoData, BASE_URL } from '@/data/seo';

type PageKey = keyof typeof seoData;

export function generatePageMetadata(page: PageKey, locale: Locale, path: string): Metadata {
  const data = seoData[page][locale];

  // Build alternate paths
  const alternateMap: Record<string, Record<string, string>> = {
    home: { es: '/es', en: '/en' },
    about: { es: '/es/nosotros', en: '/en/about' },
    services: { es: '/es/servicios', en: '/en/services' },
    contact: { es: '/es/contacto', en: '/en/contact' },
    blog: { es: '/es/blog', en: '/en/blog' },
  };

  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: `${BASE_URL}${path}`,
      languages: {
        es: `${BASE_URL}${alternateMap[page].es}`,
        en: `${BASE_URL}${alternateMap[page].en}`,
      },
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `${BASE_URL}${path}`,
      siteName: locale === 'es' ? 'Quintana Reyes & Asociados' : 'Quintana Reyes & Associates',
      locale: locale === 'es' ? 'es_PA' : 'en_US',
      type: 'website',
      images: [{ url: `${BASE_URL}/images/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: [`${BASE_URL}/images/og-image.png`],
    },
  };
}
