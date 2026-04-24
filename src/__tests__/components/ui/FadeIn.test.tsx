import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FadeIn } from '@/components/ui/FadeIn';

const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  class MockIntersectionObserver {
    observe = mockObserve;
    unobserve = mockUnobserve;
    disconnect = mockDisconnect;
    constructor() {}
  }
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

afterEach(() => {
  vi.restoreAllMocks();
  mockObserve.mockClear();
  mockUnobserve.mockClear();
  mockDisconnect.mockClear();
});

describe('FadeIn', () => {
  it('renders children', () => {
    render(
      <FadeIn>
        <p>Visible content</p>
      </FadeIn>
    );
    expect(screen.getByText('Visible content')).toBeInTheDocument();
  });

  it('initially has opacity-0 class (not yet visible)', () => {
    const { container } = render(
      <FadeIn>
        <span>Content</span>
      </FadeIn>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('opacity-0');
  });

  it('supports delay prop and applies it as transitionDelay style', () => {
    const { container } = render(
      <FadeIn delay={300}>
        <span>Delayed content</span>
      </FadeIn>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.transitionDelay).toBe('300ms');
  });

  it('uses default delay of 0 when not provided', () => {
    const { container } = render(
      <FadeIn>
        <span>No delay</span>
      </FadeIn>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.transitionDelay).toBe('0ms');
  });

  it('supports className prop', () => {
    const { container } = render(
      <FadeIn className="custom-fade">
        <span>Test</span>
      </FadeIn>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('custom-fade');
  });

  it('renders as a div element', () => {
    const { container } = render(
      <FadeIn>
        <span>Test</span>
      </FadeIn>
    );
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('has transition class for animation', () => {
    const { container } = render(
      <FadeIn>
        <span>Test</span>
      </FadeIn>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('transition-all');
  });

  it('calls IntersectionObserver.observe on mount', () => {
    render(
      <FadeIn>
        <span>Test</span>
      </FadeIn>
    );
    expect(mockObserve).toHaveBeenCalledTimes(1);
  });
});
