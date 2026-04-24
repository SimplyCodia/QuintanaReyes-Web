import { describe, it, expect } from 'vitest';
import { teamMembers, TeamMember } from '@/data/team';

describe('teamMembers', () => {
  it('has exactly 5 entries', () => {
    expect(teamMembers).toHaveLength(5);
  });

  it('each member has all required fields', () => {
    teamMembers.forEach((member: TeamMember) => {
      expect(member).toHaveProperty('name');
      expect(member).toHaveProperty('roleEs');
      expect(member).toHaveProperty('roleEn');
      expect(member).toHaveProperty('descEs');
      expect(member).toHaveProperty('descEn');
      expect(member).toHaveProperty('img');
    });
  });

  it('all required fields are non-empty strings', () => {
    teamMembers.forEach((member: TeamMember) => {
      expect(typeof member.name).toBe('string');
      expect(member.name.length).toBeGreaterThan(0);
      expect(typeof member.roleEs).toBe('string');
      expect(member.roleEs.length).toBeGreaterThan(0);
      expect(typeof member.roleEn).toBe('string');
      expect(member.roleEn.length).toBeGreaterThan(0);
      expect(typeof member.descEs).toBe('string');
      expect(member.descEs.length).toBeGreaterThan(0);
      expect(typeof member.descEn).toBe('string');
      expect(member.descEn.length).toBeGreaterThan(0);
      expect(typeof member.img).toBe('string');
      expect(member.img.length).toBeGreaterThan(0);
    });
  });

  it('image paths start with /images/team/', () => {
    teamMembers.forEach((member: TeamMember) => {
      expect(member.img).toMatch(/^\/images\/team\//);
    });
  });

  it('first member is Lloyd Quintana Reyes (founding partner)', () => {
    expect(teamMembers[0].name).toBe('Lloyd Quintana Reyes');
    expect(teamMembers[0].roleEs).toBe('Socio fundador');
    expect(teamMembers[0].roleEn).toBe('Founding Partner');
  });

  it('member names are unique', () => {
    const names = teamMembers.map((m) => m.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  it('bilingual roles are different for each member', () => {
    teamMembers.forEach((member: TeamMember) => {
      expect(member.roleEs).not.toBe(member.roleEn);
    });
  });

  it('image paths have valid image extensions', () => {
    teamMembers.forEach((member: TeamMember) => {
      expect(member.img).toMatch(/\.(jpg|jpeg|png|webp|svg)$/i);
    });
  });
});
