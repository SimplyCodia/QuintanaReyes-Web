import { describe, it, expect } from 'vitest';
import { t, getPageKeyFromPath, getAlternateUrl } from '@/lib/i18n';

describe('t()', () => {
  it('returns Spanish string when locale is es', () => {
    expect(t('es', 'Hola', 'Hello')).toBe('Hola');
  });

  it('returns English string when locale is en', () => {
    expect(t('en', 'Hola', 'Hello')).toBe('Hello');
  });

  it('returns Spanish for various strings', () => {
    expect(t('es', 'Servicios', 'Services')).toBe('Servicios');
    expect(t('es', 'Contacto', 'Contact')).toBe('Contacto');
  });

  it('returns English for various strings', () => {
    expect(t('en', 'Servicios', 'Services')).toBe('Services');
    expect(t('en', 'Contacto', 'Contact')).toBe('Contact');
  });
});

describe('getPageKeyFromPath()', () => {
  it('maps empty string to home', () => {
    expect(getPageKeyFromPath('')).toBe('home');
  });

  it('maps nosotros to about', () => {
    expect(getPageKeyFromPath('nosotros')).toBe('about');
  });

  it('maps about to about', () => {
    expect(getPageKeyFromPath('about')).toBe('about');
  });

  it('maps servicios to services', () => {
    expect(getPageKeyFromPath('servicios')).toBe('services');
  });

  it('maps services to services', () => {
    expect(getPageKeyFromPath('services')).toBe('services');
  });

  it('maps contacto to contact', () => {
    expect(getPageKeyFromPath('contacto')).toBe('contact');
  });

  it('maps contact to contact', () => {
    expect(getPageKeyFromPath('contact')).toBe('contact');
  });

  it('maps unknown slug to home', () => {
    expect(getPageKeyFromPath('unknown-page')).toBe('home');
    expect(getPageKeyFromPath('foobar')).toBe('home');
  });
});

describe('getAlternateUrl()', () => {
  it('returns /en/about when switching from /es/nosotros', () => {
    expect(getAlternateUrl('/es/nosotros', 'es')).toBe('/en/about');
  });

  it('returns /es/servicios when switching from /en/services', () => {
    expect(getAlternateUrl('/en/services', 'en')).toBe('/es/servicios');
  });

  it('returns /en when switching from /es (home)', () => {
    expect(getAlternateUrl('/es', 'es')).toBe('/en');
  });

  it('returns /es when switching from /en (home)', () => {
    expect(getAlternateUrl('/en', 'en')).toBe('/es');
  });

  it('returns /es#contacto when switching from /en/contact', () => {
    expect(getAlternateUrl('/en/contact', 'en')).toBe('/es#contacto');
  });

  it('returns /en/services when switching from /es/servicios', () => {
    expect(getAlternateUrl('/es/servicios', 'es')).toBe('/en/services');
  });

  it('returns /en#contacto when switching from /es/contacto', () => {
    expect(getAlternateUrl('/es/contacto', 'es')).toBe('/en#contacto');
  });

  it('returns /es/nosotros when switching from /en/about', () => {
    expect(getAlternateUrl('/en/about', 'en')).toBe('/es/nosotros');
  });
});
