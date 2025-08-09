/**
 * Resource Hints Module
 * 
 * This module implements various resource hints (preload, prefetch, preconnect)
 * to improve performance by optimizing resource loading.
 */

// External domains to establish early connections with
// const DOMAINS_TO_PRECONNECT = [
//   'https://fonts.googleapis.com',
//   'https://fonts.gstatic.com',
//   'https://portfolio-d10i.onrender.com' // Your backend API
// ];
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const DOMAINS_TO_PRECONNECT = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  API_URL // Backend API from env
];

// Critical scripts to preload - removing main.jsx as it's already the entry point
const SCRIPTS_TO_PRELOAD = [
  // Do not preload the main entry point to avoid circular dependencies
];

// Non-critical resources to prefetch
const RESOURCES_TO_PREFETCH = [
  // Add paths to non-critical resources
];

/**
 * Implements DNS prefetching and preconnect for external domains
 */
export const setupConnectionHints = () => {
  try {
    if (typeof document === 'undefined') return;
    
    DOMAINS_TO_PRECONNECT.forEach(domain => {
      try {
        // DNS-Prefetch
        const dnsPrefetch = document.createElement('link');
        dnsPrefetch.rel = 'dns-prefetch';
        dnsPrefetch.href = domain;
        document.head.appendChild(dnsPrefetch);
        
        // Preconnect
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = domain;
        preconnect.crossOrigin = 'anonymous';
        document.head.appendChild(preconnect);
      } catch (err) {
        console.warn(`Failed to setup connection hint for ${domain}:`, err);
      }
    });
  } catch (err) {
    console.warn('Failed to setup connection hints:', err);
  }
};

/**
 * Preloads critical resources
 */
export const preloadCriticalResources = () => {
  try {
    if (typeof document === 'undefined') return;
    
    SCRIPTS_TO_PRELOAD.forEach(src => {
      try {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = src.endsWith('.js') || src.endsWith('.jsx') ? 'script' : 
                src.endsWith('.css') ? 'style' : 
                src.endsWith('.woff2') || src.endsWith('.woff') || src.endsWith('.ttf') ? 'font' : 'fetch';
        link.href = src;
        if (link.as === 'font') link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      } catch (err) {
        console.warn(`Failed to preload resource ${src}:`, err);
      }
    });
  } catch (err) {
    console.warn('Failed to preload critical resources:', err);
  }
};

/**
 * Prefetches non-critical resources that might be needed later
 */
export const prefetchResources = () => {
  try {
    if (typeof document === 'undefined') return;
    
    // Use setTimeout instead of requestIdleCallback for better compatibility
    setTimeout(() => {
      RESOURCES_TO_PREFETCH.forEach(src => {
        try {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = src;
          document.head.appendChild(link);
        } catch (err) {
          console.warn(`Failed to prefetch resource ${src}:`, err);
        }
      });
    }, 1000);
  } catch (err) {
    console.warn('Failed to prefetch resources:', err);
  }
};

/**
 * Sets up all resource hints
 */
export const setupAllResourceHints = () => {
  try {
    setupConnectionHints();
    preloadCriticalResources();
    prefetchResources();
  } catch (err) {
    console.warn('Failed to setup resource hints:', err);
    // Continue with application loading even if resource hints fail
  }
};