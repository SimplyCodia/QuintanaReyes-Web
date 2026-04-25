import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/layout/Footer';

// Mock next/link to render a plain anchor
vi.mock('next/link', () => ({
  default: ({ href, children, className, 'aria-label': ariaLabel }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    'aria-label'?: string;
  }) => (
    <a href={href} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

// Mock next/image to render a plain img
vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, className }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
  }) => (
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}));

describe('Footer', () => {
  describe('navigation links', () => {
    it('renders Spanish navigation links when locale is es', () => {
      render(<Footer locale="es" />);
      expect(screen.getByText('Inicio')).toBeInTheDocument();
      expect(screen.getByText('Nosotros')).toBeInTheDocument();
      // "Servicios" appears in both nav link and section heading
      const serviciosElements = screen.getAllByText('Servicios');
      expect(serviciosElements.length).toBeGreaterThan(0);
      // "Contacto" appears in both nav link and section heading
      const contactoElements = screen.getAllByText('Contacto');
      expect(contactoElements.length).toBeGreaterThan(0);
    });

    it('renders English navigation links when locale is en', () => {
      render(<Footer locale="en" />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About Us')).toBeInTheDocument();
      // "Services" appears in both nav link and section heading
      const servicesElements = screen.getAllByText('Services');
      expect(servicesElements.length).toBeGreaterThan(0);
      // "Contact" appears in both nav link and section heading
      const contactElements = screen.getAllByText('Contact');
      expect(contactElements.length).toBeGreaterThan(0);
    });

    it('navigation links have correct Spanish hrefs', () => {
      render(<Footer locale="es" />);
      const inicioLink = screen.getByText('Inicio').closest('a');
      const nosotrosLink = screen.getByText('Nosotros').closest('a');
      expect(inicioLink).toHaveAttribute('href', '/es');
      expect(nosotrosLink).toHaveAttribute('href', '/es/nosotros');
    });

    it('navigation links have correct English hrefs', () => {
      render(<Footer locale="en" />);
      const homeLink = screen.getByText('Home').closest('a');
      const aboutLink = screen.getByText('About Us').closest('a');
      expect(homeLink).toHaveAttribute('href', '/en');
      expect(aboutLink).toHaveAttribute('href', '/en/about');
    });
  });

  describe('social media links', () => {
    it('renders Facebook link', () => {
      render(<Footer locale="es" />);
      const facebookLink = screen.getByRole('link', { name: 'Facebook' });
      expect(facebookLink).toBeInTheDocument();
    });

    it('renders Instagram link', () => {
      render(<Footer locale="es" />);
      const instagramLink = screen.getByRole('link', { name: 'Instagram' });
      expect(instagramLink).toBeInTheDocument();
    });

    it('renders TikTok link', () => {
      render(<Footer locale="es" />);
      const tiktokLink = screen.getByRole('link', { name: 'TikTok' });
      expect(tiktokLink).toBeInTheDocument();
    });

    it('Facebook link points to correct URL', () => {
      render(<Footer locale="es" />);
      const facebookLink = screen.getByRole('link', { name: 'Facebook' });
      expect(facebookLink).toHaveAttribute('href', expect.stringContaining('facebook.com'));
    });

    it('Instagram link points to correct URL', () => {
      render(<Footer locale="es" />);
      const instagramLink = screen.getByRole('link', { name: 'Instagram' });
      expect(instagramLink).toHaveAttribute('href', expect.stringContaining('instagram.com'));
    });

    it('TikTok link points to correct URL', () => {
      render(<Footer locale="es" />);
      const tiktokLink = screen.getByRole('link', { name: 'TikTok' });
      expect(tiktokLink).toHaveAttribute('href', expect.stringContaining('tiktok.com'));
    });
  });

  describe('contact info', () => {
    it('renders phone number', () => {
      render(<Footer locale="es" />);
      expect(screen.getByText('+507 6281-0554')).toBeInTheDocument();
    });

    it('renders email address', () => {
      render(<Footer locale="es" />);
      expect(screen.getByText('info@quintanareyes.com')).toBeInTheDocument();
    });

    it('renders location in Spanish when locale is es', () => {
      render(<Footer locale="es" />);
      expect(screen.getByText('Obarrio, Ciudad de Panamá, PH Twist Tower, piso 27, oficina 27H')).toBeInTheDocument();
    });

    it('renders location in English when locale is en', () => {
      render(<Footer locale="en" />);
      expect(screen.getByText('Obarrio, Panama City, PH Twist Tower, 27th floor, office 27H')).toBeInTheDocument();
    });

    it('renders Spanish office hours when locale is es', () => {
      render(<Footer locale="es" />);
      expect(screen.getByText('Lun – Vie: 8:00 AM – 6:00 PM')).toBeInTheDocument();
      expect(screen.getByText('Sáb: 9:00 AM – 1:00 PM')).toBeInTheDocument();
    });

    it('renders English office hours when locale is en', () => {
      render(<Footer locale="en" />);
      expect(screen.getByText('Mon – Fri: 8:00 AM – 6:00 PM')).toBeInTheDocument();
      expect(screen.getByText('Sat: 9:00 AM – 1:00 PM')).toBeInTheDocument();
    });

    it('phone link has correct tel href', () => {
      render(<Footer locale="es" />);
      const phoneLink = screen.getByText('+507 6281-0554').closest('a');
      expect(phoneLink).toHaveAttribute('href', 'tel:+50762810554');
    });

    it('email link has correct mailto href', () => {
      render(<Footer locale="es" />);
      const emailLink = screen.getByText('info@quintanareyes.com').closest('a');
      expect(emailLink).toHaveAttribute('href', 'mailto:info@quintanareyes.com');
    });
  });

  describe('copyright text', () => {
    it('renders Spanish copyright when locale is es', () => {
      render(<Footer locale="es" />);
      expect(screen.getByText(/Quintana Reyes & Asociados\. Todos los derechos reservados/)).toBeInTheDocument();
    });

    it('renders English copyright when locale is en', () => {
      render(<Footer locale="en" />);
      expect(screen.getByText(/Quintana Reyes & Associates\. All rights reserved/)).toBeInTheDocument();
    });

    it('includes current year in copyright', () => {
      render(<Footer locale="es" />);
      expect(screen.getByText(/2026/)).toBeInTheDocument();
    });
  });

  describe('locale affects displayed text', () => {
    it('shows Spanish "Navegación" heading when locale is es', () => {
      render(<Footer locale="es" />);
      expect(screen.getByText('Navegación')).toBeInTheDocument();
    });

    it('shows English "Navigation" heading when locale is en', () => {
      render(<Footer locale="en" />);
      expect(screen.getByText('Navigation')).toBeInTheDocument();
    });

    it('shows Spanish "Servicios" section heading when locale is es', () => {
      render(<Footer locale="es" />);
      const serviciosElements = screen.getAllByText('Servicios');
      expect(serviciosElements.length).toBeGreaterThan(0);
    });

    it('shows English "Services" section heading when locale is en', () => {
      render(<Footer locale="en" />);
      const servicesElements = screen.getAllByText('Services');
      expect(servicesElements.length).toBeGreaterThan(0);
    });
  });
});
