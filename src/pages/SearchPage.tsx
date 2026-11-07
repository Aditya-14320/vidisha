import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Business, Category } from '../types';
import { BusinessService } from '../services/businessService';
import { CategoryService } from '../services/categoryService';
import { StorageService, DEFAULT_VIDISHA_LOCALITIES } from '../services/storageService';
import { BusinessCard } from '../components/business/BusinessCard';
import { BusinessCardSkeleton } from '../components/common/SkeletonCard';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialLocality = searchParams.get('locality') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocality, setSelectedLocality] = useState(initialLocality);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [onlySponsored, setOnlySponsored] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [results, setResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const [vidishaLocalities, setVidishaLocalities] = useState<string[]>(DEFAULT_VIDISHA_LOCALITIES);

  useEffect(() => {
    CategoryService.getPublicCategories().then(setCategories).catch(console.warn);
    StorageService.getLocalities().then(setVidishaLocalities).catch(console.warn);
  }, []);

  useEffect(() => {
    async function executeSearch() {
      setLoading(true);
      try {
        const filters: any = {
          query: query.trim() || undefined,
          categoryId: selectedCategory || undefined,
          locality: selectedLocality || undefined,
          priceRange: selectedPrice || undefined,
          isSponsored: undefined,
        };
        const list = await BusinessService.getPublicBusinesses(filters);
        setResults(list);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    }
    executeSearch();
  }, [query, selectedCategory, selectedLocality, selectedPrice, onlySponsored]);

  const clearAllFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setSelectedLocality('');
    setSelectedPrice('');
    setOnlySponsored(false);
    setSearchParams({});
  };

  const hasFilters = query || selectedCategory || selectedLocality || selectedPrice || onlySponsored;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Search Header */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-1.5 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Search className="w-3.5 h-3.5" />
          <span>Full Directory</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight mb-1">
          Search Vidisha City Directory
        </h1>
        <p className="text-sm text-[#a1a1aa] font-light">
          Find verified establishments across all categories and localities in Vidisha.
        </p>
      </div>

      {/* Main Filter Bar */}
      <div className="bg-[#141417] rounded-3xl p-5 sm:p-6 border border-[#26262e] shadow-[0_8px_30px_rgba(0,0,0,0.6)] mb-8 space-y-4">
        {/* Top search input row */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by business name, services, products, or keyword..."
              className="w-full pl-11 pr-4 py-2.5 text-sm rounded-full border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white placeholder-[#71717a] transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="w-full md:w-56">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-3 text-sm rounded-full border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white cursor-pointer"
            >
              <option value="" className="bg-[#18181c]">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#18181c]">{c.name}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-52">
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="w-full py-2.5 px-3 text-sm rounded-full border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#1c1c22] text-white cursor-pointer"
            >
              <option value="" className="bg-[#18181c]">All Localities</option>
              {vidishaLocalities.map((loc) => (
                <option key={loc} value={loc} className="bg-[#18181c]">{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Filter Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#222228] text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setOnlySponsored(!onlySponsored)}
              className={`px-3 py-1.5 rounded-full font-bold flex items-center space-x-1.5 transition-all ${
                onlySponsored
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 shadow-sm'
                  : 'bg-[#1c1c22] text-[#d4d4d8] border border-[#2e2e38] hover:border-gold-500/40'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Featured Only</span>
            </button>
          </div>

          {hasFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-rose-400 hover:underline flex items-center space-x-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-medium text-[#a1a1aa]">
          Showing <span className="text-gold-400 font-bold">{results.length}</span> verified{results.length === 1 ? ' result' : ' results'}
        </p>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <BusinessCardSkeleton key={i} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="bg-[#141417] rounded-3xl p-12 sm:p-16 text-center border border-[#26262e] max-w-lg mx-auto shadow-xl">
          <AlertCircle className="w-14 h-14 text-gold-500/60 mx-auto mb-4" />
          <h3 className="font-serif text-lg font-bold text-white mb-2">
            No Matching Establishments Found
          </h3>
          <p className="text-xs text-[#a1a1aa] mb-7 leading-relaxed font-light">
            We couldn't find any verified listings matching your search. Try broadening your locality or keywords.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 font-bold text-xs shadow-md transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((biz) => (
            <BusinessCard key={biz.id} business={biz} />
          ))}
        </div>
      )}
    </div>
  );
};
