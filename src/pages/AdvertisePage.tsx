import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  MessageSquare,
  Image,
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
  ArrowRight
} from 'lucide-react';
import type { BannerPackage, BannerPlacement } from '../types';
import { BannerService } from '../services/bannerService';

const WHATSAPP_NUMBER = '917000845940';

const PLACEMENT_LABELS: Record<BannerPlacement, string> = {
  homepage_hero: 'Homepage Hero',
  homepage_mid: 'Homepage Mid',
  category: 'Category Page',
  offers: 'Offers Page',
  mobile_responsive: 'Mobile',
};

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

const PackageCardSkeleton: React.FC = () => (
  <div className="bg-[#141418] rounded-3xl border border-[#26262e] p-6 flex flex-col space-y-4">
    <div className="h-5 w-28 skeleton-shimmer rounded-full" />
    <div className="h-10 w-24 skeleton-shimmer rounded-lg" />
    <div className="h-3 w-full skeleton-shimmer rounded" />
    <div className="h-3 w-3/4 skeleton-shimmer rounded" />
    <div className="h-10 w-full skeleton-shimmer rounded-full mt-auto" />
  </div>
);

const FaqItem: React.FC<{ question: string; answer: string }> = ({
  question,
  answer,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[#26262e] rounded-2xl overflow-hidden bg-[#141418]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#1a1a22] transition"
      >
        <span className="text-sm font-bold text-white">{question}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gold-400 shrink-0 ml-2" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#a1a1aa] shrink-0 ml-2" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 text-xs sm:text-sm text-[#a1a1aa] leading-relaxed border-t border-[#1f1f26] pt-3 font-light">
          {answer}
        </div>
      )}
    </div>
  );
};

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

  const getBadge = (
    pkg: BannerPackage
  ): { label: string; color: string } | null => {
    if (pkg.id === 'homepage' || pkg.name === 'Homepage Banner')
      return {
        label: 'Most Popular',
        color: 'bg-gradient-to-r from-gold-400 to-gold-500 text-dark-950',
      };
    if (pkg.id === 'citywide' || pkg.name === 'Citywide Campaign')
      return {
        label: 'Best Value',
        color: 'bg-gold-500 text-dark-950',
      };
    return null;
  };

  const steps = [
    {
      icon: Package,
      title: 'Choose a Package',
      desc: 'Select the right plan for your budget and goals.',
    },
    {
      icon: MessageSquare,
      title: 'Contact Us on WhatsApp',
      desc: 'Share your requirements with our dedicated concierge team.',
    },
    {
      icon: Image,
      title: 'We Setup Your Campaign',
      desc: 'Upload artwork, select placement, confirm dates.',
    },
    {
      icon: Sparkles,
      title: 'Go Live',
      desc: 'Your banner appears to thousands of Vidisha consumers.',
    },
  ];

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

  const faqs = [
    {
      q: 'How do I book a banner?',
      a: 'Contact us on WhatsApp using the buttons on this page. Our team will guide you through the process, including artwork specifications, placement scheduling, and payment verification.',
    },
    {
      q: 'When will my ad go live?',
      a: 'After payment verification and artwork approval by our administrative team, your banner will be activated on the scheduled start date.',
    },
    {
      q: 'Can I choose specific dates?',
      a: 'Yes, campaigns can be scheduled for future dates. Share your preferred start date when you contact us and we will accommodate it based on slot availability.',
    },
    {
      q: 'What image sizes work best?',
      a: 'We recommend 1200 × 400 px for desktop banners and 600 × 300 px for mobile banners. Our team can help review your artwork specifications.',
    },
    {
      q: 'Are there any guarantees?',
      a: 'We do not guarantee specific views, clicks, leads or sales. Placement is advertising — it increases visibility for your business but is not an editorial review or subjective endorsement.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white pb-28">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#17171d] via-[#1f1f26] to-[#141418] border-b border-[#24242c] text-white">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gold-400 bg-black/60 border border-gold-500/30 px-3 py-1 rounded-full mb-5 shadow">
            <Megaphone className="w-3.5 h-3.5" />
            Sponsored Advertising
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Advertise on Vidisha City
          </h1>
          <p className="text-base sm:text-lg text-[#d4d4d8] max-w-2xl mx-auto leading-relaxed font-light">
            Reach thousands of local consumers across Vidisha&apos;s premier business directory. Promote your brand where it matters most.
          </p>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              'Hi, I am interested in banner advertising on Vidisha City. Please share available packages and pricing.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 text-dark-950 font-bold text-sm rounded-full shadow-[0_0_20px_rgba(212,168,49,0.35)] transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            Enquire on WhatsApp
          </a>
        </div>
      </section>

      {/* 2. How It Works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight text-center mb-2">
          How It Works
        </h2>
        <p className="text-sm text-[#a1a1aa] text-center mb-10 max-w-xl mx-auto font-light">
          Getting your banner ad live on Vidisha City is simple.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="relative bg-[#141418] rounded-3xl border border-[#26262e] shadow-md p-6 text-center"
            >
              <span className="absolute -top-3 -left-2 w-7 h-7 rounded-full bg-gradient-to-tr from-gold-500 to-gold-600 text-dark-950 text-xs font-bold flex items-center justify-center shadow">
                {idx + 1}
              </span>

              <step.icon className="w-8 h-8 text-gold-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">
                {step.title}
              </h3>
              <p className="text-xs text-[#a1a1aa] leading-relaxed font-light">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Package Cards */}
      <section className="bg-[#111114] border-y border-[#222228]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight text-center mb-2">
            Banner Advertising Packages
          </h2>
          <p className="text-sm text-[#a1a1aa] text-center mb-10 max-w-xl mx-auto font-light">
            Choose a package that fits your budget. All prices are introductory and subject to availability.
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
                    className={`relative flex flex-col bg-[#141418] rounded-3xl border p-6 transition hover:border-gold-500/50 shadow-md ${
                      badge
                        ? 'border-gold-500/60'
                        : 'border-[#26262e]'
                    }`}
                  >
                    {badge && (
                      <span
                        className={`absolute -top-3 right-4 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    )}

                    <h3 className="text-base font-bold text-white mb-2">
                      {pkg.name}
                    </h3>

                    <div className="mb-1">
                      <span className="text-3xl font-black text-white">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <p className="flex items-center gap-1.5 text-xs text-[#a1a1aa] mb-4">
                      <Clock className="w-3.5 h-3.5 text-gold-400" />
                      {pkg.durationDays} days
                    </p>

                    {pkg.description && (
                      <p className="text-xs text-[#d4d4d8] leading-relaxed mb-4 font-light">
                        {pkg.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
                      {pkg.allowedPlacements.map((p) => (
                        <span
                          key={p}
                          className="inline-flex items-center text-[10px] font-semibold text-gold-400 bg-[#1c1c24] border border-[#2e2e38] rounded-full px-2.5 py-0.5"
                        >
                          {PLACEMENT_LABELS[p]}
                        </span>
                      ))}
                    </div>

                    <a
                      href={buildWhatsAppUrl(pkg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-dark-950 text-sm font-bold rounded-full transition-all active:scale-95 shadow"
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

      {/* 4. Placement Previews */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight text-center mb-2">
          Where Your Ads Appear
        </h2>
        <p className="text-sm text-[#a1a1aa] text-center mb-10 max-w-xl mx-auto font-light">
          Your banner will be displayed in high-traffic sections across VidishaCity.in
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {placements.map((item) => (
            <div
              key={item.title}
              className="bg-[#141418] rounded-3xl border border-[#26262e] shadow-md p-6 flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#1c1c24] border border-[#2e2e38] flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section className="bg-[#111114] border-y border-[#222228]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight text-center mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#a1a1aa] text-center mb-8 font-light">
            Common queries regarding banner advertising on Vidisha City.
          </p>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </div>

          <div className="mt-8 p-4 bg-[#141418] rounded-2xl border border-[#24242c]">
            <p className="text-[11px] text-[#a1a1aa] leading-relaxed font-light">
              <strong className="text-gold-400">Disclaimer:</strong> Banner advertising on Vidisha City increases the visibility of your business or brand. It does not constitute an endorsement. We do not guarantee specific impressions, clicks, leads, conversions or sales. All pricing is introductory and subject to revision.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Bottom CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-gradient-to-r from-[#17171e] via-[#1f1f28] to-[#141418] rounded-3xl px-6 sm:px-12 py-12 sm:py-16 text-white border border-gold-500/30 relative overflow-hidden">
          <div className="relative">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight mb-3 text-white">
              Ready to Grow Your Business?
            </h2>
            <p className="text-[#d4d4d8] text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed font-light">
              Get your brand in front of thousands of local consumers in Vidisha. Start your banner campaign today.
            </p>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                'Hi, I would like to advertise my business on Vidisha City. Please share the available banner packages and pricing.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 text-dark-950 font-bold text-sm rounded-full shadow-[0_0_20px_rgba(212,168,49,0.35)] transition-all active:scale-95"
            >
              <MessageSquare className="w-5 h-5" />
              Get Started on WhatsApp
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdvertisePage;
