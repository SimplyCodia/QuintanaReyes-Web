import { describe, it, expect } from 'vitest';
import { seoData, BASE_URL } from '@/data/seo';

describe('seoData', () => {
  it('has entries for home, about, services, and contact', () => {
    expect(seoData).toHaveProperty('home');
    expect(seoData).toHaveProperty('about');
    expect(seoData).toHaveProperty('services');
    expect(seoData).toHaveProperty('contact');
  });

  it('each entry has es and en variants', () => {
    const pages = ['home', 'about', 'services', 'contact'] as const;
    pages.forEach((page) => {
      expect(seoData[page]).toHaveProperty('es');
      expect(seoData[page]).toHaveProperty('en');
    });
  });

  it('each variant has title and description', () => {
    const pages = ['home', 'about', 'services', 'contact'] as const;
    const locales = ['es', 'en'] as const;
    pages.forEach((page) => {
      locales.forEach((locale) => {
        expect(seoData[page][locale]).toHaveProperty('title');
        expect(seoData[page][locale]).toHaveProperty('description');
      });
    });
  });

  it('all titles and descriptions are non-empty strings', () => {
    const pages = ['home', 'about', 'services', 'contact'] as const;
    const locales = ['es', 'en'] as const;
    pages.forEach((page) => {
      locales.forEach((locale) => {
        const data = seoData[page][locale];
        expect(typeof data.title).toBe('string');
        expect(data.title.length).toBeGreaterThan(0);
        expect(typeof data.description).toBe('string');
        expect(data.description.length).toBeGreaterThan(0);
      });
    });
  });

  it('Spanish titles contain Spanish firm name', () => {
    const pages = ['home', 'about', 'services', 'contact'] as const;
    pages.forEach((page) => {
      expect(seoData[page].es.title).toContain('Quintana Reyes');
    });
  });

  it('English titles contain English firm name', () => {
    const pages = ['home', 'about', 'services', 'contact'] as const;
    pages.forEach((page) => {
      expect(seoData[page].en.title).toContain('Quintana Reyes');
    });
  });

  it('Spanish and English titles are different for each page', () => {
    const pages = ['home', 'about', 'services', 'contact'] as const;
    pages.forEach((page) => {
      expect(seoData[page].es.title).not.toBe(seoData[page].en.title);
    });
  });
});

describe('BASE_URL', () => {
  it('is defined', () => {
    expect(BASE_URL).toBeDefined();
  });

  it('is a non-empty string', () => {
    expect(typeof BASE_URL).toBe('string');
    expect(BASE_URL.length).toBeGreaterThan(0);
  });

  it('is a valid URL starting with https://', () => {
    expect(BASE_URL).toMatch(/^https:\/\//);
  });

  it('equals the production domain', () => {
    expect(BASE_URL).toBe('https://quintanareyesabogados.com');
  });
});
