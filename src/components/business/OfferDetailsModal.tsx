import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Tag,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  Phone,
  MessageSquare,
  Navigation,
  Info,
  Sparkles,
  QrCode,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Offer, OfferClaim } from '../../types';
import { OfferService } from '../../services/offerService';

interface OfferDetailsModalProps {
  offer: Offer;
  onClose: () => void;
}

export const OfferDetailsModal: React.FC<OfferDetailsModalProps> = ({ offer, onClose }) => {
  const [claim, setClaim] = useState<OfferClaim | null>(null);
  const [loadingClaim, setLoadingClaim] = useState(true);

  useEffect(() => {
    // Generate or fetch user's unique in-store pass reference
    async function initClaimPass() {
      try {
        setLoadingClaim(true);
        const userPass = await OfferService.claimOffer(offer);
        setClaim(userPass);
      } catch (err) {
        console.warn('Failed to generate claim pass', err);
      } finally {
        setLoadingClaim(false);
      }
    }

    initClaimPass();
  }, [offer.id]);

  const cleanPhone = offer.businessPhone ? offer.businessPhone.replace(/[^0-9+]/g, '') : '';
  const cleanWhatsApp = offer.businessWhatsapp
    ? offer.businessWhatsapp.replace(/[^0-9]/g, '')
    : cleanPhone.replace(/[^0-9]/g, '');

  const whatsappMessage = encodeURIComponent(
    `Hello ${offer.businessName}, I am viewing your offer "${offer.title}" ${
      claim ? `(Pass: ${claim.claimReference})` : ''
    } on Vidisha City Directory. Could you please confirm if it is currently available at your store?`
  );

  const mapQuery = offer.businessMapUrl || `https://maps.google.com/?q=${encodeURIComponent(`${offer.businessName}, ${offer.businessAddress || offer.businessLocality || 'Vidisha'}`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 my-8 relative flex flex-col max-h-[92vh]">
        {/* Top Header bar with decorative gradient */}
        <div className="h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-blue-600" />

        {/* Modal Top Nav */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center space-x-1">
              <Building2 className="w-3 h-3" />
              <span>In-Store Promotion</span>
            </span>
            {offer.isSponsored && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Featured</span>
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close offer details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Business & Locality header */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {offer.categoryName || 'Vidisha Merchant'}
              </span>
              {offer.isBusinessVerified && (
                <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Merchant</span>
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {offer.businessName}
            </h3>

            <p className="text-xs text-slate-500 flex items-center space-x-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{offer.businessAddress || `${offer.businessLocality}, Vidisha, MP`}</span>
            </p>
          </div>

          {/* Offer Title & Highlight Badge */}
          <div className="bg-gradient-to-br from-amber-50/80 via-amber-50/40 to-white rounded-2xl p-4 sm:p-5 border border-amber-200/80">
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-black bg-amber-500 text-slate-950 shadow-sm">
                {offer.discountBadge || 'Special Offer'}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {offer.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
              {offer.description}
            </p>
          </div>

          {/* UNIQUE IN-STORE CLAIM PASS CARD */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-inner relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  In-Store Reference Pass
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Issued Pass
              </span>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Pass Reference ID</span>
                <span className="text-lg sm:text-xl font-mono font-black text-amber-300 tracking-wider">
                  {loadingClaim ? 'GENERATING...' : (claim?.claimReference || 'VC-SHOP-PASS')}
                </span>
              </div>
              {offer.couponCode && (
                <div className="text-right border-l border-slate-700 pl-3">
                  <span className="text-[10px] text-slate-400 block font-medium">Promo Code</span>
                  <span className="text-sm font-mono font-bold text-white tracking-wider">
                    {offer.couponCode}
                  </span>
                </div>
              )}
            </div>

            {/* Crucial Instruction Notice */}
            <div className="mt-3 text-[11px] text-amber-100/90 leading-relaxed flex items-start space-x-2 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Important:</strong> Show this pass on your phone to the merchant <strong>before billing</strong>. The business will verify eligibility and apply the offer directly to your bill.
              </span>
            </div>

            <div className="mt-2 text-[10px] text-slate-400 text-center">
              Opening this screen does not mark the offer as redeemed. In-store redemption is finalized by the business.
            </div>
          </div>

          {/* Offer Conditions & Terms */}
          <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h5 className="font-bold text-slate-900 text-xs flex items-center space-x-1.5 pb-1 border-b border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Terms & Eligibility</span>
            </h5>

            {offer.minimumSpend && (
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Minimum Bill Amount:</span>
                <span className="font-bold text-slate-900">₹{offer.minimumSpend}</span>
              </div>
            )}

            {offer.eligibleProducts && (
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Eligible Products:</span>
                <span className="font-bold text-slate-900 text-right">{offer.eligibleProducts}</span>
              </div>
            )}

            {offer.eligibilityConditions && (
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Applicability:</span>
                <span className="font-bold text-slate-900 text-right">{offer.eligibilityConditions}</span>
              </div>
            )}

            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Validity Period:</span>
              <span className="font-semibold text-slate-900">
                {offer.startDate} to {offer.expiryDate}
              </span>
            </div>

            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Redemption Method:</span>
              <span className="font-medium text-slate-800 text-right">
                {offer.redemptionMethod || 'Show this pass in-person before billing'}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 leading-relaxed">
              <strong>Merchant Conditions:</strong> {offer.termsAndConditions}
            </div>
          </div>

          {/* Direct Store Contact Actions */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Contact & Store Location
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
              {offer.businessPhone && (
                <a
                  href={`tel:${cleanPhone}`}
                  className="py-2.5 px-3 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {offer.businessPhone}</span>
                </a>
              )}

              {offer.businessWhatsapp && (
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp In-Store</span>
                </a>
              )}

              <a
                href={mapQuery}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center space-x-1.5 transition-colors sm:col-span-2"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                <span>Get Directions to Store</span>
              </a>
            </div>
          </div>

          {/* Platform Non-Transactional Disclosure */}
          <div className="p-3 bg-slate-100 rounded-xl text-[10px] text-slate-500 leading-relaxed flex items-start space-x-2">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Vidisha City is a community discovery platform. We do not process online transactions, take commissions, or charge booking fees. Final acceptance and stock availability remain at the sole discretion of the business.
            </span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          {offer.businessSlug ? (
            <Link
              to={`/business/${offer.businessSlug}`}
              onClick={onClose}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>View Business Profile</span>
              <span>→</span>
            </Link>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm"
          >
            Done / Close
          </button>
        </div>
      </div>
    </div>
  );
};
