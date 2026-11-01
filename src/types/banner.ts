/**
 * Types for Banner Advertising feature.
 * Added per final decisions – introductory pricing and configurable packages.
 */

export type BannerPlacement =
  | 'homepage_hero' // top banner on Home page
  | 'homepage_mid' // mid‑page banner on Home page
  | 'category' // banner inside a Category page
  | 'offers' // banner on the Offers page
  | 'mobile_responsive'; // layout for mobile devices

export type BannerStatus =
  | 'pending' // awaiting payment verification
  | 'approved' // payment verified, artwork approved
  | 'scheduled' // start date is in the future
  | 'active' // currently displayed
  | 'paused' // manually paused by admin
  | 'rejected' // admin rejected the campaign
  | 'expired' // end date passed
  | 'refunded'; // payment refunded

/** Configuration for a banner package that can be edited in the admin panel. */
export interface BannerPackage {
  /** Unique identifier, e.g. "starter", "featured" */
  id: string;
  /** Human readable name shown to advertisers */
  name: string;
  /** Price in INR */
  price: number;
  /** Duration of the campaign in days */
  durationDays: number;
  /** Which placements this package permits */
  allowedPlacements: BannerPlacement[];
  /** Optional longer description */
  description?: string;
}

/** A single banner advertising campaign. */
export interface Banner {
  id: string;
  /** Reference to the selected BannerPackage */
  packageId: string;
  /** Owner business identifier */
  businessId: string;
  /** Owner business name (denormalised for quick UI) */
  businessName: string;
  /** Short title displayed on the banner */
  title: string;
  /** Longer description shown on hover or details view */
  description: string;
  /** URL of the uploaded banner image (Firebase Storage) */
  imageUrl: string;
  /** Destination URL when the banner is clicked */
  destinationUrl: string;
  /** Placement selector */
  placement: BannerPlacement;
  /** ISO‑8601 start date (YYYY‑MM‑DD) */
  startDate: string;
  /** ISO‑8601 expiry date – automatically calculated from startDate + durationDays */
  expiryDate: string;
  /** Workflow status */
  status: BannerStatus;
  /** Manual payment reference (UPI / bank txn) */
  paymentReference?: string;
  /** Payment method used */
  paymentMethod?: 'upi' | 'bank_transfer' | 'cash' | 'cheque';
  /** Amount actually paid (should match the package price) */
  amountPaid?: number;
  /** Admin notes – internal only */
  adminNotes?: string;
  /** Reason for rejection if status === 'rejected' */
  rejectionReason?: string;
  /** Timestamps */
  createdAt: string;
  updatedAt: string;
  /** Optional analytics counters */
  impressionCount?: number;
  clickCount?: number;
}
