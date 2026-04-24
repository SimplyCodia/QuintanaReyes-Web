'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/SvgIcons';
import { practiceAreas } from '@/data/services';
import { Locale, t } from '@/lib/i18n';
import { FadeIn } from '@/components/ui/FadeIn';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';

interface ServicesAccordionProps {
  locale: Locale;
}

export function ServicesAccordion({ locale }: ServicesAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-[#FAFAF7] min-h-screen">
      <div className="container mx-auto px-6 max-w-[1280px] py-24">
        <FadeIn>
          <SectionEyebrow>
            {t(locale, 'Especialidades', 'Specialties')}
          </SectionEyebrow>
          <SectionTitle>
            {t(locale, 'Servicios Legales', 'Legal Services')}
          </SectionTitle>
          <p className="font-sans text-lg text-[#6B6B6B] max-w-2xl mb-16">
            {t(
              locale,
              'Nuestra firma abarca un espectro completo de servicios legales, diseñados para proteger sus intereses con rigor y estrategia.',
              'Our firm covers a complete spectrum of legal services, designed to protect your interests with rigor and strategy.'
            )}
          </p>
        </FadeIn>

        <div className="space-y-4">
          {practiceAreas.map((area, i) => {
            const isOpen = openIndex === i;
            const title = locale === 'es' ? area.titleEs : area.titleEn;
            const desc = locale === 'es' ? area.descEs : area.descEn;
            const whatsappUrl =
              locale === 'es' ? area.whatsappLinkEs : area.whatsappLinkEn;

            return (
              <FadeIn key={area.num} delay={i * 60}>
                <div
                  className={`bg-white border transition-colors duration-300 ${
                    isOpen
                      ? 'border-[#C9A449]'
                      : 'border-[#E6E6E6] hover:border-[#C9A449]'
                  }`}
                >
                  {/* Header */}
                  <button
                    type="button"
                    onClick={() => toggleItem(i)}
                    className="w-full flex items-center justify-between gap-4 p-6 sm:p-8 text-left group"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-5 sm:gap-8 flex-1 min-w-0">
                      <span
                        className={`font-serif text-xl sm:text-2xl italic flex-shrink-0 transition-colors duration-300 ${
                          isOpen ? 'text-[#C9A449]' : 'text-[#C9A449]/40'
                        }`}
                      >
                        {area.num}.
                      </span>
                      <h3
                        className={`font-serif text-xl sm:text-2xl transition-colors duration-300 ${
                          isOpen
                            ? 'text-[#0E0E0E]'
                            : 'text-[#0E0E0E] group-hover:text-[#C9A449]'
                        }`}
                      >
                        {title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                      <span
                        className={`hidden sm:block font-sans text-xs tracking-[0.15em] uppercase font-semibold transition-colors duration-300 ${
                          isOpen ? 'text-[#C9A449]' : 'text-[#6B6B6B]'
                        }`}
                      >
                        {isOpen
                          ? t(locale, 'Ocultar Detalles', 'Hide Details')
                          : t(locale, 'Ver Detalles', 'View Details')}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${
                          isOpen
                            ? 'rotate-180 text-[#C9A449]'
                            : 'text-[#6B6B6B]'
                        }`}
                      />
                    </div>
                  </button>

                  {/* Expandable content */}
                  {isOpen && (
                    <div className="px-6 sm:px-8 pb-8 pt-0 sm:pl-[calc(2rem+2.5rem+2rem)]">
                      <div className="h-px w-full bg-[#E6E6E6] mb-6" />
                      <p className="font-sans text-base text-[#6B6B6B] leading-[1.8] mb-8 max-w-3xl">
                        {desc}
                      </p>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-[#25D366] text-white hover:bg-[#1da851] transition-colors duration-300 px-6 py-3.5 font-sans text-sm tracking-widest uppercase font-semibold"
                      >
                        <WhatsAppIcon className="w-5 h-5" />
                        {t(
                          locale,
                          'Contactar por WhatsApp',
                          'Contact on WhatsApp'
                        )}
                      </a>
                    </div>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
