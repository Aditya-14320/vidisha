import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Business } from '../../types';
import { BusinessService } from '../../services/businessService';

interface BusinessCardProps {
  business: Business;
  priorityBadge?: string;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, priorityBadge }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/business/${business.slug}`);
  };

  const handleActionClick = (e: React.MouseEvent, type: 'phone' | 'whatsapp') => {
    e.stopPropagation();
    BusinessService.recordInteraction(business.id, 'click').catch(console.warn);
  };

  const cleanPhone = business.phone ? business.phone.replace(/[^0-9+]/g, '') : '';
  const cleanWhatsApp = business.whatsapp ? business.whatsapp.replace(/[^0-9]/g, '') : cleanPhone.replace(/[^0-9]/g, '');

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all overflow-hidden flex flex-col group relative cursor-pointer active:scale-[0.99]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Top Media / Header */}
      <div className="relative h-44 sm:h-48 w-full bg-slate-100 overflow-hidden">
        <img
          src={business.coverImageUrl || business.gallery[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
          {/* Priority Listing Badge */}
          {business.packageId === 'priority' && business.paymentStatus === 'paid' && (
            <span className="inline-flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider shadow">
              <Sparkles className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
              <span>Priority Listing</span>
            </span>
          )}

          {priorityBadge && (
            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-emerald-600 text-white shadow">
              {priorityBadge}
            </span>
          )}
        </div>

        {/* Price Range Pill */}
        {business.priceRange && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded text-white text-xs font-semibold">
            {business.priceRange}
          </div>
        )}

        {/* Small business logo avatar */}
        {business.logoUrl && (
          <div className="absolute -bottom-4 left-4 w-12 h-12 rounded-xl bg-white p-0.5 shadow-md border border-slate-200 overflow-hidden">
            <img src={business.logoUrl} alt="" className="w-full h-full object-cover rounded-lg" />
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col pt-6">
        {/* Category & Verified Tag */}
        <div className="flex items-center justify-between mb-1.5 text-xs">
          <span className="font-semibold text-blue-600">
            {business.categoryName}
          </span>
          <span className="inline-flex items-center space-x-1 text-emerald-600 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified</span>
          </span>
        </div>

        {/* Business Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
          {business.name}
        </h3>

        {/* Description snippet */}
        <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {business.description}
        </p>

        {/* Location & Locality */}
        <div className="mt-auto space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100 mb-4">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700 truncate">{business.locality}, Vidisha</span>
          </div>
          {business.openingHours && typeof business.openingHours === 'string' && (
            <div className="flex items-center space-x-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{business.openingHours}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
          {business.phone ? (
            <a
              href={`tel:${cleanPhone}`}
              onClick={(e) => handleActionClick(e, 'phone')}
              className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Now</span>
            </a>
          ) : (
            <div className="text-center py-2 text-xs text-slate-400 border border-slate-200 rounded-xl">
              No Phone
            </div>
          )}

          {business.whatsapp ? (
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello ${business.name}, I found your listing on Vidisha City.`)}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => handleActionClick(e, 'whatsapp')}
              className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={handleCardClick}
              className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors"
            >
              <span>View Profile</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
