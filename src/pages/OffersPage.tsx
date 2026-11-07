import React, { useState, useEffect } from 'react';
import {
  Tag, Search, Grid, MapPin, X, AlertCircle, ShoppingBag
} from 'lucide-react';
import { Offer, Category } from '../types';
import { OfferService } from '../services/offerService';
import { CategoryService } from '../services/categoryService';
import { OfferCard } from '../components/business/OfferCard';
import { BannerDisplay } from '../components/business/BannerDisplay';
import { SEOHead } from '../components/seo/SEOHead';

export const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('');

  const vidishaLocalities = [
    'Station Road', 'Durga Nagar', 'Khariphatak', 'Madhavganj',
    'Sherpura', 'Tilak Chowk', 'Bada Bazar', 'Civil Lines'
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
      setError(err?.message || 'Unable to load active deals. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOffers(); }, []);

  const filteredOffers = offers.filter(o => {
    if (selectedCategory && o.categoryId !== selectedCategory) return false;
    if (selectedLocality && o.businessLocality?.toLowerCase() !== selectedLocality.toLowerCase()) return false;
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      if (!o.title.toLowerCase().includes(q) && !o.description.toLowerCase().includes(q) &&
          !o.businessName.toLowerCase().includes(q) && !(o.businessLocality || '').toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const clearFilters = () => { setQuery(''); setSelectedCategory(''); setSelectedLocality(''); };
  const hasFilters = query || selectedCategory || selectedLocality;

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24">
      <SEOHead
        title="Local Offers & Discounts in Vidisha – Exclusive City Deals | Vidisha City"
        description="Save money with exclusive daily deals, discounts, and festive offers from verified local shops and businesses in Vidisha, Madhya Pradesh."
        canonical="/offers"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Offers & Deals', url: '/offers' },
        ]}
      />
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#1c1c22] text-gold-400 text-xs font-bold mb-3 border border-gold-500/30">
          <Tag className="w-3.5 h-3.5 text-gold-400" />
          <span>Vidisha City Merchant Promotions</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight mb-2 sm:mb-3">
          Exclusive In-Store Offers & Deals
        </h1>
        <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed max-w-xl mx-auto font-light">
          Curated promotional discounts and complimentary gifts published directly by storefronts and dining establishments in Vidisha.
        </p>

        {/* In-Store Notice */}
        <div className="mt-5 p-3.5 bg-[#141418] border border-gold-500/30 rounded-2xl text-left text-xs text-[#d4d4d8] flex items-start space-x-3 shadow-md">
          <ShoppingBag className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
          <div className="text-[11px] sm:text-xs leading-relaxed font-light">
            <strong className="font-semibold text-white">In-Person Redemption Only:</strong> Vidisha City does not process online checkout or delivery. Simply present the offer at the store billing counter before your bill is generated.
          </div>
        </div>
      </div>

      {/* Offers Page Banner Placement */}
      <BannerDisplay placement="offers" className="mb-6 sm:mb-8" />

      {/* Filter and Search Bar */}
      <div className="bg-[#141417] rounded-3xl p-4 sm:p-6 border border-[#26262e] shadow-[0_8px_30px_rgba(0,0,0,0.6)] mb-7 sm:mb-10 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 sm:w-5 h-4 sm:h-5 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by deal, store, or keyword..."
              className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm rounded-full border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white placeholder-[#71717a] transition-all"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#71717a] hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <Grid className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm rounded-full border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white cursor-pointer"
            >
              <option value="" className="bg-[#18181c]">All Business Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#18181c]">{c.name}</option>
              ))}
            </select>
          </div>

          {/* Locality Dropdown */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm rounded-full border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white cursor-pointer"
            >
              <option value="" className="bg-[#18181c]">All Vidisha Localities</option>
              {vidishaLocalities.map((loc) => (
                <option key={loc} value={loc} className="bg-[#18181c]">{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {hasFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-[#222228] text-xs">
            <span className="text-[#a1a1aa] text-[11px] font-light">
              Showing <strong className="text-white">{filteredOffers.length}</strong> matching deals
            </span>
            <button
              onClick={clearFilters}
              className="text-rose-400 hover:underline font-semibold text-xs flex items-center space-x-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-rose-200 text-xs flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Offers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-3xl skeleton-shimmer" />
          ))}
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="text-center py-16 bg-[#141417] rounded-3xl border border-[#26262e] shadow-xl max-w-lg mx-auto">
          <Tag className="w-12 h-12 text-gold-500/50 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-white mb-1.5">No Active Offers Found</h3>
          <p className="text-xs text-[#a1a1aa] mb-5 font-light">
            There are currently no published merchant offers matching your search criteria.
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 font-bold text-xs shadow-md"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {filteredOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
};
