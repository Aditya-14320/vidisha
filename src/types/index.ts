export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested';
export type PaymentStatus = 'unpaid' | 'paid' | 'pending_verification' | 'expired';
export type ListingPackageId = 'basic' | 'free' | 'complete' | 'priority' | 'premium' | 'offer_campaign';

export const PACKAGE_PHOTO_LIMITS: Record<string, number> = {
  basic: 0,
  free: 0,
  complete: 2,
  priority: 3,
  premium: 3,
  offer_campaign: 0
};

export const MAX_BUSINESSES_PER_CATEGORY = 10;

export const PACKAGE_PRICING = {
  complete: {
    id: 'complete' as ListingPackageId,
    name: 'Complete Business Listing',
    price: 4000,
    period: 'Year',
    priceText: '₹4,000 / Year',
    photoLimit: 2,
  },
  priority: {
    id: 'priority' as ListingPackageId,
    name: 'Priority Listing',
    price: 6000,
    period: 'Year',
    priceText: '₹6,000 / Year',
    photoLimit: 3,
  },
} as const;

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
  businessCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BusinessHours {
  open: string;
  close: string;
  isClosed: boolean;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  subcategory?: string;
  description: string;
  phone: string;
  whatsapp: string;
  email?: string;
  address: string;
  locality: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  mapUrl?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  gallery: string[];
  openingHours?: Record<string, BusinessHours> | string;
  weeklyOff?: string;
  services: string[];
  priceRange: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  catalog?: Array<{
    name: string;
    price?: number;
    description?: string;
  }>;
  websiteUrl?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  approvalStatus: ApprovalStatus;
  paymentStatus: PaymentStatus;
  packageId: ListingPackageId;
  listingStartAt?: string;
  listingExpiresAt?: string;
  isTop10: boolean;
  top10Position?: number; // 1 to 10
  isSponsored: boolean;
  rating?: number;
  reviewCount?: number;
  lastVerifiedAt?: string;
  viewCount: number;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListingApplication {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  email?: string;
  categoryId: string;
  address: string;
  locality: string;
  mapUrl?: string;
  description: string;
  services: string[];
  openingHours?: string;
  weeklyOff?: string;
  priceRange?: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  websiteUrl?: string;
  requestedPackage: ListingPackageId;
  logoUrl?: string;
  gallery?: string[];
  consentTerms: boolean;
  status: ApprovalStatus;
  adminNotes?: string;
  rejectionReason?: string;
  submittedAt: string;
  updatedAt: string;
  assignedBusinessId?: string;
}

export interface Top10Slot {
  id: string;
  categoryId: string;
  categoryName?: string;
  slotNumber: number; // 1 to 10
  businessId?: string | null;
  businessName?: string | null;
  businessSlug?: string | null;
  assignedAt?: string | null;
  expiresAt?: string | null;
  status: 'active' | 'vacant' | 'expired';
}

export interface PaymentRecord {
  id: string;
  businessId: string;
  businessName: string;
  applicationId?: string;
  amount: number;
  currency: 'INR';
  packageId: ListingPackageId;
  packageName: string;
  paymentMethod: 'upi' | 'bank_transfer' | 'cash' | 'cheque';
  referenceNumber: string;
  paymentDate: string;
  periodMonths: number;
  periodStart: string;
  periodEnd: string;
  status: 'verified' | 'pending' | 'rejected';
  recordedBy: string;
  receiptNotes?: string;
  createdAt: string;
}

export interface Offer {
  id: string;
  businessId: string;
  businessName: string;
  businessSlug?: string;
  businessPhone?: string;
  businessWhatsapp?: string;
  businessAddress?: string;
  businessLocality?: string;
  businessMapUrl?: string;
  isBusinessVerified?: boolean;
  categoryId: string;
  categoryName?: string;
  title: string;
  description: string;
  discountBadge?: string;
  couponCode?: string;
  termsAndConditions: string;
  eligibilityConditions?: string;
  minimumSpend?: number;
  eligibleProducts?: string;
  startDate: string;
  expiryDate: string;
  approvalStatus: ApprovalStatus;
  status: 'active' | 'scheduled' | 'paused' | 'expired';
  isSponsored: boolean;
  businessConfirmed?: boolean;
  redemptionMethod: string;
  bannerUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OfferClaim {
  id: string;
  claimReference: string;
  offerId: string;
  offerTitle: string;
  businessId: string;
  businessName: string;
  issuedAt: string;
  status: 'issued' | 'confirmed_at_store' | 'cancelled';
  confirmedAt?: string;
  confirmedBy?: string;
  userId?: string;
}

export interface ReportItem {
  id: string;
  businessId: string;
  businessName: string;
  reporterName?: string;
  reporterContact?: string;
  issueType: 'wrong_phone' | 'closed_down' | 'wrong_address' | 'wrong_hours' | 'fraud' | 'other';
  details: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
  resolvedAt?: string;
  adminNotes?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  targetType: 'business' | 'category' | 'slot' | 'payment' | 'application' | 'offer' | 'settings' | 'banner';
  targetId: string;
  targetName?: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface ListingPackageConfig {
  id: ListingPackageId;
  name: string;
  pricePerMonth: number;
  annualPrice?: number;
  description: string;
  features: string[];
  photoLimit?: number;
  isPopular?: boolean;
}

export interface AppSettings {
  id: string;
  siteName: string;
  supportPhone: string;
  supportEmail: string;
  supportWhatsApp: string;
  address: string;
  packages: ListingPackageConfig[];
  maintenanceMode: boolean;
  announcement?: {
    active: boolean;
    text: string;
  };
}

export interface SearchFilters {
  query?: string;
  categoryId?: string;
  locality?: string;
  priceRange?: string;
  openNow?: boolean;
  hasOffers?: boolean;
  isSponsored?: boolean;
}

export * from './banner';
