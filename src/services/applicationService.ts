import { StorageService } from './storageService';
import { ListingApplication, Business } from '../types';

export const ApplicationService = {
  /**
   * Public: submit a new listing application
   */
  async submitApplication(data: Omit<ListingApplication, 'id' | 'status' | 'submittedAt' | 'updatedAt'>): Promise<{ success: boolean; application?: ListingApplication; error?: string }> {
    // Validation
    if (!data.businessName || data.businessName.trim().length < 2) {
      return { success: false, error: 'Business name is required (min 2 characters).' };
    }
    if (!data.phone || data.phone.trim().length < 10) {
      return { success: false, error: 'Valid phone number is required (min 10 digits).' };
    }
    if (!data.categoryId) {
      return { success: false, error: 'Please select a business category.' };
    }
    if (!data.address || data.address.trim().length < 5) {
      return { success: false, error: 'Please enter a complete business address.' };
    }
    if (!data.consentTerms) {
      return { success: false, error: 'You must agree to the listing policy and terms.' };
    }

    // Backend Category Capacity Check (Strict maximum 10 businesses per category)
    const businesses = await StorageService.getBusinesses();
    const activePaidCount = businesses.filter(
      (b) => b.categoryId === data.categoryId && b.approvalStatus === 'approved' && b.paymentStatus === 'paid'
    ).length;

    if (activePaidCount >= 10) {
      return {
        success: false,
        error: 'This category has reached the maximum capacity of 10 businesses. Further registrations are closed for this category.'
      };
    }

    // Disallow free bypass
    if (data.requestedPackage === 'free' || (data.requestedPackage as string) === 'basic_free') {
      return {
        success: false,
        error: 'Free business registrations have been discontinued under the premium-only model. Please select Complete or Priority listing.'
      };
    }

    try {
      const app = await StorageService.submitApplication(data);
      return { success: true, application: app };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to submit application. Please try again.' };
    }
  },

  /**
   * Admin: Get all applications
   */
  async getApplications(): Promise<ListingApplication[]> {
    return StorageService.getApplications();
  },

  /**
   * Public: Track application status by phone number or application ID
   */
  async trackApplication(searchTerm: string): Promise<ListingApplication[]> {
    return StorageService.getApplicationByPhoneOrId(searchTerm);
  },

  /**
   * Admin: Update status
   */
  async updateStatus(
    appId: string,
    status: ListingApplication['status'],
    adminNotes: string,
    performedBy: string
  ): Promise<ListingApplication | null> {
    return StorageService.updateApplicationStatus(appId, status, adminNotes, performedBy);
  },

  /**
   * Admin: Convert an approved application into a business profile (with initial unpaid status)
   */
  async convertToBusiness(application: ListingApplication, performedBy: string): Promise<Business> {
    const slug = application.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const categories = await StorageService.getCategories();
    const category = categories.find(c => c.id === application.categoryId);

    const newBusiness: Business = {
      id: 'biz-' + Date.now().toString(36),
      name: application.businessName,
      slug: slug || 'business-' + Date.now(),
      categoryId: application.categoryId,
      categoryName: category ? category.name : 'General',
      categorySlug: category ? category.slug : 'general',
      description: application.description || '',
      phone: application.phone,
      whatsapp: application.whatsapp || application.phone,
      email: application.email,
      address: application.address,
      locality: application.locality || 'Vidisha',
      mapUrl: application.mapUrl,
      logoUrl: application.logoUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop&q=80',
      coverImageUrl: (application.gallery && application.gallery[0]) || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
      gallery: application.gallery || [],
      openingHours: application.openingHours || '09:00 AM - 08:00 PM',
      weeklyOff: application.weeklyOff || 'Sunday',
      services: application.services || [],
      priceRange: application.priceRange || '₹₹',
      websiteUrl: application.websiteUrl,
      approvalStatus: 'approved',
      paymentStatus: 'unpaid', // Must be paid/verified before activation or top 10 slot assignment
      packageId: application.requestedPackage || 'complete',
      isTop10: false,
      isSponsored: false,
      lastVerifiedAt: new Date().toISOString().split('T')[0],
      viewCount: 0,
      clickCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await StorageService.saveBusiness(newBusiness);

    // Update application to approved and link businessId
    await StorageService.updateApplicationStatus(
      application.id,
      'approved',
      `Converted to business ID ${saved.id}. Awaiting manual payment verification.`,
      performedBy
    );

    return saved;
  }
};
