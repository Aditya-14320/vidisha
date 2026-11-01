import { StorageService } from './storageService';
import { Business, SearchFilters } from '../types';

export const BusinessService = {
  /**
   * Get all businesses for public display.
   * Strictly filters to only approved businesses and enforces expiry checks.
   */
  async getPublicBusinesses(filters: SearchFilters = {}): Promise<Business[]> {
    const all = await StorageService.getBusinesses();
    const now = new Date();

    return all.filter((biz) => {
      // If listing has an expiry date and it has passed, handle paid status
      if (biz.listingExpiresAt && new Date(biz.listingExpiresAt) < now) {
        biz.paymentStatus = 'expired';
      }

      // Premium-only rule: Only paid businesses can have active listings
      if (biz.approvalStatus !== 'approved' || biz.paymentStatus !== 'paid') {
        return false;
      }

      // Filter by Category
      if (filters.categoryId && biz.categoryId !== filters.categoryId) {
        return false;
      }

      // Filter by Locality
      if (filters.locality && biz.locality.toLowerCase() !== filters.locality.toLowerCase()) {
        return false;
      }

      // Filter by Price Range
      if (filters.priceRange && biz.priceRange !== filters.priceRange) {
        return false;
      }

      // Filter by Query (Name, Description, Services, Address, Locality)
      if (filters.query && filters.query.trim()) {
        const q = filters.query.toLowerCase().trim();
        const matchesName = biz.name.toLowerCase().includes(q);
        const matchesDesc = biz.description.toLowerCase().includes(q);
        const matchesLoc = biz.locality.toLowerCase().includes(q) || biz.address.toLowerCase().includes(q);
        const matchesCat = biz.categoryName.toLowerCase().includes(q);
        const matchesServices = biz.services?.some(s => s.toLowerCase().includes(q));

        if (!matchesName && !matchesDesc && !matchesLoc && !matchesCat && !matchesServices) {
          return false;
        }
      }

      return true;
    });
  },

  /**
   * Retrieve the top priority businesses for a category.
   * Returns paid priority-package businesses sorted by name, capped at 10.
   */
  async getTop10ForCategory(categoryId: string): Promise<Business[]> {
    const businesses = await this.getPublicBusinesses({ categoryId });

    const priority = businesses.filter(b =>
      b.packageId === 'priority' && b.paymentStatus === 'paid'
    );

    // Sort alphabetically by name
    priority.sort((a, b) => a.name.localeCompare(b.name));

    // Cap strictly at 10 items
    return priority.slice(0, 10);
  },

  /**
   * Get featured priority businesses (clearly marked)
   */
  async getFeaturedSponsored(limit = 6): Promise<Business[]> {
    const businesses = await this.getPublicBusinesses();
    const featured = businesses.filter(b =>
      b.packageId === 'priority' && b.paymentStatus === 'paid'
    );
    return featured.slice(0, limit);
  },

  /**
   * Get popular businesses based on genuine recorded interactions (views + clicks)
   */
  async getPopularBusinesses(limit = 6): Promise<Business[]> {
    const businesses = await this.getPublicBusinesses();
    return [...businesses]
      .sort((a, b) => ((b.viewCount || 0) + (b.clickCount || 0) * 2) - ((a.viewCount || 0) + (a.clickCount || 0) * 2))
      .slice(0, limit);
  },

  /**
   * Get recently added businesses
   */
  async getRecentlyAdded(limit = 6): Promise<Business[]> {
    const businesses = await this.getPublicBusinesses();
    return [...businesses]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  /**
   * Get a single business by slug or ID
   */
  async getBusinessBySlug(slug: string): Promise<Business | null> {
    const biz = await StorageService.getBusinessByIdOrSlug(slug);
    if (!biz) return null;
    return biz;
  },

  /**
   * Record interaction analytics
   */
  async recordInteraction(businessId: string, type: 'view' | 'click'): Promise<void> {
    const biz = await StorageService.getBusinessByIdOrSlug(businessId);
    if (!biz) return;
    if (type === 'view') {
      biz.viewCount = (biz.viewCount || 0) + 1;
    } else {
      biz.clickCount = (biz.clickCount || 0) + 1;
    }
    await StorageService.saveBusiness(biz);
  },

  /**
   * Admin: get all businesses including pending, rejected, and expired
   */
  async getAllForAdmin(): Promise<Business[]> {
    return StorageService.getBusinesses();
  },

  /**
   * Admin: save or update business
   */
  async saveBusiness(business: Business): Promise<Business> {
    return StorageService.saveBusiness(business);
  },

  /**
   * Admin: delete business
   */
  async deleteBusiness(businessId: string): Promise<void> {
    return StorageService.deleteBusiness(businessId);
  }
};
