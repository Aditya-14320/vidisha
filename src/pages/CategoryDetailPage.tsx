import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Award,
  ChevronLeft,
  MapPin,
  Filter,
  Info,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Category, Business } from '../types';
import { CategoryService } from '../services/categoryService';
import { BusinessService } from '../services/businessService';
import { DynamicIcon } from '../components/common/DynamicIcon';
import { BusinessCard } from '../components/business/BusinessCard';
import { BannerDisplay } from '../components/business/BannerDisplay';
import { BusinessCardSkeleton } from '../components/common/SkeletonCard';

export const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [top10Businesses, setTop10Businesses] = useState<Business[]>([]);
  const [otherBusinesses, setOtherBusinesses] = useState<Business[]>([]);
  const [selectedLocality, setSelectedLocality] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryData() {
      if (!slug) return;
      try {
        setLoading(true);
        const cat = await CategoryService.getCategoryBySlug(slug);
        if (!cat) {
          setCategory(null);
          return;
        }
        setCategory(cat);

        // Fetch Top 10 paid approved businesses (enforces strict max 10 server/service rule)
        const top10 = await BusinessService.getTop10ForCategory(cat.id);
        setTop10Businesses(top10);

        // Fetch other approved businesses in this category
        const allCategoryBiz = await BusinessService.getPublicBusinesses({ categoryId: cat.id });
        const top10Ids = new Set(top10.map(b => b.id));
        const others = allCategoryBiz.filter(b => !top10Ids.has(b.id));
        setOtherBusinesses(others);
      } catch (err) {
        console.error('Failed to load category', err);
      } finally {
        setLoading(false);
      }
    }

    loadCategoryData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 w-40 skeleton-shimmer rounded mb-6" />
        <div className="h-32 w-full skeleton-shimmer rounded-3xl mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <BusinessCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Category Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          The requested category does not exist or has been deactivated.
        </p>
        <Link
          to="/categories"
          className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm"
        >
          View All Categories
        </Link>
      </div>
    );
  }

  // Filter businesses by locality if selected
  const filterByLocality = (list: Business[]) => {
    if (selectedLocality === 'all') return list;
    return list.filter(b => b.locality.toLowerCase() === selectedLocality.toLowerCase());
  };

  const displayedTop10 = filterByLocality(top10Businesses);
  const displayedOthers = filterByLocality(otherBusinesses);

  // Extract unique localities from both lists
  const availableLocalities = Array.from(
    new Set([...top10Businesses, ...otherBusinesses].map(b => b.locality))
  ).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3 sm:py-6">
      {/* Back button */}
      <Link
        to="/categories"
        className="inline-flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-blue-600 mb-3 sm:mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to all categories</span>
      </Link>

      {/* Category Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-lg mb-6 sm:mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
          <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md p-2.5 sm:p-3 text-white flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
            <DynamicIcon name={category.icon} className="w-7 h-7 sm:w-11 sm:h-11" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-0.5 sm:mb-1">
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-blue-200">
                Vidisha Directory
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-xl leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        {/* CTA to list under this category */}
        <Link
          to={`/list-your-business?category=${category.id}`}
          className="shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs sm:text-sm hover:bg-blue-50 shadow-md transition-transform active:scale-95"
        >
          List Under {category.name}
        </Link>
      </div>

      {/* Category Page Banner Placement */}
      <BannerDisplay placement="category" className="mb-6 sm:mb-8" />

      {/* Locality Filter Pill Bar */}
      {availableLocalities.length > 0 && (
        <div className="mb-6 sm:mb-8 flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto pb-1.5 text-xs no-scrollbar">
          <span className="font-bold text-slate-600 flex items-center space-x-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Locality:</span>
          </span>
          <button
            onClick={() => setSelectedLocality('all')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-colors shrink-0 ${
              selectedLocality === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Localities
          </button>
          {availableLocalities.map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocality(loc)}
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors shrink-0 ${
                selectedLocality === loc
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      )}

      {/* TOP 10 SECTION */}
      <section className="mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 border-b border-slate-200 mb-4 sm:mb-6 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-sm shrink-0">
              <Award className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
                <span>Top 10 in {category.name}</span>
                <span className="text-[10px] sm:text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  {top10Businesses.length}/10 Slots
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Premier verified merchant placements in Vidisha
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center space-x-1 bg-slate-100 px-2.5 py-1 rounded-lg self-start sm:self-auto">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Placement positions, strictly capped at 10.</span>
          </div>
        </div>

        {displayedTop10.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 text-center border border-dashed border-slate-300">
            <p className="text-xs sm:text-sm font-semibold text-slate-700 mb-1">
              No businesses currently occupy the Top 10 slots in this filter.
            </p>
            <p className="text-[11px] sm:text-xs text-slate-500 mb-4">
              Are you a business owner in this category? Secure one of the available Top 10 slots.
            </p>
            <Link
              to={`/list-your-business?category=${category.id}`}
              className="px-4 sm:px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 inline-block"
            >
              Apply for Top 10 Slot
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {displayedTop10.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        )}
      </section>

      {/* OTHER DIRECTORY LISTINGS */}
      {displayedOthers.length > 0 && (
        <section className="mt-8 sm:mt-12 mb-8">
          <div className="pb-3 border-b border-slate-200 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              More Verified Listings in {category.name}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Additional community establishments across Vidisha
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {displayedOthers.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        </section>
      )}

      {/* Mandatory Placement Disclosure */}
      <div className="mt-8 p-3.5 sm:p-4 bg-slate-100 rounded-2xl text-[11px] sm:text-xs text-slate-500 leading-relaxed">
        <p className="font-semibold text-slate-700 mb-0.5">Commercial Notice:</p>
        <p>
          Top 10 slots in "{category.name}" are paid advertising directory placements reserved for active, verified merchants in Vidisha. This placement is not an independent review or subjective evaluation by Vidisha City Directory.
        </p>
      </div>
    </div>
  );
};
