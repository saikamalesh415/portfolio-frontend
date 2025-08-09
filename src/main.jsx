import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { reportWebVitals } from './lib/utils.js';
import './index.css';

// Import the App component using static import
import App from './App.jsx';

// Create a simple loading fallback for Suspense
const LoadingFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
  </div>
);

// Safely handle font preloading
const preloadFonts = () => {
  try {
    if (typeof window === 'undefined' || !document) return;
    
    const fontPreloadLinks = [
      { href: '/src/fonts/Gilroy-Regular.ttf', type: 'font/ttf' },
      { href: '/src/fonts/Gilroy-Medium.ttf', type: 'font/ttf' },
      { href: '/src/fonts/Gilroy-Bold.ttf', type: 'font/ttf' }
    ];

    fontPreloadLinks.forEach(({ href, type }) => {
      try {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.href = href;
        link.type = type;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      } catch (err) {
        console.warn(`Failed to preload font ${href}:`, err);
      }
    });
  } catch (err) {
    console.warn('Error preloading fonts:', err);
  }
};

// Safely preload fonts after page load to prevent blocking
if (typeof window !== 'undefined') {
  window.addEventListener('load', preloadFonts);
}

// Wrap render in try/catch for better error handling
try {
  // More reliable way to grab the root element with error handling
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Failed to find the root element');
  } else {
    // Create root with better error boundary
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <Suspense fallback={<LoadingFallback />}>
          <App />
        </Suspense>
      </StrictMode>,
    );
  }
} catch (error) {
  console.error('Error rendering React application:', error);
  // Add fallback for critical rendering errors
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Something went wrong</h2>
        <p>The application couldn't load properly. Please try refreshing the page.</p>
        <button onclick="window.location.reload()" style="padding: 8px 16px; background: #4a4a4a; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
  }
}

// Report performance metrics
try {
  reportWebVitals(console.log);
} catch (err) {
  console.warn('Error reporting web vitals:', err);
}

// Modified service worker registration with error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Small timeout to prevent immediate fetch that might trigger blockers
    setTimeout(() => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          // Log but don't throw error to prevent app from breaking
          console.log('SW registration failed, but app will continue:', error);
        });
    }, 2000);
  });
}
