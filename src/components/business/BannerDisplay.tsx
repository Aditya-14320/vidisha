import React, { useEffect, useState } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { Banner, BannerPlacement } from '../../types';
import { BannerService } from '../../services/bannerService';

interface BannerDisplayProps {
  placement: BannerPlacement;
  className?: string;
  /** Optional category slug to further filter category banners (future use) */
  categorySlug?: string;
}

/**
 * Converts Google Drive sharing links into direct, embeddable image URLs.
 */
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

/**
 * Renders active, paid, approved banner advertisements for a given placement.
 * Only shows banners within their active date range.
 * Automatically records impressions.
 * Clearly labels content as "Sponsored" / "Advertisement".
 * Gracefully handles broken or loading images with a branded fallback card.
 */
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
          // Record impressions for displayed banners
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
    return null; // Don't render anything if no active banners
  }

  const handleClick = (banner: Banner) => {
    BannerService.recordClick(banner.id).catch(() => {});
  };

  // Choose layout based on placement
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
            className={`relative group overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm transition-all hover:shadow-md ${
              isHero ? 'mb-5' : isMid ? 'mb-4' : 'mb-4'
            }`}
          >
            {/* Sponsored Label */}
            <div className="absolute top-2.5 left-2.5 z-10">
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-slate-950/75 text-amber-300 backdrop-blur-sm shadow-sm border border-white/10">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>Sponsored</span>
              </span>
            </div>

            {/* Banner Image / Content */}
            <a
              href={banner.destinationUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => handleClick(banner)}
              className="block"
            >
              {hasValidImage ? (
                <div className={`relative w-full ${isHero ? 'h-36 sm:h-52 md:h-64' : 'h-28 sm:h-40'}`}>
                  <img
                    src={resolvedImageUrl}
                    alt={`${banner.title} — Advertisement by ${banner.businessName}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={() => {
                      setFailedImages((prev) => new Set(prev).add(banner.id));
                    }}
                  />
                  {/* Subtle overlay with details */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3 sm:p-4 opacity-95 group-hover:opacity-100 transition-opacity">
                    <div className="w-full flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block truncate">
                          {banner.businessName}
                        </span>
                        <h3 className="text-xs sm:text-base font-bold text-white truncate drop-shadow">
                          {banner.title}
                        </h3>
                        {banner.description && (
                          <p className="text-[10px] sm:text-xs text-slate-200 line-clamp-1 hidden sm:block">
                            {banner.description}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-slate-900 font-bold text-[10px] sm:text-xs flex items-center space-x-1 shadow-sm">
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Polished Branded Fallback Card (when no image or image failed to load) */
                <div
                  className={`relative w-full ${
                    isHero ? 'p-5 sm:p-8' : 'p-4 sm:p-6'
                  } bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white flex flex-col justify-between`}
                >
                  <div className="max-w-2xl">
                    <div className="flex items-center space-x-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full">
                        {banner.businessName}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-2xl font-black text-white tracking-tight mb-1">
                      {banner.title}
                    </h3>
                    {banner.description && (
                      <p className="text-xs sm:text-sm text-blue-100/90 line-clamp-2 leading-relaxed">
                        {banner.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 sm:mt-4 flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-[10px] sm:text-xs font-semibold text-blue-200">
                      Vidisha City Verified Sponsor
                    </span>
                    <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white text-blue-700 font-bold text-xs group-hover:bg-blue-50 transition-colors shadow">
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
