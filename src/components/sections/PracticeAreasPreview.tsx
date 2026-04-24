'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { practiceAreas } from '@/data/services';
import { Locale, t } from '@/lib/i18n';

interface PracticeAreasPreviewProps {
  locale: Locale;
}

export function PracticeAreasPreview({ locale }: PracticeAreasPreviewProps) {
  const servicesHref = locale === 'es' ? '/es/servicios' : '/en/services';

  return (
    <section className="bg-white py-20 sm:py-28 border-t border-[#E6E6E6]">
      <div className="container mx-auto px-6 max-w-[1280px]">
        {/* Header */}
        <FadeIn className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
          <div>
            <SectionEyebrow>
              {t(locale, 'Áreas de Práctica', 'Practice Areas')}
            </SectionEyebrow>
            <SectionTitle>
              {t(
                locale,
                'Soluciones legales integrales',
                'Comprehensive legal solutions'
              )}
            </SectionTitle>
          </div>
          <Link
            href={servicesHref}
            className="flex-shrink-0 flex items-center gap-2 font-sans text-sm tracking-widest uppercase font-semibold text-[#C9A449] hover:text-[#8C6F2A] transition-colors duration-300 group"
          >
            {t(locale, 'Ver todos', 'View all')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </FadeIn>

        {/* Grid */}
        <div className="border-t border-l border-[#E6E6E6]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {practiceAreas.map((area, i) => {
              const isLast = i === practiceAreas.length - 1;
              const title = locale === 'es' ? area.titleEs : area.titleEn;
              const desc = locale === 'es' ? area.descEs : area.descEn;
              const whatsappUrl = locale === 'es' ? area.whatsappLinkEs : area.whatsappLinkEn;

              return (
                <FadeIn
                  key={area.num}
                  delay={Math.min(i * 80, 400)}
                  className={`border-b border-r border-[#E6E6E6] ${
                    isLast ? 'lg:col-span-1 sm:col-span-2 lg:col-start-1' : ''
                  }`}
                >
                  <div className="p-8 h-full group hover:bg-[#FAFAF7] transition-colors duration-300">
                    {/* Roman numeral */}
                    <span className="font-serif text-4xl text-[#E6E6E6] group-hover:text-[#C9A449]/20 transition-colors duration-300 block mb-4">
                      {area.num}
                    </span>
                    {/* Title */}
                    <h3 className="font-serif text-xl text-[#0E0E0E] mb-3 group-hover:text-[#0E0E0E] transition-colors duration-300">
                      {title}
                    </h3>
                    {/* Description */}
                    <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed mb-6 line-clamp-3">
                      {desc}
                    </p>
                    {/* Link */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase font-semibold text-[#C9A449] hover:text-[#8C6F2A] transition-colors duration-300 group/link"
                    >
                      {t(locale, 'Conocer más', 'Learn more')}
                      <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform duration-300" />
                    </a>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
