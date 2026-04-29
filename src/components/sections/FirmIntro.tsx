'use client';
import { FadeIn } from '@/components/ui/FadeIn';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Locale, t } from '@/lib/i18n';

interface FirmIntroProps {
  locale: Locale;
}

export function FirmIntro({ locale }: FirmIntroProps) {
  return (
    <section className="bg-[#FAFAF7] py-20 sm:py-28">
      <div className="container mx-auto px-6 max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left column: eyebrow + title */}
          <div className="lg:col-span-5">
            <FadeIn>
              <SectionEyebrow>
                {t(locale, 'La Firma', 'The Firm')}
              </SectionEyebrow>
              <SectionTitle>
                {t(
                  locale,
                  'Compromiso jurídico al más alto nivel',
                  'Legal commitment at the highest level'
                )}
              </SectionTitle>
            </FadeIn>
          </div>

          {/* Right column: description */}
          <div className="lg:col-span-7">
            <FadeIn delay={150}>
              <p className="font-sans text-base sm:text-lg text-[#6B6B6B] leading-relaxed mb-6">
                {t(
                  locale,
                  'Quintana Reyes & Asociados es una firma legal panameña con sede en Ciudad de Panamá. Fundada sobre los principios de excelencia jurídica, ética profesional y orientación estratégica, ofrecemos asesoría y representación legal de alta calidad en diversas áreas del derecho.',
                  'Quintana Reyes & Asociados is a Panamanian law firm headquartered in Panama City. Founded on the principles of legal excellence, professional ethics, and strategic guidance, we offer high-quality legal advice and representation across various areas of law.'
                )}
              </p>
              <p className="font-sans text-base sm:text-lg text-[#6B6B6B] leading-relaxed mb-6">
                {t(
                  locale,
                  'Nuestro equipo de abogados combina décadas de experiencia con un profundo conocimiento del sistema jurídico panameño e internacional, garantizando soluciones efectivas y personalizadas para cada cliente.',
                  'Our team of lawyers combines decades of experience with deep knowledge of the Panamanian and international legal systems, ensuring effective and personalized solutions for every client.'
                )}
              </p>
              {/* Decorative gold line */}
              <div className="w-16 h-px bg-[#C9A449] mt-8" />
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
