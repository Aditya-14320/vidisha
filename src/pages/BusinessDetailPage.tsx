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
  Calendar,
  Share2,
  Tag,
  Building2,
  Sparkles,
  Globe
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
          // Public check: only approved listings are displayed
          if (biz.approvalStatus !== 'approved') {
            setBusiness(null);
            return;
          }

          setBusiness(biz);
          setSelectedPhoto(biz.coverImageUrl || biz.gallery[0] || null);

          // Track view count
          BusinessService.recordInteraction(biz.id, 'view').catch(console.warn);

          // Load active offers for this business
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
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Business Profile Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          This listing may have been moved, closed, or is awaiting moderation.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm"
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
        text: `Check out ${business.name} on Vidisha City Directory!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAction = (type: 'phone' | 'whatsapp') => {
    BusinessService.recordInteraction(business.id, 'click').catch(console.warn);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between mb-4">
        <Link
          to={`/category/${business.categorySlug}`}
          className="inline-flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-blue-600"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to {business.categoryName}</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>

      {/* Main Cover & Gallery Section */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm mb-8">
        <div className="relative h-64 sm:h-96 w-full bg-slate-900">
          <img
            src={selectedPhoto || business.coverImageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80'}
            alt={business.name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 items-center">
            {business.packageId === 'priority' && business.paymentStatus === 'paid' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500 text-slate-950 uppercase tracking-wider shadow">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Priority Listing</span>
              </span>
            )}
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white shadow">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Merchant</span>
            </span>
          </div>

          {business.priceRange && (
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-md rounded-lg text-white text-xs font-bold">
              Pricing: {business.priceRange}
            </div>
          )}
        </div>

        {/* Thumbnail Gallery Row */}
        {business.gallery && business.gallery.length > 1 && (
          <div className="p-3 bg-slate-100 flex items-center space-x-3 overflow-x-auto">
            {business.gallery.map((photo, index) => (
              <button
                key={index}
                onClick={() => setSelectedPhoto(photo)}
                className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  selectedPhoto === photo ? 'border-blue-600 scale-105' : 'border-transparent opacity-75 hover:opacity-100'
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
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 mb-1">
                <span>{business.categoryName}</span>
                {business.subcategory && (
                  <>
                    <span>•</span>
                    <span className="text-slate-500">{business.subcategory}</span>
                  </>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
                {business.name}
              </h1>
              <p className="text-sm text-slate-600 flex items-center space-x-1.5 mb-4">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{business.address}, {business.locality}, Vidisha, MP</span>
              </p>

              {business.lastVerifiedAt && (
                <div className="text-xs text-slate-400">
                  Last verified by Vidisha City Admin: {business.lastVerifiedAt}
                </div>
              )}
            </div>

            {/* Quick Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              {business.phone && (
                <a
                  href={`tel:${cleanPhone}`}
                  onClick={() => handleAction('phone')}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {business.phone}</span>
                </a>
              )}

              {business.whatsapp && (
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello ${business.name}, I am contacting you via Vidisha City Directory.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleAction('whatsapp')}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95"
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
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              About {business.name}
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {business.description}
            </p>

            {/* Services & Specialties */}
            {business.services && business.services.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Services & Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {business.services.map((srv, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-100"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Catalog / Menu if available */}
          {business.catalog && business.catalog.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Popular Items & Pricing
              </h2>
              <div className="divide-y divide-slate-100">
                {business.catalog.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
                      {item.description && (
                        <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                      )}
                    </div>
                    {item.price !== undefined && (
                      <span className="text-sm font-bold text-blue-700 ml-4">
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
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-slate-100">
                <Tag className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-900">
                  Active Offers & Discounts
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
        <div className="space-y-6">
          {/* Timings & Opening Hours Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Business Hours</span>
            </h3>

            <div className="space-y-2 text-sm text-slate-700 mb-4">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 text-xs font-medium">Opening Hours:</span>
                <span className="font-semibold text-xs text-slate-900">
                  {typeof business.openingHours === 'string' ? business.openingHours : '09:00 AM - 08:30 PM'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 text-xs font-medium">Weekly Off:</span>
                <span className="font-semibold text-xs text-amber-700">
                  {business.weeklyOff || 'Open all 7 days'}
                </span>
              </div>
            </div>
          </div>

          {/* Location & Directions Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Location & Map</span>
            </h3>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {business.address}, {business.locality}, Vidisha, Madhya Pradesh.
            </p>

            <a
              href={business.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(`${business.name} ${business.locality} Vidisha`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 flex items-center justify-center space-x-2 transition-colors border border-blue-200"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Google Maps</span>
            </a>
          </div>

          {/* Website & Social Links if available */}
          {business.websiteUrl && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Official Website</span>
              </h3>
              <a
                href={business.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-blue-600 hover:underline truncate block"
              >
                {business.websiteUrl}
              </a>
            </div>
          )}

          {/* Report Incorrect Info Button */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <p className="text-xs text-slate-500 mb-2">
              Is something incorrect or outdated with this profile?
            </p>
            <button
              onClick={() => setReportModalOpen(true)}
              className="text-xs font-bold text-slate-600 hover:text-red-600 inline-flex items-center space-x-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
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
