'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlides } from '@/data/heroSlides';
import { Locale, t } from '@/lib/i18n';

interface HeroCarouselProps {
  locale: Locale;
}

const ROMAN = ['I', 'II', 'III'];

export function HeroCarousel({ locale }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((index: number) => {
    setCurrent((index + heroSlides.length) % heroSlides.length);
  }, []);

  const goNext = useCallback(() => {
    goTo(current + 1);
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    goTo(current - 1);
  }, [current, goTo]);

  useEffect(() => {
    if (isHovered) return;
    timerRef.current = setTimeout(goNext, 5000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, isHovered, goNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  const contactHref = locale === 'es' ? '/es/contacto' : '/en/contact';
  const servicesHref = locale === 'es' ? '/es/servicios' : '/en/services';

  const slide = heroSlides[current];

  return (
    <section
      className="relative w-full h-screen min-h-[600px] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label={t(locale, 'Carrusel principal', 'Main carousel')}
    >
      {/* Slides */}
      {heroSlides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          aria-hidden={i !== current}
        >
          {/* Background image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.img}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E0E]/80 via-[#0E0E0E]/50 to-[#0E0E0E]/20" />
          <div className="absolute inset-0 bg-[#0E0E0E]/30" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-20 max-w-[1280px]">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <p
              key={`eyebrow-${current}`}
              className="text-[#C9A449] font-sans text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold mb-6"
            >
              {t(locale, 'Firma Legal en Panamá · Obarrio', 'Law Firm in Panama · Obarrio')}
            </p>

            {/* Headline */}
            <h1
              key={`headline-${current}`}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] text-white mb-6"
            >
              {locale === 'es' ? slide.headlineEs : slide.headlineEn}
            </h1>

            {/* Subtitle */}
            <p
              key={`subtitle-${current}`}
              className="font-sans text-base sm:text-lg text-white/80 mb-10 max-w-xl leading-relaxed"
            >
              {locale === 'es' ? slide.subEs : slide.subEn}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={contactHref}
                className="inline-flex items-center justify-center bg-[#C9A449] text-[#0E0E0E] hover:bg-[#8C6F2A] hover:text-white transition-colors duration-300 px-8 py-4 font-sans text-sm tracking-widest uppercase font-semibold"
              >
                {t(locale, 'Consulta Privada', 'Private Consultation')}
              </Link>
              <Link
                href={servicesHref}
                className="inline-flex items-center justify-center border border-[#C9A449] text-white hover:bg-[#C9A449] hover:text-[#0E0E0E] transition-colors duration-300 px-8 py-4 font-sans text-sm tracking-widest uppercase font-semibold"
              >
                {t(locale, 'Áreas de Práctica', 'Practice Areas')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goPrev}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 hidden md:flex items-center justify-center border border-white/30 text-white hover:border-[#C9A449] hover:text-[#C9A449] transition-colors duration-300 bg-[#0E0E0E]/20 backdrop-blur-sm"
        aria-label={t(locale, 'Anterior', 'Previous')}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 hidden md:flex items-center justify-center border border-white/30 text-white hover:border-[#C9A449] hover:text-[#C9A449] transition-colors duration-300 bg-[#0E0E0E]/20 backdrop-blur-sm"
        aria-label={t(locale, 'Siguiente', 'Next')}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Roman numeral pagination */}
      <div className="absolute bottom-8 right-6 sm:right-12 z-30 flex items-center gap-6">
        {ROMAN.map((numeral, i) => (
          <button
            key={numeral}
            onClick={() => goTo(i)}
            className={`font-serif text-sm transition-all duration-300 ${
              i === current
                ? 'text-[#C9A449] font-semibold'
                : 'text-white/50 hover:text-white/80'
            }`}
            aria-label={`${t(locale, 'Diapositiva', 'Slide')} ${numeral}`}
            aria-current={i === current ? 'true' : undefined}
          >
            {numeral}
          </button>
        ))}
        {/* Progress bar */}
        <div className="w-16 h-px bg-white/20 relative overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-[#C9A449] transition-all duration-300"
            style={{ width: `${((current + 1) / heroSlides.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0E0E0E]/60 to-transparent z-10 pointer-events-none" />
    </section>
  );
}
