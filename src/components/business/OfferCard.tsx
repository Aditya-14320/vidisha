import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Tag,
  Calendar,
  MapPin,
  CheckCircle2,
  Phone,
  MessageSquare,
  Navigation,
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
      <div className="bg-[#141417] rounded-3xl border border-[#26262e] shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:border-gold-500/50 hover:shadow-[0_12px_40px_rgba(212,168,49,0.15)] transition-all duration-300 p-4 sm:p-5 flex flex-col relative overflow-hidden group">
        {/* Top Gold Accent Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600" />

        {/* Top Badges Row */}
        <div className="flex items-center justify-between mb-3 pt-1 gap-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1f1a10] text-gold-400 border border-gold-500/40">
            <Tag className="w-3 h-3 text-gold-400" />
            <span>{offer.discountBadge || 'Privileged Offer'}</span>
          </span>

          <div className="flex items-center space-x-1.5">
            {offer.isSponsored && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 uppercase tracking-wider">
                <span>Featured</span>
              </span>
            )}
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#1d1d24] text-[#a1a1aa] border border-[#2a2a34]">
              <ShoppingBag className="w-2.5 h-2.5 text-gold-400" />
              <span>In-Store</span>
            </span>
          </div>
        </div>

        {/* Business Name, Category & Verified Badge */}
        <div className="mb-2">
          <div className="flex items-center justify-between gap-1 text-[11px] font-medium text-[#a1a1aa] mb-0.5">
            <span className="text-gold-400 font-bold uppercase tracking-wider text-[10px] truncate">
              {offer.categoryName || 'Vidisha Merchant'}
            </span>
            {offer.isBusinessVerified && (
              <span className="inline-flex items-center space-x-1 text-gold-400 font-medium shrink-0">
                <CheckCircle2 className="w-3 h-3 text-gold-400" />
                <span>Verified</span>
              </span>
            )}
          </div>

          <h4 className="font-serif text-sm sm:text-base font-bold text-white line-clamp-1 group-hover:text-gold-400 transition-colors">
            {offer.businessSlug ? (
              <Link to={`/business/${offer.businessSlug}`} className="hover:underline">
                {offer.businessName}
              </Link>
            ) : (
              offer.businessName
            )}
          </h4>

          <div className="flex items-center space-x-1 text-[11px] text-[#a1a1aa] mt-0.5">
            <MapPin className="w-3 h-3 text-gold-400 shrink-0" />
            <span className="truncate">{offer.businessLocality || 'Vidisha'}</span>
          </div>
        </div>

        {/* Offer Title */}
        <h3 className="font-serif text-base sm:text-lg font-bold text-white mb-1.5 leading-snug">
          {offer.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#a1a1aa] mb-3.5 line-clamp-2 leading-relaxed font-light">
          {offer.description}
        </p>

        {/* Eligibility Conditions */}
        {offer.eligibilityConditions && (
          <div className="mb-3 p-2.5 bg-[#18181e] rounded-xl border border-[#2a2a34] text-[11px] text-[#a1a1aa] flex items-start space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1">
              <strong className="text-white">Condition:</strong> {offer.eligibilityConditions}
            </span>
          </div>
        )}

        {/* In-Store Promo Code */}
        {offer.couponCode && (
          <div className="mb-3.5 px-3 py-2 bg-[#1c1810] border border-dashed border-gold-500/50 rounded-xl flex items-center justify-between text-xs">
            <span className="text-[10px] text-gold-400 uppercase font-bold tracking-wider">In-Store Code:</span>
            <span className="font-mono font-bold text-white tracking-widest text-sm">
              {offer.couponCode}
            </span>
          </div>
        )}

        {/* Validity Dates */}
        <div className="mt-auto pt-2.5 border-t border-[#222228] flex items-center justify-between text-[11px] text-[#8e8e93] mb-3.5">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3 h-3 text-[#71717a]" />
            <span>Valid till {offer.expiryDate}</span>
          </div>
          <span className="text-[10px] text-gold-400 font-semibold bg-[#1a1710] px-2 py-0.5 rounded-full border border-gold-500/30">
            Show Before Billing
          </span>
        </div>

        {/* Primary Action: Show Offer at Shop */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-dark-950 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center space-x-1.5 transition-all duration-200 transform active:scale-95 mb-2.5"
        >
          <span>Show Offer at Shop</span>
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Secondary Contact Actions */}
        <div className="grid grid-cols-3 gap-1.5 text-[11px] font-semibold text-[#d4d4d8]">
          {offer.businessPhone ? (
            <a
              href={`tel:${cleanPhone}`}
              className="py-1.5 px-2 rounded-full bg-[#1b1b22] hover:bg-[#252530] border border-[#2c2c36] text-white flex items-center justify-center space-x-1 transition-colors text-center"
              title="Call Business"
            >
              <Phone className="w-3 h-3 text-gold-400" />
              <span>Call</span>
            </a>
          ) : (
            <div className="py-1.5 px-2 text-center text-[#71717a] text-[10px] rounded-full bg-[#18181c]">
              No Phone
            </div>
          )}

          {offer.businessWhatsapp ? (
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="py-1.5 px-2 rounded-full bg-[#1b1b22] hover:bg-[#252530] border border-[#2c2c36] text-gold-400 flex items-center justify-center space-x-1 transition-colors text-center"
              title="Message on WhatsApp"
            >
              <MessageSquare className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          ) : (
            <div className="py-1.5 px-2 text-center text-[#71717a] text-[10px] rounded-full bg-[#18181c]">
              No Chat
            </div>
          )}

          <a
            href={mapQuery}
            target="_blank"
            rel="noreferrer"
            className="py-1.5 px-2 rounded-full bg-[#1b1b22] hover:bg-[#252530] border border-[#2c2c36] text-white flex items-center justify-center space-x-1 transition-colors text-center"
            title="Directions"
          >
            <Navigation className="w-3 h-3 text-gold-400" />
            <span>Map</span>
          </a>
        </div>
      </div>

      {modalOpen && (
        <OfferDetailsModal offer={offer} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
};
