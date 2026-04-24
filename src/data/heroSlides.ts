export interface HeroSlide {
  id: number;
  img: string;
  headlineEs: string;
  headlineEn: string;
  subEs: string;
  subEn: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: 0,
    img: '/images/hero/slide-1.jpg',
    headlineEs: 'Excelencia jurídica con total confidencialidad.',
    headlineEn: 'Legal excellence with complete confidentiality.',
    subEs: 'Asesoría legal integral en Panamá con enfoque estratégico, ético y personalizado.',
    subEn: 'Comprehensive legal counsel in Panama with a strategic, ethical, and personalized approach.',
  },
  {
    id: 1,
    img: '/images/hero/slide-2.jpg',
    headlineEs: 'Estrategia legal para decisiones clave.',
    headlineEn: 'Legal strategy for critical decisions.',
    subEs: 'Soluciones precisas para clientes que exigen criterio, experiencia y discreción.',
    subEn: 'Precise solutions for clients who expect judgment, experience, and discretion.',
  },
  {
    id: 2,
    img: '/images/hero/slide-3.jpg',
    headlineEs: 'Atención personalizada en cada caso.',
    headlineEn: 'Personalized attention in every matter.',
    subEs: 'Acompañamiento jurídico de alto nivel para clientes nacionales e internacionales.',
    subEn: 'High-level legal guidance for local and international clients.',
  },
];
