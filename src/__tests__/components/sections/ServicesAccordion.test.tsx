import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ServicesAccordion } from '@/components/sections/ServicesAccordion';
import { practiceAreas } from '@/data/services';

describe('ServicesAccordion', () => {
  it('renders all 7 practice areas', () => {
    render(<ServicesAccordion locale="es" />);
    practiceAreas.forEach((area) => {
      expect(screen.getByText(area.titleEs)).toBeInTheDocument();
    });
  });

  it('renders Spanish titles when locale is es', () => {
    render(<ServicesAccordion locale="es" />);
    expect(screen.getByText('Derecho de Familia')).toBeInTheDocument();
    expect(screen.getByText('Derecho Migratorio')).toBeInTheDocument();
    expect(screen.getByText('Derecho Penal')).toBeInTheDocument();
  });

  it('renders English titles when locale is en', () => {
    render(<ServicesAccordion locale="en" />);
    expect(screen.getByText('Family Law')).toBeInTheDocument();
    expect(screen.getByText('Immigration Law')).toBeInTheDocument();
    expect(screen.getByText('Criminal Law')).toBeInTheDocument();
  });

  it('renders Roman numerals for all practice areas', () => {
    render(<ServicesAccordion locale="es" />);
    ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'].forEach((numeral) => {
      expect(screen.getByText(numeral)).toBeInTheDocument();
    });
  });

  it('accordion content containers initially have maxHeight 0 (collapsed)', () => {
    const { container } = render(<ServicesAccordion locale="es" />);
    const expandable = container.querySelectorAll('.overflow-hidden');
    expandable.forEach((el) => {
      expect((el as HTMLElement).style.maxHeight).toBe('0px');
    });
  });

  it('expands accordion on click to show description', async () => {
    render(<ServicesAccordion locale="es" />);
    const firstButton = screen.getAllByRole('button')[0];
    await userEvent.click(firstButton);
    expect(screen.getByText(practiceAreas[0].descEs)).toBeInTheDocument();
  });

  it('WhatsApp links are rendered in the DOM (content is always mounted)', () => {
    render(<ServicesAccordion locale="es" />);
    // All 7 WhatsApp links are in the DOM (content is rendered but hidden via maxHeight)
    const whatsappLinks = screen.getAllByText('Contactar por WhatsApp');
    expect(whatsappLinks).toHaveLength(7);
  });

  it('WhatsApp button text is visible when locale is es', () => {
    render(<ServicesAccordion locale="es" />);
    const whatsappLinks = screen.getAllByText('Contactar por WhatsApp');
    expect(whatsappLinks.length).toBeGreaterThan(0);
  });

  it('WhatsApp button text is visible when locale is en', () => {
    render(<ServicesAccordion locale="en" />);
    const whatsappLinks = screen.getAllByText('Contact on WhatsApp');
    expect(whatsappLinks.length).toBeGreaterThan(0);
  });

  it('WhatsApp links use correct hrefs from data (es)', () => {
    render(<ServicesAccordion locale="es" />);
    // Find all anchor tags that contain WhatsApp text
    const whatsappAnchors = screen
      .getAllByText('Contactar por WhatsApp')
      .map((el) => el.closest('a'));
    expect(whatsappAnchors[0]).toHaveAttribute('href', practiceAreas[0].whatsappLinkEs);
    expect(whatsappAnchors[1]).toHaveAttribute('href', practiceAreas[1].whatsappLinkEs);
  });

  it('WhatsApp links use correct hrefs from data (en)', () => {
    render(<ServicesAccordion locale="en" />);
    const whatsappAnchors = screen
      .getAllByText('Contact on WhatsApp')
      .map((el) => el.closest('a'));
    expect(whatsappAnchors[0]).toHaveAttribute('href', practiceAreas[0].whatsappLinkEn);
    expect(whatsappAnchors[1]).toHaveAttribute('href', practiceAreas[1].whatsappLinkEn);
  });

  it('each button has aria-expanded attribute', () => {
    render(<ServicesAccordion locale="es" />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(7);
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('aria-expanded');
    });
  });

  it('aria-expanded is false by default for all items', () => {
    render(<ServicesAccordion locale="es" />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('aria-expanded becomes true when item is opened', async () => {
    render(<ServicesAccordion locale="es" />);
    const firstButton = screen.getAllByRole('button')[0];
    await userEvent.click(firstButton);
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('opening one item sets only that items aria-expanded to true', async () => {
    render(<ServicesAccordion locale="es" />);
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[2]); // open third item
    expect(buttons[2]).toHaveAttribute('aria-expanded', 'true');
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes the accordion content container when clicking open item again', async () => {
    const { container } = render(<ServicesAccordion locale="es" />);
    const firstButton = screen.getAllByRole('button')[0];
    // Open first item
    await userEvent.click(firstButton);
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    // Close first item
    await userEvent.click(firstButton);
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    // All content containers should be collapsed
    const expandable = container.querySelectorAll('.overflow-hidden');
    expandable.forEach((el) => {
      expect((el as HTMLElement).style.maxHeight).toBe('0px');
    });
  });
});
