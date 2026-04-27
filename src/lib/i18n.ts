export type Locale = 'es' | 'en';

export const locales: Locale[] = ['es', 'en'];
export const defaultLocale: Locale = 'es';

export function t(locale: Locale, es: string, en: string): string {
  return locale === 'es' ? es : en;
}

// Map Spanish routes to English equivalents and vice versa
export const routeMap: Record<string, Record<Locale, string>> = {
  home: { es: '/es', en: '/en' },
  about: { es: '/es/nosotros', en: '/en/about' },
  services: { es: '/es/servicios', en: '/en/services' },
  blog: { es: '/es/blog', en: '/en/blog' },
  contact: { es: '/es#contacto', en: '/en#contacto' },
};

// Get the page key from a path segment
export function getPageKeyFromPath(path: string): string {
  const map: Record<string, string> = {
    '': 'home',
    nosotros: 'about',
    about: 'about',
    servicios: 'services',
    services: 'services',
    blog: 'blog',
    contacto: 'contact',
    contact: 'contact',
  };
  return map[path] || 'home';
}

// Get the alternate locale URL for language switcher
export function getAlternateUrl(currentPath: string, currentLocale: Locale): string {
  const targetLocale = currentLocale === 'es' ? 'en' : 'es';
  // Extract the page segment after /es/ or /en/
  const segments = currentPath.split('/').filter(Boolean);
  const pageSegment = segments[1] || '';
  const pageKey = getPageKeyFromPath(pageSegment);
  return routeMap[pageKey]?.[targetLocale] || `/${targetLocale}`;
}
