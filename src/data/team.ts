export interface TeamMember {
  name: string;
  roleEs: string;
  roleEn: string;
  descEs: string;
  descEn: string;
  img: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: 'Lloyd Quintana Reyes',
    roleEs: 'Socio fundador',
    roleEn: 'Founding Partner',
    descEs: 'Amplia trayectoria, liderazgo y criterio jurídico que guían decisiones legales con precisión.',
    descEn: 'Extensive track record, leadership, and legal judgment that guide precise legal decisions.',
    img: '/images/team/lloyd_quintana.jpeg',
  },
  {
    name: 'Seiling Arroyo',
    roleEs: 'Abogada',
    roleEn: 'Attorney at Law',
    descEs: 'Reconocida por su ética y enfoque humano que brinda acompañamiento legal confiable.',
    descEn: 'Recognized for her ethics and human approach that provides reliable legal support.',
    img: '/images/team/seiling_arroyo.jpeg',
  },
  {
    name: 'Ameth Vera',
    roleEs: 'Asesor financiero',
    roleEn: 'Financial Advisor',
    descEs: 'Enfocado en soluciones estratégicas que fortalecen la seguridad patrimonial y financiera.',
    descEn: 'Focused on strategic solutions that strengthen asset and financial security.',
    img: '/images/team/ameth-vera.jpg',
  },
  {
    name: 'Victor Caicedo',
    roleEs: 'Abogado',
    roleEn: 'Attorney at Law',
    descEs: 'Comprometido con la defensa legal y la atención detallada en cada proceso.',
    descEn: 'Committed to legal defense and detailed attention in every process.',
    img: '/images/team/victor_caicedo.jpg',
  },
  {
    name: 'Manuel Barsallo',
    roleEs: 'Asistente',
    roleEn: 'Assistant',
    descEs: 'Soporte fundamental en la gestión de casos y atención al cliente.',
    descEn: 'Fundamental support in case management and client service.',
    img: '/images/team/manuel_barsallo.jpg',
  },
];
