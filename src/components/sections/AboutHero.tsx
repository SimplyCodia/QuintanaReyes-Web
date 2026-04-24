'use client';
import { FadeIn } from '@/components/ui/FadeIn';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { Locale, t } from '@/lib/i18n';

interface AboutHeroProps {
  locale: Locale;
}

export function AboutHero({ locale }: AboutHeroProps) {
  return (
    <section className="bg-[#FAFAF7] pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="container mx-auto px-6 max-w-[1280px]">
        <FadeIn className="text-center max-w-4xl mx-auto">
          <SectionEyebrow>
            {t(locale, 'Sobre Nosotros', 'About Us')}
          </SectionEyebrow>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#0E0E0E] leading-[1.15] mb-8">
            {t(
              locale,
              'Experiencia, ética y estrategia',
              'Experience, ethics, and strategy'
            )}
          </h1>

          {/* Gold line */}
          <div className="w-16 h-px bg-[#C9A449] mx-auto mb-8" />

          <p className="font-sans text-base sm:text-lg text-[#6B6B6B] leading-relaxed max-w-2xl mx-auto">
            {t(
              locale,
              'Somos una firma legal panameña con presencia en Obarrio, Ciudad de Panamá, comprometida con brindar asesoría jurídica de excelencia a personas naturales, empresas e instituciones.',
              'We are a Panamanian law firm based in Obarrio, Panama City, committed to providing excellent legal advice to individuals, businesses, and institutions.'
            )}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
