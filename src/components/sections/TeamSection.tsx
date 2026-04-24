'use client';
import { FadeIn } from '@/components/ui/FadeIn';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { teamMembers } from '@/data/team';
import { Locale, t } from '@/lib/i18n';

interface TeamSectionProps {
  locale: Locale;
}

export function TeamSection({ locale }: TeamSectionProps) {
  return (
    <section className="bg-[#FAFAF7] py-20 sm:py-28">
      <div className="container mx-auto px-6 max-w-[1280px]">
        {/* Header */}
        <FadeIn className="mb-16">
          <SectionEyebrow>
            {t(locale, 'Nuestro Equipo', 'Our Team')}
          </SectionEyebrow>
          <SectionTitle>
            {t(
              locale,
              'Los profesionales detrás de cada caso',
              'The professionals behind every case'
            )}
          </SectionTitle>
          <p className="font-sans text-base text-[#6B6B6B] max-w-2xl leading-relaxed">
            {t(
              locale,
              'Contamos con un equipo multidisciplinario de abogados y asesores comprometidos con la excelencia y la ética en cada actuación.',
              'We have a multidisciplinary team of lawyers and advisors committed to excellence and ethics in every action.'
            )}
          </p>
        </FadeIn>

        {/* Team grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-16">
          {teamMembers.map((member, i) => (
            <FadeIn key={member.name} delay={i * 100}>
              <div className="group">
                {/* Photo */}
                <div className="relative overflow-hidden mb-5 aspect-[3/4] bg-[#E6E6E6]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.img}
                    alt={member.name}
                    className="absolute inset-0 w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                {/* Info */}
                <div>
                  <h3 className="font-serif text-lg text-[#0E0E0E] mb-1">
                    {member.name}
                  </h3>
                  <p className="font-sans text-xs text-[#C9A449] tracking-widest uppercase font-semibold mb-2">
                    {locale === 'es' ? member.roleEs : member.roleEn}
                  </p>
                  <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed">
                    {locale === 'es' ? member.descEs : member.descEn}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Associate team box */}
        <FadeIn>
          <div className="border border-[#E6E6E6] bg-white p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-px bg-[#C9A449]" />
              </div>
              <div>
                <p className="font-sans text-xs text-[#C9A449] tracking-[0.2em] uppercase font-semibold mb-2">
                  {t(locale, 'Equipo Asociado', 'Associate Team')}
                </p>
                <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed max-w-2xl">
                  {t(
                    locale,
                    'Contamos además con una red de abogados asociados y especialistas en diversas ramas del derecho, lo que nos permite brindar asesoría integral y multidisciplinaria en casos de mayor complejidad.',
                    'We also have a network of associate lawyers and specialists in various branches of law, allowing us to provide comprehensive and multidisciplinary advice in more complex cases.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
