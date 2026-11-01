import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Shield, Sparkles, Award, ArrowRight, Zap, Users, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Category } from '../types';
import { CategoryService } from '../services/categoryService';

export const PricingPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showCategorySlots, setShowCategorySlots] = useState(false);

  useEffect(() => {
    CategoryService.getPublicCategories()
      .then((cats) => setCategories(cats))
      .catch((err) => console.error('Failed to load categories', err))
      .finally(() => setLoadingCategories(false));
  }, []);

  const totalOccupied = categories.reduce((sum, c) => sum + Math.min(10, c.businessCount || 0), 0);
  const totalSlots = categories.length * 10;
  const totalAvailable = Math.max(0, totalSlots - totalOccupied);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 pb-24">
      {/* Background Glow Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Premium Commercial Directory • Vidisha, MP</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Grow Your Business in Vidisha
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Exclusive verified digital presence for established Vidisha merchants. Every category is strictly capped at <span className="text-white font-semibold">10 business slots</span>.
          </p>

          {/* Dynamic Slots Counter Strip */}
          <div className="mt-8 max-w-2xl mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span>Strict Limit: Max 10 Businesses Per Category</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    {loadingCategories
                      ? 'Checking live category slots...'
                      : `${totalAvailable} of ${totalSlots} total category slots currently open`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCategorySlots(!showCategorySlots)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition-colors self-end sm:self-auto"
              >
                <span>{showCategorySlots ? 'Hide Category Slots' : 'View Live Category Slots'}</span>
                {showCategorySlots ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Expandable Live Slots Panel */}
            {showCategorySlots && (
              <div className="mt-4 pt-4 border-t border-slate-800 text-left animate-in fade-in duration-200">
                <p className="text-xs text-slate-400 mb-3">
                  Live slot occupancy per category (maximum 10 paid businesses per category):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const occupied = Math.min(10, cat.businessCount || 0);
                    const available = Math.max(0, 10 - occupied);
                    const isFull = available === 0;

                    return (
                      <div
                        key={cat.id}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                          isFull
                            ? 'bg-red-950/20 border-red-900/40 text-red-300'
                            : available <= 3
                            ? 'bg-amber-950/20 border-amber-900/40 text-amber-300'
                            : 'bg-slate-800/50 border-slate-700/60 text-slate-300'
                        }`}
                      >
                        <span className="font-semibold truncate mr-2">{cat.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                            isFull
                              ? 'bg-red-500/20 text-red-400'
                              : available <= 3
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {isFull ? 'FULL (0 slots)' : `${available}/10 open`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Pricing Cards Grid (Balanced 2-Column Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16 items-stretch">
          {/* Plan 1: Complete Business Listing */}
          <section className="relative rounded-3xl border-2 border-blue-500/60 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 p-7 sm:p-9 flex flex-col shadow-2xl shadow-blue-950/40 hover:border-blue-400 hover:shadow-blue-900/50 hover:-translate-y-1 transition-all duration-300">
            {/* Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg border border-blue-400/40">
              Most Popular
            </div>

            <div className="mb-4 mt-2 text-center">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase tracking-wider mb-2">
                Standard Paid Listing
              </span>
              <h3 className="text-2xl font-bold text-white">Complete Business Listing</h3>
              <p className="text-xs text-slate-400 mt-1">Full profile visibility with contact buttons & photographs</p>
            </div>

            <div className="mb-6 text-center">
              <div className="flex items-baseline justify-center space-x-2">
                <span className="text-gray-500 line-through text-base sm:text-lg">₹8,000</span>
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">₹4,000</span>
                <span className="text-sm font-semibold text-slate-400">/ Year</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">Exclusive 50% Annual Introductory Pricing</p>
            </div>

            {/* Photo Policy Pill */}
            <div className="p-3 bg-blue-950/40 rounded-xl mb-6 text-xs text-blue-200 font-bold border border-blue-800/50 flex items-center justify-center space-x-2">
              <Shield className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Allows exactly 2 business photographs</span>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-300">
              <li className="flex items-start">
                <Check className="w-4 h-4 text-emerald-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Business name & category directory visibility</span>
              </li>
              <li className="flex items-start font-semibold text-white">
                <Check className="w-4 h-4 text-emerald-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Exactly 2 business photographs on profile</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-emerald-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Direct customer phone call button</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-emerald-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Direct WhatsApp enquiry button</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-emerald-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Full address & Vidisha locality listing</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-emerald-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Google Maps navigation & interactive directions</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-emerald-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Business hours & detailed description</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-emerald-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Dedicated custom business profile page</span>
              </li>
            </ul>

            <Link
              to="/list-your-business?package=complete"
              className="mt-auto w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm text-center shadow-lg shadow-blue-600/30 transition-all transform active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>Choose Complete Listing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          {/* Plan 2: Priority Listing */}
          <section className="relative rounded-3xl border-2 border-amber-500/60 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 p-7 sm:p-9 flex flex-col shadow-2xl shadow-amber-950/30 hover:border-amber-400 hover:shadow-amber-900/50 hover:-translate-y-1 transition-all duration-300">
            {/* Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg border border-amber-300">
              Maximum Visibility
            </div>

            <div className="mb-4 mt-2 text-center">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider mb-2">
                Top Priority Tier
              </span>
              <h3 className="text-2xl font-bold text-white">Priority Listing</h3>
              <p className="text-xs text-slate-400 mt-1">Prime category placement, 3 photographs & offer promotion</p>
            </div>

            <div className="mb-6 text-center">
              <div className="flex items-baseline justify-center space-x-2">
                <span className="text-gray-500 line-through text-base sm:text-lg">₹12,000</span>
                <span className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight">₹6,000</span>
                <span className="text-sm font-semibold text-slate-400">/ Year</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">Exclusive 50% Annual Introductory Pricing</p>
            </div>

            {/* Photo Policy Pill */}
            <div className="p-3 bg-amber-950/40 rounded-xl mb-6 text-xs text-amber-200 font-bold border border-amber-800/50 flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Allows exactly 3 business photographs</span>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-300">
              <li className="flex items-start">
                <Check className="w-4 h-4 text-emerald-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Everything included in Complete Listing</span>
              </li>
              <li className="flex items-start font-semibold text-white">
                <Check className="w-4 h-4 text-emerald-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Exactly 3 business photographs on profile</span>
              </li>
              <li className="flex items-start font-semibold text-amber-300">
                <Check className="w-4 h-4 text-emerald-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Priority placement over standard paid listings</span>
              </li>
              <li className="flex items-start font-semibold text-amber-300">
                <Check className="w-4 h-4 text-emerald-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Gold Priority visual highlighting badge</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-emerald-400 mr-2.5 mt-0.5 shrink-0" />
                <span>One month of free Offers page promotion</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-emerald-400 mr-2.5 mt-0.5 shrink-0" />
                <span>One eligible in-store offer/campaign</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-emerald-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Priority customer support & updates</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-emerald-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Dedicated custom business profile page</span>
              </li>
            </ul>

            <Link
              to="/list-your-business?package=priority"
              className="mt-auto w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm text-center shadow-lg shadow-amber-500/20 transition-all transform active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>Choose Priority Listing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </div>

        {/* Feature Comparison Table */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white">Plan Comparison</h3>
            <p className="text-sm text-slate-400 mt-1">Feature-by-feature comparison of our two paid plans</p>
          </div>

          <div className="border border-slate-800 rounded-3xl overflow-hidden shadow-2xl bg-slate-900/80 backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6 font-bold">Feature</th>
                    <th className="py-4 px-6 font-bold text-center bg-blue-950/40 text-blue-300">
                      Complete Business Listing
                    </th>
                    <th className="py-4 px-6 font-bold text-center bg-amber-950/40 text-amber-300">
                      Priority Listing
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                  <tr>
                    <td className="py-4 px-6 font-semibold text-white">Annual Subscription</td>
                    <td className="py-4 px-6 text-center font-bold text-blue-400 bg-blue-950/20">₹4,000 / Year</td>
                    <td className="py-4 px-6 text-center font-bold text-amber-400 bg-amber-950/20">₹6,000 / Year</td>
                  </tr>
                  <tr className="bg-slate-800/30">
                    <td className="py-4 px-6 font-semibold text-white">
                      Business Photographs Allowed
                      <span className="block text-xs font-normal text-slate-400">Storefront, showroom, or products</span>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-blue-400 bg-blue-950/30">
                      Exactly 2 Photographs
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-amber-400 bg-amber-950/30">
                      Exactly 3 Photographs
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Business Name & Category Listing</td>
                    <td className="py-4 px-6 text-center text-emerald-400 font-bold bg-blue-950/20">Included</td>
                    <td className="py-4 px-6 text-center text-emerald-400 font-bold bg-amber-950/20">Included</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Calling Phone Number Button</td>
                    <td className="py-4 px-6 text-center text-emerald-400 font-bold bg-blue-950/20">Direct Call Button</td>
                    <td className="py-4 px-6 text-center text-emerald-400 font-bold bg-amber-950/20">Direct Call Button</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">WhatsApp Customer Enquiry</td>
                    <td className="py-4 px-6 text-center text-emerald-400 font-bold bg-blue-950/20">Direct Chat Button</td>
                    <td className="py-4 px-6 text-center text-emerald-400 font-bold bg-amber-950/20">Direct Chat Button</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Physical Address & Locality</td>
                    <td className="py-4 px-6 text-center text-emerald-400 font-bold bg-blue-950/20">Full Address</td>
                    <td className="py-4 px-6 text-center text-emerald-400 font-bold bg-amber-950/20">Full Address</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Google Maps Navigation Link</td>
                    <td className="py-4 px-6 text-center text-emerald-400 font-bold bg-blue-950/20">Interactive Directions</td>
                    <td className="py-4 px-6 text-center text-emerald-400 font-bold bg-amber-950/20">Interactive Directions</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Opening Hours & Description</td>
                    <td className="py-4 px-6 text-center text-emerald-400 font-bold bg-blue-950/20">Included</td>
                    <td className="py-4 px-6 text-center text-emerald-400 font-bold bg-amber-950/20">Included</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Dedicated Business Details Page</td>
                    <td className="py-4 px-6 text-center text-emerald-400 font-bold bg-blue-950/20">Custom URL Page</td>
                    <td className="py-4 px-6 text-center text-emerald-400 font-bold bg-amber-950/20">Custom URL Page</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Directory Placement & Rank</td>
                    <td className="py-4 px-6 text-center text-slate-300 font-medium bg-blue-950/20">Standard Paid Position</td>
                    <td className="py-4 px-6 text-center text-amber-400 font-bold bg-amber-950/20">Priority Top Placement</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Visual Highlighting Badge</td>
                    <td className="py-4 px-6 text-center text-slate-400 font-medium bg-blue-950/20">Verified Merchant</td>
                    <td className="py-4 px-6 text-center text-amber-400 font-bold bg-amber-950/20">Gold Priority Badge</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Offers Page Promotion</td>
                    <td className="py-4 px-6 text-center text-slate-400 font-medium bg-blue-950/20">Optional Add-on</td>
                    <td className="py-4 px-6 text-center text-emerald-400 font-bold bg-amber-950/20">1 Month Free Included</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Why List Section */}
        <section className="mb-12 bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Why list your business on Vidisha City?</span>
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-300 text-sm">
            <li className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>Connect directly with thousands of Vidisha customers actively seeking local services.</span>
            </li>
            <li className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>Make it effortless for customers to call, WhatsApp, or navigate to your physical storefront.</span>
            </li>
            <li className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>Showcase genuine storefront and showcase photographs to build instant customer trust.</span>
            </li>
            <li className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>Zero commissions on sales — customers pay your shop directly in-store.</span>
            </li>
          </ul>
        </section>

        {/* How it works */}
        <section className="mb-12 bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-4">How it works</h3>
          <ol className="list-decimal list-inside space-y-3 text-slate-300 text-sm">
            <li>
              Choose your listing plan (<span className="font-semibold text-blue-400">Complete: ₹4,000 / Year</span> or <span className="font-semibold text-amber-400">Priority: ₹6,000 / Year</span>).
            </li>
            <li>
              Submit your business details and verified photographs (up to 2 for Complete, up to 3 for Priority).
            </li>
            <li>
              Our local administration verifies establishment legitimacy and activates your listing upon payment verification.
            </li>
            <li>
              Your business goes live in its category slot (max 10 businesses per category) so customers discover you instantly.
            </li>
          </ol>
        </section>

        {/* Important terms */}
        <section className="border-t border-slate-800 pt-8 text-sm text-slate-400">
          <h4 className="font-bold text-white mb-3 text-sm">Important Platform Terms</h4>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm">
            <li>
              <strong>Strict 10-Slot Limit:</strong> Every category has a maximum of 10 businesses. Only paid businesses can have active listings. When 10 slots are occupied in a category, further registrations are closed.
            </li>
            <li>
              <strong>Photograph Limits:</strong> Complete Business Listing permits exactly 2 business photographs; Priority Listing permits exactly 3 business photographs on the profile.
            </li>
            <li>
              <strong>Term & Renewals:</strong> Paid plans run for 12 full months (₹4,000/year for Complete Listing, ₹6,000/year for Priority Listing) from activation date.
            </li>
            <li>
              <strong>Priority Visibility:</strong> Priority listing provides prime category placement over standard paid listings.
            </li>
            <li>
              <strong>Zero Commissions:</strong> Vidisha City does not process in-store purchases or charge any commissions on customer orders.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PricingPage;
