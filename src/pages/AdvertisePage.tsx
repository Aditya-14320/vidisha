import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  MessageSquare,
  Image,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Star,
  Sparkles,
  MousePointerClick,
  Eye,
  Layout,
  Package,
  ChevronDown,
  ChevronUp,
  Clock,
  Tag,
  Send,
} from 'lucide-react';
import type { BannerPackage, BannerPlacement } from '../types';
import { BannerService } from '../services/bannerService';

// --------------- Helpers ---------------

const WHATSAPP_NUMBER = '917000845940';

/** Human-readable label for a BannerPlacement value. */
const PLACEMENT_LABELS: Record<BannerPlacement, string> = {
  homepage_hero: 'Homepage Hero',
  homepage_mid: 'Homepage Mid',
  category: 'Category Page',
  offers: 'Offers Page',
  mobile_responsive: 'Mobile',
};

/** Build a pre-filled WhatsApp enquiry URL for a given package. */
function buildWhatsAppUrl(pkg: BannerPackage): string {
  const placements = pkg.allowedPlacements
    .map((p) => PLACEMENT_LABELS[p])
    .join(', ');

  const text = [
    `Hi, I am interested in the ${pkg.name} banner package on Vidisha City.`,
    '',
    `Package: ${pkg.name}`,
    `Price: ₹${pkg.price.toLocaleString('en-IN')}`,
    `Duration: ${pkg.durationDays} days`,
    `Placement: ${placements}`,
    '',
    'Please share availability and payment details.',
  ].join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

// --------------- Sub-components ---------------

/** Skeleton loader shown while packages are being fetched. */
const PackageCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col space-y-4 animate-pulse">
    <div className="h-5 w-28 bg-slate-200 rounded" />
    <div className="h-10 w-24 bg-slate-200 rounded" />
    <div className="h-3 w-full bg-slate-200 rounded" />
    <div className="h-3 w-3/4 bg-slate-200 rounded" />
    <div className="flex gap-2 mt-2">
      <div className="h-5 w-20 bg-slate-200 rounded-full" />
      <div className="h-5 w-20 bg-slate-200 rounded-full" />
    </div>
    <div className="h-10 w-full bg-slate-200 rounded-xl mt-auto" />
  </div>
);

/** A single FAQ accordion item. */
const FaqItem: React.FC<{ question: string; answer: string }> = ({
  question,
  answer,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition"
      >
        <span className="text-sm font-bold text-slate-800">{question}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

// --------------- Main Page ---------------

export const AdvertisePage: React.FC = () => {
  const [packages, setPackages] = useState<BannerPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    BannerService.getPackages()
      .then((pkgs) => {
        if (!cancelled) setPackages(pkgs);
      })
      .catch((err) => console.error('Failed to load banner packages', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Badge logic based on package id / name
  const getBadge = (
    pkg: BannerPackage
  ): { label: string; color: string } | null => {
    if (pkg.id === 'homepage' || pkg.name === 'Homepage Banner')
      return {
        label: 'Most Popular',
        color: 'bg-amber-400 text-amber-900',
      };
    if (pkg.id === 'citywide' || pkg.name === 'Citywide Campaign')
      return {
        label: 'Best Value',
        color: 'bg-emerald-500 text-white',
      };
    return null;
  };

  // ---- How-it-works steps ----
  const steps = [
    {
      icon: Package,
      title: 'Choose a Package',
      desc: 'Select the right plan for your budget and goals.',
    },
    {
      icon: MessageSquare,
      title: 'Contact Us on WhatsApp',
      desc: 'Share your requirements with our team.',
    },
    {
      icon: Image,
      title: 'We Setup Your Campaign',
      desc: 'Upload artwork, select placement, confirm dates.',
    },
    {
      icon: Sparkles,
      title: 'Go Live',
      desc: 'Your ad appears to Vidisha consumers.',
    },
  ];

  // ---- Placement preview cards ----
  const placements = [
    {
      icon: Eye,
      title: 'Homepage Hero Banner',
      desc: 'Prime visibility at the top of VidishaCity.in',
    },
    {
      icon: Layout,
      title: 'Homepage Mid-Page Banner',
      desc: 'Catch attention as users browse popular businesses',
    },
    {
      icon: MousePointerClick,
      title: 'Category Page Banner',
      desc: 'Target specific business categories relevant to your industry',
    },
    {
      icon: Tag,
      title: 'Offers Page Banner',
      desc: 'Appear alongside active deals and promotions',
    },
  ];

  // ---- FAQ items ----
  const faqs = [
    {
      q: 'How do I book a banner?',
      a: 'Contact us on WhatsApp using the buttons on this page. Our team will guide you through the process, including artwork upload, placement selection, and payment.',
    },
    {
      q: 'When will my ad go live?',
      a: 'After payment verification and artwork approval by our team, your banner will be activated on the scheduled start date.',
    },
    {
      q: 'Can I choose specific dates?',
      a: 'Yes, campaigns can be scheduled for future dates. Share your preferred start date when you contact us and we will accommodate it.',
    },
    {
      q: 'What image sizes work best?',
      a: 'We recommend 1200 × 400 px for desktop banners and 600 × 300 px for mobile banners. Our team can help you with artwork specifications.',
    },
    {
      q: 'Are there any guarantees?',
      a: 'We do not guarantee specific views, clicks, leads or sales. Placement is advertising — it increases visibility for your business but is not an endorsement of your products or services.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* ============================================================
          1. Hero Section
          ============================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/20" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-white/10" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-200 bg-white/10 px-3 py-1 rounded-full mb-6">
            <Megaphone className="w-3.5 h-3.5" />
            Sponsored Advertising
          </span>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Advertise on Vidisha City
          </h1>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Reach thousands of local consumers across Vidisha&apos;s premier
            business directory. Promote your brand where it matters most.
          </p>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              'Hi, I am interested in banner advertising on Vidisha City. Please share available packages and pricing.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 px-7 py-3 bg-white text-blue-700 font-bold text-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            Enquire on WhatsApp
          </a>
        </div>
      </section>

      {/* ============================================================
          2. How It Works
          ============================================================ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-center mb-2">
          How It Works
        </h2>
        <p className="text-sm text-slate-500 text-center mb-10 max-w-xl mx-auto">
          Getting your banner ad live on Vidisha City is simple.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="relative bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center"
            >
              {/* Step number */}
              <span className="absolute -top-3 -left-2 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow">
                {idx + 1}
              </span>

              <step.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {step.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {step.desc}
              </p>

              {/* Connector arrow (hidden on last card) */}
              {idx < steps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          3. Package Cards
          ============================================================ */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-center mb-2">
            Banner Advertising Packages
          </h2>
          <p className="text-sm text-slate-500 text-center mb-10 max-w-xl mx-auto">
            Choose a package that fits your budget. All prices are introductory
            and subject to change.
          </p>

          <p className="text-center text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-6">
            Advertisement
          </p>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <PackageCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((pkg) => {
                const badge = getBadge(pkg);
                return (
                  <div
                    key={pkg.id}
                    className={`relative flex flex-col bg-white rounded-2xl border shadow-sm p-6 transition hover:shadow-md ${
                      badge
                        ? 'border-blue-300 ring-2 ring-blue-100'
                        : 'border-slate-200'
                    }`}
                  >
                    {/* Badge */}
                    {badge && (
                      <span
                        className={`absolute -top-3 right-4 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    )}

                    {/* Name */}
                    <h3 className="text-base font-bold text-slate-900 mb-3">
                      {pkg.name}
                    </h3>

                    {/* Price */}
                    <div className="mb-1">
                      <span className="text-3xl font-black text-slate-900">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Duration */}
                    <p className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                      <Clock className="w-3.5 h-3.5" />
                      {pkg.durationDays} days
                    </p>

                    {/* Description */}
                    {pkg.description && (
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {pkg.description}
                      </p>
                    )}

                    {/* Allowed placements as badges */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {pkg.allowedPlacements.map((p) => (
                        <span
                          key={p}
                          className="inline-flex items-center text-[10px] font-semibold text-blue-700 bg-blue-50 rounded-full px-2.5 py-0.5"
                        >
                          {PLACEMENT_LABELS[p]}
                        </span>
                      ))}
                    </div>

                    {/* WhatsApp CTA */}
                    <a
                      href={buildWhatsAppUrl(pkg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                      Enquire on WhatsApp
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          4. Where Your Ads Appear (Placement Previews)
          ============================================================ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-center mb-2">
          Where Your Ads Appear
        </h2>
        <p className="text-sm text-slate-500 text-center mb-10 max-w-xl mx-auto">
          Your banner will be displayed in high-traffic areas across VidishaCity.in
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {placements.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          5. FAQ Section
          ============================================================ */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-center mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 text-center mb-8">
            Common queries about banner advertising on Vidisha City.
          </p>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <strong className="text-slate-600">Disclaimer:</strong> Banner
              advertising on Vidisha City increases the visibility of your
              business or brand. It does not constitute an endorsement. We do
              not guarantee specific impressions, clicks, leads, conversions or
              sales. All pricing is introductory and subject to revision.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          6. Bottom CTA
          ============================================================ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl px-6 sm:px-12 py-12 sm:py-16 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/20" />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-white/10" />
          </div>

          <div className="relative">
            <Star className="w-8 h-8 text-amber-300 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
              Ready to Grow Your Business?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
              Get your brand in front of thousands of local consumers in
              Vidisha. Start your banner campaign today.
            </p>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                'Hi, I would like to advertise my business on Vidisha City. Please share the available banner packages and pricing.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-bold text-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all active:scale-95"
            >
              <MessageSquare className="w-5 h-5" />
              Get Started on WhatsApp
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mt-6">
          This page is advertising material for Vidisha City banner placements.
        </p>
      </section>
    </div>
  );
};

export default AdvertisePage;
