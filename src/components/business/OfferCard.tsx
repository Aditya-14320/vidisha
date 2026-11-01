import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Tag,
  Calendar,
  Building2,
  MapPin,
  CheckCircle2,
  Sparkles,
  Phone,
  MessageSquare,
  Navigation,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { Offer } from '../../types';
import { OfferDetailsModal } from './OfferDetailsModal';

interface OfferCardProps {
  offer: Offer;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const cleanPhone = offer.businessPhone ? offer.businessPhone.replace(/[^0-9+]/g, '') : '';
  const cleanWhatsApp = offer.businessWhatsapp
    ? offer.businessWhatsapp.replace(/[^0-9]/g, '')
    : cleanPhone.replace(/[^0-9]/g, '');

  const whatsappMessage = encodeURIComponent(
    `Hello ${offer.businessName}, I saw your offer "${offer.title}" on Vidisha City Directory. Could you please confirm if this offer is valid for in-store purchase today?`
  );

  const mapQuery = offer.businessMapUrl || `https://maps.google.com/?q=${encodeURIComponent(`${offer.businessName}, ${offer.businessAddress || offer.businessLocality || 'Vidisha'}`)}`;

  return (
    <>
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-4 sm:p-5 flex flex-col relative overflow-hidden group">
        {/* Top colored accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-blue-600" />

        {/* Top Badges Row */}
        <div className="flex items-center justify-between mb-3 pt-1 gap-2">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
            <Tag className="w-3 h-3 text-amber-600" />
            <span>{offer.discountBadge || 'City Special'}</span>
          </span>

          <div className="flex items-center space-x-1.5">
            {offer.isSponsored && (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                <span>Featured</span>
              </span>
            )}
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              <ShoppingBag className="w-2.5 h-2.5 text-blue-600" />
              <span>In-Store</span>
            </span>
          </div>
        </div>

        {/* Business Name, Category & Verified Badge */}
        <div className="mb-2">
          <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-slate-500 mb-0.5">
            <span className="text-blue-600 font-bold uppercase tracking-wider truncate">
              {offer.categoryName || 'Vidisha Merchant'}
            </span>
            {offer.isBusinessVerified && (
              <span className="inline-flex items-center space-x-0.5 text-emerald-600 font-medium shrink-0">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Verified</span>
              </span>
            )}
          </div>

          <h4 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {offer.businessSlug ? (
              <Link to={`/business/${offer.businessSlug}`} className="hover:underline">
                {offer.businessName}
              </Link>
            ) : (
              offer.businessName
            )}
          </h4>

          <div className="flex items-center space-x-1 text-[11px] text-slate-500 mt-0.5">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{offer.businessLocality || 'Vidisha'}</span>
          </div>
        </div>

        {/* Offer Title */}
        <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1.5 leading-snug">
          {offer.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 mb-3 line-clamp-2 leading-relaxed">
          {offer.description}
        </p>

        {/* Eligibility Conditions Pill (if specified) */}
        {offer.eligibilityConditions && (
          <div className="mb-3 p-2 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-start space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span className="line-clamp-1">
              <strong>Condition:</strong> {offer.eligibilityConditions}
            </span>
          </div>
        )}

        {/* In-Store Promo Code (Only shown when merchant provides a real coupon code) */}
        {offer.couponCode && (
          <div className="mb-3 px-2.5 py-1.5 bg-blue-50/60 border border-dashed border-blue-200 rounded-xl flex items-center justify-between text-xs">
            <span className="text-[10px] text-blue-700 uppercase font-bold">In-Store Code:</span>
            <span className="font-mono font-bold text-blue-900 tracking-wider">
              {offer.couponCode}
            </span>
          </div>
        )}

        {/* Validity Dates */}
        <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 mb-3.5">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>Valid till {offer.expiryDate}</span>
          </div>
          <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
            Show Before Billing
          </span>
        </div>

        {/* Primary Action: Show Offer at Shop */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center space-x-1.5 transition-transform active:scale-95 mb-2"
        >
          <span>Show Offer at Shop</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Secondary Contact Actions (Real phone, WhatsApp, directions) */}
        <div className="grid grid-cols-3 gap-1.5 text-[11px] font-semibold text-slate-600">
          {offer.businessPhone ? (
            <a
              href={`tel:${cleanPhone}`}
              className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center space-x-1 transition-colors text-center"
              title="Call Business"
            >
              <Phone className="w-3 h-3" />
              <span>Call</span>
            </a>
          ) : (
            <div className="py-1.5 px-2 text-center text-slate-300 text-[10px] rounded-lg bg-slate-50">
              No Phone
            </div>
          )}

          {offer.businessWhatsapp ? (
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="py-1.5 px-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center space-x-1 transition-colors text-center"
              title="WhatsApp Store"
            >
              <MessageSquare className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          ) : (
            <div className="py-1.5 px-2 text-center text-slate-300 text-[10px] rounded-lg bg-slate-50">
              No WhatsApp
            </div>
          )}

          <a
            href={mapQuery}
            target="_blank"
            rel="noreferrer"
            className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center space-x-1 transition-colors text-center"
            title="Directions"
          >
            <Navigation className="w-3 h-3 text-blue-600" />
            <span>Map</span>
          </a>
        </div>
      </div>

      {/* Offer Details Modal */}
      {modalOpen && (
        <OfferDetailsModal
          offer={offer}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};
