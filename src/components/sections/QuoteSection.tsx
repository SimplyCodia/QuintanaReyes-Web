'use client';
import Link from 'next/link';
import { FadeIn } from '@/components/ui/FadeIn';
import { Locale, t } from '@/lib/i18n';

interface QuoteSectionProps {
  locale: Locale;
}

export function QuoteSection({ locale }: QuoteSectionProps) {
  const contactHref = locale === 'es' ? '/es#contacto' : '/en#contacto';

  return (
    <section className="bg-[#0E0E0E] py-24 sm:py-32 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 border-l border-t border-[#C9A449]/10 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 border-r border-b border-[#C9A449]/10 translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6 max-w-[1280px] relative z-10">
        <FadeIn className="text-center">
          {/* Opening quote mark */}
          <div className="font-serif text-8xl text-[#C9A449]/20 leading-none mb-6 select-none">
            &ldquo;
          </div>

          {/* Quote text */}
          <blockquote className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.25] max-w-4xl mx-auto mb-12">
            {t(
              locale,
              'Su caso merece más que un abogado, merece una estrategia.',
              'Your case deserves more than a lawyer, it deserves a strategy.'
            )}
          </blockquote>

          {/* Divider */}
          <div className="w-16 h-px bg-[#C9A449] mx-auto mb-10" />

          {/* Subtitle */}
          <p className="font-sans text-sm text-white/60 tracking-[0.2em] uppercase mb-10">
            {t(locale, 'Quintana Reyes & Asociados', 'Quintana Reyes & Associates')}
          </p>

          {/* CTA */}
          <Link
            href={contactHref}
            className="inline-flex items-center justify-center bg-[#C9A449] text-[#0E0E0E] hover:bg-[#8C6F2A] hover:text-white transition-colors duration-300 px-8 py-4 font-sans text-sm tracking-widest uppercase font-semibold"
          >
            {t(locale, 'Agenda tu consulta', 'Schedule your consultation')}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
