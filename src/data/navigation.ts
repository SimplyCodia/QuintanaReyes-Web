export interface NavLink {
  id: string;
  labelEs: string;
  labelEn: string;
  hrefEs: string;
  hrefEn: string;
}

export const navLinks: NavLink[] = [
  { id: 'inicio', labelEs: 'Inicio', labelEn: 'Home', hrefEs: '/es', hrefEn: '/en' },
  { id: 'nosotros', labelEs: 'Nosotros', labelEn: 'About Us', hrefEs: '/es/nosotros', hrefEn: '/en/about' },
  { id: 'servicios', labelEs: 'Servicios', labelEn: 'Services', hrefEs: '/es/servicios', hrefEn: '/en/services' },
  { id: 'blog', labelEs: 'Blog', labelEn: 'Blog', hrefEs: '/es/blog', hrefEn: '/en/blog' },
  { id: 'contacto', labelEs: 'Contacto', labelEn: 'Contact', hrefEs: '/es#contacto', hrefEn: '/en#contacto' },
];
