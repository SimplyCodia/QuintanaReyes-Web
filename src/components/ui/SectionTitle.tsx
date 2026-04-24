import { ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
  dark?: boolean;
}

export function SectionTitle({ children, dark = false }: SectionTitleProps) {
  return (
    <h2
      className={`font-serif text-4xl sm:text-5xl lg:text-[48px] leading-[1.2] mb-8 ${
        dark ? 'text-white' : 'text-[#0E0E0E]'
      }`}
    >
      {children}
    </h2>
  );
}
