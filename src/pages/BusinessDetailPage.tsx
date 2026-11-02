import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  Share2,
  Tag,
  Sparkles,
  Globe,
  Star
} from 'lucide-react';
import { Business, Offer } from '../types';
import { BusinessService } from '../services/businessService';
import { OfferService } from '../services/offerService';
import { ReportModal } from '../components/business/ReportModal';
import { OfferCard } from '../components/business/OfferCard';

export const BusinessDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBusinessData() {
      if (!slug) return;
      try {
        setLoading(true);
        const biz = await BusinessService.getBusinessBySlug(slug);
        if (biz) {
          if (biz.approvalStatus !== 'approved') {
            setBusiness(null);
            return;
          }
          setBusiness(biz);
          setSelectedPhoto(biz.coverImageUrl || biz.gallery[0] || null);
          BusinessService.recordInteraction(biz.id, 'view').catch(console.warn);
          const bizOffers = await OfferService.getOffersForBusiness(biz.id);
          setOffers(bizOffers);
        }
      } catch (err) {
        console.error('Failed to load business profile', err);
      } finally {
        setLoading(false);
      }
    }
    loadBusinessData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="h-6 w-32 skeleton-shimmer rounded mb-4" />
        <div className="h-72 w-full skeleton-shimmer rounded-3xl mb-6" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 skeleton-shimmer rounded" />
          <div className="h-4 w-1/3 skeleton-shimmer rounded" />
          <div className="h-20 w-full skeleton-shimmer rounded" />
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-14 h-14 text-gold-400 mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-white mb-2">Business Profile Not Found</h2>
        <p className="text-sm text-[#a1a1aa] mb-8 font-light">
          This listing may have been relocated, closed, or is currently awaiting moderation.
        </p>
        <Link
          to="/"
          className="px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 font-bold rounded-full text-sm shadow-md"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const cleanPhone = business.phone ? business.phone.replace(/[^0-9+]/g, '') : '';
  const cleanWhatsApp = business.whatsapp ? business.whatsapp.replace(/[^0-9]/g, '') : cleanPhone.replace(/[^0-9]/g, '');

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${business.name} — Vidisha City`,
        text: `Discover ${business.name} on Vidisha City Directory!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAction = (_type: 'phone' | 'whatsapp') => {
    BusinessService.recordInteraction(business.id, 'click').catch(console.warn);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between mb-5">
        <Link
          to={`/category/${business.categorySlug}`}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-[#a1a1aa] hover:text-gold-400 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 text-gold-500 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to {business.categoryName}</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-white bg-[#1a1a22] border border-[#2a2a34] hover:border-gold-500/50 shadow-sm transition-all"
        >
          <Share2 className="w-3.5 h-3.5 text-gold-400" />
          <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>

      {/* Main Cover & Gallery Section */}
      <div className="bg-[#141417] rounded-3xl border border-[#26262e] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)] mb-8">
        <div className="relative h-64 sm:h-96 w-full bg-[#1b1b22]">
          <img
            src={selectedPhoto || business.coverImageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&auto=format&fit=crop&q=80'}
            alt={business.name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          {/* Ambient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141417] via-transparent to-black/30" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 items-center z-10">
            {business.packageId === 'priority' && business.paymentStatus === 'paid' && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 uppercase tracking-wider shadow-lg">
                <Star className="w-3.5 h-3.5 fill-dark-950 text-dark-950" />
                <span>Priority Selection</span>
              </span>
            )}
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1d1d24]/90 text-white border border-[#2e2e38] backdrop-blur-md shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
              <span>Verified Establishment</span>
            </span>
          </div>
        </div>

        {/* Thumbnail Gallery Row */}
        {business.gallery && business.gallery.length > 1 && (
          <div className="p-3 bg-[#111114] flex items-center space-x-3 overflow-x-auto border-b border-[#24242c]">
            {business.gallery.map((photo, index) => (
              <button
                key={index}
                onClick={() => setSelectedPhoto(photo)}
                className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  selectedPhoto === photo
                    ? 'border-gold-500 scale-105 shadow-md'
                    : 'border-transparent opacity-60 hover:opacity-100 hover:border-[#383844]'
                }`}
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Profile Header Details */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-2 text-xs font-bold text-gold-400 mb-1 uppercase tracking-wider">
                <span>{business.categoryName}</span>
                {business.subcategory && (
                  <>
                    <span className="text-[#52525c]">•</span>
                    <span className="text-[#a1a1aa] font-medium">{business.subcategory}</span>
                  </>
                )}
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                {business.name}
              </h1>
              <p className="text-sm text-[#d4d4d8] flex items-center space-x-1.5 mb-3 font-light">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{business.address}, {business.locality}, Vidisha, MP</span>
              </p>

              {business.lastVerifiedAt && (
                <div className="text-xs text-[#a1a1aa] flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                  <span>Verified by Vidisha City Admin: {business.lastVerifiedAt}</span>
                </div>
              )}
            </div>

            {/* Quick Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              {business.phone && (
                <a
                  href={`tel:${cleanPhone}`}
                  onClick={() => handleAction('phone')}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-dark-950 font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {business.phone}</span>
                </a>
              )}

              {business.whatsapp && (
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello ${business.name}, I am reaching out via Vidisha City Directory.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleAction('whatsapp')}
                  className="px-6 py-3 rounded-full bg-[#1c1c24] border border-gold-500/40 text-gold-300 hover:bg-[#252530] font-semibold text-sm shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Inquiry</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Details & Side Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div className="bg-[#141417] rounded-3xl p-6 sm:p-8 border border-[#26262e] shadow-md">
            <h2 className="font-serif text-lg font-bold text-white mb-4 pb-3 border-b border-[#24242c] flex items-center space-x-2">
              <span>About {business.name}</span>
            </h2>
            <p className="text-sm text-[#d4d4d8] leading-relaxed whitespace-pre-line font-light">
              {business.description}
            </p>

            {/* Services & Specialties */}
            {business.services && business.services.length > 0 && (
              <div className="mt-6 pt-6 border-t border-[#24242c]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-3">
                  Services & Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {business.services.map((srv, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full bg-[#1b1b22] text-[#e4e4e7] text-xs font-medium border border-[#2a2a34] hover:border-gold-500/40 transition-colors"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Catalog / Menu */}
          {business.catalog && business.catalog.length > 0 && (
            <div className="bg-[#141417] rounded-3xl p-6 sm:p-8 border border-[#26262e] shadow-md">
              <h2 className="font-serif text-lg font-bold text-white mb-4 pb-3 border-b border-[#24242c]">
                Featured Items & Pricing
              </h2>
              <div className="divide-y divide-[#24242c]">
                {business.catalog.map((item, idx) => (
                  <div key={idx} className="py-3.5 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                      {item.description && (
                        <p className="text-xs text-[#a1a1aa] mt-0.5 font-light">{item.description}</p>
                      )}
                    </div>
                    {item.price !== undefined && (
                      <span className="text-sm font-bold text-gold-400 ml-4">
                        ₹{item.price}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Offers from this business */}
          {offers.length > 0 && (
            <div className="bg-[#141417] rounded-3xl p-6 sm:p-8 border border-[#26262e] shadow-md">
              <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-[#24242c]">
                <Tag className="w-5 h-5 text-gold-400" />
                <h2 className="font-serif text-lg font-bold text-white">
                  Exclusive Offers & Promotions
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {offers.map(offer => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info Column */}
        <div className="space-y-5">
          {/* Timings & Opening Hours Card */}
          <div className="bg-[#141417] rounded-3xl p-6 border border-[#26262e] shadow-md">
            <h3 className="font-serif text-base font-bold text-white mb-4 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gold-400" />
              <span>Business Hours</span>
            </h3>

            <div className="space-y-2.5 text-sm text-[#d4d4d8]">
              <div className="flex justify-between items-center py-1.5 border-b border-[#24242c]">
                <span className="text-[#a1a1aa] text-xs font-medium">Opening Hours</span>
                <span className="font-semibold text-xs text-white">
                  {typeof business.openingHours === 'string' ? business.openingHours : '09:00 AM – 08:30 PM'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-[#a1a1aa] text-xs font-medium">Weekly Off</span>
                <span className="font-semibold text-xs text-gold-400">
                  {business.weeklyOff || 'Open all 7 days'}
                </span>
              </div>
            </div>
          </div>

          {/* Location & Directions Card */}
          <div className="bg-[#141417] rounded-3xl p-6 border border-[#26262e] shadow-md">
            <h3 className="font-serif text-base font-bold text-white mb-3 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gold-400" />
              <span>Location & Map</span>
            </h3>

            <p className="text-xs text-[#a1a1aa] mb-4 leading-relaxed font-light">
              {business.address}, {business.locality}, Vidisha, Madhya Pradesh.
            </p>

            <a
              href={business.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(`${business.name} ${business.locality} Vidisha`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-full bg-[#1d1d24] hover:bg-[#252530] text-gold-400 font-semibold text-xs flex items-center justify-center space-x-2 transition-colors border border-[#2e2e38] hover:border-gold-500/40"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Google Maps</span>
            </a>
          </div>

          {/* Website */}
          {business.websiteUrl && (
            <div className="bg-[#141417] rounded-3xl p-6 border border-[#26262e] shadow-md">
              <h3 className="font-serif text-base font-bold text-white mb-3 flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gold-400" />
                <span>Official Website</span>
              </h3>
              <a
                href={business.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-gold-400 hover:underline truncate block transition-colors"
              >
                {business.websiteUrl}
              </a>
            </div>
          )}

          {/* Report Incorrect Info Button */}
          <div className="p-4 bg-[#141418] rounded-2xl border border-[#26262e] text-center">
            <p className="text-xs text-[#a1a1aa] mb-2 font-light">
              Is something incorrect or outdated with this profile?
            </p>
            <button
              onClick={() => setReportModalOpen(true)}
              className="text-xs font-semibold text-[#a1a1aa] hover:text-rose-400 inline-flex items-center space-x-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Report Incorrect Information</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        business={business}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
};
