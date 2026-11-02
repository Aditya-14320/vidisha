import React, { useState } from 'react';
import {
  X,
  Tag,
  Building2,
  Calendar,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import { Offer } from '../../types';

interface OfferDetailsModalProps {
  offer: Offer;
  onClose: () => void;
}

export const OfferDetailsModal: React.FC<OfferDetailsModalProps> = ({ offer, onClose }) => {
  const [copied, setCopied] = useState(false);

  const cleanPhone = offer.businessPhone ? offer.businessPhone.replace(/[^0-9+]/g, '') : '';
  const cleanWhatsApp = offer.businessWhatsapp
    ? offer.businessWhatsapp.replace(/[^0-9]/g, '')
    : cleanPhone.replace(/[^0-9]/g, '');

  const whatsappMessage = encodeURIComponent(
    `Hello ${offer.businessName}, I am showing your "${offer.title}" offer found on Vidisha City Directory.`
  );

  const mapQuery =
    offer.businessMapUrl ||
    `https://maps.google.com/?q=${encodeURIComponent(`${offer.businessName}, ${offer.businessAddress || offer.businessLocality || 'Vidisha'}`)}`;

  const handleCopyCode = () => {
    if (offer.couponCode) {
      navigator.clipboard.writeText(offer.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#141418] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gold-500/40 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Card */}
        <div className="bg-[#1b1b22] text-white p-5 sm:p-6 relative border-b border-[#2a2a36]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#252530] hover:bg-[#30303e] text-[#a1a1aa] hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-gold-400 to-gold-500 text-dark-950 uppercase tracking-wider shadow">
              {offer.discountBadge || 'Exclusive Offer'}
            </span>
            {offer.isSponsored && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#262632] text-gold-400 border border-gold-500/30">
                <Sparkles className="w-3 h-3 text-gold-400" />
                <span>Featured</span>
              </span>
            )}
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
            {offer.title}
          </h3>
          <p className="text-xs text-gold-400 font-semibold tracking-wider uppercase">
            {offer.businessName} • {offer.categoryName}
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* Coupon Code Banner */}
          {offer.couponCode && (
            <div className="p-4 bg-[#1a1710] border-2 border-dashed border-gold-500/50 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gold-400 uppercase font-bold tracking-widest block">
                  In-Store Promo Code
                </span>
                <span className="font-mono text-xl font-black text-white tracking-widest">
                  {offer.couponCode}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3.5 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-dark-950 font-bold text-xs flex items-center space-x-1.5 shadow transition-all active:scale-95"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider mb-1">
              Offer Details
            </h4>
            <p className="text-sm text-[#e4e4e7] leading-relaxed font-light">
              {offer.description}
            </p>
          </div>

          {/* Terms / Condition */}
          {offer.eligibilityConditions && (
            <div className="p-3.5 bg-[#1a1a22] rounded-2xl border border-[#2a2a36] text-xs text-[#a1a1aa] flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-semibold">Conditions:</strong>{' '}
                <span>{offer.eligibilityConditions}</span>
              </div>
            </div>
          )}

          {/* Store Location & Validity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#24242c] text-xs">
            <div className="flex items-center space-x-2 text-[#a1a1aa]">
              <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Valid till: <strong className="text-white">{offer.expiryDate}</strong></span>
            </div>
            <div className="flex items-center space-x-2 text-[#a1a1aa]">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
              <span className="truncate">{offer.businessLocality || 'Vidisha'}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 bg-[#111114] border-t border-[#24242c] flex flex-wrap gap-2.5 items-center justify-between">
          <div className="flex items-center space-x-2">
            {offer.businessPhone && (
              <a
                href={`tel:${cleanPhone}`}
                className="px-4 py-2 rounded-full bg-[#1c1c24] hover:bg-[#252530] border border-[#2e2e38] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-gold-400" />
                <span>Call Store</span>
              </a>
            )}

            {offer.businessWhatsapp && (
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 text-xs font-bold flex items-center space-x-1.5 shadow"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>

          <a
            href={mapQuery}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-full bg-[#1c1c24] hover:bg-[#252530] border border-[#2e2e38] text-gold-400 text-xs font-semibold flex items-center space-x-1.5 transition-colors ml-auto"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Map Directions</span>
          </a>
        </div>
      </div>
    </div>
  );
};
