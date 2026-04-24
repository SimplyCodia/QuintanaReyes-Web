'use client';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}

export function ButtonSolid({
  children,
  onClick,
  className = '',
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-[#C9A449] text-[#0E0E0E] hover:bg-[#8C6F2A] hover:text-white transition-colors duration-300 px-8 py-4 font-sans text-sm tracking-widest uppercase font-semibold ${className}`}
    >
      {children}
    </button>
  );
}

interface ButtonOutlineProps extends ButtonProps {
  dark?: boolean;
}

export function ButtonOutline({
  children,
  onClick,
  className = '',
  dark = false,
  type = 'button',
}: ButtonOutlineProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`border border-[#C9A449] transition-colors duration-300 px-8 py-4 font-sans text-sm tracking-widest uppercase font-semibold
        ${
          dark
            ? 'text-[#C9A449] hover:bg-[#C9A449] hover:text-[#0E0E0E]'
            : 'text-white hover:bg-[#C9A449] hover:text-[#0E0E0E]'
        } ${className}`}
    >
      {children}
    </button>
  );
}
