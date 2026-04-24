'use client';
import { User, Shield, Target, Clock } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Locale, t } from '@/lib/i18n';

interface WhyChooseUsProps {
  locale: Locale;
}

interface CardData {
  icon: React.ReactNode;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
}

const cards: CardData[] = [
  {
    icon: <User className="w-6 h-6 text-[#C9A449]" />,
    titleEs: 'Atención Personalizada',
    titleEn: 'Personalized Attention',
    descEs:
      'Cada cliente recibe un trato exclusivo y dedicado. Nos involucramos profundamente en cada caso para ofrecer soluciones a la medida.',
    descEn:
      'Every client receives exclusive and dedicated treatment. We get deeply involved in each case to provide tailored solutions.',
  },
  {
    icon: <Shield className="w-6 h-6 text-[#C9A449]" />,
    titleEs: 'Ética y Confidencialidad',
    titleEn: 'Ethics and Confidentiality',
    descEs:
      'La discreción y la integridad son pilares fundamentales de nuestra práctica. Su información siempre está protegida.',
    descEn:
      'Discretion and integrity are fundamental pillars of our practice. Your information is always protected.',
  },
  {
    icon: <Target className="w-6 h-6 text-[#C9A449]" />,
    titleEs: 'Orientación a Resultados',
    titleEn: 'Results-Oriented',
    descEs:
      'Cada estrategia que diseñamos tiene un objetivo claro: alcanzar los mejores resultados posibles para nuestros clientes.',
    descEn:
      'Every strategy we design has a clear objective: to achieve the best possible results for our clients.',
  },
  {
    icon: <Clock className="w-6 h-6 text-[#C9A449]" />,
    titleEs: 'Experiencia Comprobada',
    titleEn: 'Proven Experience',
    descEs:
      'Décadas de práctica legal nos respaldan. Hemos representado con éxito a clientes en los casos más complejos.',
    descEn:
      'Decades of legal practice back us up. We have successfully represented clients in the most complex cases.',
  },
];

export function WhyChooseUs({ locale }: WhyChooseUsProps) {
  return (
    <section className="bg-white border-t border-[#E6E6E6] py-20 sm:py-28">
      <div className="container mx-auto px-6 max-w-[1280px]">
        {/* Header */}
        <FadeIn className="text-center mb-16">
          <SectionEyebrow>
            {t(locale, 'Por qué elegirnos', 'Why Choose Us')}
          </SectionEyebrow>
          <SectionTitle>
            {t(
              locale,
              'Una firma que marca la diferencia',
              'A firm that makes the difference'
            )}
          </SectionTitle>
        </FadeIn>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="flex flex-col items-center text-center p-6 group">
                {/* Icon circle */}
                <div className="w-14 h-14 rounded-full border border-[#E6E6E6] flex items-center justify-center mb-6 group-hover:border-[#C9A449] transition-colors duration-300">
                  {card.icon}
                </div>
                <h3 className="font-serif text-xl text-[#0E0E0E] mb-3">
                  {locale === 'es' ? card.titleEs : card.titleEn}
                </h3>
                <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed">
                  {locale === 'es' ? card.descEs : card.descEn}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
