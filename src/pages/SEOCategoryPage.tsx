import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  ChevronRight,
  MapPin,
  Star,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Building2,
  ChevronDown,
  ArrowRight,
  Filter,
  ShieldCheck
} from 'lucide-react';
import { SEO_CATEGORY_PAGES, SEOCategoryConfig } from '../data/seoCategoryData';
import { Business } from '../types';
import { BusinessService } from '../services/businessService';
import { BusinessCard } from '../components/business/BusinessCard';
import { BusinessCardSkeleton } from '../components/common/SkeletonCard';
import { DynamicIcon } from '../components/common/DynamicIcon';
import { SEOHead } from '../components/seo/SEOHead';
import { buildItemListSchema, buildFAQSchema } from '../utils/schemaGenerator';

interface SEOCategoryPageProps {
  categoryKey: 'restaurants' | 'hotels' | 'doctors' | 'coaching' | 'gyms';
}

export const SEOCategoryPage: React.FC<SEOCategoryPageProps> = ({ categoryKey }) => {
  const config = SEO_CATEGORY_PAGES[categoryKey];

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedLocality, setSelectedLocality] = useState<string>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!config) return;
    async function fetchListings() {
      try {
        setLoading(true);
        // Load approved businesses from live database / fallback
        const list = await BusinessService.getPublicBusinesses({ categoryId: config.categoryId });
        setBusinesses(list);
      } catch (err) {
        console.error(`Failed to load businesses for ${config.title}:`, err);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [config?.categoryId, config?.title]);

  if (!config) {
    return <Navigate to="/categories" replace />;
  }

  const filteredBusinesses = selectedLocality === 'all'
    ? businesses
    : businesses.filter(b => (b.locality || '').toLowerCase().includes(selectedLocality.toLowerCase()));

  // Prepare Schema.org Structured Data
  const itemListSchema = buildItemListSchema(
    config.h1,
    businesses.map(b => ({
      name: b.name,
      url: `/business/${b.slug || b.id}`,
    }))
  );

  const faqSchema = buildFAQSchema(config.faqs);

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [itemListSchema, faqSchema],
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Comprehensive SEO Head */}
      <SEOHead
        title={config.title}
        description={config.metaDescription}
        canonical={config.path}
        ogType="website"
        breadcrumbs={config.breadcrumbs}
        structuredData={combinedSchema}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center space-x-2 text-xs text-[#a1a1aa]">
          {config.breadcrumbs.map((item, idx) => (
            <React.Fragment key={item.url}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#52525c]" />}
              {idx === config.breadcrumbs.length - 1 ? (
                <span className="font-semibold text-gold-400" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link to={item.url} className="hover:text-white transition-colors">
                  {item.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Hero Section */}
        <header className="relative overflow-hidden bg-gradient-to-br from-[#181820] via-[#141418] to-[#1a1a24] rounded-3xl p-6 sm:p-10 border border-gold-500/30 shadow-[0_12px_45px_rgba(0,0,0,0.7)] mb-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#101014] border border-gold-500/40 text-gold-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <DynamicIcon name={config.iconName} className="w-4 h-4 text-gold-400" />
              <span>Vidisha Local Directory • Verified 2026</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
              {config.h1}
            </h1>

            <p className="text-sm sm:text-base text-[#d4d4d8] leading-relaxed font-light mb-6">
              {config.subtitle}
            </p>

            {/* Quick stats & verification badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#a1a1aa] pt-4 border-t border-[#2a2a34]">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span className="text-white font-medium">100% Manually Verified</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-gold-400" />
                <span>Vidisha, Madhya Pradesh (464001)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Direct Contact • Zero Commission</span>
              </div>
            </div>
          </div>
        </header>

        {/* Locality Quick Filters */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141418] p-4 rounded-2xl border border-[#26262e]">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
            <Filter className="w-4 h-4 text-gold-400" />
            <span>Filter by Locality in Vidisha:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedLocality('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedLocality === 'all'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 shadow-md'
                  : 'bg-[#1e1e26] text-slate-300 hover:bg-[#282834]'
              }`}
            >
              All Localities ({businesses.length})
            </button>
            {config.localities.map((loc) => {
              const count = businesses.filter(b => (b.locality || '').toLowerCase().includes(loc.toLowerCase())).length;
              return (
                <button
                  key={loc}
                  onClick={() => setSelectedLocality(loc)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedLocality === loc
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 shadow-md'
                      : 'bg-[#1e1e26] text-slate-300 hover:bg-[#282834]'
                  }`}
                >
                  {loc} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Business Listings Grid */}
        <section className="mb-14" aria-labelledby="listings-heading">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#24242a]">
            <div>
              <h2 id="listings-heading" className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                Verified {config.categoryName} in Vidisha
              </h2>
              <p className="text-xs text-[#a1a1aa] font-light mt-0.5">
                Showing {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'business' : 'businesses'}
                {selectedLocality !== 'all' ? ` in ${selectedLocality}` : ' across all areas'}
              </p>
            </div>
            <Link
              to="/list-your-business"
              className="text-xs font-bold text-gold-400 hover:text-gold-300 inline-flex items-center space-x-1"
            >
              <span>List Your Business</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <BusinessCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((biz) => (
                <BusinessCard key={biz.id} business={biz} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-[#141418] rounded-3xl border border-[#24242e] text-[#a1a1aa] space-y-4">
              <Building2 className="w-12 h-12 text-gold-400/50 mx-auto" />
              <div className="max-w-md mx-auto">
                <h3 className="font-serif text-lg font-bold text-white mb-1">
                  New Listings Coming Soon
                </h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  We are currently verifying more {config.categoryName.toLowerCase()} in{' '}
                  {selectedLocality !== 'all' ? selectedLocality : 'Vidisha'}.
                </p>
              </div>
              <Link
                to="/list-your-business"
                className="inline-block px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 font-bold text-xs shadow-md"
              >
                Are you a local business owner? Register your establishment
              </Link>
            </div>
          )}
        </section>

        {/* Local Expert Guide & Recommendations Section */}
        <section className="mb-14 bg-[#141418] rounded-3xl p-6 sm:p-10 border border-[#26262e] shadow-lg">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-2 text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Local Guide & Insights</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-4">
              Complete Guide to {config.categoryName} in Vidisha
            </h2>

            <p className="text-sm text-[#d4d4d8] leading-relaxed font-light mb-8">
              {config.editorialGuide.overview}
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {config.editorialGuide.highlights.map((h, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#1a1a22] border border-[#2e2e3a]">
                  <div className="w-8 h-8 rounded-full bg-gold-500/10 text-gold-400 font-bold text-xs flex items-center justify-center mb-3">
                    0{idx + 1}
                  </div>
                  <h3 className="font-bold text-sm text-white mb-2">{h.title}</h3>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed font-light">
                    {h.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Locality & Booking Advice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#26262e] text-xs text-[#d4d4d8]">
              <div className="p-4 bg-[#101014] rounded-xl border border-[#22222a]">
                <strong className="text-gold-400 block mb-1">Locality Advice:</strong>
                {config.editorialGuide.localitiesAdvice}
              </div>
              <div className="p-4 bg-[#101014] rounded-xl border border-[#22222a]">
                <strong className="text-gold-400 block mb-1">Booking & Visiting Tips:</strong>
                {config.editorialGuide.bookingAdvice}
              </div>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions (FAQ) Section */}
        <section className="mb-14 bg-[#141418] rounded-3xl p-6 sm:p-10 border border-[#26262e] shadow-lg">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2 text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4 text-gold-400" />
              <span>Questions & Answers</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-6">
              Frequently Asked Questions About {config.categoryName} in Vidisha
            </h2>

            <div className="space-y-3">
              {config.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#1a1a22] border border-[#2a2a34] overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-left font-bold text-sm text-white flex items-center justify-between gap-4"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-gold-400 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#a1a1aa] leading-relaxed font-light border-t border-[#24242e]">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Internal Linking & Related Searches */}
        <section className="p-6 sm:p-8 bg-[#101014] rounded-3xl border border-[#22222a]">
          <h2 className="font-bold text-xs uppercase tracking-wider text-[#71717a] mb-4">
            Related Vidisha Directories & Resources
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {config.relatedSearches.map((link) => (
              <Link
                key={link.url}
                to={link.url}
                className="px-4 py-2 rounded-xl bg-[#181820] hover:bg-gold-500 hover:text-dark-950 text-xs text-[#d4d4d8] font-semibold border border-[#2e2e3a] transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
