'use client';
import { CheckCircle, History, User, Shield } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Locale, t } from '@/lib/i18n';

interface DifferentiatorsProps {
  locale: Locale;
}

interface DiffCard {
  icon: React.ReactNode;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
}

const diffCards: DiffCard[] = [
  {
    icon: <CheckCircle className="w-6 h-6 text-[#C9A449]" />,
    titleEs: 'Rigor Jurídico',
    titleEn: 'Legal Rigor',
    descEs:
      'Aplicamos un análisis exhaustivo en cada caso, sustentado en un profundo conocimiento de la legislación panameña e internacional para garantizar estrategias sólidas y bien fundamentadas.',
    descEn:
      'We apply exhaustive analysis to every case, grounded in deep knowledge of Panamanian and international legislation to guarantee solid and well-founded strategies.',
  },
  {
    icon: <History className="w-6 h-6 text-[#C9A449]" />,
    titleEs: 'Trayectoria Reconocida',
    titleEn: 'Recognized Track Record',
    descEs:
      'Décadas de experiencia con un historial probado de resultados exitosos en diversas áreas del derecho nos posicionan como referente de confianza en el ámbito jurídico panameño.',
    descEn:
      'Decades of experience with a proven track record of successful outcomes across various areas of law position us as a trusted benchmark in the Panamanian legal sphere.',
  },
  {
    icon: <User className="w-6 h-6 text-[#C9A449]" />,
    titleEs: 'Trato Exclusivo',
    titleEn: 'Exclusive Treatment',
    descEs:
      'Brindamos atención directa y personalizada a cada cliente. No somos un despacho masivo: cada caso recibe el tiempo y la dedicación que merece.',
    descEn:
      'We provide direct and personalized attention to every client. We are not a mass firm: each case receives the time and dedication it deserves.',
  },
  {
    icon: <Shield className="w-6 h-6 text-[#C9A449]" />,
    titleEs: 'Confidencialidad Absoluta',
    titleEn: 'Absolute Confidentiality',
    descEs:
      'La privacidad de nuestros clientes es sagrada. Manejamos toda la información con la más estricta discreción y bajo los más altos estándares éticos profesionales.',
    descEn:
      'The privacy of our clients is sacred. We handle all information with the strictest discretion and under the highest professional ethical standards.',
  },
];

export function Differentiators({ locale }: DifferentiatorsProps) {
  return (
    <section className="bg-[#FAFAF7] py-20 sm:py-28">
      <div className="container mx-auto px-6 max-w-[1280px]">
        {/* Header */}
        <FadeIn className="mb-16">
          <SectionEyebrow>
            {t(locale, 'Nuestros Diferenciadores', 'Our Differentiators')}
          </SectionEyebrow>
          <SectionTitle>
            {t(
              locale,
              'Lo que nos distingue',
              'What sets us apart'
            )}
          </SectionTitle>
        </FadeIn>

        {/* 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {diffCards.map((card, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="bg-white border border-[#E6E6E6] hover:border-[#C9A449] transition-colors duration-300 p-8 group">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 border border-[#E6E6E6] group-hover:border-[#C9A449] flex items-center justify-center transition-colors duration-300">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-[#0E0E0E] mb-3">
                      {locale === 'es' ? card.titleEs : card.titleEn}
                    </h3>
                    <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed">
                      {locale === 'es' ? card.descEs : card.descEn}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
