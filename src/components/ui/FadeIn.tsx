'use client';
import { useRef, useState, useEffect, ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, className = '' }: FadeInProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    const current = domRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  // Before JS mounts, content is fully visible (SSR/no-JS friendly)
  // After mount, apply fade-in animation
  const animClass = !mounted
    ? 'opacity-100'
    : isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-8';

  return (
    <div
      className={`transition-all duration-700 ease-out ${animClass} ${className}`}
      style={mounted ? { transitionDelay: `${delay}ms` } : undefined}
      ref={domRef}
    >
      {children}
    </div>
  );
}
