import { describe, it, expect, beforeEach } from 'vitest';
import { BannerService } from '../services/bannerService';
import { BannerPackage, Banner } from '../types';

describe('Banner Advertising Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides the 4 introductory banner packages with accurate prices and durations', async () => {
    const packages = await BannerService.getPackages();
    expect(packages.length).toBe(4);

    const starter = packages.find((p) => p.id === 'starter');
    expect(starter).toBeDefined();
    expect(starter?.price).toBe(499);
    expect(starter?.durationDays).toBe(7);

    const featured = packages.find((p) => p.id === 'featured');
    expect(featured).toBeDefined();
    expect(featured?.price).toBe(999);
    expect(featured?.durationDays).toBe(15);

    const homepage = packages.find((p) => p.id === 'homepage');
    expect(homepage).toBeDefined();
    expect(homepage?.price).toBe(1999);
    expect(homepage?.durationDays).toBe(30);

    const citywide = packages.find((p) => p.id === 'citywide');
    expect(citywide).toBeDefined();
    expect(citywide?.price).toBe(2999);
    expect(citywide?.durationDays).toBe(30);
  });

  it('allows administrator to customize package prices and durations', async () => {
    const packages = await BannerService.getPackages();
    const homepage = packages.find((p) => p.id === 'homepage')!;

    await BannerService.savePackage({
      ...homepage,
      price: 2499,
      durationDays: 45,
    });

    const updated = await BannerService.getPackages();
    const updatedHomepage = updated.find((p) => p.id === 'homepage');
    expect(updatedHomepage?.price).toBe(2499);
    expect(updatedHomepage?.durationDays).toBe(45);
  });

  it('creates a new campaign with status "pending"', async () => {
    const banner = await BannerService.createBannerCampaign({
      packageId: 'starter',
      businessName: 'Vidisha Sweets Corner',
      title: 'Grand Diwali Sale',
      description: 'Up to 25% discount on all gift hampers',
      imageUrl: 'https://example.com/banner.jpg',
      destinationUrl: 'https://vidishacity.in/business/vidisha-sweets',
      placement: 'category',
      startDate: '2026-11-01',
      expiryDate: '2026-11-08',
    });

    expect(banner.id).toBeDefined();
    expect(banner.status).toBe('pending');
    expect(banner.businessName).toBe('Vidisha Sweets Corner');
    expect(banner.impressionCount).toBe(0);
    expect(banner.clickCount).toBe(0);
  });

  it('approves a campaign into scheduled or active based on start date', async () => {
    // Future campaign -> scheduled
    const futureBanner = await BannerService.createBannerCampaign({
      packageId: 'homepage',
      businessName: 'Sanchi Hotel',
      title: 'Luxury Stay',
      description: 'Book online today',
      imageUrl: '',
      destinationUrl: 'https://vidishacity.in/business/sanchi-hotel',
      placement: 'homepage_hero',
      startDate: '2099-01-01',
      expiryDate: '2099-01-31',
    });

    const approvedFuture = await BannerService.approveBanner(futureBanner.id, 'admin@vidishacity.in');
    expect(approvedFuture.status).toBe('scheduled');

    // Past/Current campaign -> active
    const currentBanner = await BannerService.createBannerCampaign({
      packageId: 'starter',
      businessName: 'Govindam Sweets',
      title: 'Fresh Ghewar',
      description: 'Pure Desi Ghee',
      imageUrl: '',
      destinationUrl: 'https://vidishacity.in/business/govindam',
      placement: 'offers',
      startDate: '2020-01-01',
      expiryDate: '2099-12-31',
    });

    const approvedCurrent = await BannerService.approveBanner(currentBanner.id, 'admin@vidishacity.in');
    expect(approvedCurrent.status).toBe('active');
  });

  it('verifies manual payment and records reference, method, and amount', async () => {
    const banner = await BannerService.createBannerCampaign({
      packageId: 'homepage',
      businessName: 'Vidisha Auto Works',
      title: 'Complete Servicing',
      description: 'Best two-wheeler mechanic',
      imageUrl: '',
      destinationUrl: 'https://vidishacity.in/business/auto',
      placement: 'homepage_mid',
      startDate: '2026-11-01',
      expiryDate: '2026-12-01',
    });

    const verified = await BannerService.verifyPayment(
      banner.id,
      {
        paymentReference: 'UPI-987654321012',
        paymentMethod: 'upi',
        amountPaid: 1999,
      },
      'admin@vidishacity.in'
    );

    expect(verified.paymentReference).toBe('UPI-987654321012');
    expect(verified.paymentMethod).toBe('upi');
    expect(verified.amountPaid).toBe(1999);
  });

  it('detects slot conflicts for overlapping active/approved campaigns in the same placement', async () => {
    // Create and approve banner 1 on homepage_hero from 2026-11-01 to 2026-11-30
    const b1 = await BannerService.createBannerCampaign({
      packageId: 'homepage',
      businessName: 'Business A',
      title: 'Ad A',
      description: '',
      imageUrl: '',
      destinationUrl: 'https://vidishacity.in',
      placement: 'homepage_hero',
      startDate: '2026-11-01',
      expiryDate: '2026-11-30',
    });
    await BannerService.saveBanner({ ...b1, status: 'active' });

    // Check conflict for overlapping dates in same placement
    const conflicts = await BannerService.checkSlotConflict(
      'homepage_hero',
      '2026-11-15',
      '2026-12-15'
    );
    expect(conflicts.length).toBe(1);
    expect(conflicts[0].id).toBe(b1.id);

    // Check non-overlapping dates
    const noConflictsDate = await BannerService.checkSlotConflict(
      'homepage_hero',
      '2026-12-01',
      '2026-12-31'
    );
    expect(noConflictsDate.length).toBe(0);

    // Check different placement
    const noConflictsPlacement = await BannerService.checkSlotConflict(
      'category',
      '2026-11-15',
      '2026-11-25'
    );
    expect(noConflictsPlacement.length).toBe(0);
  });

  it('automatically expires past-due active banners', async () => {
    // Create an active banner that has already expired
    const expiredBanner = await BannerService.createBannerCampaign({
      packageId: 'starter',
      businessName: 'Old Campaign',
      title: 'Old Sale',
      description: '',
      imageUrl: '',
      destinationUrl: 'https://vidishacity.in',
      placement: 'category',
      startDate: '2020-01-01',
      expiryDate: '2020-01-08',
    });
    await BannerService.saveBanner({ ...expiredBanner, status: 'active' });

    const expiredCount = await BannerService.autoExpireBanners();
    expect(expiredCount).toBe(1);

    const fetched = await BannerService.getBannerById(expiredBanner.id);
    expect(fetched?.status).toBe('expired');
  });

  it('filters active banners strictly by date and status', async () => {
    // Active and valid dates
    const valid = await BannerService.createBannerCampaign({
      packageId: 'homepage',
      businessName: 'Live Advertiser',
      title: 'Live Now',
      description: '',
      imageUrl: '',
      destinationUrl: 'https://vidishacity.in',
      placement: 'homepage_hero',
      startDate: '2020-01-01',
      expiryDate: '2099-12-31',
    });
    await BannerService.saveBanner({ ...valid, status: 'active' });

    // Pending banner (should not be returned)
    await BannerService.createBannerCampaign({
      packageId: 'homepage',
      businessName: 'Pending Advertiser',
      title: 'Pending Ad',
      description: '',
      imageUrl: '',
      destinationUrl: 'https://vidishacity.in',
      placement: 'homepage_hero',
      startDate: '2020-01-01',
      expiryDate: '2099-12-31',
    });

    const activeBanners = await BannerService.getActiveBannersForPlacement('homepage_hero');
    expect(activeBanners.length).toBe(1);
    expect(activeBanners[0].id).toBe(valid.id);
  });
});
