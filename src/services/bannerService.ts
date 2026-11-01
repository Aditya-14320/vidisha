import { isFirebaseConfigured, db } from '../lib/firebase';
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { StorageService } from './storageService';
import { Banner, BannerPackage, BannerPlacement, BannerStatus } from '../types';

// --------------- Storage Keys ---------------
const BANNERS_KEY = 'vidisha_banners_v1';
const BANNER_PACKAGES_KEY = 'vidisha_banner_packages_v1';

// --------------- Default Packages (seed data) ---------------
const DEFAULT_BANNER_PACKAGES: BannerPackage[] = [
  {
    id: 'starter',
    name: 'Starter Banner',
    price: 499,
    durationDays: 7,
    allowedPlacements: ['category', 'offers'],
    description: 'One category page OR Offers page placement for 7 days.'
  },
  {
    id: 'featured',
    name: 'Featured Banner',
    price: 999,
    durationDays: 15,
    allowedPlacements: ['category', 'offers'],
    description: 'Prominent placement on one selected category page OR Offers page for 15 days.'
  },
  {
    id: 'homepage',
    name: 'Homepage Banner',
    price: 1999,
    durationDays: 30,
    allowedPlacements: ['homepage_hero', 'homepage_mid'],
    description: 'One homepage banner slot for 30 days.'
  },
  {
    id: 'citywide',
    name: 'Citywide Campaign',
    price: 2999,
    durationDays: 30,
    allowedPlacements: ['homepage_hero', 'homepage_mid', 'category', 'offers'],
    description: 'Homepage + one relevant category page + Offers page for 30 days.'
  }
];

// --------------- Local Storage Helpers ---------------
function getLocal<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key}`, e);
  }
}

function isUsingFirebase(): boolean {
  if (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'test') return false;
  return isFirebaseConfigured && db !== null;
}

const loggedNotices = new Set<string>();
function logFirestoreNotice(context: string, err: any) {
  if (!loggedNotices.has(context)) {
    loggedNotices.add(context);
    console.info(`[Vidisha City] Using local store for ${context} (${err?.code || err?.message || 'rules pending'})`);
  }
}

// --------------- Ensure default packages are seeded ---------------
function ensureDefaultPackages(): void {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(BANNER_PACKAGES_KEY);
  if (!existing) {
    setLocal(BANNER_PACKAGES_KEY, DEFAULT_BANNER_PACKAGES);
  }
}
ensureDefaultPackages();

// --------------- Banner Service ---------------
export const BannerService = {
  // ---- Packages ----

  async getPackages(): Promise<BannerPackage[]> {
    if (isUsingFirebase()) {
      try {
        const snap = await getDocs(collection(db!, 'bannerPackages'));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as BannerPackage));
        }
      } catch (err) {
        logFirestoreNotice('getPackages', err);
      }
    }
    return getLocal<BannerPackage[]>(BANNER_PACKAGES_KEY, DEFAULT_BANNER_PACKAGES);
  },

  async savePackage(pkg: BannerPackage): Promise<void> {
    if (isUsingFirebase()) {
      try {
        await setDoc(doc(db!, 'bannerPackages', pkg.id), pkg, { merge: true });
      } catch (err) {
        logFirestoreNotice('savePackage', err);
      }
    }
    const list = getLocal<BannerPackage[]>(BANNER_PACKAGES_KEY, DEFAULT_BANNER_PACKAGES);
    const index = list.findIndex(p => p.id === pkg.id);
    if (index >= 0) {
      list[index] = pkg;
    } else {
      list.push(pkg);
    }
    setLocal(BANNER_PACKAGES_KEY, list);
  },

  // ---- Banners ----

  async getBanners(): Promise<Banner[]> {
    if (isUsingFirebase()) {
      try {
        const snap = await getDocs(collection(db!, 'banners'));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as Banner));
        }
      } catch (err) {
        logFirestoreNotice('getBanners', err);
      }
    }
    return getLocal<Banner[]>(BANNERS_KEY, []);
  },

  async getBannerById(id: string): Promise<Banner | null> {
    if (isUsingFirebase()) {
      try {
        const snap = await getDoc(doc(db!, 'banners', id));
        if (snap.exists()) {
          return { id: snap.id, ...snap.data() } as Banner;
        }
      } catch (err) {
        logFirestoreNotice('getBannerById', err);
      }
    }
    const list = getLocal<Banner[]>(BANNERS_KEY, []);
    return list.find(b => b.id === id) || null;
  },

  async saveBanner(banner: Banner): Promise<Banner> {
    const now = new Date().toISOString();
    const updated: Banner = {
      ...banner,
      updatedAt: now,
      createdAt: banner.createdAt || now,
    };

    if (isUsingFirebase()) {
      try {
        await setDoc(doc(db!, 'banners', updated.id), updated, { merge: true });
      } catch (err) {
        logFirestoreNotice('saveBanner', err);
      }
    }

    const list = getLocal<Banner[]>(BANNERS_KEY, []);
    const index = list.findIndex(b => b.id === updated.id);
    if (index >= 0) {
      list[index] = updated;
    } else {
      list.push(updated);
    }
    setLocal(BANNERS_KEY, list);
    return updated;
  },

  async deleteBanner(id: string): Promise<void> {
    if (isUsingFirebase()) {
      try {
        await deleteDoc(doc(db!, 'banners', id));
      } catch (err) {
        logFirestoreNotice('deleteBanner', err);
      }
    }
    const list = getLocal<Banner[]>(BANNERS_KEY, []);
    setLocal(BANNERS_KEY, list.filter(b => b.id !== id));
  },

  async getActiveBannersForPlacement(placement: BannerPlacement): Promise<Banner[]> {
    const today = new Date().toISOString().split('T')[0];
    let all: Banner[] = [];

    if (isUsingFirebase()) {
      try {
        // Query specifically for status == 'active' to satisfy Firestore security rules
        const q = query(
          collection(db!, 'banners'),
          where('status', '==', 'active')
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          all = snap.docs.map(d => ({ id: d.id, ...d.data() } as Banner));
        }
      } catch (err) {
        logFirestoreNotice('getActiveBannersForPlacement', err);
      }
    }

    if (all.length === 0) {
      all = getLocal<Banner[]>(BANNERS_KEY, []);
    }

    return all.filter(
      b =>
        b.status === 'active' &&
        b.placement === placement &&
        b.startDate.split('T')[0] <= today &&
        b.expiryDate.split('T')[0] >= today
    );
  },

  async checkSlotConflict(
    placement: BannerPlacement,
    startDate: string,
    expiryDate: string,
    excludeBannerId?: string
  ): Promise<Banner[]> {
    const all = await this.getBanners();
    const activeStatuses: BannerStatus[] = ['active', 'approved', 'scheduled'];
    return all.filter(b => {
      if (excludeBannerId && b.id === excludeBannerId) return false;
      if (!activeStatuses.includes(b.status)) return false;
      if (b.placement !== placement) return false;
      // Check date overlap: banners overlap if one starts before the other ends and vice versa
      return b.startDate <= expiryDate && b.expiryDate >= startDate;
    });
  },

  async autoExpireBanners(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const all = await this.getBanners();
    let expiredCount = 0;

    for (const banner of all) {
      if (banner.status === 'active' && banner.expiryDate.split('T')[0] < today) {
        await this.saveBanner({ ...banner, status: 'expired' });
        expiredCount++;
      }
    }

    return expiredCount;
  },

  // ---- Campaign Lifecycle ----

  async createBannerCampaign(data: {
    packageId: string;
    businessName: string;
    title: string;
    description: string;
    imageUrl: string;
    destinationUrl: string;
    placement: BannerPlacement;
    startDate: string;
    expiryDate: string;
  }): Promise<Banner> {
    const now = new Date().toISOString();
    const id = `banner-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newBanner: Banner = {
      id,
      packageId: data.packageId,
      businessId: '',
      businessName: data.businessName,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      destinationUrl: data.destinationUrl,
      placement: data.placement,
      startDate: data.startDate,
      expiryDate: data.expiryDate,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      impressionCount: 0,
      clickCount: 0,
    };
    return this.saveBanner(newBanner);
  },

  async approveBanner(id: string, performedBy: string): Promise<Banner> {
    const banner = await this.getBannerById(id);
    if (!banner) throw new Error(`Banner not found: ${id}`);

    const now = new Date().toISOString();
    const newStatus: BannerStatus = banner.startDate <= now ? 'active' : 'scheduled';
    const updated = await this.saveBanner({ ...banner, status: newStatus });

    await StorageService.recordAuditLog({
      action: 'BANNER_APPROVED',
      performedBy,
      targetType: 'banner',
      targetId: id,
      targetName: banner.title,
      details: { newStatus, businessName: banner.businessName }
    });

    return updated;
  },

  async rejectBanner(id: string, reason: string, performedBy: string): Promise<Banner> {
    const banner = await this.getBannerById(id);
    if (!banner) throw new Error(`Banner not found: ${id}`);

    const updated = await this.saveBanner({
      ...banner,
      status: 'rejected',
      rejectionReason: reason,
    });

    await StorageService.recordAuditLog({
      action: 'BANNER_REJECTED',
      performedBy,
      targetType: 'banner',
      targetId: id,
      targetName: banner.title,
      details: { reason, businessName: banner.businessName }
    });

    return updated;
  },

  async pauseBanner(id: string, performedBy: string): Promise<Banner> {
    const banner = await this.getBannerById(id);
    if (!banner) throw new Error(`Banner not found: ${id}`);

    const updated = await this.saveBanner({ ...banner, status: 'paused' });

    await StorageService.recordAuditLog({
      action: 'BANNER_PAUSED',
      performedBy,
      targetType: 'banner',
      targetId: id,
      targetName: banner.title,
      details: { businessName: banner.businessName }
    });

    return updated;
  },

  async resumeBanner(id: string, performedBy: string): Promise<Banner> {
    const banner = await this.getBannerById(id);
    if (!banner) throw new Error(`Banner not found: ${id}`);

    const now = new Date().toISOString();
    const newStatus: BannerStatus =
      banner.startDate <= now && banner.expiryDate >= now
        ? 'active'
        : banner.startDate > now
          ? 'scheduled'
          : 'expired';
    const updated = await this.saveBanner({ ...banner, status: newStatus });

    await StorageService.recordAuditLog({
      action: 'BANNER_RESUMED',
      performedBy,
      targetType: 'banner',
      targetId: id,
      targetName: banner.title,
      details: { newStatus, businessName: banner.businessName }
    });

    return updated;
  },

  async verifyPayment(
    id: string,
    paymentData: { paymentReference: string; paymentMethod: 'upi' | 'bank_transfer' | 'cash' | 'cheque'; amountPaid: number },
    performedBy: string
  ): Promise<Banner> {
    const banner = await this.getBannerById(id);
    if (!banner) throw new Error(`Banner not found: ${id}`);

    const updated = await this.saveBanner({
      ...banner,
      paymentReference: paymentData.paymentReference,
      paymentMethod: paymentData.paymentMethod,
      amountPaid: paymentData.amountPaid,
    });

    await StorageService.recordAuditLog({
      action: 'BANNER_PAYMENT_VERIFIED',
      performedBy,
      targetType: 'banner',
      targetId: id,
      targetName: banner.title,
      details: {
        paymentReference: paymentData.paymentReference,
        paymentMethod: paymentData.paymentMethod,
        amountPaid: paymentData.amountPaid,
        businessName: banner.businessName
      }
    });

    return updated;
  },

  // ---- Analytics ----

  async recordImpression(id: string): Promise<void> {
    const list = getLocal<Banner[]>(BANNERS_KEY, []);
    const index = list.findIndex(b => b.id === id);
    if (index >= 0) {
      list[index].impressionCount = (list[index].impressionCount || 0) + 1;
      setLocal(BANNERS_KEY, list);
    }
  },

  async recordClick(id: string): Promise<void> {
    const list = getLocal<Banner[]>(BANNERS_KEY, []);
    const index = list.findIndex(b => b.id === id);
    if (index >= 0) {
      list[index].clickCount = (list[index].clickCount || 0) + 1;
      setLocal(BANNERS_KEY, list);
    }
  },
};
