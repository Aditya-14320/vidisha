/**
 * Image Optimization Utility for Vidisha City
 * Provides automatic format selection (f_auto: WebP/AVIF), high-quality compression (q_auto:best),
 * DPR support (retina screens), and responsive srcSets for Cloudinary & external images.
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: 'best' | 'good' | 'eco' | 'low';
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'limit' | 'fill' | 'fit' | 'thumb' | 'scale';
  gravity?: 'auto' | 'face' | 'center';
  dpr?: boolean | number;
}

/**
 * Transforms a Cloudinary URL to use high-quality, optimal delivery transformations.
 * Preserves the original asset in Cloudinary while generating crisp, high-definition variants.
 */
export function getOptimizedImageUrl(
  url?: string | null,
  options: ImageOptimizationOptions = {}
): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Handle Cloudinary URLs
  if (url.includes('cloudinary.com')) {
    const {
      width,
      height,
      quality = 'best',
      format = 'auto',
      crop = width && height ? 'fill' : 'limit',
      gravity = 'auto',
      dpr = true
    } = options;

    const transformations: string[] = [];

    // Format auto-negotiation (AVIF / WebP depending on browser support)
    if (format) {
      transformations.push(`f_${format}`);
    }

    // High quality auto-compression (q_auto:best prevents visible artifacting)
    if (quality) {
      transformations.push(`q_auto:${quality}`);
    }

    // High DPI / Retina support
    if (dpr) {
      transformations.push(typeof dpr === 'number' ? `dpr_${dpr}` : 'dpr_auto');
    }

    // Target dimensions & cropping
    if (width) {
      transformations.push(`w_${Math.round(width)}`);
    }
    if (height) {
      transformations.push(`h_${Math.round(height)}`);
    }
    if (crop && (width || height)) {
      transformations.push(`c_${crop}`);
      if (crop === 'fill' || crop === 'thumb') {
        transformations.push(`g_${gravity}`);
      }
    }

    const transformStr = transformations.join(',');

    // Match /image/upload/(optional existing transforms/)(v\d+/... or public_id)
    const regex = /\/image\/upload\/(?:(?:[a-z]_[^/]+,?)+\/)?(v\d+\/)?/;
    if (regex.test(url)) {
      return url.replace(regex, (_match, version) => {
        return `/image/upload/${transformStr}/${version || ''}`;
      });
    }

    return url;
  }

  // Handle Unsplash sample photos
  if (url.includes('images.unsplash.com')) {
    const urlObj = new URL(url);
    if (options.width) {
      urlObj.searchParams.set('w', options.width.toString());
    }
    if (options.height) {
      urlObj.searchParams.set('h', options.height.toString());
    }
    urlObj.searchParams.set('auto', 'format');
    urlObj.searchParams.set('fit', options.crop === 'fill' ? 'crop' : 'max');
    urlObj.searchParams.set('q', options.quality === 'best' ? '85' : '80');
    return urlObj.toString();
  }

  // Return original URL for other CDNs/sources
  return url;
}

/**
 * Generate a responsive srcSet string for mobile, tablet, and desktop viewports.
 * Example sizes: [400, 800, 1200, 1600]
 */
export function getResponsiveSrcSet(
  url?: string | null,
  widths: number[] = [400, 800, 1200, 1600],
  baseOptions: Omit<ImageOptimizationOptions, 'width'> = {}
): string {
  if (!url || typeof url !== 'string') return '';
  if (!url.includes('cloudinary.com') && !url.includes('images.unsplash.com')) {
    return '';
  }

  return widths
    .map(w => {
      const optimizedUrl = getOptimizedImageUrl(url, { ...baseOptions, width: w });
      return `${optimizedUrl} ${w}w`;
    })
    .join(', ');
}
