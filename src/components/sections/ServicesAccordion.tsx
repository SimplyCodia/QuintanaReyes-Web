'use client';
import { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/SvgIcons';
import { practiceAreas } from '@/data/services';
import { Locale, t } from '@/lib/i18n';

interface ServicesAccordionProps {
  locale: Locale;
}

export function ServicesAccordion({ locale }: ServicesAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="border-t border-[#E6E6E6]">
      {practiceAreas.map((area, i) => {
        const isOpen = openIndex === i;
        const title = locale === 'es' ? area.titleEs : area.titleEn;
        const desc = locale === 'es' ? area.descEs : area.descEn;
        const whatsappUrl = locale === 'es' ? area.whatsappLinkEs : area.whatsappLinkEn;

        return (
          <div key={area.num} className="border-b border-[#E6E6E6]">
            {/* Header */}
            <button
              type="button"
              onClick={() => toggleItem(i)}
              className="w-full flex items-center justify-between gap-4 py-7 px-0 text-left group"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-6 sm:gap-8 flex-1 min-w-0">
                {/* Roman numeral */}
                <span
                  className={`font-serif text-xl sm:text-2xl flex-shrink-0 transition-colors duration-300 ${
                    isOpen ? 'text-[#C9A449]' : 'text-[#E6E6E6]'
                  }`}
                >
                  {area.num}
                </span>

                {/* Title */}
                <h3
                  className={`font-serif text-xl sm:text-2xl transition-colors duration-300 ${
                    isOpen ? 'text-[#C9A449]' : 'text-[#0E0E0E] group-hover:text-[#C9A449]'
                  }`}
                >
                  {title}
                </h3>
              </div>

              <div className="flex items-center gap-4 sm:gap-8 flex-shrink-0">
                {/* "Ver Detalles" label — hidden on mobile */}
                <span
                  className={`hidden sm:block font-sans text-xs tracking-[0.15em] uppercase font-semibold transition-colors duration-300 ${
                    isOpen ? 'text-[#C9A449]' : 'text-[#6B6B6B]'
                  }`}
                >
                  {isOpen
                    ? t(locale, 'Ocultar', 'Hide')
                    : t(locale, 'Ver Detalles', 'View Details')}
                </span>

                {/* Chevron icon */}
                <div
                  className={`w-8 h-8 border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isOpen
                      ? 'border-[#C9A449] bg-[#C9A449] rotate-180'
                      : 'border-[#E6E6E6] group-hover:border-[#C9A449]'
                  }`}
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-colors duration-300 ${
                      isOpen ? 'text-[#0E0E0E]' : 'text-[#6B6B6B]'
                    }`}
                  />
                </div>
              </div>
            </button>

            {/* Expandable content */}
            <AccordionContent isOpen={isOpen}>
              <div className="pb-8 pl-0 sm:pl-[calc(1.5rem+2rem+2rem)]">
                <p className="font-sans text-base text-[#6B6B6B] leading-relaxed mb-6 max-w-3xl">
                  {desc}
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#25D366] text-white hover:bg-[#1da851] transition-colors duration-300 px-6 py-3 font-sans text-sm tracking-widest uppercase font-semibold"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  {t(locale, 'Contactar por WhatsApp', 'Contact on WhatsApp')}
                </a>
              </div>
            </AccordionContent>
          </div>
        );
      })}
    </div>
  );
}

// Smooth animated accordion content
function AccordionContent({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="overflow-hidden transition-all duration-500 ease-in-out"
      style={{
        maxHeight: isOpen
          ? contentRef.current
            ? `${contentRef.current.scrollHeight}px`
            : '500px'
          : '0px',
        opacity: isOpen ? 1 : 0,
      }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
