import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { BusinessDetailPage } from './pages/BusinessDetailPage';
import { SearchPage } from './pages/SearchPage';
import { OffersPage } from './pages/OffersPage';
import { PricingPage } from './pages/PricingPage';
import { ListBusinessPage } from './pages/ListBusinessPage';
import { ListingPolicyPage } from './pages/ListingPolicyPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { AdvertisePage } from './pages/AdvertisePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SEOCategoryPage } from './pages/SEOCategoryPage';
import { ScrollToTop } from './components/common/ScrollToTop';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminBusinessesPage } from './pages/admin/AdminBusinessesPage';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage';
import { AdminTop10SlotsPage } from './pages/admin/AdminTop10SlotsPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminOffersPage } from './pages/admin/AdminOffersPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';
import { AdminBannersPage } from './pages/admin/AdminBannersPage';
import { AdminDatabasePage } from './pages/admin/AdminDatabasePage';

export const App: React.FC = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <Routes>
        {/* Public Directory Routes */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="category/:slug" element={<CategoryDetailPage />} />
          {/* SEO High-Intent Targeted Category Landing Routes */}
          <Route path="restaurants-in-vidisha" element={<SEOCategoryPage categoryKey="restaurants" />} />
          <Route path="hotels-in-vidisha" element={<SEOCategoryPage categoryKey="hotels" />} />
          <Route path="doctors-in-vidisha" element={<SEOCategoryPage categoryKey="doctors" />} />
          <Route path="coaching-in-vidisha" element={<SEOCategoryPage categoryKey="coaching" />} />
          <Route path="gyms-in-vidisha" element={<SEOCategoryPage categoryKey="gyms" />} />
          <Route path="business/:slug" element={<BusinessDetailPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="offers" element={<OffersPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="advertise" element={<AdvertisePage />} />
          <Route path="list-your-business" element={<ListBusinessPage />} />
          <Route path="listing-policy" element={<ListingPolicyPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin" element={<AdminLoginPage />} />

        {/* Protected Admin Console Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="businesses" element={<AdminBusinessesPage />} />
          <Route path="applications" element={<AdminApplicationsPage />} />
          <Route path="slots" element={<AdminTop10SlotsPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="banners" element={<AdminBannersPage />} />
          <Route path="offers" element={<AdminOffersPage />} />
          <Route path="database" element={<AdminDatabasePage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="audit" element={<AdminAuditLogsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
