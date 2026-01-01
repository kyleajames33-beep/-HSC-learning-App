import React from 'react';

// Asset Loader with fallbacks and lazy loading
class AssetLoader {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.fallbackIcons = this.generateFallbackIcons();
  }

  // Generate fallback icons using SVG
  generateFallbackIcons() {
    const createSVGIcon = (size, color = '#3B82F6') => {
      return `data:image/svg+xml,${encodeURIComponent(`
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="${color}"/>
          <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" 
                font-weight="bold" text-anchor="middle" dy="0.35em" fill="white">H</text>
        </svg>
      `)}`;
    };

    return {
      '16x16': createSVGIcon(16),
      '32x32': createSVGIcon(32),
      '72x72': createSVGIcon(72),
      '96x96': createSVGIcon(96),
      '128x128': createSVGIcon(128),
      '144x144': createSVGIcon(144),
      '152x152': createSVGIcon(152),
      '192x192': createSVGIcon(192),
      '384x384': createSVGIcon(384),
      '512x512': createSVGIcon(512),
    };
  }

  // Check if an asset exists
  async assetExists(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Load asset with fallback
  async loadAsset(url, fallbackUrl = null) {
    // Check cache first
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    // Check if already loading
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    const loadPromise = this.performAssetLoad(url, fallbackUrl);
    this.loadingPromises.set(url, loadPromise);

    try {
      const result = await loadPromise;
      this.cache.set(url, result);
      return result;
    } finally {
      this.loadingPromises.delete(url);
    }
  }

  async performAssetLoad(url, fallbackUrl) {
    try {
      // Try to load primary asset
      if (await this.assetExists(url)) {
        return url;
      }

      // Try fallback if provided
      if (fallbackUrl && await this.assetExists(fallbackUrl)) {
        console.warn(`Asset not found: ${url}, using fallback: ${fallbackUrl}`);
        return fallbackUrl;
      }

      // Generate fallback based on asset type
      return this.generateFallback(url);
    } catch (error) {
      console.error(`Failed to load asset: ${url}`, error);
      return this.generateFallback(url);
    }
  }

  generateFallback(url) {
    // Determine asset type and generate appropriate fallback
    if (url.includes('icon') || url.includes('favicon')) {
      const sizeMatch = url.match(/(\d+)x(\d+)/);
      if (sizeMatch) {
        const size = sizeMatch[1];
        return this.fallbackIcons[`${size}x${size}`] || this.fallbackIcons['192x192'];
      }
      return this.fallbackIcons['192x192'];
    }

    // For other images, return a placeholder
    return this.generatePlaceholderImage(url);
  }

  generatePlaceholderImage(url) {
    const width = 400;
    const height = 300;
    
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#F3F4F6"/>
        <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="#E5E7EB" rx="8"/>
        <circle cx="${width / 2}" cy="${height / 2 - 20}" r="30" fill="#9CA3AF"/>
        <rect x="${width / 2 - 40}" y="${height / 2 + 20}" width="80" height="8" fill="#9CA3AF" rx="4"/>
        <rect x="${width / 2 - 60}" y="${height / 2 + 35}" width="120" height="6" fill="#D1D5DB" rx="3"/>
      </svg>
    `)}`;
  }

  // Preload critical assets
  async preloadCriticalAssets() {
    const criticalAssets = [
      '/icon-192x192.png',
      '/icon-512x512.png',
      '/favicon.ico',
      '/manifest.json'
    ];

    const promises = criticalAssets.map(asset => 
      this.loadAsset(asset).catch(err => 
        console.warn(`Failed to preload critical asset: ${asset}`, err)
      )
    );

    await Promise.allSettled(promises);
  }

  // Get optimized image URL based on device capabilities
  getOptimizedImageUrl(baseUrl, options = {}) {
    const { 
      width, 
      height, 
      quality = 80, 
      format = 'auto',
      devicePixelRatio = window.devicePixelRatio || 1 
    } = options;

    // If no dimensions provided, return original
    if (!width && !height) {
      return baseUrl;
    }

    // Calculate actual dimensions considering device pixel ratio
    const actualWidth = width ? Math.round(width * devicePixelRatio) : undefined;
    const actualHeight = height ? Math.round(height * devicePixelRatio) : undefined;

    // For now, return original URL (would integrate with image optimization service)
    return baseUrl;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  // Get cache size
  getCacheSize() {
    return this.cache.size;
  }
}

// Create singleton instance
const assetLoader = new AssetLoader();

// React hook for asset loading
export const useAsset = (url, options = {}) => {
  const [asset, setAsset] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;

    const loadAsset = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const optimizedUrl = assetLoader.getOptimizedImageUrl(url, options);
        const loadedAsset = await assetLoader.loadAsset(optimizedUrl, options.fallback);
        
        if (!cancelled) {
          setAsset(loadedAsset);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
          // Still set a fallback asset
          setAsset(assetLoader.generateFallback(url));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAsset();

    return () => {
      cancelled = true;
    };
  }, [url, options.fallback]);

  return { asset, loading, error };
};

// Component for lazy-loaded images with fallbacks
export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  fallback,
  width,
  height,
  quality,
  onLoad,
  onError,
  ...props 
}) => {
  const { asset, loading, error } = useAsset(src, { 
    fallback, 
    width, 
    height, 
    quality 
  });

  React.useEffect(() => {
    if (!loading && !error && onLoad) {
      onLoad();
    }
    if (error && onError) {
      onError(error);
    }
  }, [loading, error, onLoad, onError]);

  if (loading) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
        style={{ width, height }}
        {...props}
      >
        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={asset}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
      {...props}
    />
  );
};

// Initialize preloading when module loads
if (typeof window !== 'undefined') {
  assetLoader.preloadCriticalAssets();
}

export default assetLoader;