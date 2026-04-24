import { describe, it, expect } from 'vitest';
import { generatePageMetadata } from '@/lib/metadata';
import { seoData, BASE_URL } from '@/data/seo';

describe('generatePageMetadata()', () => {
  describe('title', () => {
    it('returns correct title for home/es', () => {
      const metadata = generatePageMetadata('home', 'es', '/es');
      expect(metadata.title).toBe(seoData.home.es.title);
    });

    it('returns correct title for home/en', () => {
      const metadata = generatePageMetadata('home', 'en', '/en');
      expect(metadata.title).toBe(seoData.home.en.title);
    });

    it('returns correct title for about/es', () => {
      const metadata = generatePageMetadata('about', 'es', '/es/nosotros');
      expect(metadata.title).toBe(seoData.about.es.title);
    });

    it('returns correct title for about/en', () => {
      const metadata = generatePageMetadata('about', 'en', '/en/about');
      expect(metadata.title).toBe(seoData.about.en.title);
    });

    it('returns correct title for services/es', () => {
      const metadata = generatePageMetadata('services', 'es', '/es/servicios');
      expect(metadata.title).toBe(seoData.services.es.title);
    });

    it('returns correct title for services/en', () => {
      const metadata = generatePageMetadata('services', 'en', '/en/services');
      expect(metadata.title).toBe(seoData.services.en.title);
    });

    it('returns correct title for contact/es', () => {
      const metadata = generatePageMetadata('contact', 'es', '/es/contacto');
      expect(metadata.title).toBe(seoData.contact.es.title);
    });

    it('returns correct title for contact/en', () => {
      const metadata = generatePageMetadata('contact', 'en', '/en/contact');
      expect(metadata.title).toBe(seoData.contact.en.title);
    });
  });

  describe('description', () => {
    it('returns correct description for home/es', () => {
      const metadata = generatePageMetadata('home', 'es', '/es');
      expect(metadata.description).toBe(seoData.home.es.description);
    });

    it('returns correct description for home/en', () => {
      const metadata = generatePageMetadata('home', 'en', '/en');
      expect(metadata.description).toBe(seoData.home.en.description);
    });

    it('returns correct description for services/es', () => {
      const metadata = generatePageMetadata('services', 'es', '/es/servicios');
      expect(metadata.description).toBe(seoData.services.es.description);
    });
  });

  describe('canonical URL', () => {
    it('returns correct canonical for home/es', () => {
      const metadata = generatePageMetadata('home', 'es', '/es');
      expect(metadata.alternates?.canonical).toBe(`${BASE_URL}/es`);
    });

    it('returns correct canonical for about/en', () => {
      const metadata = generatePageMetadata('about', 'en', '/en/about');
      expect(metadata.alternates?.canonical).toBe(`${BASE_URL}/en/about`);
    });

    it('returns correct canonical for services/es', () => {
      const metadata = generatePageMetadata('services', 'es', '/es/servicios');
      expect(metadata.alternates?.canonical).toBe(`${BASE_URL}/es/servicios`);
    });

    it('returns correct canonical for contact/en', () => {
      const metadata = generatePageMetadata('contact', 'en', '/en/contact');
      expect(metadata.alternates?.canonical).toBe(`${BASE_URL}/en/contact`);
    });
  });

  describe('alternates with both languages', () => {
    it('includes both es and en language alternates for home', () => {
      const metadata = generatePageMetadata('home', 'es', '/es');
      const languages = metadata.alternates?.languages as Record<string, string>;
      expect(languages).toBeDefined();
      expect(languages['es']).toBe(`${BASE_URL}/es`);
      expect(languages['en']).toBe(`${BASE_URL}/en`);
    });

    it('includes both es and en language alternates for about', () => {
      const metadata = generatePageMetadata('about', 'en', '/en/about');
      const languages = metadata.alternates?.languages as Record<string, string>;
      expect(languages).toBeDefined();
      expect(languages['es']).toBe(`${BASE_URL}/es/nosotros`);
      expect(languages['en']).toBe(`${BASE_URL}/en/about`);
    });

    it('includes both es and en language alternates for services', () => {
      const metadata = generatePageMetadata('services', 'es', '/es/servicios');
      const languages = metadata.alternates?.languages as Record<string, string>;
      expect(languages['es']).toBe(`${BASE_URL}/es/servicios`);
      expect(languages['en']).toBe(`${BASE_URL}/en/services`);
    });

    it('includes both es and en language alternates for contact', () => {
      const metadata = generatePageMetadata('contact', 'en', '/en/contact');
      const languages = metadata.alternates?.languages as Record<string, string>;
      expect(languages['es']).toBe(`${BASE_URL}/es/contacto`);
      expect(languages['en']).toBe(`${BASE_URL}/en/contact`);
    });
  });

  describe('OpenGraph data', () => {
    it('returns openGraph object with title and description', () => {
      const metadata = generatePageMetadata('home', 'es', '/es');
      expect(metadata.openGraph).toBeDefined();
      expect(metadata.openGraph?.title).toBe(seoData.home.es.title);
      expect(metadata.openGraph?.description).toBe(seoData.home.es.description);
    });

    it('returns openGraph url equal to canonical', () => {
      const metadata = generatePageMetadata('about', 'es', '/es/nosotros');
      expect(metadata.openGraph?.url).toBe(`${BASE_URL}/es/nosotros`);
    });

    it('returns openGraph siteName in Spanish for es locale', () => {
      const metadata = generatePageMetadata('home', 'es', '/es');
      expect(metadata.openGraph?.siteName).toBe('Quintana Reyes & Asociados');
    });

    it('returns openGraph siteName in English for en locale', () => {
      const metadata = generatePageMetadata('home', 'en', '/en');
      expect(metadata.openGraph?.siteName).toBe('Quintana Reyes & Associates');
    });

    it('returns openGraph type as website', () => {
      const metadata = generatePageMetadata('services', 'en', '/en/services');
      expect(metadata.openGraph?.type).toBe('website');
    });

    it('returns openGraph images array with og-image', () => {
      const metadata = generatePageMetadata('contact', 'es', '/es/contacto');
      const images = metadata.openGraph?.images as Array<{ url: string }>;
      expect(images).toBeDefined();
      expect(images[0].url).toBe(`${BASE_URL}/images/og-image.jpg`);
    });
  });

  describe('Twitter card data', () => {
    it('returns twitter card as summary_large_image', () => {
      const metadata = generatePageMetadata('home', 'es', '/es');
      expect(metadata.twitter?.card).toBe('summary_large_image');
    });

    it('returns twitter title matching page title', () => {
      const metadata = generatePageMetadata('about', 'en', '/en/about');
      expect(metadata.twitter?.title).toBe(seoData.about.en.title);
    });

    it('returns twitter description matching page description', () => {
      const metadata = generatePageMetadata('services', 'es', '/es/servicios');
      expect(metadata.twitter?.description).toBe(seoData.services.es.description);
    });

    it('returns twitter images array with og-image', () => {
      const metadata = generatePageMetadata('contact', 'en', '/en/contact');
      const images = metadata.twitter?.images as string[];
      expect(images).toBeDefined();
      expect(images[0]).toBe(`${BASE_URL}/images/og-image.jpg`);
    });
  });
});
