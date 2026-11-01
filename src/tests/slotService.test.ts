import { describe, it, expect, beforeEach } from 'vitest';
import { SlotService } from '../services/slotService';
import { StorageService } from '../services/storageService';
import { Business } from '../types';

describe('Top 10 Slot Rules & Limits', () => {
  beforeEach(() => {
    StorageService.resetToDefaultSeed();
  });

  const mockApprovedPaidBiz: Business = {
    id: 'test-biz-paid',
    name: 'Test Approved Paid Shop',
    slug: 'test-approved-paid-shop',
    categoryId: 'cat-restaurants',
    categoryName: 'Restaurants and Cafes',
    categorySlug: 'restaurants-and-cafes',
    description: 'A test restaurant for verification',
    phone: '+91 9999999999',
    whatsapp: '+91 9999999999',
    address: 'Station Road, Vidisha',
    locality: 'Station Road',
    gallery: [],
    services: ['Dining'],
    priceRange: '₹₹',
    approvalStatus: 'approved',
    paymentStatus: 'paid',
    packageId: 'premium',
    isTop10: false,
    isSponsored: false,
    viewCount: 10,
    clickCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  it('strictly limits category slots to 10 positions', async () => {
    const slots = await SlotService.getCategorySlots('cat-restaurants');
    expect(slots.length).toBe(10);
    expect(slots[0].slotNumber).toBe(1);
    expect(slots[9].slotNumber).toBe(10);
  });

  it('rejects slot number outside 1-10 range', async () => {
    const resLow = await SlotService.assignSlot('cat-restaurants', 0, mockApprovedPaidBiz, '2026-12-31', 'admin');
    expect(resLow.success).toBe(false);

    const resHigh = await SlotService.assignSlot('cat-restaurants', 11, mockApprovedPaidBiz, '2026-12-31', 'admin');
    expect(resHigh.success).toBe(false);
  });

  it('rejects unapproved businesses from occupying Top 10 slots', async () => {
    const unapprovedBiz: Business = {
      ...mockApprovedPaidBiz,
      id: 'biz-unapproved',
      approvalStatus: 'pending'
    };

    const res = await SlotService.assignSlot('cat-restaurants', 2, unapprovedBiz, '2026-12-31', 'admin');
    expect(res.success).toBe(false);
    expect(res.message).toContain('Only approved businesses');
  });

  it('rejects unpaid businesses from occupying Top 10 slots', async () => {
    const unpaidBiz: Business = {
      ...mockApprovedPaidBiz,
      id: 'biz-unpaid',
      paymentStatus: 'unpaid'
    };

    const res = await SlotService.assignSlot('cat-restaurants', 2, unpaidBiz, '2026-12-31', 'admin');
    expect(res.success).toBe(false);
    expect(res.message).toContain('unpaid or unverified');
  });

  it('successfully assigns approved and paid business to vacant slot', async () => {
    await StorageService.saveBusiness(mockApprovedPaidBiz);
    const res = await SlotService.assignSlot('cat-restaurants', 2, mockApprovedPaidBiz, '2026-12-31', 'admin');
    expect(res.success).toBe(true);

    const slots = await SlotService.getCategorySlots('cat-restaurants');
    const slot2 = slots.find(s => s.slotNumber === 2);
    expect(slot2?.businessId).toBe(mockApprovedPaidBiz.id);
    expect(slot2?.status).toBe('active');
  });

  it('vacates slot correctly and removes Top 10 flag from business', async () => {
    await StorageService.saveBusiness(mockApprovedPaidBiz);
    await SlotService.assignSlot('cat-restaurants', 3, mockApprovedPaidBiz, '2026-12-31', 'admin');

    await SlotService.vacateSlot('cat-restaurants', 3, 'admin');

    const slots = await SlotService.getCategorySlots('cat-restaurants');
    const slot3 = slots.find(s => s.slotNumber === 3);
    expect(slot3?.businessId).toBeNull();
    expect(slot3?.status).toBe('vacant');

    const biz = await StorageService.getBusinessByIdOrSlug(mockApprovedPaidBiz.id);
    expect(biz?.isTop10).toBe(false);
  });
});
