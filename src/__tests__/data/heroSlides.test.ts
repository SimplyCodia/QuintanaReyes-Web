import { describe, it, expect } from 'vitest';
import { heroSlides, HeroSlide } from '@/data/heroSlides';

describe('heroSlides', () => {
  it('has exactly 3 entries', () => {
    expect(heroSlides).toHaveLength(3);
  });

  it('each slide has a unique id', () => {
    const ids = heroSlides.map((slide) => slide.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('each slide has bilingual content', () => {
    heroSlides.forEach((slide: HeroSlide) => {
      expect(slide).toHaveProperty('headlineEs');
      expect(slide).toHaveProperty('headlineEn');
      expect(slide).toHaveProperty('subEs');
      expect(slide).toHaveProperty('subEn');
    });
  });

  it('each slide has all required fields', () => {
    heroSlides.forEach((slide: HeroSlide) => {
      expect(slide).toHaveProperty('id');
      expect(slide).toHaveProperty('img');
      expect(slide).toHaveProperty('headlineEs');
      expect(slide).toHaveProperty('headlineEn');
      expect(slide).toHaveProperty('subEs');
      expect(slide).toHaveProperty('subEn');
    });
  });

  it('all text fields are non-empty strings', () => {
    heroSlides.forEach((slide: HeroSlide) => {
      expect(typeof slide.headlineEs).toBe('string');
      expect(slide.headlineEs.length).toBeGreaterThan(0);
      expect(typeof slide.headlineEn).toBe('string');
      expect(slide.headlineEn.length).toBeGreaterThan(0);
      expect(typeof slide.subEs).toBe('string');
      expect(slide.subEs.length).toBeGreaterThan(0);
      expect(typeof slide.subEn).toBe('string');
      expect(slide.subEn.length).toBeGreaterThan(0);
    });
  });

  it('IDs are numeric and sequential starting from 0', () => {
    expect(heroSlides[0].id).toBe(0);
    expect(heroSlides[1].id).toBe(1);
    expect(heroSlides[2].id).toBe(2);
  });

  it('image paths reference hero slide images', () => {
    heroSlides.forEach((slide: HeroSlide) => {
      expect(slide.img).toMatch(/^\/images\/hero\//);
    });
  });

  it('bilingual headlines are different for each slide', () => {
    heroSlides.forEach((slide: HeroSlide) => {
      expect(slide.headlineEs).not.toBe(slide.headlineEn);
    });
  });
});
