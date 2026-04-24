import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ServicesAccordion } from '@/components/sections/ServicesAccordion';
import { practiceAreas } from '@/data/services';

beforeAll(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    constructor(cb: IntersectionObserverCallback) {
      setTimeout(() => cb([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver), 0);
    }
    root = null;
    rootMargin = '';
    thresholds = [0];
    takeRecords() { return []; }
  } as unknown as typeof IntersectionObserver;
});

describe('ServicesAccordion', () => {
  it('renders all 7 practice areas', () => {
    render(<ServicesAccordion locale="es" />);
    practiceAreas.forEach((area) => {
      expect(screen.getByText(area.titleEs)).toBeDefined();
    });
  });

  it('renders Spanish titles when locale is es', () => {
    render(<ServicesAccordion locale="es" />);
    expect(screen.getByText('Derecho de Familia')).toBeDefined();
    expect(screen.getByText('Derecho Penal')).toBeDefined();
  });

  it('renders English titles when locale is en', () => {
    render(<ServicesAccordion locale="en" />);
    expect(screen.getByText('Family Law')).toBeDefined();
    expect(screen.getByText('Criminal Law')).toBeDefined();
  });

  it('expands accordion on click to show description', () => {
    render(<ServicesAccordion locale="es" />);
    const buttons = screen.getAllByRole('button', { expanded: false });
    fireEvent.click(buttons[0]);
    expect(screen.getByText(/Gestionamos casos de divorcio/)).toBeDefined();
  });

  it('shows WhatsApp button when accordion is expanded', () => {
    render(<ServicesAccordion locale="es" />);
    const buttons = screen.getAllByRole('button', { expanded: false });
    fireEvent.click(buttons[0]);
    expect(screen.getByText('Contactar por WhatsApp')).toBeDefined();
  });

  it('WhatsApp link has correct href', () => {
    render(<ServicesAccordion locale="es" />);
    const buttons = screen.getAllByRole('button', { expanded: false });
    fireEvent.click(buttons[0]);
    const link = screen.getByText('Contactar por WhatsApp').closest('a');
    expect(link?.getAttribute('href')).toBe(practiceAreas[0].whatsappLinkEs);
  });

  it('each button has aria-expanded attribute', () => {
    render(<ServicesAccordion locale="es" />);
    const buttons = screen.getAllByRole('button');
    const accordionButtons = buttons.filter((b) => b.getAttribute('aria-expanded') !== null);
    expect(accordionButtons.length).toBe(7);
  });

  it('closes accordion when clicking open item again', () => {
    render(<ServicesAccordion locale="es" />);
    const buttons = screen.getAllByRole('button', { expanded: false });
    fireEvent.click(buttons[0]);
    expect(screen.getByText(/Gestionamos casos de divorcio/)).toBeDefined();
    fireEvent.click(screen.getAllByRole('button', { expanded: true })[0]);
    expect(screen.queryByText(/Gestionamos casos de divorcio/)).toBeNull();
  });
});
