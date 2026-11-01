import { describe, it, expect } from 'vitest';
import { SEED_BUSINESSES, SEED_CATEGORIES, SEED_OFFERS } from '../data/seedData';
import { deduplicateBusinesses, deduplicateOffers } from '../services/storageService';

describe('Data Integrity & Deduplication Audit', () => {
  it('should have exactly 20 distinct categories with unique IDs, names, and slugs', () => {
    expect(SEED_CATEGORIES.length).toBe(20);
    const catIds = new Set(SEED_CATEGORIES.map(c => c.id));
    const catNames = new Set(SEED_CATEGORIES.map(c => c.name.toLowerCase()));
    const catSlugs = new Set(SEED_CATEGORIES.map(c => c.slug.toLowerCase()));

    expect(catIds.size).toBe(SEED_CATEGORIES.length);
    expect(catNames.size).toBe(SEED_CATEGORIES.length);
    expect(catSlugs.size).toBe(SEED_CATEGORIES.length);
  });

  it('should have all distinct businesses with unique IDs, names, slugs, and phone numbers', () => {
    expect(SEED_BUSINESSES.length).toBe(51);

    const ids = new Set<string>();
    const names = new Set<string>();
    const slugs = new Set<string>();
    const phones = new Set<string>();

    for (const b of SEED_BUSINESSES) {
      // Check ID
      expect(ids.has(b.id)).toBe(false);
      ids.add(b.id);

      // Check Name
      const normName = b.name.trim().toLowerCase();
      expect(names.has(normName)).toBe(false);
      names.add(normName);

      // Check Slug
      const normSlug = b.slug.trim().toLowerCase();
      expect(slugs.has(normSlug)).toBe(false);
      slugs.add(normSlug);

      // Check Phone
      const normPhone = (b.phone || '').replace(/[^0-9]/g, '');
      if (normPhone.length > 5) {
        expect(phones.has(normPhone)).toBe(false);
        phones.add(normPhone);
      }
    }
  });

  it('deduplicateBusinesses should filter out duplicate records seamlessly', () => {
    const duplicated = [...SEED_BUSINESSES, ...SEED_BUSINESSES];
    const deduplicated = deduplicateBusinesses(duplicated);
    expect(deduplicated.length).toBe(SEED_BUSINESSES.length);
  });

  it('should have unique offers with distinct IDs', () => {
    const offerIds = new Set(SEED_OFFERS.map(o => o.id));
    expect(offerIds.size).toBe(SEED_OFFERS.length);
  });
});
