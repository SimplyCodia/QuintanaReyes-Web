'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AlternateLinkContextValue {
  alternateUrl: string | null;
  setAlternateUrl: (url: string | null) => void;
}

const AlternateLinkContext = createContext<AlternateLinkContextValue | null>(null);

export function AlternateLinkProvider({ children }: { children: React.ReactNode }) {
  const [alternateUrl, setAlternateUrl] = useState<string | null>(null);
  return (
    <AlternateLinkContext.Provider value={{ alternateUrl, setAlternateUrl }}>
      {children}
    </AlternateLinkContext.Provider>
  );
}

export function useAlternateLinkValue(): string | null {
  const ctx = useContext(AlternateLinkContext);
  return ctx?.alternateUrl ?? null;
}

/**
 * Page-level hook: register an alternate-language URL for the current route.
 * The Header reads it via `useAlternateLinkValue` and uses it as the language
 * switcher destination, overriding the static `getAlternateUrl` mapping.
 *
 * Pass `null` to clear (e.g. when the data is unavailable). Cleans up on unmount.
 */
export function useRegisterAlternateLink(url: string | null): void {
  const ctx = useContext(AlternateLinkContext);
  useEffect(() => {
    if (!ctx) return;
    ctx.setAlternateUrl(url);
    return () => ctx.setAlternateUrl(null);
  }, [ctx, url]);
}
