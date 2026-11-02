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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-ivory-300 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Card */}
        <div className="bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800 text-ivory-100 p-5 sm:p-6 relative border-b border-forest-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-forest-800/80 hover:bg-forest-700 text-ivory-200 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold-400 text-forest-950 uppercase tracking-wider shadow">
              {offer.discountBadge || 'Exclusive Offer'}
            </span>
            {offer.isSponsored && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-forest-800 text-gold-300 border border-gold-500/30">
                <Sparkles className="w-3 h-3 text-gold-400" />
                <span>Featured</span>
              </span>
            )}
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
            {offer.title}
          </h3>
          <p className="text-xs text-gold-300 font-medium">
            At {offer.businessName} • {offer.businessLocality || 'Vidisha'}
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Coupon Code Section */}
          {offer.couponCode && (
            <div className="p-4 bg-ivory-100 rounded-2xl border border-gold-300/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-charcoal-400 block tracking-wider">
                  In-Store Redemption Code
                </span>
                <span className="font-mono text-xl font-bold text-forest-950 tracking-wider">
                  {offer.couponCode}
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3.5 py-2 rounded-xl bg-forest-900 hover:bg-forest-950 text-gold-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-gold-500/30 shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 text-gold-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 mb-1.5">
              Offer Details
            </h4>
            <p className="text-sm text-charcoal-700 leading-relaxed font-light">
              {offer.description}
            </p>
          </div>

          {/* Eligibility Conditions */}
          {offer.eligibilityConditions && (
            <div className="p-3.5 bg-ivory-100 rounded-xl border border-ivory-300 text-xs text-charcoal-700">
              <strong className="text-charcoal-900 block mb-1">Terms & Conditions:</strong>
              <p>{offer.eligibilityConditions}</p>
            </div>
          )}

          {/* Dates & Location */}
          <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-ivory-200">
            <div>
              <span className="text-charcoal-400 block mb-0.5">Valid From</span>
              <span className="font-semibold text-charcoal-800">{offer.startDate || 'Immediate'}</span>
            </div>
            <div>
              <span className="text-charcoal-400 block mb-0.5">Valid Till</span>
              <span className="font-semibold text-charcoal-800">{offer.expiryDate}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-ivory-50 border-t border-ivory-200 grid grid-cols-3 gap-2">
          {offer.businessPhone && (
            <a
              href={`tel:${cleanPhone}`}
              className="py-2.5 px-3 rounded-xl bg-forest-900 text-gold-300 hover:bg-forest-950 text-xs font-semibold flex items-center justify-center space-x-1.5 border border-gold-500/30 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span>Call</span>
            </a>
          )}
          {offer.businessWhatsapp && (
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 rounded-xl bg-forest-800 text-ivory-100 hover:bg-forest-900 text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 text-gold-400" />
              <span>WhatsApp</span>
            </a>
          )}
          <a
            href={mapQuery}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 px-3 rounded-xl bg-white border border-ivory-300 text-charcoal-800 hover:bg-ivory-100 text-xs font-semibold flex items-center justify-center space-x-1.5"
          >
            <Navigation className="w-3.5 h-3.5 text-gold-600" />
            <span>Map</span>
          </a>
        </div>
      </div>
    </div>
  );
};
