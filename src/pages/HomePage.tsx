import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Tag,
  Clock,
  ArrowRight,
  TrendingUp,
  Star
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
import { SEOHead } from '../components/seo/SEOHead';
import { buildWebSiteSchema } from '../utils/schemaGenerator';

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
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6">
      <SEOHead
        title="Vidisha City – Discover Local Businesses in Vidisha, Madhya Pradesh"
        description="Discover the best local businesses in Vidisha. Explore restaurants, hotels, doctors, coaching institutes, gyms and more with Vidisha City."
        canonical="/"
        ogType="website"
        structuredData={buildWebSiteSchema()}
      />

      {/* Top Search Hero Banner matching reference screenshot */}
      <SearchBanner categories={categories} />

      {/* Featured Establishments section matching reference screenshot */}
      <section className="mb-10 sm:mb-14 bg-[#141417] rounded-3xl p-5 sm:p-7 border border-[#2a2a30] shadow-[0_10px_35px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#24242a]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold-500 to-gold-600 text-dark-950 flex items-center justify-center font-bold shrink-0 shadow-md">
              <Star className="w-5 h-5 fill-dark-950 text-dark-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif text-lg sm:text-2xl font-bold text-white tracking-tight">
                  Featured Establishments
                </h2>
              </div>
              <p className="text-xs text-[#a1a1aa] font-light">
                Promoted listings by verified merchants in Vidisha
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-[#1d1d24] text-gold-400 px-3 py-1 rounded-full uppercase tracking-wider border border-gold-500/30">
            Sponsored
          </span>
        </div>

        {/* Featured Business Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <BusinessCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredSponsored.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredSponsored.map((biz) => (
              <BusinessCard key={biz.id} business={biz} priorityBadge="Priority Listing" />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-[#a1a1aa] text-sm">
            Featured listings will appear here.
          </div>
        )}

        {/* Carousel Dots indicator matching screenshot */}
        <div className="flex items-center justify-center space-x-2 mt-6">
          <span className="w-2.5 h-2.5 rounded-full bg-gold-400" />
          <span className="w-2 h-2 rounded-full bg-[#3f3f46]" />
          <span className="w-2 h-2 rounded-full bg-[#3f3f46]" />
          <span className="w-2 h-2 rounded-full bg-[#3f3f46]" />
        </div>
      </section>

      {/* Top Homepage Hero Banner Placement */}
      <BannerDisplay placement="homepage_hero" className="my-5 sm:my-8" />

      {/* Categories Grid */}
      <section className="hidden md:block mb-12">
        <div className="flex items-end justify-between mb-5 pb-3 border-b border-[#24242a]">
          <div>
            <div className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Curated Sectors
            </div>
            <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
              Explore by Category
            </h2>
            <p className="text-xs text-[#a1a1aa] font-light mt-0.5">
              Browse top verified business sectors across Vidisha
            </p>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors group shrink-0"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {categories.slice(0, 8).map((cat) => (
              <CategoryCard key={cat.id} category={cat} compact />
            ))}
          </div>
        )}
      </section>

      {/* Today's Offers & Deals */}
      {offers.length > 0 && (
        <section className="mb-10 sm:mb-14">
          <div className="flex items-end justify-between mb-5 pb-3 border-b border-[#24242a]">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1a1a20] text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/30">
                <Tag className="w-4 sm:w-5 h-4 sm:h-5 text-gold-400" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-gold-400 uppercase tracking-wider">Limited Privileges</div>
                <h2 className="font-serif text-xl sm:text-3xl font-bold text-white tracking-tight">
                  Exclusive In-Store Offers
                </h2>
                <p className="text-xs text-[#a1a1aa] font-light">
                  Active discounts published directly by participating Vidisha merchants
                </p>
              </div>
            </div>
            <Link
              to="/offers"
              className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors group shrink-0"
            >
              <span>View All Offers</span>
              <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {offers.slice(0, 3).map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      )}

      {/* Top 10 in Restaurants & Cafes Section */}
      {topRestaurants.length > 0 && (
        <section className="mb-10 sm:mb-14">
          <div className="flex items-end justify-between mb-5 pb-3 border-b border-[#24242a]">
            <div>
              <div className="flex items-center space-x-2 mb-0.5">
                <span className="text-[10px] font-bold bg-[#1a1a22] text-gold-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-gold-500/30">
                  Hallmark Selection
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-3xl font-bold text-white tracking-tight">
                Top 10 in Restaurants & Cafes
              </h2>
              <p className="text-xs text-[#a1a1aa] font-light">
                Curated dining and sweet destinations in Vidisha
              </p>
            </div>
            <Link
              to="/category/restaurants-and-cafes"
              className="text-xs sm:text-sm font-semibold text-gold-400 hover:text-gold-300 inline-flex items-center space-x-1.5 group shrink-0"
            >
              <span>Explore Category</span>
              <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {topRestaurants.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        </section>
      )}

      {/* Mid-page Homepage Banner Placement */}
      <BannerDisplay placement="homepage_mid" className="my-8 sm:my-12" />

      {/* Popular Businesses */}
      {popularBusinesses.length > 0 && (
        <section className="mb-10 sm:mb-14">
          <div className="flex items-end justify-between mb-5 pb-3 border-b border-[#24242a]">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1c1c22] text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/30">
                <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-gold-400" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-gold-400 uppercase tracking-wider">High Engagement</div>
                <h2 className="font-serif text-xl sm:text-3xl font-bold text-white tracking-tight">
                  Frequently Visited Businesses
                </h2>
                <p className="text-xs text-[#a1a1aa] font-light">
                  Ranked by actual interaction volume, inquiries, and customer views
                </p>
              </div>
            </div>
            <Link
              to="/search"
              className="text-xs sm:text-sm font-semibold text-gold-400 hover:text-gold-300 inline-flex items-center space-x-1.5 group shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {popularBusinesses.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Added */}
      {recentBusinesses.length > 0 && (
        <section className="mb-10 sm:mb-14">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#24242a]">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1c1c22] text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/30">
                <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-gold-400" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-3xl font-bold text-white tracking-tight">
                  Newly Verified Establishments
                </h2>
                <p className="text-xs text-[#a1a1aa] font-light">
                  Recent additions meeting Vidisha City verification standards
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {recentBusinesses.map((biz) => (
              <BusinessCard key={biz.id} business={biz} priorityBadge="New Addition" />
            ))}
          </div>
        </section>
      )}

      {/* CTA: List Your Business Dark Luxury Banner */}
      <section className="bg-gradient-to-r from-[#141418] via-[#1a1a22] to-[#121215] text-white rounded-3xl p-7 sm:p-12 shadow-2xl relative overflow-hidden border border-gold-500/30 mb-8">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-[#22222a] text-gold-400 border border-gold-500/30 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-3">
            For Local Storefronts & Professionals
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Elevate Your Business Presence in Vidisha
          </h2>
          <p className="text-xs sm:text-base text-[#d4d4d8] mb-6 sm:mb-8 leading-relaxed font-light">
            Connect with thousands of local patrons seeking verified products and services daily. Register your establishment for administrative verification.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              to="/list-your-business"
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 hover:from-gold-300 hover:to-gold-500 text-dark-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(212,168,49,0.3)] text-center transition-all duration-200 transform active:scale-95"
            >
              List Your Business Now
            </Link>
            <Link
              to="/pricing"
              className="px-6 py-3.5 rounded-full bg-[#18181e] hover:bg-[#22222a] text-white border border-[#33333c] hover:border-gold-500/40 font-semibold text-xs sm:text-sm text-center transition-colors"
            >
              View Placement Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
