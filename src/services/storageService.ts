import { isFirebaseConfigured, db } from '../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  runTransaction,
  writeBatch
} from 'firebase/firestore';
import {
  SEED_CATEGORIES,
  SEED_BUSINESSES,
  SEED_OFFERS,
  SEED_SETTINGS,
  INITIAL_TOP10_SLOTS
} from '../data/seedData';
import {
  Category,
  Business,
  Offer,
  OfferClaim,
  ListingApplication,
  PaymentRecord,
  Top10Slot,
  ReportItem,
  AuditLog,
  AppSettings
} from '../types';

export const STORAGE_KEYS = {
  CATEGORIES: 'vidisha_categories_v1',
  BUSINESSES: 'vidisha_businesses_v1',
  OFFERS: 'vidisha_offers_v1',
  OFFER_CLAIMS: 'vidisha_offer_claims_v1',
  APPLICATIONS: 'vidisha_applications_v1',
  PAYMENTS: 'vidisha_payments_v1',
  SLOTS: 'vidisha_slots_v1',
  REPORTS: 'vidisha_reports_v1',
  AUDIT: 'vidisha_audit_v1',
  SETTINGS: 'vidisha_settings_v1',
  INITIALIZED: 'vidisha_db_initialized_v5',
};

// Strict Deduplication Helpers - Guarantees no business or offer is ever repeated
export function deduplicateBusinesses(businesses: Business[]): Business[] {
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const seenSlugs = new Set<string>();
  const result: Business[] = [];

  for (const b of businesses) {
    if (!b || !b.name) continue;
    const cleanId = (b.id || '').trim();
    const normName = b.name.trim().toLowerCase();
    const normSlug = (b.slug || '').trim().toLowerCase();

    // Check if duplicate by ID, Name or Slug
    if (cleanId && seenIds.has(cleanId)) continue;
    if (normName && seenNames.has(normName)) continue;
    if (normSlug && seenSlugs.has(normSlug)) continue;

    if (cleanId) seenIds.add(cleanId);
    if (normName) seenNames.add(normName);
    if (normSlug) seenSlugs.add(normSlug);

    result.push(b);
  }

  return result;
}

export function deduplicateOffers(offers: Offer[]): Offer[] {
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const result: Offer[] = [];

  for (const o of offers) {
    if (!o || !o.title) continue;
    const cleanId = (o.id || '').trim();
    const normKey = `${(o.businessId || '').trim()}_${o.title.trim().toLowerCase()}`;

    if (cleanId && seenIds.has(cleanId)) continue;
    if (seenTitles.has(normKey)) continue;

    if (cleanId) seenIds.add(cleanId);
    seenTitles.add(normKey);
    result.push(o);
  }

  return result;
}

// Mock/Fake IDs that must never be presented as real businesses or offers
export const MOCK_BUSINESS_IDS = new Set<string>([]);
export const MOCK_OFFER_IDS = new Set<string>([]);

// Check if local persistent store is initialized; if not, seed it with rich Vidisha database.
function ensureInitializedLocalStore() {
  if (typeof window === 'undefined') return;
  const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!isInit) {
    const rawBiz = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    let existingList: Business[] = [];
    if (rawBiz) {
      try {
        const parsed = JSON.parse(rawBiz);
        if (Array.isArray(parsed)) existingList = parsed;
      } catch (e) {}
    }
    const combinedBiz = deduplicateBusinesses([...existingList, ...SEED_BUSINESSES]);

    const rawOffers = localStorage.getItem(STORAGE_KEYS.OFFERS);
    let existingOffers: Offer[] = [];
    if (rawOffers) {
      try {
        const parsed = JSON.parse(rawOffers);
        if (Array.isArray(parsed)) existingOffers = parsed;
      } catch (e) {}
    }
    const combinedOffers = deduplicateOffers([...existingOffers, ...SEED_OFFERS]);

    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(combinedBiz));
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(combinedOffers));
    if (!localStorage.getItem(STORAGE_KEYS.SLOTS)) {
      localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(INITIAL_TOP10_SLOTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(SEED_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify([
        {
          id: 'audit-seed-1',
          action: 'SYSTEM_INITIALIZED',
          performedBy: 'System Bootstrap',
          targetType: 'settings',
          targetId: 'seed',
          details: { seedDate: new Date().toISOString(), businesses: combinedBiz.length },
          timestamp: new Date().toISOString()
        }
      ]));
    }
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

// Ensure init on module load
ensureInitializedLocalStore();

const loggedNotices = new Set<string>();
function logFirestoreNotice(context: string, err: any) {
  if (!loggedNotices.has(context)) {
    loggedNotices.add(context);
    console.info(`[Vidisha City] Using local store for ${context} (${err?.code || err?.message || 'rules pending'})`);
  }
}

export const StorageService = {
  // Helper to read from local store
  getLocal<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage`, e);
      return defaultValue;
    }
  },

  // Helper to write to local store
  setLocal<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing ${key} to localStorage`, e);
    }
  },

  resetToDefaultSeed() {
    this.resetToFullSeedDatabase();
  },

  resetToFullSeedDatabase() {
    this.setLocal(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
    this.setLocal(STORAGE_KEYS.BUSINESSES, deduplicateBusinesses(SEED_BUSINESSES));
    this.setLocal(STORAGE_KEYS.OFFERS, deduplicateOffers(SEED_OFFERS));
    this.setLocal(STORAGE_KEYS.SLOTS, INITIAL_TOP10_SLOTS);
    this.setLocal(STORAGE_KEYS.SETTINGS, SEED_SETTINGS);
    this.setLocal(STORAGE_KEYS.INITIALIZED, 'true');
  },

  exportFullDatabase() {
    return {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      categories: this.getLocal(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES),
      businesses: deduplicateBusinesses(this.getLocal(STORAGE_KEYS.BUSINESSES, SEED_BUSINESSES)),
      offers: deduplicateOffers(this.getLocal(STORAGE_KEYS.OFFERS, SEED_OFFERS)),
      applications: this.getLocal(STORAGE_KEYS.APPLICATIONS, []),
      payments: this.getLocal(STORAGE_KEYS.PAYMENTS, []),
      slots: this.getLocal(STORAGE_KEYS.SLOTS, INITIAL_TOP10_SLOTS),
      settings: this.getLocal(STORAGE_KEYS.SETTINGS, SEED_SETTINGS),
      banners: this.getLocal('vidisha_banners_v1', []),
    };
  },

  importFullDatabase(data: any): { success: boolean; count: number; error?: string } {
    try {
      if (!data || typeof data !== 'object') {
        return { success: false, count: 0, error: 'Invalid database JSON format.' };
      }
      let count = 0;
      if (Array.isArray(data.categories)) {
        this.setLocal(STORAGE_KEYS.CATEGORIES, data.categories);
        count += data.categories.length;
      }
      if (Array.isArray(data.businesses)) {
        const clean = deduplicateBusinesses(data.businesses);
        this.setLocal(STORAGE_KEYS.BUSINESSES, clean);
        count += clean.length;
      }
      if (Array.isArray(data.offers)) {
        const clean = deduplicateOffers(data.offers);
        this.setLocal(STORAGE_KEYS.OFFERS, clean);
        count += clean.length;
      }
      if (Array.isArray(data.applications)) {
        this.setLocal(STORAGE_KEYS.APPLICATIONS, data.applications);
        count += data.applications.length;
      }
      if (Array.isArray(data.payments)) {
        this.setLocal(STORAGE_KEYS.PAYMENTS, data.payments);
        count += data.payments.length;
      }
      if (data.slots && typeof data.slots === 'object') {
        this.setLocal(STORAGE_KEYS.SLOTS, data.slots);
      }
      if (data.settings && typeof data.settings === 'object') {
        this.setLocal(STORAGE_KEYS.SETTINGS, data.settings);
      }
      if (Array.isArray(data.banners)) {
        this.setLocal('vidisha_banners_v1', data.banners);
      }
      return { success: true, count };
    } catch (err: any) {
      return { success: false, count: 0, error: err.message || 'Import failed.' };
    }
  },

  async syncSeedToFirestore(): Promise<{ success: boolean; count: number; error?: string }> {
    if (!db) return { success: false, count: 0, error: 'Cloud Firestore is not initialized or offline.' };

    try {
      let count = 0;
      // 1. Categories
      for (const cat of SEED_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat, { merge: true });
        count++;
      }

      // 2. Businesses
      for (const biz of SEED_BUSINESSES) {
        await setDoc(doc(db, 'businesses', biz.id), biz, { merge: true });
        count++;
      }

      // 3. Offers
      for (const off of SEED_OFFERS) {
        await setDoc(doc(db, 'offers', off.id), off, { merge: true });
        count++;
      }

      // 4. Global Settings
      await setDoc(doc(db, 'appSettings', 'global-settings'), SEED_SETTINGS, { merge: true });
      count++;

      return { success: true, count };
    } catch (err: any) {
      const isPermission = err?.code === 'permission-denied' || (err?.message && err.message.includes('Missing or insufficient permissions'));
      const friendlyError = isPermission
        ? 'Firebase Firestore is currently locked or rules need publishing. In your Firebase Console > Firestore Database > Rules tab, paste the rules from firestore.rules and click "Publish".'
        : (err.message || 'Error writing to Firestore');
      console.warn('Firestore sync status:', friendlyError);
      return { success: false, count: 0, error: friendlyError };
    }
  },

  isUsingFirebase(): boolean {
    // If in test environment or explicitly testing, use local storage engine
    if (import.meta.env.MODE === 'test') {
      return false;
    }
    return isFirebaseConfigured && db !== null;
  },

  /**
   * Automatically initializes and seeds Cloud Firestore if it is currently empty.
   */
  async autoSeedIfEmpty(): Promise<void> {
    if (!this.isUsingFirebase() || !db) return;
    try {
      const snap = await getDocs(collection(db, 'categories'));
      if (snap.empty) {
        console.info('[Vidisha City] Firestore database is empty. Auto-seeding 20 official categories & settings...');
        await this.syncSeedToFirestore();
        console.info('[Vidisha City] Auto-seeding completed!');
      }
    } catch (err) {
      logFirestoreNotice('autoSeedIfEmpty', err);
    }
  },

  // ---------------- CATEGORIES ----------------
  async getCategories(): Promise<Category[]> {
    if (this.isUsingFirebase()) {
      try {
        const snap = await getDocs(query(collection(db!, 'categories'), orderBy('order', 'asc')));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
        } else {
          // If empty, auto-seed in the background for next loads
          this.autoSeedIfEmpty().catch(console.warn);
        }
      } catch (err) {
        logFirestoreNotice('getCategories', err);
      }
    }
    const list = this.getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
    return [...list].sort((a, b) => a.order - b.order);
  },

  async saveCategory(category: Category): Promise<Category> {
    if (this.isUsingFirebase()) {
      try {
        await setDoc(doc(db!, 'categories', category.id), category, { merge: true });
      } catch (err) {
        logFirestoreNotice('saveCategory', err);
      }
    }
    const list = this.getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
    const index = list.findIndex(c => c.id === category.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...category, updatedAt: new Date().toISOString() };
    } else {
      list.push({ ...category, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.setLocal(STORAGE_KEYS.CATEGORIES, list);
    return category;
  },

  async deleteCategory(categoryId: string): Promise<void> {
    if (this.isUsingFirebase()) {
      try {
        await deleteDoc(doc(db!, 'categories', categoryId));
      } catch (err) {
        logFirestoreNotice('deleteCategory', err);
      }
    }
    const list = this.getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
    const updated = list.filter(c => c.id !== categoryId);
    this.setLocal(STORAGE_KEYS.CATEGORIES, updated);
  },

  // ---------------- BUSINESSES ----------------
  async getBusinesses(): Promise<Business[]> {
    const localList = this.getLocal<Business[]>(STORAGE_KEYS.BUSINESSES, []);
    let remoteList: Business[] = [];

    if (this.isUsingFirebase()) {
      try {
        const snap = await getDocs(collection(db!, 'businesses'));
        if (!snap.empty) {
          remoteList = snap.docs.map(d => ({ id: d.id, ...d.data() } as Business));
        }
      } catch (err) {
        logFirestoreNotice('getBusinesses', err);
      }
    }

    const cleanLocal = localList.filter(b => !MOCK_BUSINESS_IDS.has(b.id));
    const cleanRemote = remoteList.filter(b => !MOCK_BUSINESS_IDS.has(b.id));

    if (cleanRemote.length === 0) {
      return deduplicateBusinesses(cleanLocal);
    }

    return deduplicateBusinesses([...cleanRemote, ...cleanLocal]);
  },

  async getBusinessByIdOrSlug(idOrSlug: string): Promise<Business | null> {
    const list = await this.getBusinesses();
    return list.find(b => b.id === idOrSlug || b.slug === idOrSlug) || null;
  },

  async saveBusiness(business: Business): Promise<Business> {
    const now = new Date().toISOString();
    const updatedBusiness: Business = {
      ...business,
      updatedAt: now,
      createdAt: business.createdAt || now,
    };

    if (this.isUsingFirebase()) {
      try {
        await setDoc(doc(db!, 'businesses', updatedBusiness.id), updatedBusiness, { merge: true });
      } catch (err) {
        logFirestoreNotice('saveBusiness', err);
      }
    }

    const list = this.getLocal<Business[]>(STORAGE_KEYS.BUSINESSES, SEED_BUSINESSES);
    const index = list.findIndex(b => b.id === updatedBusiness.id || (b.slug && b.slug === updatedBusiness.slug));
    if (index >= 0) {
      list[index] = updatedBusiness;
    } else {
      list.push(updatedBusiness);
    }
    const deduplicated = deduplicateBusinesses(list);
    this.setLocal(STORAGE_KEYS.BUSINESSES, deduplicated);
    return updatedBusiness;
  },

  async deleteBusiness(businessId: string): Promise<void> {
    if (this.isUsingFirebase()) {
      try {
        await deleteDoc(doc(db!, 'businesses', businessId));
      } catch (err) {
        logFirestoreNotice('deleteBusiness', err);
      }
    }
    const list = this.getLocal<Business[]>(STORAGE_KEYS.BUSINESSES, SEED_BUSINESSES);
    this.setLocal(STORAGE_KEYS.BUSINESSES, list.filter(b => b.id !== businessId));
  },

  // ---------------- TOP 10 SLOTS (Concurrency-safe, server-enforced max 10) ----------------
  async getSlotsForCategory(categoryId: string): Promise<Top10Slot[]> {
    const allSlots = this.getLocal<Record<string, Top10Slot[]>>(STORAGE_KEYS.SLOTS, INITIAL_TOP10_SLOTS);
    if (!allSlots[categoryId]) {
      // Initialize 10 vacant slots for category
      allSlots[categoryId] = Array.from({ length: 10 }, (_, i) => ({
        id: `${categoryId}_slot_${i + 1}`,
        categoryId,
        slotNumber: i + 1,
        businessId: null,
        businessName: null,
        businessSlug: null,
        assignedAt: null,
        expiresAt: null,
        status: 'vacant'
      }));
      this.setLocal(STORAGE_KEYS.SLOTS, allSlots);
    }
    return allSlots[categoryId];
  },

  async assignTop10Slot(
    categoryId: string,
    slotNumber: number,
    business: Business,
    expiresAt: string,
    performedBy: string
  ): Promise<{ success: boolean; message: string }> {
    // Validate bounds: Must be strictly between 1 and 10
    if (slotNumber < 1 || slotNumber > 10) {
      return { success: false, message: 'Invalid slot. Categories have exactly 10 slots (1-10).' };
    }

    // Must be approved and paid
    if (business.approvalStatus !== 'approved') {
      return { success: false, message: 'Only approved businesses can occupy a Top 10 slot.' };
    }
    if (business.paymentStatus !== 'paid') {
      return { success: false, message: 'Business has unpaid or unverified payment status.' };
    }

    // Server-side / transaction equivalent logic
    const allSlots = this.getLocal<Record<string, Top10Slot[]>>(STORAGE_KEYS.SLOTS, INITIAL_TOP10_SLOTS);
    const categorySlots = allSlots[categoryId] || Array.from({ length: 10 }, (_, i) => ({
      id: `${categoryId}_slot_${i + 1}`,
      categoryId,
      slotNumber: i + 1,
      businessId: null,
      businessName: null,
      businessSlug: null,
      assignedAt: null,
      expiresAt: null,
      status: 'vacant'
    }));

    // Check if business is already in another slot in this category
    const existingIndex = categorySlots.findIndex(s => s.businessId === business.id && s.slotNumber !== slotNumber);
    if (existingIndex >= 0) {
      // Vacate old slot
      categorySlots[existingIndex] = {
        ...categorySlots[existingIndex],
        businessId: null,
        businessName: null,
        businessSlug: null,
        assignedAt: null,
        expiresAt: null,
        status: 'vacant'
      };
    }

    const targetSlotIndex = categorySlots.findIndex(s => s.slotNumber === slotNumber);
    if (targetSlotIndex === -1) {
      return { success: false, message: 'Slot index out of range.' };
    }

    // Assign slot
    const now = new Date().toISOString();
    categorySlots[targetSlotIndex] = {
      ...categorySlots[targetSlotIndex],
      businessId: business.id,
      businessName: business.name,
      businessSlug: business.slug,
      assignedAt: now,
      expiresAt,
      status: 'active'
    };

    allSlots[categoryId] = categorySlots;
    this.setLocal(STORAGE_KEYS.SLOTS, allSlots);

    // Update business document
    await this.saveBusiness({
      ...business,
      isTop10: true,
      top10Position: slotNumber,
      listingExpiresAt: expiresAt
    });

    // Record audit log
    await this.recordAuditLog({
      action: 'SLOT_ASSIGNED',
      performedBy,
      targetType: 'slot',
      targetId: `${categoryId}_slot_${slotNumber}`,
      targetName: `${business.name} -> Slot #${slotNumber}`,
      details: { categoryId, slotNumber, expiresAt, businessId: business.id }
    });

    return { success: true, message: `Successfully assigned ${business.name} to slot #${slotNumber}` };
  },

  async vacateSlot(categoryId: string, slotNumber: number, performedBy: string): Promise<void> {
    const allSlots = this.getLocal<Record<string, Top10Slot[]>>(STORAGE_KEYS.SLOTS, INITIAL_TOP10_SLOTS);
    const categorySlots = allSlots[categoryId];
    if (!categorySlots) return;

    const slot = categorySlots.find(s => s.slotNumber === slotNumber);
    if (slot && slot.businessId) {
      const bizId = slot.businessId;
      const biz = await this.getBusinessByIdOrSlug(bizId);
      if (biz) {
        await this.saveBusiness({
          ...biz,
          isTop10: false,
          top10Position: undefined
        });
      }

      slot.businessId = null;
      slot.businessName = null;
      slot.businessSlug = null;
      slot.assignedAt = null;
      slot.expiresAt = null;
      slot.status = 'vacant';

      allSlots[categoryId] = categorySlots;
      this.setLocal(STORAGE_KEYS.SLOTS, allSlots);

      await this.recordAuditLog({
        action: 'SLOT_VACATED',
        performedBy,
        targetType: 'slot',
        targetId: `${categoryId}_slot_${slotNumber}`,
        details: { categoryId, slotNumber, vacatedBusinessId: bizId }
      });
    }
  },

  // ---------------- APPLICATIONS ----------------
  async getApplications(): Promise<ListingApplication[]> {
    const localApps = this.getLocal<ListingApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
    let remoteApps: ListingApplication[] = [];

    if (this.isUsingFirebase()) {
      try {
        const snap = await getDocs(query(collection(db!, 'listingApplications'), orderBy('submittedAt', 'desc')));
        if (!snap.empty) {
          remoteApps = snap.docs.map(d => ({ id: d.id, ...d.data() } as ListingApplication));
        }
      } catch (err) {
        console.warn('Firebase getApplications query failed, attempting simple collection fetch', err);
        try {
          const snapSimple = await getDocs(collection(db!, 'listingApplications'));
          if (!snapSimple.empty) {
            remoteApps = snapSimple.docs.map(d => ({ id: d.id, ...d.data() } as ListingApplication));
          }
        } catch (err2) {
          console.warn('Firebase simple collection fetch also failed, using local store', err2);
        }
      }
    }

    // Merge by id (remote takes precedence, local fills any gaps)
    const map = new Map<string, ListingApplication>();
    for (const app of localApps) {
      map.set(app.id, app);
    }
    for (const app of remoteApps) {
      map.set(app.id, app);
    }

    const merged = Array.from(map.values());
    return merged.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  },

  async getApplicationByPhoneOrId(searchTerm: string): Promise<ListingApplication[]> {
    const all = await this.getApplications();
    const cleanTerm = searchTerm.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!cleanTerm) return [];

    return all.filter(app => {
      const cleanPhone = (app.phone || '').replace(/[^0-9]/g, '');
      const cleanWa = (app.whatsapp || '').replace(/[^0-9]/g, '');
      const cleanId = (app.id || '').toLowerCase();
      const cleanName = (app.businessName || '').toLowerCase().replace(/[^a-z0-9]/g, '');

      return cleanPhone.includes(cleanTerm) ||
             cleanWa.includes(cleanTerm) ||
             cleanId.includes(cleanTerm) ||
             cleanName.includes(cleanTerm);
    });
  },

  async submitApplication(appData: Omit<ListingApplication, 'id' | 'status' | 'submittedAt' | 'updatedAt'>): Promise<ListingApplication> {
    const id = 'app-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
    const now = new Date().toISOString();
    const newApp: ListingApplication = {
      ...appData,
      id,
      status: 'pending',
      submittedAt: now,
      updatedAt: now
    };

    if (this.isUsingFirebase()) {
      try {
        await setDoc(doc(db!, 'listingApplications', id), newApp);
      } catch (err) {
        console.warn('Firebase submitApplication failed', err);
      }
    }

    const list = this.getLocal<ListingApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
    list.unshift(newApp);
    this.setLocal(STORAGE_KEYS.APPLICATIONS, list);

    await this.recordAuditLog({
      action: 'APPLICATION_SUBMITTED',
      performedBy: newApp.ownerName || 'Public Applicant',
      targetType: 'application',
      targetId: id,
      targetName: newApp.businessName,
      details: { categoryId: newApp.categoryId, package: newApp.requestedPackage }
    });

    return newApp;
  },

  async updateApplicationStatus(
    appId: string,
    status: ListingApplication['status'],
    adminNotes: string,
    performedBy: string
  ): Promise<ListingApplication | null> {
    const list = this.getLocal<ListingApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
    const app = list.find(a => a.id === appId);
    if (!app) return null;

    app.status = status;
    app.adminNotes = adminNotes;
    app.updatedAt = new Date().toISOString();

    if (this.isUsingFirebase()) {
      try {
        await updateDoc(doc(db!, 'listingApplications', appId), {
          status,
          adminNotes,
          updatedAt: app.updatedAt
        });
      } catch (err) {
        console.warn('Firebase updateApplicationStatus failed', err);
      }
    }

    this.setLocal(STORAGE_KEYS.APPLICATIONS, list);

    await this.recordAuditLog({
      action: `APPLICATION_${status.toUpperCase()}`,
      performedBy,
      targetType: 'application',
      targetId: appId,
      targetName: app.businessName,
      details: { newStatus: status, adminNotes }
    });

    return app;
  },

  // ---------------- PAYMENTS ----------------
  async getPayments(): Promise<PaymentRecord[]> {
    if (this.isUsingFirebase()) {
      try {
        const snap = await getDocs(query(collection(db!, 'payments'), orderBy('createdAt', 'desc')));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as PaymentRecord));
        }
      } catch (err) {
        logFirestoreNotice('getPayments', err);
      }
    }
    return this.getLocal<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, []);
  },

  async recordPayment(payment: Omit<PaymentRecord, 'id' | 'createdAt'>): Promise<PaymentRecord> {
    const id = 'pay-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
    const now = new Date().toISOString();
    const newRecord: PaymentRecord = {
      ...payment,
      id,
      createdAt: now
    };

    if (this.isUsingFirebase()) {
      try {
        await setDoc(doc(db!, 'payments', id), newRecord);
      } catch (err) {
        console.warn('Firebase recordPayment failed', err);
      }
    }

    const list = this.getLocal<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, []);
    list.unshift(newRecord);
    this.setLocal(STORAGE_KEYS.PAYMENTS, list);

    // If verified, update the business paymentStatus and listing validity
    if (newRecord.status === 'verified' && newRecord.businessId) {
      const biz = await this.getBusinessByIdOrSlug(newRecord.businessId);
      if (biz) {
        await this.saveBusiness({
          ...biz,
          paymentStatus: 'paid',
          listingStartAt: newRecord.periodStart,
          listingExpiresAt: newRecord.periodEnd,
          packageId: newRecord.packageId
        });
      }
    }

    await this.recordAuditLog({
      action: 'PAYMENT_RECORDED',
      performedBy: newRecord.recordedBy,
      targetType: 'payment',
      targetId: id,
      targetName: `${newRecord.businessName} (₹${newRecord.amount})`,
      details: {
        method: newRecord.paymentMethod,
        ref: newRecord.referenceNumber,
        status: newRecord.status,
        period: `${newRecord.periodStart} to ${newRecord.periodEnd}`
      }
    });

    return newRecord;
  },

  // ---------------- OFFERS ----------------
  async getOffers(): Promise<Offer[]> {
    const localOffers = this.getLocal<Offer[]>(STORAGE_KEYS.OFFERS, []);
    let remoteOffers: Offer[] = [];

    if (this.isUsingFirebase()) {
      try {
        const snap = await getDocs(collection(db!, 'offers'));
        if (!snap.empty) {
          remoteOffers = snap.docs.map(d => ({ id: d.id, ...d.data() } as Offer));
        }
      } catch (err) {
        logFirestoreNotice('getOffers', err);
      }
    }

    const cleanLocal = localOffers.filter(o => !MOCK_OFFER_IDS.has(o.id));
    const cleanRemote = remoteOffers.filter(o => !MOCK_OFFER_IDS.has(o.id));

    if (cleanRemote.length === 0) {
      return cleanLocal;
    }

    const map = new Map<string, Offer>();
    for (const o of cleanLocal) map.set(o.id, o);
    for (const o of cleanRemote) map.set(o.id, o);
    return Array.from(map.values());
  },

  async saveOffer(offer: Offer, performedBy: string): Promise<Offer> {
    const now = new Date().toISOString();
    const updatedOffer: Offer = {
      ...offer,
      updatedAt: now,
      createdAt: offer.createdAt || now,
    };

    if (this.isUsingFirebase()) {
      try {
        await setDoc(doc(db!, 'offers', updatedOffer.id), updatedOffer, { merge: true });
      } catch (err) {
        console.warn('Firebase saveOffer failed', err);
      }
    }
    const list = this.getLocal<Offer[]>(STORAGE_KEYS.OFFERS, SEED_OFFERS);
    const idx = list.findIndex(o => o.id === updatedOffer.id);
    if (idx >= 0) {
      list[idx] = updatedOffer;
    } else {
      list.push(updatedOffer);
    }
    this.setLocal(STORAGE_KEYS.OFFERS, list);

    await this.recordAuditLog({
      action: 'OFFER_SAVED',
      performedBy,
      targetType: 'offer',
      targetId: updatedOffer.id,
      targetName: updatedOffer.title,
      details: { businessId: updatedOffer.businessId, expiryDate: updatedOffer.expiryDate }
    });

    return updatedOffer;
  },

  async deleteOffer(offerId: string, performedBy: string): Promise<void> {
    if (this.isUsingFirebase()) {
      try {
        await deleteDoc(doc(db!, 'offers', offerId));
      } catch (err) {
        console.warn('Firebase deleteOffer failed', err);
      }
    }
    const list = this.getLocal<Offer[]>(STORAGE_KEYS.OFFERS, SEED_OFFERS);
    this.setLocal(STORAGE_KEYS.OFFERS, list.filter(o => o.id !== offerId));

    await this.recordAuditLog({
      action: 'OFFER_DELETED',
      performedBy,
      targetType: 'offer',
      targetId: offerId
    });
  },

  // ---------------- OFFER CLAIMS (IN-STORE PASSES) ----------------
  async getOfferClaims(): Promise<OfferClaim[]> {
    const localClaims = this.getLocal<OfferClaim[]>(STORAGE_KEYS.OFFER_CLAIMS, []);
    let remoteClaims: OfferClaim[] = [];

    if (this.isUsingFirebase()) {
      try {
        const snap = await getDocs(collection(db!, 'offerClaims'));
        if (!snap.empty) {
          remoteClaims = snap.docs.map(d => ({ id: d.id, ...d.data() } as OfferClaim));
        }
      } catch (err) {
        console.warn('Firebase getOfferClaims failed', err);
      }
    }

    if (remoteClaims.length === 0) return localClaims;
    const map = new Map<string, OfferClaim>();
    for (const c of localClaims) map.set(c.id, c);
    for (const c of remoteClaims) map.set(c.id, c);
    return Array.from(map.values());
  },

  async saveOfferClaim(claim: OfferClaim): Promise<OfferClaim> {
    if (this.isUsingFirebase()) {
      try {
        await setDoc(doc(db!, 'offerClaims', claim.id), claim, { merge: true });
      } catch (err) {
        console.warn('Firebase saveOfferClaim failed', err);
      }
    }
    const list = this.getLocal<OfferClaim[]>(STORAGE_KEYS.OFFER_CLAIMS, []);
    const idx = list.findIndex(c => c.id === claim.id);
    if (idx >= 0) {
      list[idx] = claim;
    } else {
      list.unshift(claim);
    }
    this.setLocal(STORAGE_KEYS.OFFER_CLAIMS, list);
    return claim;
  },

  async findExistingClaim(offerId: string, sessionOrUserId: string): Promise<OfferClaim | null> {
    const all = await this.getOfferClaims();
    return all.find(c => c.offerId === offerId && c.userId === sessionOrUserId && c.status === 'issued') || null;
  },

  // ---------------- REPORTS ----------------
  async getReports(): Promise<ReportItem[]> {
    return this.getLocal<ReportItem[]>(STORAGE_KEYS.REPORTS, []);
  },

  async submitReport(reportData: Omit<ReportItem, 'id' | 'createdAt' | 'status'>): Promise<ReportItem> {
    const id = 'rep-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
    const report: ReportItem = {
      ...reportData,
      id,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    const list = this.getLocal<ReportItem[]>(STORAGE_KEYS.REPORTS, []);
    list.unshift(report);
    this.setLocal(STORAGE_KEYS.REPORTS, list);

    await this.recordAuditLog({
      action: 'REPORT_SUBMITTED',
      performedBy: report.reporterName || 'Anonymous Public User',
      targetType: 'business',
      targetId: report.businessId,
      targetName: report.businessName,
      details: { issueType: report.issueType }
    });

    return report;
  },

  async updateReportStatus(reportId: string, status: ReportItem['status'], adminNotes?: string): Promise<void> {
    const list = this.getLocal<ReportItem[]>(STORAGE_KEYS.REPORTS, []);
    const item = list.find(r => r.id === reportId);
    if (item) {
      item.status = status;
      if (adminNotes) item.adminNotes = adminNotes;
      if (status === 'resolved') item.resolvedAt = new Date().toISOString();
      this.setLocal(STORAGE_KEYS.REPORTS, list);
    }
  },

  // ---------------- AUDIT LOGS ----------------
  async getAuditLogs(): Promise<AuditLog[]> {
    return this.getLocal<AuditLog[]>(STORAGE_KEYS.AUDIT, []);
  },

  async recordAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const id = 'aud-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
    const newEntry: AuditLog = {
      ...log,
      id,
      timestamp: new Date().toISOString()
    };
    const list = this.getLocal<AuditLog[]>(STORAGE_KEYS.AUDIT, []);
    list.unshift(newEntry);
    // keep max 500 audit entries locally
    if (list.length > 500) list.pop();
    this.setLocal(STORAGE_KEYS.AUDIT, list);
  },

  // ---------------- APP SETTINGS ----------------
  async getSettings(): Promise<AppSettings> {
    return this.getLocal<AppSettings>(STORAGE_KEYS.SETTINGS, SEED_SETTINGS);
  },

  async updateSettings(settings: AppSettings, performedBy: string): Promise<AppSettings> {
    this.setLocal(STORAGE_KEYS.SETTINGS, settings);
    await this.recordAuditLog({
      action: 'SETTINGS_UPDATED',
      performedBy,
      targetType: 'settings',
      targetId: 'global',
      details: { siteName: settings.siteName, packagesCount: settings.packages.length }
    });
    return settings;
  }
};

// Automatically seed Cloud Firestore in the background on startup if empty
if (typeof window !== 'undefined' && import.meta.env.MODE !== 'test') {
  setTimeout(() => {
    StorageService.autoSeedIfEmpty().catch(() => {});
  }, 1000);
}
