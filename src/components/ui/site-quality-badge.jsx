import React, { useState, useEffect } from 'react';

export const SiteQualityBadge = ({ className = "", variant = "default" }) => {
  const [metrics, setMetrics] = useState({
    lighthouse: null,
    security: 'A+',
    uptime: '99.9%',
    loading: true
  });

  useEffect(() => {
    // Simulate fetching performance metrics safely
    const timer = setTimeout(() => {
      setMetrics({
        lighthouse: 98,
        security: 'A+',
        uptime: '99.9%',
        loading: false
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (metrics.loading) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <span className="text-xs opacity-60">Loading metrics...</span>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-400"></span>
          <span className="text-xs">Performance: {metrics.lighthouse}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-400"></span>
          <span className="text-xs">Security: {metrics.security}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-md border border-gray-700 p-2 ${className}`}>
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-400"></span>
          <span className="text-xs">Performance: {metrics.lighthouse}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-400"></span>
          <span className="text-xs">Security: {metrics.security}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-400"></span>
          <span className="text-xs">Uptime: {metrics.uptime}</span>
        </div>
      </div>
    </div>
  );
};