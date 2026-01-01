// Dynamic icon generation service
export class IconGenerator {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.initCanvas();
  }

  initCanvas() {
    if (typeof window !== 'undefined') {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
    }
  }

  // Generate app icon with specified size and style
  generateAppIcon(size = 192, options = {}) {
    const {
      backgroundColor = '#0284c7',
      textColor = '#ffffff',
      text = 'H',
      borderRadius = size * 0.2,
      gradient = true
    } = options;

    // Create SVG icon
    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          ${gradient ? `
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
              <stop offset="100%" style="stop-color:${this.darkenColor(backgroundColor, 20)};stop-opacity:1" />
            </linearGradient>
          ` : ''}
        </defs>
        <rect width="${size}" height="${size}" rx="${borderRadius}" 
              fill="${gradient ? 'url(#bg)' : backgroundColor}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" 
              font-size="${size * 0.4}" font-weight="bold" 
              text-anchor="middle" dy="0.35em" fill="${textColor}">${text}</text>
      </svg>
    `;

    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  // Generate favicon
  generateFavicon() {
    return this.generateAppIcon(32, {
      backgroundColor: '#0284c7',
      borderRadius: 4,
      gradient: false
    });
  }

  // Generate Apple touch icon
  generateAppleTouchIcon() {
    return this.generateAppIcon(180, {
      backgroundColor: '#0284c7',
      borderRadius: 36,
      gradient: true
    });
  }

  // Generate icon set for PWA manifest
  generateIconSet() {
    const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
    const icons = {};

    sizes.forEach(size => {
      icons[`${size}x${size}`] = this.generateAppIcon(size, {
        backgroundColor: '#0284c7',
        borderRadius: size * 0.2,
        gradient: true
      });
    });

    return icons;
  }

  // Generate placeholder image
  generatePlaceholder(width = 400, height = 300, options = {}) {
    const {
      backgroundColor = '#f3f4f6',
      iconColor = '#9ca3af',
      text = 'Image'
    } = options;

    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="${backgroundColor}"/>
        <rect x="20" y="20" width="${width - 40}" height="${height - 40}" 
              fill="#e5e7eb" rx="8" stroke="#d1d5db" stroke-width="1"/>
        
        <!-- Image icon -->
        <g transform="translate(${width / 2 - 24}, ${height / 2 - 32})">
          <rect width="48" height="36" rx="4" fill="${iconColor}" opacity="0.5"/>
          <circle cx="36" cy="12" r="6" fill="${iconColor}"/>
          <polygon points="8,28 20,16 28,24 40,12 48,20 48,32 8,32" fill="${iconColor}"/>
        </g>
        
        <!-- Text -->
        <text x="50%" y="${height / 2 + 20}" font-family="Arial, sans-serif" 
              font-size="14" text-anchor="middle" fill="${iconColor}">${text}</text>
      </svg>
    `;

    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  // Generate loading spinner
  generateLoadingSpinner(size = 24, color = '#3b82f6') {
    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <style>
          .spinner { 
            animation: spin 1s linear infinite; 
            transform-origin: center; 
          }
          @keyframes spin { 
            to { transform: rotate(360deg); } 
          }
        </style>
        <circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" 
                fill="none" stroke-linecap="round" stroke-dasharray="31.416" 
                stroke-dashoffset="31.416" class="spinner">
          <animate attributeName="stroke-dasharray" dur="2s" 
                   values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
          <animate attributeName="stroke-dashoffset" dur="2s" 
                   values="0;-15.708;-31.416" repeatCount="indefinite"/>
        </circle>
      </svg>
    `;

    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  // Utility function to darken a color
  darkenColor(color, percent) {
    // Simple color darkening for hex colors
    if (color.startsWith('#')) {
      const num = parseInt(color.slice(1), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) - amt;
      const G = (num >> 8 & 0x00FF) - amt;
      const B = (num & 0x0000FF) - amt;
      return `#${(
        0x1000000 + 
        (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + 
        (B < 255 ? B < 1 ? 0 : B : 255)
      ).toString(16).slice(1)}`;
    }
    return color;
  }

  // Convert SVG to PNG (if needed for fallbacks)
  async svgToPng(svgDataUrl, width, height) {
    if (!this.canvas || !this.ctx) {
      return svgDataUrl; // Return SVG if canvas not available
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.drawImage(img, 0, 0, width, height);
        resolve(this.canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(svgDataUrl);
      img.src = svgDataUrl;
    });
  }
}

// Create singleton instance
const iconGenerator = new IconGenerator();

// Function to inject dynamic favicon
export const injectDynamicFavicon = () => {
  if (typeof window === 'undefined') return;

  const favicon = iconGenerator.generateFavicon();
  
  // Remove existing favicon
  const existingFavicon = document.querySelector('link[rel="icon"]');
  if (existingFavicon) {
    existingFavicon.remove();
  }

  // Add new favicon
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = favicon;
  document.head.appendChild(link);
};

// Function to inject Apple touch icon
export const injectAppleTouchIcon = () => {
  if (typeof window === 'undefined') return;

  const icon = iconGenerator.generateAppleTouchIcon();
  
  // Remove existing Apple touch icon
  const existingIcon = document.querySelector('link[rel="apple-touch-icon"]');
  if (existingIcon) {
    existingIcon.remove();
  }

  // Add new Apple touch icon
  const link = document.createElement('link');
  link.rel = 'apple-touch-icon';
  link.href = icon;
  document.head.appendChild(link);
};

export default iconGenerator;