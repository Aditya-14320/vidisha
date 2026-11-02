import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Shield, Sparkles, Award, ArrowRight, Zap, ChevronDown, ChevronUp } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0d0d0d] text-white py-10 pb-28">
      {/* Background Glow Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#1c1c24] border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider mb-4 shadow">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Premium Commercial Directory • Vidisha, MP</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Grow Your Business in Vidisha
          </h1>
          <p className="text-base sm:text-lg text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed font-light">
            Exclusive verified digital presence for established Vidisha merchants. Every category is strictly capped at <span className="text-white font-semibold">10 business slots</span>.
          </p>

          {/* Dynamic Slots Counter Strip */}
          <div className="mt-8 max-w-2xl mx-auto bg-[#141418] border border-[#2a2a34] rounded-3xl p-4 sm:p-5 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-gold-500 to-gold-600 text-dark-950 flex items-center justify-center shrink-0 font-bold">
                  <Award className="w-5 h-5 text-dark-950" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span>Strict Limit: Max 10 Businesses Per Category</span>
                  </h2>
                  <p className="text-xs text-[#a1a1aa]">
                    {loadingCategories
                      ? 'Checking live category slots...'
                      : `${totalAvailable} of ${totalSlots} total category slots currently open`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCategorySlots(!showCategorySlots)}
                className="px-4 py-2 rounded-full bg-[#1f1f28] hover:bg-[#282834] text-gold-400 text-xs font-semibold border border-[#333342] flex items-center space-x-1.5 transition-colors self-end sm:self-auto"
              >
                <span>{showCategorySlots ? 'Hide Category Slots' : 'View Live Category Slots'}</span>
                {showCategorySlots ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Expandable Live Slots Panel */}
            {showCategorySlots && (
              <div className="mt-4 pt-4 border-t border-[#24242c] text-left animate-in fade-in duration-200">
                <p className="text-xs text-[#a1a1aa] mb-3">
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
                            ? 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                            : available <= 3
                            ? 'bg-[#221c10] border-gold-500/40 text-gold-300'
                            : 'bg-[#181820] border-[#2e2e38] text-[#d4d4d8]'
                        }`}
                      >
                        <span className="font-semibold truncate mr-2">{cat.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                            isFull
                              ? 'bg-rose-500/20 text-rose-400'
                              : available <= 3
                              ? 'bg-gold-500/20 text-gold-400'
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

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16 items-stretch">
          {/* Plan 1: Complete Business Listing */}
          <section className="relative rounded-3xl border border-[#2a2a34] bg-[#141418] p-7 sm:p-9 flex flex-col shadow-2xl hover:border-gold-500/50 hover:-translate-y-1 transition-all duration-300">
            <div className="mb-4 mt-2 text-center">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-[#1e1e26] text-gold-400 border border-gold-500/30 uppercase tracking-wider mb-2">
                Standard Paid Listing
              </span>
              <h3 className="font-serif text-2xl font-bold text-white">Complete Business Listing</h3>
              <p className="text-xs text-[#a1a1aa] mt-1 font-light">Full profile visibility with contact buttons & photographs</p>
            </div>

            <div className="mb-6 text-center">
              <div className="flex items-baseline justify-center space-x-2">
                <span className="text-[#71717a] line-through text-base sm:text-lg">₹8,000</span>
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">₹4,000</span>
                <span className="text-sm font-semibold text-[#a1a1aa]">/ Year</span>
              </div>
              <p className="text-[11px] text-gold-400 font-semibold mt-1">Exclusive 50% Annual Introductory Pricing</p>
            </div>

            {/* Photo Policy Pill */}
            <div className="p-3 bg-[#191922] rounded-2xl mb-6 text-xs text-[#d4d4d8] font-bold border border-[#2e2e38] flex items-center justify-center space-x-2">
              <Shield className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Allows exactly 2 business photographs</span>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8 flex-1 text-sm text-[#d4d4d8]">
              <li className="flex items-start">
                <Check className="w-4 h-4 text-gold-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Business name & category directory visibility</span>
              </li>
              <li className="flex items-start font-semibold text-white">
                <Check className="w-4 h-4 text-gold-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Exactly 2 business photographs on profile</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-gold-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Direct customer phone call button</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-gold-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Direct WhatsApp enquiry button</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-gold-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Full address & Vidisha locality listing</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-gold-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Google Maps navigation & interactive directions</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-gold-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Business hours & detailed description</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-gold-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Dedicated custom business profile page</span>
              </li>
            </ul>

            <Link
              to="/list-your-business?package=complete"
              className="mt-auto w-full py-3.5 px-6 rounded-full bg-[#1f1f28] hover:bg-[#2a2a36] text-white border border-[#333342] hover:border-gold-500/50 font-bold text-sm text-center shadow transition-all flex items-center justify-center space-x-2"
            >
              <span>Choose Complete Listing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          {/* Plan 2: Priority Listing */}
          <section className="relative rounded-3xl border-2 border-gold-500/80 bg-gradient-to-b from-[#191922] via-[#141418] to-[#111114] p-7 sm:p-9 flex flex-col shadow-2xl hover:border-gold-400 hover:-translate-y-1 transition-all duration-300">
            {/* Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 text-dark-950 text-xs font-black uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg">
              Maximum Visibility
            </div>

            <div className="mb-4 mt-2 text-center">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-gold-500/20 text-gold-400 border border-gold-500/40 uppercase tracking-wider mb-2">
                Top Priority Tier
              </span>
              <h3 className="font-serif text-2xl font-bold text-white">Priority Listing</h3>
              <p className="text-xs text-[#a1a1aa] mt-1 font-light">Prime category placement, 3 photographs & offer promotion</p>
            </div>

            <div className="mb-6 text-center">
              <div className="flex items-baseline justify-center space-x-2">
                <span className="text-[#71717a] line-through text-base sm:text-lg">₹12,000</span>
                <span className="text-4xl sm:text-5xl font-black text-gold-400 tracking-tight">₹6,000</span>
                <span className="text-sm font-semibold text-[#a1a1aa]">/ Year</span>
              </div>
              <p className="text-[11px] text-gold-400 font-semibold mt-1">Exclusive 50% Annual Introductory Pricing</p>
            </div>

            {/* Photo Policy Pill */}
            <div className="p-3 bg-[#1e1910] rounded-2xl mb-6 text-xs text-gold-300 font-bold border border-gold-500/30 flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Allows exactly 3 business photographs</span>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8 flex-1 text-sm text-[#d4d4d8]">
              <li className="flex items-start">
                <Check className="w-4 h-4 text-gold-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Everything included in Complete Listing</span>
              </li>
              <li className="flex items-start font-semibold text-white">
                <Check className="w-4 h-4 text-gold-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Exactly 3 business photographs on profile</span>
              </li>
              <li className="flex items-start font-semibold text-gold-300">
                <Check className="w-4 h-4 text-gold-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Priority placement over standard paid listings</span>
              </li>
              <li className="flex items-start font-semibold text-gold-300">
                <Check className="w-4 h-4 text-gold-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Gold Priority visual highlighting badge</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-gold-400 mr-2.5 mt-0.5 shrink-0" />
                <span>One month of free Offers page promotion</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-gold-400 mr-2.5 mt-0.5 shrink-0" />
                <span>One eligible in-store offer/campaign</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-gold-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Priority customer support & updates</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-gold-400 mr-2.5 mt-0.5 shrink-0" />
                <span>Dedicated custom business profile page</span>
              </li>
            </ul>

            <Link
              to="/list-your-business?package=priority"
              className="mt-auto w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 hover:from-gold-300 hover:to-gold-500 text-dark-950 font-bold text-sm text-center shadow-[0_0_20px_rgba(212,168,49,0.35)] transition-all flex items-center justify-center space-x-2"
            >
              <span>Choose Priority Listing</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </section>
        </div>

        {/* Feature Comparison Table */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl font-bold text-white">Plan Comparison</h3>
            <p className="text-sm text-[#a1a1aa] mt-1">Feature-by-feature comparison of our two paid plans</p>
          </div>

          <div className="border border-[#26262e] rounded-3xl overflow-hidden shadow-2xl bg-[#141418]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#181820] border-b border-[#26262e] text-xs uppercase tracking-wider text-[#a1a1aa]">
                    <th className="py-4 px-6 font-bold">Feature</th>
                    <th className="py-4 px-6 font-bold text-center text-white">
                      Complete Business Listing
                    </th>
                    <th className="py-4 px-6 font-bold text-center text-gold-400">
                      Priority Listing
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#24242c] text-sm text-[#d4d4d8]">
                  <tr>
                    <td className="py-4 px-6 font-semibold text-white">Annual Subscription</td>
                    <td className="py-4 px-6 text-center font-bold text-white">₹4,000 / Year</td>
                    <td className="py-4 px-6 text-center font-bold text-gold-400">₹6,000 / Year</td>
                  </tr>
                  <tr className="bg-[#181820]/40">
                    <td className="py-4 px-6 font-semibold text-white">
                      Business Photographs Allowed
                      <span className="block text-xs font-normal text-[#a1a1aa]">Storefront, showroom, or products</span>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-white">
                      Exactly 2 Photographs
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-gold-400">
                      Exactly 3 Photographs
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Business Name & Category Listing</td>
                    <td className="py-4 px-6 text-center text-gold-400 font-bold">Included</td>
                    <td className="py-4 px-6 text-center text-gold-400 font-bold">Included</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Calling Phone Number Button</td>
                    <td className="py-4 px-6 text-center text-gold-400 font-bold">Direct Call Button</td>
                    <td className="py-4 px-6 text-center text-gold-400 font-bold">Direct Call Button</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">WhatsApp Customer Enquiry</td>
                    <td className="py-4 px-6 text-center text-gold-400 font-bold">Direct Chat Button</td>
                    <td className="py-4 px-6 text-center text-gold-400 font-bold">Direct Chat Button</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Physical Address & Locality</td>
                    <td className="py-4 px-6 text-center text-gold-400 font-bold">Full Address</td>
                    <td className="py-4 px-6 text-center text-gold-400 font-bold">Full Address</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Google Maps Navigation Link</td>
                    <td className="py-4 px-6 text-center text-gold-400 font-bold">Interactive Directions</td>
                    <td className="py-4 px-6 text-center text-gold-400 font-bold">Interactive Directions</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Opening Hours & Description</td>
                    <td className="py-4 px-6 text-center text-gold-400 font-bold">Included</td>
                    <td className="py-4 px-6 text-center text-gold-400 font-bold">Included</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Dedicated Business Details Page</td>
                    <td className="py-4 px-6 text-center text-gold-400 font-bold">Custom URL Page</td>
                    <td className="py-4 px-6 text-center text-gold-400 font-bold">Custom URL Page</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Directory Placement & Rank</td>
                    <td className="py-4 px-6 text-center text-[#a1a1aa] font-medium">Standard Paid Position</td>
                    <td className="py-4 px-6 text-center text-gold-400 font-bold">Priority Top Placement</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Visual Highlighting Badge</td>
                    <td className="py-4 px-6 text-center text-[#a1a1aa] font-medium">Verified Merchant</td>
                    <td className="py-4 px-6 text-center text-gold-400 font-bold">Gold Priority Badge</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">Offers Page Promotion</td>
                    <td className="py-4 px-6 text-center text-[#a1a1aa] font-medium">Optional Add-on</td>
                    <td className="py-4 px-6 text-center text-gold-400 font-bold">1 Month Free Included</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Why List Section */}
        <section className="mb-12 bg-[#141418] p-6 sm:p-8 rounded-3xl border border-[#26262e]">
          <h3 className="font-serif text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-gold-400" />
            <span>Why list your business on Vidisha City?</span>
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#d4d4d8] text-sm font-light">
            <li className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
              <span>Connect directly with thousands of Vidisha customers actively seeking local services.</span>
            </li>
            <li className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
              <span>Make it effortless for customers to call, WhatsApp, or navigate to your physical storefront.</span>
            </li>
            <li className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
              <span>Showcase genuine storefront and showcase photographs to build instant customer trust.</span>
            </li>
            <li className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
              <span>Zero commissions on sales — customers pay your shop directly in-store.</span>
            </li>
          </ul>
        </section>

        {/* How it works */}
        <section className="mb-12 bg-[#141418] p-6 sm:p-8 rounded-3xl border border-[#26262e]">
          <h3 className="font-serif text-xl font-bold text-white mb-4">How it works</h3>
          <ol className="list-decimal list-inside space-y-3 text-[#d4d4d8] text-sm font-light">
            <li>
              Choose your listing plan (<span className="font-semibold text-white">Complete: ₹4,000 / Year</span> or <span className="font-semibold text-gold-400">Priority: ₹6,000 / Year</span>).
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
        <section className="border-t border-[#24242c] pt-8 text-sm text-[#a1a1aa]">
          <h4 className="font-bold text-white mb-3 text-sm">Important Platform Terms</h4>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm font-light">
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
