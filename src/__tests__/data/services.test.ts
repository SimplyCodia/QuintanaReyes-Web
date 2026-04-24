import { describe, it, expect } from 'vitest';
import { practiceAreas, PracticeArea } from '@/data/services';

describe('practiceAreas', () => {
  it('has exactly 7 entries', () => {
    expect(practiceAreas).toHaveLength(7);
  });

  it('each area has all required fields', () => {
    practiceAreas.forEach((area: PracticeArea) => {
      expect(area).toHaveProperty('num');
      expect(area).toHaveProperty('titleEs');
      expect(area).toHaveProperty('titleEn');
      expect(area).toHaveProperty('descEs');
      expect(area).toHaveProperty('descEn');
      expect(area).toHaveProperty('whatsappLinkEs');
      expect(area).toHaveProperty('whatsappLinkEn');
    });
  });

  it('all required fields are non-empty strings', () => {
    practiceAreas.forEach((area: PracticeArea) => {
      expect(typeof area.num).toBe('string');
      expect(area.num.length).toBeGreaterThan(0);
      expect(typeof area.titleEs).toBe('string');
      expect(area.titleEs.length).toBeGreaterThan(0);
      expect(typeof area.titleEn).toBe('string');
      expect(area.titleEn.length).toBeGreaterThan(0);
      expect(typeof area.descEs).toBe('string');
      expect(area.descEs.length).toBeGreaterThan(0);
      expect(typeof area.descEn).toBe('string');
      expect(area.descEn.length).toBeGreaterThan(0);
      expect(typeof area.whatsappLinkEs).toBe('string');
      expect(area.whatsappLinkEs.length).toBeGreaterThan(0);
      expect(typeof area.whatsappLinkEn).toBe('string');
      expect(area.whatsappLinkEn.length).toBeGreaterThan(0);
    });
  });

  it('Roman numerals are I through VII in order', () => {
    const expectedNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    practiceAreas.forEach((area, index) => {
      expect(area.num).toBe(expectedNumerals[index]);
    });
  });

  it('WhatsApp links for es are valid URLs starting with https://wa.link/', () => {
    practiceAreas.forEach((area: PracticeArea) => {
      expect(area.whatsappLinkEs).toMatch(/^https:\/\/wa\.link\//);
    });
  });

  it('WhatsApp links for en are valid URLs starting with https://wa.link/', () => {
    practiceAreas.forEach((area: PracticeArea) => {
      expect(area.whatsappLinkEn).toMatch(/^https:\/\/wa\.link\//);
    });
  });

  it('bilingual content is different for all areas', () => {
    practiceAreas.forEach((area: PracticeArea) => {
      expect(area.titleEs).not.toBe(area.titleEn);
      expect(area.descEs).not.toBe(area.descEn);
    });
  });

  it('first area is Derecho de Familia / Family Law', () => {
    expect(practiceAreas[0].titleEs).toBe('Derecho de Familia');
    expect(practiceAreas[0].titleEn).toBe('Family Law');
  });

  it('last area is Derecho Corporativo / Corporate and Commercial Law', () => {
    expect(practiceAreas[6].titleEs).toBe('Derecho Corporativo y Comercial');
    expect(practiceAreas[6].titleEn).toBe('Corporate and Commercial Law');
  });
});
