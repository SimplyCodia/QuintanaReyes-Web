'use client';
import { FadeIn } from '@/components/ui/FadeIn';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Locale, t } from '@/lib/i18n';

interface AboutHistoryProps {
  locale: Locale;
}

export function AboutHistory({ locale }: AboutHistoryProps) {
  return (
    <section className="bg-[#FAFAF7] py-20 sm:py-28">
      <div className="container mx-auto px-6 max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text content */}
          <FadeIn>
            <SectionEyebrow>
              {t(locale, 'Nuestra Historia', 'Our History')}
            </SectionEyebrow>
            <SectionTitle>
              {t(
                locale,
                'Décadas construyendo confianza',
                'Decades building trust'
              )}
            </SectionTitle>

            {/* Quote */}
            <blockquote className="border-l-2 border-[#C9A449] pl-6 mb-8">
              <p className="font-serif text-xl text-[#0E0E0E] italic leading-relaxed">
                {t(
                  locale,
                  '"Cada caso es una oportunidad de hacer justicia y de demostrar que el derecho, bien ejercido, transforma vidas."',
                  '"Every case is an opportunity to serve justice and to demonstrate that law, when well-practiced, transforms lives."'
                )}
              </p>
              <footer className="mt-3 font-sans text-xs text-[#C9A449] tracking-[0.15em] uppercase font-semibold">
                Lloyd Quintana Reyes — {t(locale, 'Socio fundador', 'Founding Partner')}
              </footer>
            </blockquote>

            <div className="space-y-4">
              <p className="font-sans text-base text-[#6B6B6B] leading-relaxed">
                {t(
                  locale,
                  'Quintana Reyes & Asociados nació de la visión de crear una firma legal donde la excelencia técnica y el trato humano conviven en perfecta armonía. Desde nuestros inicios en Panamá, hemos construido una trayectoria sólida y reconocida en el ámbito jurídico nacional.',
                  'Quintana Reyes & Asociados was born from the vision of creating a law firm where technical excellence and human treatment coexist in perfect harmony. Since our beginnings in Panama, we have built a solid and recognized track record in the national legal sphere.'
                )}
              </p>
              <p className="font-sans text-base text-[#6B6B6B] leading-relaxed">
                {t(
                  locale,
                  'A lo largo de los años, hemos representado con éxito a cientos de clientes en casos que van desde asuntos de familia hasta complejas operaciones corporativas, consolidándonos como una referencia de confianza para quienes buscan asesoría legal de primer nivel en Panamá.',
                  'Over the years, we have successfully represented hundreds of clients in cases ranging from family matters to complex corporate operations, establishing ourselves as a trusted reference for those seeking top-tier legal advice in Panama.'
                )}
              </p>
              <p className="font-sans text-base text-[#6B6B6B] leading-relaxed">
                {t(
                  locale,
                  'Hoy, con un equipo multidisciplinario de profesionales altamente capacitados, continuamos expandiendo nuestras capacidades para servir mejor a nuestros clientes en un entorno legal cada vez más complejo y globalizado.',
                  'Today, with a multidisciplinary team of highly qualified professionals, we continue expanding our capabilities to better serve our clients in an increasingly complex and globalized legal environment.'
                )}
              </p>
            </div>
          </FadeIn>

          {/* Right: image with decorative border */}
          <FadeIn delay={200}>
            <div className="relative">
              {/* Decorative border offset */}
              <div className="absolute -top-4 -right-4 w-full h-full border border-[#C9A449]/30 z-0" />
              {/* Image container */}
              <div className="relative z-10 overflow-hidden aspect-[4/5] bg-[#E6E6E6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                  alt={t(locale, 'Oficinas de Quintana Reyes & Asociados', 'Quintana Reyes & Asociados offices')}
                  className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-[#0E0E0E]/10" />
              </div>
              {/* Bottom caption bar */}
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-[#0E0E0E]/80 backdrop-blur-sm px-6 py-4">
                <p className="font-sans text-xs text-[#C9A449] tracking-[0.15em] uppercase font-semibold">
                  {t(locale, 'Obarrio, Ciudad de Panamá', 'Obarrio, Panama City')}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
