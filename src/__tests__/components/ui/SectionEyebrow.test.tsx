import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';

describe('SectionEyebrow', () => {
  it('renders children', () => {
    render(<SectionEyebrow>Practice Areas</SectionEyebrow>);
    expect(screen.getByText('Practice Areas')).toBeInTheDocument();
  });

  it('renders as a paragraph element', () => {
    const { container } = render(<SectionEyebrow>Label</SectionEyebrow>);
    const p = container.querySelector('p');
    expect(p).toBeInTheDocument();
    expect(p).toHaveTextContent('Label');
  });

  it('has gold color class', () => {
    const { container } = render(<SectionEyebrow>Test</SectionEyebrow>);
    const p = container.querySelector('p');
    expect(p?.className).toContain('text-[#C9A449]');
  });

  it('has uppercase class', () => {
    const { container } = render(<SectionEyebrow>Test</SectionEyebrow>);
    const p = container.querySelector('p');
    expect(p?.className).toContain('uppercase');
  });

  it('has tracking (letter-spacing) class', () => {
    const { container } = render(<SectionEyebrow>Test</SectionEyebrow>);
    const p = container.querySelector('p');
    expect(p?.className).toContain('tracking-');
  });

  it('has sans-serif font class', () => {
    const { container } = render(<SectionEyebrow>Test</SectionEyebrow>);
    const p = container.querySelector('p');
    expect(p?.className).toContain('font-sans');
  });

  it('has semibold font weight class', () => {
    const { container } = render(<SectionEyebrow>Test</SectionEyebrow>);
    const p = container.querySelector('p');
    expect(p?.className).toContain('font-semibold');
  });
});
