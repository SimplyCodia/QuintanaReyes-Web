import { describe, it, expect } from 'vitest';
import { navLinks, NavLink } from '@/data/navigation';

describe('navLinks', () => {
  it('has exactly 4 entries', () => {
    expect(navLinks).toHaveLength(4);
  });

  it('each link has all required fields', () => {
    navLinks.forEach((link: NavLink) => {
      expect(link).toHaveProperty('id');
      expect(link).toHaveProperty('labelEs');
      expect(link).toHaveProperty('labelEn');
      expect(link).toHaveProperty('hrefEs');
      expect(link).toHaveProperty('hrefEn');
    });
  });

  it('all required fields are non-empty strings', () => {
    navLinks.forEach((link: NavLink) => {
      expect(typeof link.id).toBe('string');
      expect(link.id.length).toBeGreaterThan(0);
      expect(typeof link.labelEs).toBe('string');
      expect(link.labelEs.length).toBeGreaterThan(0);
      expect(typeof link.labelEn).toBe('string');
      expect(link.labelEn.length).toBeGreaterThan(0);
      expect(typeof link.hrefEs).toBe('string');
      expect(link.hrefEs.length).toBeGreaterThan(0);
      expect(typeof link.hrefEn).toBe('string');
      expect(link.hrefEn.length).toBeGreaterThan(0);
    });
  });

  it('Spanish links start with /es', () => {
    navLinks.forEach((link: NavLink) => {
      expect(link.hrefEs).toMatch(/^\/es/);
    });
  });

  it('English links start with /en', () => {
    navLinks.forEach((link: NavLink) => {
      expect(link.hrefEn).toMatch(/^\/en/);
    });
  });

  it('IDs are unique', () => {
    const ids = navLinks.map((link) => link.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('contains home, about, services, and contact links', () => {
    const ids = navLinks.map((link) => link.id);
    expect(ids).toContain('inicio');
    expect(ids).toContain('nosotros');
    expect(ids).toContain('servicios');
    expect(ids).toContain('contacto');
  });
});
