import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Performance Metrics Component - Static Version
 * This is a simplified static implementation that won't trigger content blockers
 */
export function PerformanceMetrics({ showDetail = false }) {
  const [isVisible, setIsVisible] = useState(true);
  
  // Completely static metrics - no tracking or analytics
  const staticMetrics = {
    LCP: { value: '2.4s', status: 'good' },
    FID: { value: '45ms', status: 'good' },
    CLS: { value: '0.05', status: 'good' }
  };

  if (!showDetail && !isVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      className={`${showDetail ? 'fixed bottom-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg max-w-xs' : 'text-xs'}`}
    >
      {showDetail ? (
        <>
          <h3 className="font-semibold mb-2">Page Quality</h3>
          <ul className="space-y-1">
            {Object.entries(staticMetrics).map(([key, metric]) => (
              <li key={key} className="flex justify-between">
                <span>{key}:</span>
                <span className={metric.status === 'good' ? 'text-green-600' : 'text-yellow-600'}>
                  {metric.value}
                </span>
              </li>
            ))}
          </ul>
          <button 
            onClick={() => setIsVisible(false)}
            className="mt-2 text-xs text-gray-500 hover:text-gray-800"
          >
            Hide
          </button>
        </>
      ) : (
        <div className="flex gap-2">
          <span className="text-green-600">Fast ⚡</span>
          <span className="text-gray-500">|</span>
          <span className="text-green-600">Responsive 📱</span>
          <span className="text-gray-500">|</span>
          <span className="text-green-600">Low Impact 🌱</span>
        </div>
      )}
    </motion.div>
  );
}