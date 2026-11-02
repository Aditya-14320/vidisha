import React, { useEffect, useState } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { Banner, BannerPlacement } from '../../types';
import { BannerService } from '../../services/bannerService';

interface BannerDisplayProps {
  placement: BannerPlacement;
  className?: string;
  categorySlug?: string;
}

function getSafeImageUrl(url?: string): string {
  if (!url) return '';
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }
  const driveIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (url.includes('drive.google.com') && driveIdMatch && driveIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
  }
  return url;
}

export const BannerDisplay: React.FC<BannerDisplayProps> = ({ placement, className = '' }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadBanners() {
      try {
        const active = await BannerService.getActiveBannersForPlacement(placement);
        if (mounted) {
          setBanners(active);
          for (const banner of active) {
            BannerService.recordImpression(banner.id).catch(() => {});
          }
        }
      } catch (err) {
        console.error('Failed to load banners for placement:', placement, err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadBanners();
    return () => { mounted = false; };
  }, [placement]);

  if (loading || banners.length === 0) {
    return null;
  }

  const handleClick = (banner: Banner) => {
    BannerService.recordClick(banner.id).catch(() => {});
  };

  const isHero = placement === 'homepage_hero';
  const isMid = placement === 'homepage_mid' || placement === 'mobile_responsive';

  return (
    <div className={`relative ${className}`}>
      {banners.map((banner) => {
        const hasValidImage = banner.imageUrl && !failedImages.has(banner.id);
        const resolvedImageUrl = getSafeImageUrl(banner.imageUrl);

        return (
          <div
            key={banner.id}
            className={`relative group overflow-hidden rounded-3xl border border-[#26262e] shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all hover:border-gold-500/50 ${
              isHero ? 'mb-6' : isMid ? 'mb-5' : 'mb-4'
            }`}
          >
            {/* Sponsored Label in Gold */}
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/80 text-gold-400 backdrop-blur-md shadow-md border border-gold-500/30">
                <Sparkles className="w-2.5 h-2.5 text-gold-400" />
                <span>Sponsored Partner</span>
              </span>
            </div>

            {/* Banner Link */}
            <a
              href={banner.destinationUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => handleClick(banner)}
              className="block"
            >
              {hasValidImage ? (
                <div className={`relative w-full ${isHero ? 'h-40 sm:h-56 md:h-64' : 'h-32 sm:h-44'}`}>
                  <img
                    src={resolvedImageUrl}
                    alt={`${banner.title} — Advertisement by ${banner.businessName}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    onError={() => {
                      setFailedImages((prev) => new Set(prev).add(banner.id));
                    }}
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/90 via-[#0d0d0d]/40 to-transparent flex items-end p-4 sm:p-6 opacity-95 group-hover:opacity-100 transition-opacity">
                    <div className="w-full flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-[10px] text-gold-400 font-bold uppercase tracking-widest block truncate">
                          {banner.businessName}
                        </span>
                        <h3 className="font-serif text-sm sm:text-xl font-bold text-white truncate drop-shadow-md">
                          {banner.title}
                        </h3>
                        {banner.description && (
                          <p className="text-[11px] sm:text-xs text-[#d4d4d8] line-clamp-1 hidden sm:block font-light">
                            {banner.description}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 px-4 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 font-bold text-xs flex items-center space-x-1.5 shadow-md">
                        <span>Visit</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Fallback Dark Luxury Card */
                <div
                  className={`relative w-full ${
                    isHero ? 'p-6 sm:p-10' : 'p-5 sm:p-8'
                  } bg-[#141418] text-white flex flex-col justify-between border border-[#2a2a34]`}
                >
                  <div className="max-w-2xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400 bg-gold-400/10 border border-gold-400/30 px-2.5 py-0.5 rounded-full">
                        {banner.businessName}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg sm:text-2xl font-bold text-white tracking-tight mb-1.5">
                      {banner.title}
                    </h3>
                    {banner.description && (
                      <p className="text-xs sm:text-sm text-[#a1a1aa] line-clamp-2 leading-relaxed font-light">
                        {banner.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 sm:mt-6 flex items-center justify-between pt-3 border-t border-[#24242e]">
                    <span className="text-[11px] sm:text-xs font-medium text-gold-400/80">
                      Vidisha City Verified Commercial Partner
                    </span>
                    <span className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 font-bold text-xs group-hover:from-gold-400 group-hover:to-gold-500 transition-colors shadow">
                      <span>Explore</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              )}
            </a>
          </div>
        );
      })}
    </div>
  );
};
