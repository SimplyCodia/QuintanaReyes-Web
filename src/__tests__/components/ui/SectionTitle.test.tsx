import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionTitle } from '@/components/ui/SectionTitle';

describe('SectionTitle', () => {
  it('renders children as h2', () => {
    render(<SectionTitle>Our Services</SectionTitle>);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Our Services');
  });

  it('has dark text class when dark=true', () => {
    render(<SectionTitle dark={true}>Dark Title</SectionTitle>);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.className).toContain('text-white');
  });

  it('has light text class when dark=false', () => {
    render(<SectionTitle dark={false}>Light Title</SectionTitle>);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.className).toContain('text-[#0E0E0E]');
  });

  it('defaults to light variant (dark=false) when prop not provided', () => {
    render(<SectionTitle>Default Title</SectionTitle>);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.className).toContain('text-[#0E0E0E]');
  });

  it('renders complex children', () => {
    render(
      <SectionTitle>
        <span>Complex</span> Children
      </SectionTitle>
    );
    expect(screen.getByText('Complex')).toBeInTheDocument();
  });

  it('has serif font class', () => {
    render(<SectionTitle>Test</SectionTitle>);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.className).toContain('font-serif');
  });
});
