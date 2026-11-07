import { describe, it, expect } from 'vitest';
import { getOptimizedImageUrl, getResponsiveSrcSet } from '../utils/imageOptimizer';

describe('Image Optimizer Utility', () => {
  const sampleCloudinaryUrl = 'https://res.cloudinary.com/dmqyfhjbt/image/upload/v1794041521/vidisha-businesses/covers/lfmcqjq8f8vx1kzeqylr.png';
  const sampleUnsplashUrl = 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&auto=format&fit=crop&q=80';

  it('optimizes Cloudinary image with f_auto, q_auto:best, and dimensions', () => {
    const result = getOptimizedImageUrl(sampleCloudinaryUrl, {
      width: 1200,
      quality: 'best',
      format: 'auto',
      crop: 'limit'
    });

    expect(result).toContain('f_auto');
    expect(result).toContain('q_auto:best');
    expect(result).toContain('dpr_auto');
    expect(result).toContain('w_1200');
    expect(result).toContain('c_limit');
    expect(result).toContain('/v1794041521/vidisha-businesses/covers/lfmcqjq8f8vx1kzeqylr.png');
  });

  it('generates high quality crop=fill for card thumbnails', () => {
    const result = getOptimizedImageUrl(sampleCloudinaryUrl, {
      width: 800,
      height: 520,
      crop: 'fill',
      quality: 'best'
    });

    expect(result).toContain('w_800');
    expect(result).toContain('h_520');
    expect(result).toContain('c_fill');
    expect(result).toContain('g_auto');
    expect(result).toContain('q_auto:best');
  });

  it('generates valid responsive srcSet', () => {
    const srcSet = getResponsiveSrcSet(sampleCloudinaryUrl, [400, 800, 1200], {
      quality: 'best',
      format: 'auto'
    });

    expect(srcSet).toContain('w_400');
    expect(srcSet).toContain('400w');
    expect(srcSet).toContain('w_800');
    expect(srcSet).toContain('800w');
    expect(srcSet).toContain('w_1200');
    expect(srcSet).toContain('1200w');
  });

  it('handles Unsplash URLs properly with high quality', () => {
    const result = getOptimizedImageUrl(sampleUnsplashUrl, {
      width: 1600,
      quality: 'best'
    });

    expect(result).toContain('w=1600');
    expect(result).toContain('q=85');
    expect(result).toContain('auto=format');
  });

  it('returns empty string or safe fallback for invalid/null URLs', () => {
    expect(getOptimizedImageUrl(null)).toBe('');
    expect(getOptimizedImageUrl('')).toBe('');
    expect(getOptimizedImageUrl('https://example.com/photo.jpg')).toBe('https://example.com/photo.jpg');
  });
});
