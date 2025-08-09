/**
 * Image optimization utility
 * Creates responsive image sources for better performance across devices
 */

export const getResponsiveImageSrc = (imagePath, size = "default") => {
  try {
    // For production, these would be actual image paths
    const sizes = {
      small: `${imagePath}?w=480`,
      medium: `${imagePath}?w=768`,
      large: `${imagePath}?w=1024`,
      default: imagePath
    };

    return sizes[size] || sizes.default;
  } catch (err) {
    console.warn('Error getting responsive image source:', err);
    return imagePath; // Fallback to original path
  }
};

export const lazyLoadImage = (imgElement) => {
  try {
    if ('loading' in HTMLImageElement.prototype) {
      imgElement.loading = 'lazy';
    }
    return imgElement;
  } catch (err) {
    console.warn('Error setting lazy loading:', err);
    return imgElement;
  }
};

// Image preload function for critical images
export const preloadCriticalImages = (imagePaths) => {
  try {
    if (typeof window === 'undefined' || !document) return;
    
    if (!Array.isArray(imagePaths)) {
      console.warn('preloadCriticalImages expected an array, got:', typeof imagePaths);
      return;
    }
    
    imagePaths.forEach(path => {
      try {
        if (!path) return;
        
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = path;
        document.head.appendChild(link);
      } catch (err) {
        console.warn(`Failed to preload image ${path}:`, err);
      }
    });
  } catch (err) {
    console.warn('Error in preloadCriticalImages:', err);
  }
};