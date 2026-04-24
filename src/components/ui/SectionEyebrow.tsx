import { ReactNode } from 'react';

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[#C9A449] font-sans text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold mb-4">
      {children}
    </p>
  );
}
