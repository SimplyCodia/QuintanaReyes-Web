import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ButtonSolid, ButtonOutline } from '@/components/ui/Button';

describe('ButtonSolid', () => {
  it('renders children', () => {
    render(<ButtonSolid>Click me</ButtonSolid>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<ButtonSolid onClick={handleClick}>Click me</ButtonSolid>);
    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders a button element', () => {
    render(<ButtonSolid>Submit</ButtonSolid>);
    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toBeInTheDocument();
  });

  it('has button type by default', () => {
    render(<ButtonSolid>Test</ButtonSolid>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('supports className prop', () => {
    render(<ButtonSolid className="custom-class">Test</ButtonSolid>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('has gold background color class', () => {
    render(<ButtonSolid>Test</ButtonSolid>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-[#C9A449]');
  });

  it('does not call onClick when not clicked', () => {
    const handleClick = vi.fn();
    render(<ButtonSolid onClick={handleClick}>Test</ButtonSolid>);
    expect(handleClick).not.toHaveBeenCalled();
  });
});

describe('ButtonOutline', () => {
  it('renders children', () => {
    render(<ButtonOutline>Learn More</ButtonOutline>);
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<ButtonOutline onClick={handleClick}>Click</ButtonOutline>);
    await userEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has dark variant class when dark=true', () => {
    render(<ButtonOutline dark={true}>Dark Button</ButtonOutline>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('text-[#C9A449]');
  });

  it('has light variant class when dark=false', () => {
    render(<ButtonOutline dark={false}>Light Button</ButtonOutline>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('text-white');
  });

  it('defaults to light variant (dark=false)', () => {
    render(<ButtonOutline>Default Button</ButtonOutline>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('text-white');
  });

  it('supports className prop', () => {
    render(<ButtonOutline className="my-custom-class">Test</ButtonOutline>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('my-custom-class');
  });

  it('has border with gold color', () => {
    render(<ButtonOutline>Test</ButtonOutline>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('border-[#C9A449]');
  });
});
