import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Reports performance metrics using native browser Performance API
 * @param {Function} onPerfEntry - Optional callback function to report metrics
 */
export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function && typeof window !== 'undefined' && window.performance) {
    // Wait for LCP, FID, CLS to be available
    setTimeout(() => {
      const entries = {};
      
      // Get navigation timing metrics
      const navigationEntry = window.performance.getEntriesByType('navigation')[0];
      if (navigationEntry) {
        // Time to First Byte (TTFB)
        entries.TTFB = {
          name: 'TTFB',
          value: navigationEntry.responseStart
        };
        
        // First Contentful Paint from PerformancePaintTiming
        const paintEntries = window.performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          entries.FCP = {
            name: 'FCP',
            value: fcpEntry.startTime
          };
        }
      }
      
      // Report collected metrics
      Object.values(entries).forEach(metric => {
        onPerfEntry(metric);
      });
      
      // Set up PerformanceObserver for other metrics
      if ('PerformanceObserver' in window) {
        // LCP - Largest Contentful Paint
        try {
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
              onPerfEntry({
                name: 'LCP',
                value: lastEntry.startTime
              });
            }
          }).observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
          console.warn('LCP measurement not supported', e);
        }
        
        // FID - First Input Delay
        try {
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const firstInput = entries[0];
            if (firstInput) {
              onPerfEntry({
                name: 'FID',
                value: firstInput.processingStart - firstInput.startTime
              });
            }
          }).observe({ type: 'first-input', buffered: true });
        } catch (e) {
          console.warn('FID measurement not supported', e);
        }
        
        // CLS - Cumulative Layout Shift
        try {
          let clsValue = 0;
          new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
            onPerfEntry({
              name: 'CLS',
              value: clsValue
            });
          }).observe({ type: 'layout-shift', buffered: true });
        } catch (e) {
          console.warn('CLS measurement not supported', e);
        }
      }
    }, 3000); // Wait 3s to collect initial metrics
  }
};

/**
 * Formats Web Vitals metrics for display
 * @param {Object} metric - Web Vitals metric object
 * @returns {Object} Formatted metric object
 */
export const formatWebVitalMetric = (metric) => {
  const name = metric.name;
  const value = Math.round(name === 'CLS' ? metric.value * 1000 : metric.value);
  
  const ratings = {
    LCP: [2500, 4000], // Good: 0-2.5s, Needs Improvement: 2.5-4s, Poor: >4s
    FID: [100, 300],   // Good: 0-100ms, Needs Improvement: 100-300ms, Poor: >300ms
    CLS: [0.1, 0.25],  // Good: 0-0.1, Needs Improvement: 0.1-0.25, Poor: >0.25
    TTFB: [800, 1800], // Good: 0-800ms, Needs Improvement: 800-1800ms, Poor: >1800ms
    FCP: [1800, 3000], // Good: 0-1.8s, Needs Improvement: 1.8-3s, Poor: >3s
  };
  
  const [good, needsImprovement] = ratings[name] || [];
  
  let rating = 'good';
  if (good && metric.value > good) rating = 'needs-improvement';
  if (needsImprovement && metric.value > needsImprovement) rating = 'poor';
  
  return {
    name,
    value: name === 'CLS' ? value.toFixed(2) : `${value}ms`,
    rating,
  };
};
