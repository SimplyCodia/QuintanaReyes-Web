'use client';
import { Scale, Shield, Target } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Locale, t } from '@/lib/i18n';

interface AboutValuesProps {
  locale: Locale;
}

interface ValueCard {
  icon: React.ReactNode;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
}

const values: ValueCard[] = [
  {
    icon: <Scale className="w-7 h-7 text-[#C9A449]" />,
    titleEs: 'Ética Profesional',
    titleEn: 'Professional Ethics',
    descEs:
      'Actuamos con integridad absoluta en cada representación legal. La honestidad y la transparencia con nuestros clientes son la base de cada relación profesional que establecemos.',
    descEn:
      'We act with absolute integrity in every legal representation. Honesty and transparency with our clients are the foundation of every professional relationship we establish.',
  },
  {
    icon: <Shield className="w-7 h-7 text-[#C9A449]" />,
    titleEs: 'Confidencialidad',
    titleEn: 'Confidentiality',
    descEs:
      'La privacidad de cada cliente es nuestra prioridad. Manejamos toda la información con la más estricta discreción, protegiendo sus intereses en todo momento bajo los más altos estándares profesionales.',
    descEn:
      'The privacy of every client is our priority. We handle all information with the strictest discretion, protecting your interests at all times under the highest professional standards.',
  },
  {
    icon: <Target className="w-7 h-7 text-[#C9A449]" />,
    titleEs: 'Orientación a Resultados',
    titleEn: 'Results-Oriented',
    descEs:
      'Cada estrategia legal que diseñamos está enfocada en obtener el mejor resultado posible. Nos comprometemos no solo con el proceso, sino con el impacto real y tangible en la vida de nuestros clientes.',
    descEn:
      'Every legal strategy we design is focused on achieving the best possible outcome. We commit not only to the process, but to the real and tangible impact on the lives of our clients.',
  },
];

export function AboutValues({ locale }: AboutValuesProps) {
  return (
    <section className="bg-white py-20 sm:py-28 border-t border-[#E6E6E6]">
      <div className="container mx-auto px-6 max-w-[1280px]">
        {/* Header */}
        <FadeIn className="text-center mb-16">
          <SectionEyebrow>
            {t(locale, 'Nuestros Valores', 'Our Values')}
          </SectionEyebrow>
          <SectionTitle>
            {t(
              locale,
              'Los principios que nos guían',
              'The principles that guide us'
            )}
          </SectionTitle>
        </FadeIn>

        {/* Values grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, i) => (
            <FadeIn key={i} delay={i * 120}>
              <div className="flex flex-col items-center text-center p-8 border border-[#E6E6E6] hover:border-[#C9A449] transition-colors duration-300 group h-full">
                {/* Icon */}
                <div className="w-16 h-16 border border-[#E6E6E6] group-hover:border-[#C9A449] flex items-center justify-center mb-6 transition-colors duration-300">
                  {value.icon}
                </div>
                {/* Gold line */}
                <div className="w-8 h-px bg-[#C9A449] mb-6" />
                {/* Title */}
                <h3 className="font-serif text-2xl text-[#0E0E0E] mb-4">
                  {locale === 'es' ? value.titleEs : value.titleEn}
                </h3>
                {/* Description */}
                <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed">
                  {locale === 'es' ? value.descEs : value.descEn}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
