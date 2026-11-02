import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  MessageSquare,
  MapPin,
  Star,
  CheckCircle2,
  ArrowRight
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
      className="bg-[#141417] rounded-3xl border border-[#2a2a30] shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:border-gold-500/50 hover:shadow-[0_12px_40px_rgba(212,168,49,0.15)] transition-all duration-300 overflow-hidden flex flex-col group relative cursor-pointer active:scale-[0.99]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Top Media / Header with warm ambient glow & badges matching reference screenshot */}
      <div className="relative h-48 sm:h-52 w-full bg-[#1e1e24] overflow-hidden">
        <img
          src={business.coverImageUrl || business.gallery[0] || 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80'}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Ambient dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141417] via-transparent to-black/40" />

        {/* Badges Overlay matching PRIORITY LISTING in screenshot */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
          {(business.packageId === 'priority' || priorityBadge) && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 uppercase tracking-wider shadow-lg">
              <Star className="w-3 h-3 fill-dark-950 text-dark-950" />
              <span>{priorityBadge || 'Priority Listing'}</span>
            </span>
          )}
        </div>

        {/* Price Range Pill */}
        {business.priceRange && (
          <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-black/70 backdrop-blur-md rounded-full text-gold-300 text-[11px] font-medium border border-gold-500/20">
            {business.priceRange}
          </div>
        )}

        {/* Bottom image overlay metadata (Locality, Stars, and View Details) matching screenshot */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white z-10">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 text-white font-medium">
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              <span>{business.locality || 'Vidisha'}</span>
            </span>

            {/* Star ratings */}
            <div className="flex items-center space-x-1">
              <div className="flex text-gold-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <span className="text-[11px] font-semibold text-white">4.8</span>
            </div>
          </div>

          <span className="inline-flex items-center space-x-1 text-xs font-semibold text-gold-400 group-hover:text-gold-300 group-hover:translate-x-0.5 transition-transform">
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Category & Verified Tag */}
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="font-semibold text-gold-400 tracking-wider uppercase text-[11px]">
            {business.categoryName}
          </span>
          <span className="inline-flex items-center space-x-1 text-[#a1a1aa] font-medium text-[11px] bg-[#1d1d24] px-2 py-0.5 rounded-full border border-[#2e2e38]">
            <CheckCircle2 className="w-3 h-3 text-gold-400" />
            <span>Verified</span>
          </span>
        </div>

        {/* Business Title */}
        <h3 className="font-serif text-lg font-bold text-white group-hover:text-gold-400 transition-colors line-clamp-1 mb-1.5">
          {business.name}
        </h3>

        {/* Description snippet */}
        <p className="text-xs sm:text-sm text-[#a1a1aa] line-clamp-2 mb-4 leading-relaxed font-light">
          {business.description}
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-[#222228]" onClick={(e) => e.stopPropagation()}>
          {business.phone ? (
            <a
              href={`tel:${cleanPhone}`}
              onClick={(e) => handleActionClick(e, 'phone')}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-full border border-gold-500/40 text-gold-300 hover:bg-gold-500 hover:text-dark-950 text-xs font-semibold transition-all duration-200"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Now</span>
            </a>
          ) : (
            <div className="text-center py-2.5 text-xs text-[#71717a] border border-[#26262e] rounded-full bg-[#18181c]">
              No Phone
            </div>
          )}

          {business.whatsapp ? (
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello ${business.name}, I discovered your establishment on Vidisha City Directory.`)}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => handleActionClick(e, 'whatsapp')}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-dark-950 text-xs font-bold transition-all duration-200 shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={handleCardClick}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-full bg-[#222228] hover:bg-[#2c2c34] text-white text-xs font-semibold transition-colors"
            >
              <span>View Details</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
