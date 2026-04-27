'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe, Menu } from 'lucide-react';
import { navLinks } from '@/data/navigation';
import { Locale, t, getAlternateUrl } from '@/lib/i18n';
import { MobileMenu } from './MobileMenu';
import { useAlternateLinkValue } from './AlternateLinkContext';

interface HeaderProps {
  locale: Locale;
  currentPath: string;
}

export function Header({ locale, currentPath }: HeaderProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHomePage =
    currentPath === `/${locale}` ||
    currentPath === `/${locale}/` ||
    currentPath === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute active nav id from path
  const activeNavId = (() => {
    const segments = currentPath.split('/').filter(Boolean);
    const slug = segments[1] || '';
    if (!slug) return 'inicio';
    const map: Record<string, string> = {
      nosotros: 'nosotros',
      about: 'nosotros',
      servicios: 'servicios',
      services: 'servicios',
      blog: 'blog',
      contacto: 'contacto',
      contact: 'contacto',
    };
    return map[slug] || 'inicio';
  })();

  const transparent = isHomePage && !scrolled;
  const overrideAlternateUrl = useAlternateLinkValue();
  const alternateUrl = overrideAlternateUrl ?? getAlternateUrl(currentPath, locale);
  const contactHref = locale === 'es' ? '/es/contacto' : '/en/contact';

  const handleLanguageSwitch = useCallback(() => {
    router.push(alternateUrl, { scroll: false });
  }, [alternateUrl, router]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          transparent
            ? 'bg-transparent'
            : 'bg-white border-b border-[#E6E6E6] shadow-sm'
        }`}
      >
        <div className="container mx-auto px-6 max-w-[1280px]">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href={locale === 'es' ? '/es' : '/en'}
              className="flex-shrink-0 flex items-center"
              aria-label={t(locale, 'Quintana Reyes & Asociados — Inicio', 'Quintana Reyes & Asociados — Home')}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo/logo_qr_asociados-dorado.webp"
                alt="Quintana Reyes & Asociados"
                className={`h-20 w-auto object-contain transition-all duration-500 ${
                  transparent ? '' : 'brightness-0'
                }`}
              />
            </Link>

            {/* Desktop nav */}
            <nav
              className="hidden lg:flex items-center gap-8"
              aria-label={t(locale, 'Navegación principal', 'Main navigation')}
            >
              {navLinks.map((link) => {
                const href = locale === 'es' ? link.hrefEs : link.hrefEn;
                const label = locale === 'es' ? link.labelEs : link.labelEn;
                const isActive = activeNavId === link.id;
                return (
                  <Link
                    key={link.id}
                    href={href}
                    className={`font-sans text-sm font-medium tracking-wide transition-colors duration-200 relative group
                      ${
                        transparent
                          ? isActive
                            ? 'text-[#C9A449]'
                            : 'text-white hover:text-[#C9A449]'
                          : isActive
                          ? 'text-[#C9A449]'
                          : 'text-[#1C1C1C] hover:text-[#C9A449]'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {label}
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-[#C9A449] transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Language switcher */}
              <button
                type="button"
                onClick={handleLanguageSwitch}
                className={`flex items-center gap-1.5 font-sans text-xs font-semibold tracking-widest uppercase transition-colors duration-200 ${
                  transparent
                    ? 'text-white/70 hover:text-[#C9A449]'
                    : 'text-[#6B6B6B] hover:text-[#C9A449]'
                }`}
                aria-label={t(locale, 'Cambiar a inglés', 'Switch to Spanish')}
              >
                <Globe className="w-3.5 h-3.5" />
                {locale === 'es' ? 'EN' : 'ES'}
              </button>

              {/* CTA */}
              <Link
                href={contactHref}
                className="bg-[#C9A449] text-[#0E0E0E] hover:bg-[#8C6F2A] hover:text-white transition-colors duration-300 px-5 py-2.5 font-sans text-xs tracking-widest uppercase font-semibold"
              >
                {t(locale, 'Consulta Privada', 'Private Consultation')}
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className={`lg:hidden flex items-center justify-center w-10 h-10 transition-colors duration-200 ${
                transparent
                  ? 'text-white hover:text-[#C9A449]'
                  : 'text-[#1C1C1C] hover:text-[#C9A449]'
              }`}
              aria-label={t(locale, 'Abrir menú', 'Open menu')}
              aria-expanded={mobileOpen}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <MobileMenu
        locale={locale}
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        currentPath={currentPath}
        alternateUrl={alternateUrl}
      />
    </>
  );
}
