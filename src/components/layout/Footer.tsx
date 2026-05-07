'use client';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { TikTokIcon, FacebookIcon, InstagramIcon } from '@/components/ui/SvgIcons';
import { navLinks } from '@/data/navigation';
import { practiceAreas } from '@/data/services';
import { Locale, t } from '@/lib/i18n';

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const year = 2026;

  return (
    <footer className="bg-[#0E0E0E]">
      {/* Main footer grid */}
      <div className="container mx-auto px-6 max-w-[1280px] py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Logo + description */}
          <div className="lg:col-span-1">
            <Link
              href={locale === 'es' ? '/es' : '/en'}
              className="inline-block mb-6"
              aria-label="Quintana Reyes & Asociados"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo/logo_qr_asociados-dorado.webp"
                alt="Quintana Reyes & Asociados"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="font-sans text-sm text-white/60 leading-relaxed mb-6">
              {t(
                locale,
                'Firma legal panameña comprometida con la excelencia jurídica, la ética profesional y la estrategia al servicio de sus clientes.',
                'Panamanian law firm committed to legal excellence, professional ethics, and strategy in service of our clients.'
              )}
            </p>
            {/* Social media */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/p/Quintana-Reyes-Asociados-100063661835449/?locale=es_LA"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/50 hover:border-[#C9A449] hover:text-[#C9A449] transition-colors duration-300"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/abogados_quintanareyes/?hl=es"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/50 hover:border-[#C9A449] hover:text-[#C9A449] transition-colors duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@abogados_quintanareyes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/50 hover:border-[#C9A449] hover:text-[#C9A449] transition-colors duration-300"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="font-sans text-xs text-[#C9A449] tracking-[0.2em] uppercase font-semibold mb-6">
              {t(locale, 'Navegación', 'Navigation')}
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => {
                const href = locale === 'es' ? link.hrefEs : link.hrefEn;
                const label = locale === 'es' ? link.labelEs : link.labelEn;
                return (
                  <li key={link.id}>
                    <Link
                      href={href}
                      className="font-sans text-sm text-white/60 hover:text-[#C9A449] transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="font-sans text-xs text-[#C9A449] tracking-[0.2em] uppercase font-semibold mb-6">
              {t(locale, 'Servicios', 'Services')}
            </h3>
            <ul className="space-y-3">
              {practiceAreas.map((area) => {
                const title = locale === 'es' ? area.titleEs : area.titleEn;
                const servicesHref =
                  locale === 'es' ? '/es/servicios' : '/en/services';
                return (
                  <li key={area.num}>
                    <Link
                      href={servicesHref}
                      className="font-sans text-sm text-white/60 hover:text-[#C9A449] transition-colors duration-200"
                    >
                      {title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 4: Contact info */}
          <div>
            <h3 className="font-sans text-xs text-[#C9A449] tracking-[0.2em] uppercase font-semibold mb-6">
              {t(locale, 'Contacto', 'Contact')}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C9A449] flex-shrink-0 mt-0.5" />
                <span className="font-sans text-sm text-white/60 leading-relaxed">
                  {t(
                    locale,
                    'Obarrio, Ciudad de Panamá, PH Twist Tower, piso 27, oficina 27H',
                    'Obarrio, Panama City, PH Twist Tower, 27th floor, office 27H'
                  )}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C9A449] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-sans text-sm text-white/60">
                    <a href="tel:+50762810554" className="hover:text-[#C9A449] transition-colors">+507 6281-0554</a>
                    {' | '}
                    <a href="tel:+50766069100" className="hover:text-[#C9A449] transition-colors">+507 6606-9100</a>
                  </p>
                  <p className="font-sans text-sm text-white/40">373-6404</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C9A449] flex-shrink-0" />
                <a
                  href="mailto:info@quintanareyesabogados.com"
                  className="font-sans text-sm text-white/60 hover:text-[#C9A449] transition-colors duration-200"
                >
                  info@quintanareyesabogados.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C9A449] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-sans text-sm text-white/60">
                    {t(
                      locale,
                      'Lun – Vie: 8:00 AM – 6:00 PM',
                      'Mon – Fri: 8:00 AM – 6:00 PM'
                    )}
                  </p>
                  <p className="font-sans text-sm text-white/40">
                    {t(
                      locale,
                      'Sáb: 9:00 AM – 1:00 PM',
                      'Sat: 9:00 AM – 1:00 PM'
                    )}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 max-w-[1280px] py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-sans text-xs text-white/40 text-center sm:text-left">
              {t(
                locale,
                `© ${year} Quintana Reyes & Asociados. Todos los derechos reservados.`,
                `© ${year} Quintana Reyes & Associates. All rights reserved.`
              )}
            </p>
            <p className="font-sans text-xs text-white/40 text-center">
              {t(locale, 'Hecho por', 'Made by')}{' '}
              <a
                href="https://simplycodia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#C9A449] transition-colors duration-200"
              >
                SimplyCodia
              </a>
            </p>
            <div className="flex items-center gap-6">
              <Link
                href={locale === 'es' ? '/es/politica-de-privacidad' : '/en/privacy-policy'}
                className="font-sans text-xs text-white/40 hover:text-white/70 transition-colors duration-200"
              >
                {t(locale, 'Política de privacidad', 'Privacy policy')}
              </Link>
              <Link
                href={locale === 'es' ? '/es/aviso-legal' : '/en/legal-notice'}
                className="font-sans text-xs text-white/40 hover:text-white/70 transition-colors duration-200"
              >
                {t(locale, 'Aviso legal', 'Legal notice')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
