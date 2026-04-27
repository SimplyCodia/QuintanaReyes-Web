'use client';
import { useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Globe } from 'lucide-react';
import { navLinks } from '@/data/navigation';
import { Locale, t } from '@/lib/i18n';

interface MobileMenuProps {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  alternateUrl: string;
}

export function MobileMenu({
  locale,
  isOpen,
  onClose,
  currentPath,
  alternateUrl,
}: MobileMenuProps) {
  // Escape key closes menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Compute active nav id
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

  const router = useRouter();
  const contactHref = locale === 'es' ? '/es/contacto' : '/en/contact';

  const handleLanguageSwitch = useCallback(() => {
    onClose();
    router.push(alternateUrl, { scroll: false });
  }, [alternateUrl, router, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isOpen}
      >
        {/* Blurred overlay */}
        <div
          className="absolute inset-0 bg-[#0E0E0E]/60 backdrop-blur-sm"
          onClick={onClose}
          aria-label={t(locale, 'Cerrar menú', 'Close menu')}
        />

        {/* Drawer panel */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white flex flex-col transition-transform duration-500 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label={t(locale, 'Menú de navegación', 'Navigation menu')}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E6E6E6]">
            <Link
              href={locale === 'es' ? '/es' : '/en'}
              onClick={onClose}
              aria-label="Quintana Reyes & Asociados"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo/logo_qr_asociados-dorado.webp"
                alt="Quintana Reyes & Asociados"
                className="h-9 w-auto object-contain brightness-0"
              />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 border border-[#E6E6E6] hover:border-[#C9A449] transition-colors duration-200 text-[#1C1C1C] hover:text-[#C9A449]"
              aria-label={t(locale, 'Cerrar menú', 'Close menu')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav
            className="flex-1 flex flex-col justify-center px-8 py-8 overflow-y-auto"
            aria-label={t(locale, 'Navegación móvil', 'Mobile navigation')}
          >
            <ul className="space-y-2">
              {navLinks.map((link, i) => {
                const href = locale === 'es' ? link.hrefEs : link.hrefEn;
                const label = locale === 'es' ? link.labelEs : link.labelEn;
                const isActive = activeNavId === link.id;
                return (
                  <li key={link.id}>
                    <Link
                      href={href}
                      onClick={onClose}
                      className={`block font-serif text-3xl sm:text-4xl leading-tight py-3 transition-colors duration-200 ${
                        isActive
                          ? 'text-[#C9A449]'
                          : 'text-[#0E0E0E] hover:text-[#C9A449]'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                      style={{ transitionDelay: `${i * 50}ms` }}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom section */}
          <div className="px-8 pb-8 border-t border-[#E6E6E6] pt-6 space-y-5">
            {/* Language switcher */}
            <button
              type="button"
              onClick={handleLanguageSwitch}
              className="flex items-center gap-2 font-sans text-sm font-semibold tracking-widest uppercase text-[#6B6B6B] hover:text-[#C9A449] transition-colors duration-200"
              aria-label={t(locale, 'Cambiar a inglés', 'Switch to Spanish')}
            >
              <Globe className="w-4 h-4" />
              {locale === 'es' ? 'English' : 'Español'}
            </button>

            {/* CTA button */}
            <Link
              href={contactHref}
              onClick={onClose}
              className="flex items-center justify-center bg-[#C9A449] text-[#0E0E0E] hover:bg-[#8C6F2A] hover:text-white transition-colors duration-300 px-8 py-4 font-sans text-sm tracking-widest uppercase font-semibold w-full"
            >
              {t(locale, 'Consulta Privada', 'Private Consultation')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
