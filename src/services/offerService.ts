import { StorageService } from './storageService';
import { Offer, OfferClaim } from '../types';

export interface OfferFilterParams {
  categoryId?: string;
  locality?: string;
  query?: string;
  status?: 'active' | 'scheduled' | 'expired' | 'all';
}

function calculateStatus(offer: Offer): Offer['status'] {
  if (offer.status === 'paused') return 'paused';
  const today = new Date().toISOString().split('T')[0];
  if (offer.expiryDate < today) return 'expired';
  if (offer.startDate > today) return 'scheduled';
  return 'active';
}

export const OfferService = {
  /**
   * Helper: Enriches an offer with real stored business profile data (phones, locality, verified status)
   */
  async enrichOffers(offers: Offer[]): Promise<Offer[]> {
    const businesses = await StorageService.getBusinesses();
    const bizMap = new Map(businesses.map(b => [b.id, b]));

    return offers.map(offer => {
      const biz = bizMap.get(offer.businessId);
      const computedStatus = calculateStatus(offer);

      return {
        ...offer,
        businessName: biz?.name || offer.businessName,
        businessSlug: biz?.slug || offer.businessSlug,
        businessPhone: biz?.phone || offer.businessPhone,
        businessWhatsapp: biz?.whatsapp || biz?.phone || offer.businessWhatsapp,
        businessAddress: biz?.address || offer.businessAddress,
        businessLocality: biz?.locality || offer.businessLocality || 'Vidisha',
        businessMapUrl: biz?.mapUrl || offer.businessMapUrl,
        isBusinessVerified: biz?.approvalStatus === 'approved',
        categoryName: offer.categoryName || biz?.categoryName || 'General',
        status: computedStatus,
      };
    });
  },

  /**
   * Get public active offers for directory consumers.
   * Strictly filters out expired, scheduled, paused, or unconfirmed promotions.
   */
  async getPublicOffers(filters: OfferFilterParams = {}): Promise<Offer[]> {
    const rawOffers = await StorageService.getOffers();
    const enriched = await this.enrichOffers(rawOffers);

    return enriched.filter(offer => {
      // Must be approved and confirmed by the merchant
      if (offer.approvalStatus !== 'approved') return false;
      if (offer.businessConfirmed === false) return false;

      // Status check (default only active offers on public listing)
      if (filters.status && filters.status !== 'all') {
        if (offer.status !== filters.status) return false;
      } else {
        if (offer.status !== 'active') return false;
      }

      // Filter by category
      if (filters.categoryId && offer.categoryId !== filters.categoryId) {
        return false;
      }

      // Filter by locality
      if (filters.locality && offer.businessLocality?.toLowerCase() !== filters.locality.toLowerCase()) {
        return false;
      }

      // Search query across title, description, and business name
      if (filters.query && filters.query.trim()) {
        const q = filters.query.toLowerCase().trim();
        const matchesTitle = offer.title.toLowerCase().includes(q);
        const matchesDesc = offer.description.toLowerCase().includes(q);
        const matchesBiz = offer.businessName.toLowerCase().includes(q);
        const matchesCat = (offer.categoryName || '').toLowerCase().includes(q);
        const matchesLoc = (offer.businessLocality || '').toLowerCase().includes(q);

        if (!matchesTitle && !matchesDesc && !matchesBiz && !matchesCat && !matchesLoc) {
          return false;
        }
      }

      return true;
    });
  },

  /**
   * Get public offers for a specific business profile
   */
  async getOffersForBusiness(businessId: string): Promise<Offer[]> {
    const all = await this.getPublicOffers();
    return all.filter(o => o.businessId === businessId);
  },

  /**
   * Admin: get all offers with complete state
   */
  async getAllForAdmin(): Promise<Offer[]> {
    const rawOffers = await StorageService.getOffers();
    return this.enrichOffers(rawOffers);
  },

  /**
   * Issue a unique In-Store Offer Reference Pass for the consumer.
   * If a session already claimed this offer, reuses the existing claim reference to prevent duplicates.
   */
  async claimOffer(offer: Offer, userSessionId?: string): Promise<OfferClaim> {
    const effectiveSession = userSessionId || 'anon-' + (typeof window !== 'undefined' ? (localStorage.getItem('vidisha_session_id') || 'guest') : 'guest');

    // Check existing
    const existing = await StorageService.findExistingClaim(offer.id, effectiveSession);
    if (existing) {
      return existing;
    }

    // Generate readable in-store reference code: VC-XXXXXX
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const claimReference = `VC-${randomCode}`;

    const newClaim: OfferClaim = {
      id: 'claim-' + Date.now().toString(36) + '-' + randomCode.toLowerCase(),
      claimReference,
      offerId: offer.id,
      offerTitle: offer.title,
      businessId: offer.businessId,
      businessName: offer.businessName,
      issuedAt: new Date().toISOString(),
      status: 'issued',
      userId: effectiveSession,
    };

    return StorageService.saveOfferClaim(newClaim);
  },

  /**
   * Get all claims for administrative tracking
   */
  async getOfferClaims(): Promise<OfferClaim[]> {
    return StorageService.getOfferClaims();
  },

  /**
   * In-store redemption confirmation by merchant or admin
   */
  async confirmRedemption(claimReference: string, performedBy: string): Promise<{ success: boolean; claim?: OfferClaim; error?: string }> {
    const all = await StorageService.getOfferClaims();
    const target = all.find(c => c.claimReference === claimReference || c.id === claimReference);
    if (!target) {
      return { success: false, error: 'Pass reference code not found.' };
    }
    if (target.status === 'confirmed_at_store') {
      return { success: false, error: `This pass was already confirmed on ${new Date(target.confirmedAt || '').toLocaleString()}.` };
    }

    target.status = 'confirmed_at_store';
    target.confirmedAt = new Date().toISOString();
    target.confirmedBy = performedBy;

    const saved = await StorageService.saveOfferClaim(target);
    return { success: true, claim: saved };
  },

  /**
   * Admin: save or edit offer
   */
  async saveOffer(offer: Offer, performedBy: string): Promise<Offer> {
    return StorageService.saveOffer(offer, performedBy);
  },

  /**
   * Admin: pause or resume offer
   */
  async togglePause(offerId: string, performedBy: string): Promise<Offer | null> {
    const all = await StorageService.getOffers();
    const target = all.find(o => o.id === offerId);
    if (!target) return null;

    target.status = target.status === 'paused' ? 'active' : 'paused';
    return StorageService.saveOffer(target, performedBy);
  },

  /**
   * Admin: delete offer
   */
  async deleteOffer(offerId: string, performedBy: string): Promise<void> {
    return StorageService.deleteOffer(offerId, performedBy);
  }
};
