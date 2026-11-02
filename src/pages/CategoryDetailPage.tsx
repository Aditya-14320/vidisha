import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Award, ChevronLeft, Filter, Info, AlertCircle
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
        if (!cat) { setCategory(null); return; }
        setCategory(cat);

        const top10 = await BusinessService.getTop10ForCategory(cat.id);
        setTop10Businesses(top10);

        const allCategoryBiz = await BusinessService.getPublicBusinesses({ categoryId: cat.id });
        const top10Ids = new Set(top10.map(b => b.id));
        setOtherBusinesses(allCategoryBiz.filter(b => !top10Ids.has(b.id)));
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
        <div className="h-36 w-full skeleton-shimmer rounded-3xl mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <BusinessCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-14 h-14 text-gold-400 mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-white mb-2">Category Not Found</h2>
        <p className="text-sm text-[#a1a1aa] mb-8 font-light">
          The requested category does not exist or has been deactivated.
        </p>
        <Link to="/categories" className="px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 font-bold rounded-full text-sm shadow-md">
          View All Categories
        </Link>
      </div>
    );
  }

  const filterByLocality = (list: Business[]) => {
    if (selectedLocality === 'all') return list;
    return list.filter(b => b.locality.toLowerCase() === selectedLocality.toLowerCase());
  };

  const displayedTop10 = filterByLocality(top10Businesses);
  const displayedOthers = filterByLocality(otherBusinesses);
  const availableLocalities = Array.from(
    new Set([...top10Businesses, ...otherBusinesses].map(b => b.locality))
  ).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24">
      {/* Back button */}
      <Link
        to="/categories"
        className="inline-flex items-center space-x-1 text-xs font-semibold text-[#a1a1aa] hover:text-gold-400 mb-4 sm:mb-5 group transition-colors"
      >
        <ChevronLeft className="w-4 h-4 text-gold-500 group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to all categories</span>
      </Link>

      {/* Category Hero Banner */}
      <div className="bg-gradient-to-r from-[#17171d] via-[#1f1f26] to-[#141418] text-white rounded-3xl p-5 sm:p-8 shadow-2xl mb-7 sm:mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 border border-gold-500/30 relative overflow-hidden">
        <div className="flex items-start sm:items-center space-x-4 sm:space-x-5 relative z-10">
          <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-[#0e0e11] border border-gold-500/40 p-3 sm:p-4 text-gold-400 flex items-center justify-center shrink-0 shadow-lg">
            <DynamicIcon name={category.icon} className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-gold-400">
                Vidisha City Directory
              </span>
            </div>
            <h1 className="font-serif text-xl sm:text-3xl font-bold text-white tracking-tight">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#d4d4d8] mt-1.5 max-w-xl leading-relaxed font-light">
              {category.description}
            </p>
          </div>
        </div>

        <Link
          to={`/list-your-business?category=${category.id}`}
          className="shrink-0 px-6 py-3 rounded-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 hover:from-gold-300 hover:to-gold-500 text-dark-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 relative z-10"
        >
          List Under {category.name}
        </Link>
      </div>

      {/* Category Page Banner Placement */}
      <BannerDisplay placement="category" className="mb-7 sm:mb-10" />

      {/* Locality Filter Pill Bar */}
      {availableLocalities.length > 0 && (
        <div className="mb-7 sm:mb-10 flex items-center space-x-2 overflow-x-auto pb-2 text-xs no-scrollbar">
          <span className="font-semibold text-[#a1a1aa] flex items-center space-x-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-gold-400" />
            <span>Filter:</span>
          </span>
          <button
            onClick={() => setSelectedLocality('all')}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all shrink-0 ${
              selectedLocality === 'all'
                ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 shadow-sm'
                : 'bg-[#18181c] text-[#d4d4d8] border border-[#2a2a34] hover:border-gold-500/40'
            }`}
          >
            All Localities
          </button>
          {availableLocalities.map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocality(loc)}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all shrink-0 ${
                selectedLocality === loc
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 shadow-sm'
                  : 'bg-[#18181c] text-[#d4d4d8] border border-[#2a2a34] hover:border-gold-500/40'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      )}

      {/* TOP 10 SECTION */}
      <section className="mb-10 sm:mb-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#24242c] mb-6 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gold-500 to-gold-600 text-dark-950 flex items-center justify-center shadow-sm shrink-0">
              <Award className="w-5 h-5 text-dark-950" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 flex-wrap">
                <span>Premier Selection in {category.name}</span>
                <span className="text-[10px] sm:text-xs font-bold text-gold-400 bg-[#1c1c24] px-2.5 py-0.5 rounded-full border border-gold-500/30">
                  {top10Businesses.length}/10 Slots
                </span>
              </h2>
              <p className="text-xs text-[#a1a1aa] font-light">
                Top verified merchant placements in Vidisha
              </p>
            </div>
          </div>

          <div className="text-[11px] text-[#a1a1aa] flex items-center space-x-1.5 bg-[#141418] px-3 py-1.5 rounded-full border border-[#26262e] self-start sm:self-auto">
            <Info className="w-3.5 h-3.5 text-gold-400 shrink-0" />
            <span>Placement positions strictly capped at 10.</span>
          </div>
        </div>

        {displayedTop10.length === 0 ? (
          <div className="bg-[#141417] rounded-3xl p-8 sm:p-10 text-center border border-[#26262e]">
            <p className="text-sm font-semibold text-white mb-1.5">
              No businesses occupy the Top 10 slots under this filter.
            </p>
            <p className="text-xs text-[#a1a1aa] mb-5 font-light">
              Are you a business owner here? Secure one of the available Top 10 selection slots.
            </p>
            <Link
              to={`/list-your-business?category=${category.id}`}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 text-xs font-bold shadow-md inline-block transition-colors"
            >
              Apply for Selection Slot
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {displayedTop10.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        )}
      </section>

      {/* OTHER DIRECTORY LISTINGS */}
      {displayedOthers.length > 0 && (
        <section className="mt-10 sm:mt-14 mb-10">
          <div className="pb-4 border-b border-[#24242c] mb-6">
            <h2 className="font-serif text-base sm:text-xl font-bold text-white">
              More Verified Listings in {category.name}
            </h2>
            <p className="text-xs text-[#a1a1aa] font-light mt-0.5">
              Additional community establishments across Vidisha
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {displayedOthers.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        </section>
      )}

      {/* Mandatory Placement Disclosure */}
      <div className="mt-10 p-4 sm:p-5 bg-[#141418] rounded-2xl text-[11px] sm:text-xs text-[#a1a1aa] leading-relaxed border border-[#26262e]">
        <p className="font-semibold text-gold-400 mb-0.5">Commercial Placement Disclosure:</p>
        <p className="font-light">
          Premier Selection slots in "{category.name}" are paid commercial directory positions reserved for active, verified merchants in Vidisha. This placement is not an independent editorial review or subjective evaluation by Vidisha City Directory.
        </p>
      </div>
    </div>
  );
};
