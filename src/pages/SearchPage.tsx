import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid,
  MapPin,
  X,
  AlertCircle,
  Sparkles,
  Tag
} from 'lucide-react';
import { Business, Category } from '../types';
import { BusinessService } from '../services/businessService';
import { CategoryService } from '../services/categoryService';
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
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [results, setResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const vidishaLocalities = [
    'Station Road',
    'Durga Nagar',
    'Khariphatak',
    'Madhavganj',
    'Sherpura',
    'Tilak Chowk',
    'Bada Bazar',
    'Ahmedpur Road',
    'Civil Lines',
    'Venkatesh Market',
    'Neem Tal'
  ];

  useEffect(() => {
    CategoryService.getPublicCategories().then(setCategories).catch(console.warn);
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
    setOnlyOpenNow(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          Vidisha City Search & Directory
        </h1>
        <p className="text-sm text-slate-500">
          Find verified establishments across all 20 categories and localities in Vidisha.
        </p>
      </div>

      {/* Main Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-8 space-y-4">
        {/* Top search input row */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by business name, services, products, or keyword..."
              className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus-ring"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="w-full md:w-56">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-3 text-sm rounded-xl border border-slate-300 focus-ring bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-52">
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="w-full py-2.5 px-3 text-sm rounded-xl border border-slate-300 focus-ring bg-white"
            >
              <option value="">All Localities</option>
              {vidishaLocalities.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Filter Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-600 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </span>

            {/* Price pills */}
            {['₹', '₹₹', '₹₹₹', '₹₹₹₹'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPrice(selectedPrice === p ? '' : p)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  selectedPrice === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}

            {/* Sponsored Only Toggle */}
            <button
              onClick={() => setOnlySponsored(!onlySponsored)}
              className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1 transition-colors ${
                onlySponsored
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Sponsored Only</span>
            </button>
          </div>

          {(query || selectedCategory || selectedLocality || selectedPrice || onlySponsored) && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-red-600 hover:underline flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-semibold text-slate-700">
          Showing <span className="text-blue-600 font-bold">{results.length}</span> verified results
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
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto shadow-sm">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">
            No matching businesses found
          </h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            We couldn't find any verified listings matching your specific search and filter criteria. Try broadening your locality or keywords.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
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
