# Vidisha City — Local Business Discovery PWA

A modern, production-oriented Progressive Web App (PWA) and commercial discovery platform for **Vidisha, Madhya Pradesh, India**.

Vidisha City connects citizens and visitors with verified local merchants, doctors, restaurants, schools, coaching institutes, and professional service providers, while providing a sustainable monetization engine through strictly capped Top 10 directory positions, manual payment verification, and promotional deal campaigns.

---

## 1. Key Platform Features

- **Progressive Web App (PWA)**:
  - Installable on Android (via Chrome/Edge prompt) and iOS (via Safari Share sheet instructions).
  - Offline fallback and caching for static assets with offline status alerts.
  - Custom Web App Manifest and branding (`Vidisha City`).
- **Comprehensive City Taxonomy**:
  - 20 seeded categories specific to Vidisha (Restaurants & Cafes, Sweets & Bakeries, Chanderi Sarees & Fashion, Electronics, Doctors & Dentists, Coaching Centres, Automobile Repair, etc.).
  - Searchable by Vidisha localities: *Station Road, Durga Nagar, Khariphatak, Madhavganj, Tilak Chowk, Bada Bazar, Civil Lines, Venkatesh Market*, etc.
- **Strict Top 10 Paid Placement Model**:
  - Strict maximum of **10 active paid slots** per category enforced on the server/service layer.
  - Real-time waitlisting when slots are filled.
  - Automatic demotion of expired or unpaid businesses from Top 10 slots.
  - Clear transparency labeling: Paid positions are commercial placements, not quality ratings or endorsements.
- **Official Merchant Listing Onboarding**:
  - Public "List Your Business" application workflow.
  - Submissions are created in a secure `pending` state and hidden from public display until admin verification.
- **Protected Admin Console (`/admin`)**:
  - Category manager (create, edit, reorder, activate/deactivate, delete with business dependency checks).
  - Business manager (edit details, assign package, set expiry, toggle sponsored status, CSV export).
  - Application review queue with one-click conversion to business directory profile.
  - Concurrency-safe Top 10 slot manager with visual slot occupancy and waitlist queues.
  - Manual payment recording and reconciliation (UPI, NEFT, Cash) with period validation and CSV export.
  - Promotional offer and coupon campaign publishing.
  - User feedback & inaccurate info report moderation.
  - Tamper-evident security audit trail.

---

## 2. Technology Stack

- **Frontend & PWA**: React 18, Vite 5, TypeScript, Tailwind CSS, Lucide React icons, `vite-plugin-pwa`
- **Routing**: React Router DOM v6
- **Database & Storage**: Cloud Firestore & Firebase Storage (with offline persistent fallback)
- **Security & Auth**: Firebase Authentication with role-claims verification
- **Testing**: Vitest, React Testing Library, JSDOM
- **Deployment**: Netlify (`netlify.toml`) & Firebase Hosting (`firebase.json`)

---

## 3. Project Structure

```text
Vidisha/
├── public/                     # Static assets, PWA icons, manifest, sitemap, robots.txt
│   ├── logo.svg
│   ├── pwa-192x192.png
│   ├── pwa-512x512.png
│   ├── apple-touch-icon.png
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── common/             # SearchBanner, CategoryCard, DynamicIcon, SkeletonCard
│   │   ├── layout/             # Header, Footer, BottomNav
│   │   ├── business/           # BusinessCard, OfferCard, ReportModal
│   │   └── pwa/                # PWAInstallPrompt, OfflineBanner
│   ├── context/
│   │   └── AuthContext.tsx     # Firebase Auth + Admin role verification
│   ├── data/
│   │   └── seedData.ts         # 20 Vidisha categories, realistic businesses & seed offers
│   ├── layouts/
│   │   └── RootLayout.tsx      # Public responsive shell with BottomNav & PWA prompt
│   ├── lib/
│   │   └── firebase.ts         # Firebase initialization with graceful offline fallback
│   ├── pages/
│   │   ├── HomePage.tsx        # Search, Categories, Top 10, Deals, Featured Sponsored
│   │   ├── CategoriesPage.tsx  # All 20 categories list
│   │   ├── CategoryDetailPage.tsx # SEO category page with Top 10 slots
│   │   ├── BusinessDetailPage.tsx # Verified profile, gallery, map, menu, report modal
│   │   ├── SearchPage.tsx      # Multi-facet filters (locality, price, category, open now)
│   │   ├── OffersPage.tsx      # Active city deals and promo codes
│   │   ├── PricingPage.tsx     # Basic (₹499/mo), Premium (₹999/mo), Deal (₹299)
│   │   ├── ListBusinessPage.tsx# Merchant application form with validation
│   │   ├── ListingPolicyPage.tsx # Rules & placement disclosure
│   │   ├── PrivacyPage.tsx     # Privacy statement
│   │   ├── TermsPage.tsx       # Terms of service
│   │   ├── ContactPage.tsx     # Support contact
│   │   └── admin/              # Protected admin control center
│   │       ├── AdminLayout.tsx
│   │       ├── AdminLoginPage.tsx
│   │       ├── AdminDashboardPage.tsx
│   │       ├── AdminCategoriesPage.tsx
│   │       ├── AdminBusinessesPage.tsx
│   │       ├── AdminApplicationsPage.tsx
│   │       ├── AdminTop10SlotsPage.tsx
│   │       ├── AdminPaymentsPage.tsx
│   │       ├── AdminOffersPage.tsx
│   │       ├── AdminReportsPage.tsx
│   │       └── AdminAuditLogsPage.tsx
│   ├── services/               # Service layer
│   │   ├── storageService.ts   # Unified storage engine (Firestore + local indexed store)
│   │   ├── businessService.ts  # Filter, Top 10, popularity analytics
│   │   ├── categoryService.ts  # Taxonomy CRUD
│   │   ├── slotService.ts      # Strict 10-slot enforcement
│   │   ├── applicationService.ts# Submission & onboarding
│   │   ├── paymentService.ts   # Manual payment records & CSV
│   │   ├── offerService.ts     # Deals & campaigns
│   │   ├── reportService.ts    # Correction reports
│   │   └── auditService.ts     # Immutable audit logging
│   └── tests/                  # Automated Vitest test suite
│       ├── slotService.test.ts
│       └── businessService.test.ts
├── firestore.rules             # Production security rules
├── storage.rules               # Storage bucket security rules
├── firestore.indexes.json      # Compound Firestore indexes
├── firebase.json               # Firebase deployment configuration
├── netlify.toml                # Netlify SPA redirect & security headers
├── tailwind.config.js          # Tailwind styling configuration
└── vite.config.ts              # Vite & VitePWA configuration
```

---

## 4. Setup and Installation

### Prerequisites
- Node.js (v18 or higher; v20/v24 recommended)
- npm or pnpm

### Quick Start

1. Clone or open the repository:
   ```bash
   cd Vidisha
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional):
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Note:* The application includes a self-initializing persistence engine pre-seeded with 20 categories, realistic Vidisha storefronts, and deals. If Firebase credentials are not yet entered, it functions seamlessly in local persistent mode.

4. Start development server:
   ```bash
   npm run dev
   ```

5. Run automated tests:
   ```bash
   npm test
   ```

6. Build for production:
   ```bash
   npm run build
   ```

---

## 5. Security & Firebase Configuration

### Setting up Firebase

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Authentication** (Email/Password and Google Provider).
3. Create a **Cloud Firestore** database (Production mode).
4. Create a **Firebase Storage** bucket.
5. Populate `.env` with your project keys:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

### Deploying Firestore & Storage Rules

Deploy the included security rules:
```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

#### Rules Summary:
- **Public**: Can read only approved businesses (`approvalStatus == 'approved'`), active categories, and active deals.
- **Private**: Payments, audit logs, applications, and admin user records are strictly restricted from unauthorized client access.
- **Tamper-Evident**: Audit logs can only be appended; `update` and `delete` are completely forbidden.

### Establishing the Initial Administrator Securely

**Important Security Notice:** There is no public registration endpoint to grant admin rights. To establish the initial administrator in production:

1. In Firebase Console > Authentication > Users, create the administrator user account (e.g., `admin@vidishacity.in`). Copy their `User UID`.
2. In Cloud Firestore, create a document inside the `adminUsers` collection with Document ID equal to the administrator's `User UID`:
   ```json
   {
     "email": "admin@vidishacity.in",
     "role": "admin",
     "createdAt": "2026-10-25T12:00:00Z"
   }
   ```
3. Alternatively, assign custom user claims using the Firebase Admin SDK:
   ```javascript
   const admin = require('firebase-admin');
   admin.initializeApp();
   await admin.auth().setCustomUserClaims(targetUid, { admin: true });
   ```
4. For local offline administration, access `/admin` and authenticate using the administrative passcode (`Vidisha@Admin2026`).

---

## 6. Business Model & Top 10 Slot Rules

Vidisha City monetizes through verified directory placement:

| Package | Price | Features |
|---|---|---|
| **Basic Listing** | ₹499 / month | Profile, direct phone & WhatsApp, verified badge, directions |
| **Premium Listing** | ₹999 / month | All Basic features + Eligible for Category Top 10 slot, catalog, deals |
| **Offer Campaign** | ₹299 / campaign | Highlight on homepage "Today's Offers", coupon code, validity timer |

### Strict 10-Slot Limit Policy
- **Maximum of 10 slots** per category.
- Slot assignments require **both** `approvalStatus === 'approved'` and `paymentStatus === 'paid'`.
- Duplicate assignments of the same business in the same category are blocked.
- Expired listings are demoted automatically upon term completion.
- When all 10 slots are occupied, additional applicants are placed on the **Waitlist** view in the admin console.

---

## 7. Netlify Deployment

1. Connect your repository to Netlify.
2. Build Settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Add environment variables in Netlify Dashboard:
   - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, etc.
4. Deploy! The included `netlify.toml` automatically configures SPA client-side routing, service worker headers, and HTTP security policies.

---

## 8. License & Operational Ethics

Vidisha City adheres to ethical directory practices:
- No artificial star ratings or simulated reviews.
- Clear distinction between organic listings and paid advertising positions.
- Transparent reporting mechanism for outdated phone numbers or relocated stores.
