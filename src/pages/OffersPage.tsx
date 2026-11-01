import React, { useState, useEffect } from 'react';
import {
  Tag,
  Search,
  Grid,
  MapPin,
  Filter,
  X,
  AlertCircle,
  RotateCw,
  ShoppingBag,
  Info,
  Building2,
  Calendar
} from 'lucide-react';
import { Offer, Category } from '../types';
import { OfferService } from '../services/offerService';
import { CategoryService } from '../services/categoryService';
import { OfferCard } from '../components/business/OfferCard';
import { BannerDisplay } from '../components/business/BannerDisplay';

export const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('');

  const vidishaLocalities = [
    'Station Road',
    'Durga Nagar',
    'Khariphatak',
    'Madhavganj',
    'Sherpura',
    'Tilak Chowk',
    'Bada Bazar',
    'Civil Lines'
  ];

  const loadOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const [offerList, categoryList] = await Promise.all([
        OfferService.getPublicOffers(),
        CategoryService.getPublicCategories()
      ]);
      setOffers(offerList);
      setCategories(categoryList);
    } catch (err: any) {
      console.error('Failed to load offers', err);
      setError(err?.message || 'Unable to load active deals. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  // Filtered in-memory list
  const filteredOffers = offers.filter(o => {
    if (selectedCategory && o.categoryId !== selectedCategory) {
      return false;
    }
    if (selectedLocality && o.businessLocality?.toLowerCase() !== selectedLocality.toLowerCase()) {
      return false;
    }
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      const matchesTitle = o.title.toLowerCase().includes(q);
      const matchesDesc = o.description.toLowerCase().includes(q);
      const matchesBiz = o.businessName.toLowerCase().includes(q);
      const matchesLoc = (o.businessLocality || '').toLowerCase().includes(q);
      if (!matchesTitle && !matchesDesc && !matchesBiz && !matchesLoc) {
        return false;
      }
    }
    return true;
  });

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setSelectedLocality('');
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-2.5 border border-amber-200">
          <Tag className="w-3.5 h-3.5 text-amber-600" />
          <span>Vidisha City Store Promotions</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2 sm:mb-3">
          Today's In-Store Offers & Deals
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
          Discover verified promotional discounts and complimentary gifts directly published by storefronts and dining destinations in Vidisha.
        </p>

        {/* Clear Non-Transactional Business Model Notice */}
        <div className="mt-4 p-3 sm:p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-left text-xs text-blue-900 flex items-start space-x-2.5">
          <ShoppingBag className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-[11px] sm:text-xs leading-relaxed">
            <strong>In-Person Merchant Offers:</strong> Vidisha City is a local business discovery platform and does not handle online checkout or delivery transactions. Simply present the offer pass at the store billing counter before your bill is generated.
          </div>
        </div>
      </div>

      {/* Offers Page Banner Placement */}
      <BannerDisplay placement="offers" className="mb-6 sm:mb-8" />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200 shadow-sm mb-6 sm:mb-8 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 sm:w-5 h-4 sm:h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by deal, store, or keyword..."
              className="w-full pl-9 sm:pl-10 pr-8 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <Grid className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-9 pr-8 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 text-slate-700 cursor-pointer"
            >
              <option value="">All Business Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Locality Dropdown */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="w-full pl-9 pr-8 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 text-slate-700 cursor-pointer"
            >
              <option value="">All Vidisha Localities</option>
              {vidishaLocalities.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset Pill */}
        {(query || selectedCategory || selectedLocality) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 text-[11px]">
              Showing <strong>{filteredOffers.length}</strong> matching promotional deals
            </span>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-semibold text-xs flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Error State with Retry Button */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadOffers}
            className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 flex items-center space-x-1 text-xs"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 skeleton-shimmer" />
          ))}
        </div>
      ) : filteredOffers.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-slate-200 max-w-md mx-auto my-6 shadow-sm">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">
            No Active Deals Found
          </h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            {query || selectedCategory || selectedLocality
              ? 'No promotions match your selected filters. Try broadening your criteria.'
              : 'There are currently no active seasonal promotions published in this category.'}
          </p>
          {(query || selectedCategory || selectedLocality) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm"
            >
              Show All Available Deals
            </button>
          )}
        </div>
      ) : (
        /* Offers Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}

      {/* Mandatory Platform Disclaimer */}
      <div className="mt-10 p-4 bg-slate-100 rounded-2xl text-[11px] sm:text-xs text-slate-500 leading-relaxed border border-slate-200/60">
        <p className="font-semibold text-slate-700 mb-1 flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Local Offer Verification Policy:</span>
        </p>
        <p>
          All promotional listings, discounts, and benefits on this page are provided directly by authorized store owners in Vidisha. Vidisha City does not process online payments, deduct automatic invoice discounts, or guarantee inventory availability. Please confirm promotional terms with the merchant prior to finalizing your in-store purchase.
        </p>
      </div>
    </div>
  );
};
