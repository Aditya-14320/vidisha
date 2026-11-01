import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Tag,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Users,
  Search,
  MessageSquare
} from 'lucide-react';
import { Category, Business, Offer } from '../types';
import { CategoryService } from '../services/categoryService';
import { BusinessService } from '../services/businessService';
import { OfferService } from '../services/offerService';
import { SearchBanner } from '../components/common/SearchBanner';
import { CategoryCard } from '../components/common/CategoryCard';
import { BusinessCard } from '../components/business/BusinessCard';
import { OfferCard } from '../components/business/OfferCard';
import { BannerDisplay } from '../components/business/BannerDisplay';
import { BusinessCardSkeleton, CategoryCardSkeleton } from '../components/common/SkeletonCard';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredSponsored, setFeaturedSponsored] = useState<Business[]>([]);
  const [popularBusinesses, setPopularBusinesses] = useState<Business[]>([]);
  const [recentBusinesses, setRecentBusinesses] = useState<Business[]>([]);
  const [topRestaurants, setTopRestaurants] = useState<Business[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [cats, sponsored, popular, recent, restTop10, publicOffers] = await Promise.all([
          CategoryService.getPublicCategories(),
          BusinessService.getFeaturedSponsored(4),
          BusinessService.getPopularBusinesses(6),
          BusinessService.getRecentlyAdded(4),
          BusinessService.getTop10ForCategory('cat-restaurants'),
          OfferService.getPublicOffers()
        ]);

        setCategories(cats);
        setFeaturedSponsored(sponsored);
        setPopularBusinesses(popular);
        setRecentBusinesses(recent);
        setTopRestaurants(restTop10);
        setOffers(publicOffers);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3 sm:py-6">
      {/* Top Search Hero Banner */}
      <SearchBanner categories={categories} />

      {/* Top Homepage Hero Banner Placement */}
      <BannerDisplay placement="homepage_hero" className="my-4 sm:my-6" />

      {/* Categories Grid (First 8 most popular + View All) - Hidden on mobile, accessible via Bottom Nav & /categories */}
      <section className="hidden md:block mb-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-[11px] sm:text-sm text-slate-500">
              Browse top verified business sectors across Vidisha
            </p>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center space-x-1 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 shrink-0"
          >
            <span>All 20 Categories</span>
            <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-4">
            {categories.slice(0, 8).map((cat) => (
              <CategoryCard key={cat.id} category={cat} compact />
            ))}
          </div>
        )}
      </section>

      {/* Featured Sponsored Businesses (Clearly Labelled) */}
      {featuredSponsored.length > 0 && (
        <section className="mb-7 sm:mb-12 bg-gradient-to-br from-amber-50/50 via-white to-blue-50/30 p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-amber-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 fill-current" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                    Featured Businesses
                  </h2>
                  <span className="text-[9px] sm:text-[10px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded uppercase">
                    Sponsored
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Promoted listings by verified merchants in Vidisha
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {featuredSponsored.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        </section>
      )}

      {/* Today's Offers & Deals */}
      {offers.length > 0 && (
        <section className="mb-7 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Tag className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                  Today's Offers & Deals
                </h2>
                <p className="text-[11px] sm:text-sm text-slate-500">
                  Active discounts directly from Vidisha stores and dining spots
                </p>
              </div>
            </div>
            <Link
              to="/offers"
              className="inline-flex items-center space-x-1 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {offers.slice(0, 3).map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      )}

      {/* Top 10 in Restaurants & Cafes Section */}
      {topRestaurants.length > 0 && (
        <section className="mb-7 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                  Top 10 in Restaurants & Cafes
                </h2>
                <span className="text-[10px] sm:text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Top 10
                </span>
              </div>
              <p className="text-[11px] sm:text-sm text-slate-500">
                Curated dining and sweet destinations in Vidisha
              </p>
            </div>
            <Link
              to="/category/restaurants-and-cafes"
              className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 inline-flex items-center space-x-1 shrink-0"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {topRestaurants.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        </section>
      )}

      {/* Mid-page Homepage Banner Placement */}
      <BannerDisplay placement="homepage_mid" className="my-6 sm:my-8" />

      {/* Popular Businesses based on real interaction counts */}
      {popularBusinesses.length > 0 && (
        <section className="mb-7 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <TrendingUp className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                  Frequently Visited Businesses
                </h2>
                <p className="text-[11px] sm:text-sm text-slate-500">
                  Based on actual interaction volume and visitor views
                </p>
              </div>
            </div>
            <Link
              to="/search"
              className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 inline-flex items-center space-x-1 shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {popularBusinesses.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Added */}
      {recentBusinesses.length > 0 && (
        <section className="mb-7 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Clock className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                  Recently Added to Directory
                </h2>
                <p className="text-[11px] sm:text-sm text-slate-500">
                  Newly verified establishments in Vidisha
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {recentBusinesses.map((biz) => (
              <BusinessCard key={biz.id} business={biz} priorityBadge="New" />
            ))}
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="mb-7 sm:mb-12 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-slate-200/90 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-10">
          <span className="text-[11px] sm:text-xs font-bold text-blue-600 uppercase tracking-wider">
            Simple & Transparent
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            How Vidisha City Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 sm:mt-2">
            Connecting local consumers directly with neighborhood business owners without middlemen or hidden commission fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          <div className="text-center p-3 sm:p-4">
            <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 font-black text-base sm:text-lg">
              1
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1">
              Search & Discover
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Find verified shops, doctors, tutors, and services filtered by locality such as Station Road, Durga Nagar, or Khariphatak.
            </p>
          </div>

          <div className="text-center p-3 sm:p-4">
            <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 font-black text-base sm:text-lg">
              2
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1">
              Direct Contact
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Call or message the business owner directly on WhatsApp with one click. Get directions right to their door.
            </p>
          </div>

          <div className="text-center p-3 sm:p-4">
            <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 font-black text-base sm:text-lg">
              3
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1">
              Save with Local Offers
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Unlock exclusive festival deals and coupons published directly by participating merchants.
            </p>
          </div>
        </div>
      </section>

      {/* CTA: List Your Business Banner */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-500/40 text-blue-100 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
            For Local Storefronts & Professionals
          </span>
          <h2 className="text-xl sm:text-4xl font-black tracking-tight text-white mb-2 sm:mb-3">
            Are You a Business Owner in Vidisha?
          </h2>
          <p className="text-xs sm:text-base text-blue-100 mb-5 sm:mb-6 leading-relaxed">
            Reach thousands of Vidisha citizens looking for your services daily. Submit your listing application today for administrative verification.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <Link
              to="/list-your-business"
              className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-white text-blue-700 font-bold text-xs sm:text-sm hover:bg-blue-50 shadow-md text-center transition-transform active:scale-95"
            >
              List Your Business Now
            </Link>
            <Link
              to="/pricing"
              className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white border border-blue-400/40 font-bold text-xs sm:text-sm text-center transition-colors"
            >
              View Listing Packages
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
