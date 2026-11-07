import { describe, it, expect, beforeEach } from 'vitest';
import { BusinessService } from '../services/businessService';
import { ApplicationService } from '../services/applicationService';
import { StorageService } from '../services/storageService';
import { Business } from '../types';

describe('Business Directory Queries & Application Submissions', () => {
  beforeEach(() => {
    StorageService.resetToDefaultSeed();
  });

  it('excludes unapproved businesses from public display', async () => {
    const hiddenBiz: Business = {
      id: 'biz-hidden',
      name: 'Hidden Unapproved Establishment',
      slug: 'hidden-unapproved-establishment',
      categoryId: 'cat-restaurants',
      categoryName: 'Restaurants and Cafes',
      categorySlug: 'restaurants-and-cafes',
      description: 'Hidden pending shop',
      phone: '+91 9111111111',
      whatsapp: '+91 9111111111',
      address: 'Durga Nagar, Vidisha',
      locality: 'Durga Nagar',
      gallery: [],
      services: [],
      priceRange: '₹',
      approvalStatus: 'pending', // unapproved!
      paymentStatus: 'unpaid',
      packageId: 'basic',
      isTop10: false,
      isSponsored: false,
      viewCount: 0,
      clickCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await StorageService.saveBusiness(hiddenBiz);

    const publicList = await BusinessService.getPublicBusinesses();
    const found = publicList.find(b => b.id === hiddenBiz.id);
    expect(found).toBeUndefined();
  });

  it('filters businesses by locality accurately', async () => {
    const testBiz: Business = {
      id: 'biz-test-loc',
      name: 'Station Road Verified Store',
      slug: 'station-road-verified-store',
      categoryId: 'cat-restaurants',
      categoryName: 'Restaurants and Cafes',
      categorySlug: 'restaurants-and-cafes',
      description: 'Test business on station road',
      phone: '+91 9425111111',
      whatsapp: '+91 9425111111',
      address: 'Station Road, Vidisha',
      locality: 'Station Road',
      gallery: [],
      services: ['Service'],
      priceRange: '₹',
      approvalStatus: 'approved',
      paymentStatus: 'paid',
      packageId: 'basic',
      isTop10: false,
      isSponsored: false,
      viewCount: 0,
      clickCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await StorageService.saveBusiness(testBiz);

    const list = await BusinessService.getPublicBusinesses({ locality: 'Station Road' });
    expect(list.length).toBeGreaterThan(0);
    list.forEach(b => {
      expect(b.locality.toLowerCase()).toBe('station road');
    });
  });

  it('validates required fields on business listing application', async () => {
    // Missing business name
    const resNoName = await ApplicationService.submitApplication({
      businessName: '',
      ownerName: 'Test Owner',
      phone: '9876543210',
      whatsapp: '9876543210',
      categoryId: 'cat-restaurants',
      address: 'Civil Lines, Vidisha',
      locality: 'Civil Lines',
      description: 'Test description',
      services: ['Catering'],
      requestedPackage: 'basic',
      consentTerms: true
    });
    expect(resNoName.success).toBe(false);

    // Missing consent terms
    const resNoTerms = await ApplicationService.submitApplication({
      businessName: 'Valid Business',
      ownerName: 'Test Owner',
      phone: '9876543210',
      whatsapp: '9876543210',
      categoryId: 'cat-restaurants',
      address: 'Civil Lines, Vidisha',
      locality: 'Civil Lines',
      description: 'Test description',
      services: ['Catering'],
      requestedPackage: 'basic',
      consentTerms: false // Not checked
    });
    expect(resNoTerms.success).toBe(false);
  });

  it('submits valid application in pending state', async () => {
    const valid = await ApplicationService.submitApplication({
      businessName: 'New Vidisha Hardware',
      ownerName: 'Sanjay Jain',
      phone: '9826012345',
      whatsapp: '9826012345',
      categoryId: 'cat-home-repair',
      address: 'Main Market, Tilak Chowk, Vidisha',
      locality: 'Tilak Chowk',
      description: 'Wholesale and retail electrical hardware and sanitary fittings.',
      services: ['Hardware', 'Paints'],
      requestedPackage: 'premium',
      consentTerms: true
    });

    expect(valid.success).toBe(true);
    expect(valid.application).toBeDefined();
    expect(valid.application?.status).toBe('pending');
  });

  it('submits application with mapUrl and converts to business with mapUrl preserved', async () => {
    const testMapUrl = 'https://maps.app.goo.gl/vidisha-test-link';
    const valid = await ApplicationService.submitApplication({
      businessName: 'Vidisha Map Electronics',
      ownerName: 'Amit Sharma',
      phone: '9826099999',
      whatsapp: '9826099999',
      categoryId: 'cat-home-repair',
      address: 'Station Road, Vidisha',
      locality: 'Station Road',
      mapUrl: testMapUrl,
      description: 'Electronics sales and repair.',
      services: ['Repair', 'Sales'],
      requestedPackage: 'complete',
      consentTerms: true
    });

    expect(valid.success).toBe(true);
    expect(valid.application?.mapUrl).toBe(testMapUrl);

    if (valid.application) {
      const convertedBiz = await ApplicationService.convertToBusiness(valid.application, 'admin@vidisha.in');
      expect(convertedBiz.mapUrl).toBe(testMapUrl);
    }
  });

  it('adds custom locality, prevents duplicates, and retrieves updated localities list', async () => {
    const newLocality = 'Mukharji Nagar Colony';
    const firstAdd = await StorageService.addCustomLocality(newLocality);
    expect(firstAdd.success).toBe(true);
    expect(firstAdd.alreadyExisted).toBe(false);

    // Attempting to add same locality case-insensitively should be prevented as duplicate
    const duplicateAdd = await StorageService.addCustomLocality('mukharji nagar colony');
    expect(duplicateAdd.success).toBe(true);
    expect(duplicateAdd.alreadyExisted).toBe(true);

    const localities = await StorageService.getLocalities();
    expect(localities).toContain(newLocality);
    // Count occurrences of newLocality - must be exactly 1
    const count = localities.filter(l => l.toLowerCase() === newLocality.toLowerCase()).length;
    expect(count).toBe(1);
    expect(localities[localities.length - 1]).toBe('Other / Outskirts');
  });

  it('saves and preserves short and long Google Maps URLs on business listings', async () => {
    const shortMapUrl = 'https://maps.app.goo.gl/kXz99xyz';
    const biz = await StorageService.saveBusiness({
      id: 'biz-test-maps',
      name: 'Vidisha Maps Cafe',
      slug: 'vidisha-maps-cafe',
      categoryId: 'cat-restaurants',
      categoryName: 'Restaurants and Cafes',
      categorySlug: 'restaurants-and-cafes',
      description: 'Cafe with verified maps link',
      phone: '9826011111',
      whatsapp: '9826011111',
      address: 'Near Station Road, Vidisha',
      locality: 'Station Road',
      mapUrl: shortMapUrl,
      gallery: [],
      services: ['Coffee'],
      priceRange: '₹₹',
      approvalStatus: 'approved',
      paymentStatus: 'paid',
      packageId: 'complete',
      isTop10: false,
      isSponsored: false,
      viewCount: 0,
      clickCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    expect(biz.mapUrl).toBe(shortMapUrl);

    const fetched = await StorageService.getBusinessByIdOrSlug('biz-test-maps');
    expect(fetched?.mapUrl).toBe(shortMapUrl);
  });
});
