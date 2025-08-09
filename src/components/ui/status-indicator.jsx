import React, { useState, useEffect } from "react";
import { Check, AlertCircle, Loader2, CloudOff } from "lucide-react";
import { motion } from "framer-motion";

// API endpoint
const API_URL =  import.meta.env.VITE_API_URL || 'http://localhost:5001';
const TIMEOUT_DURATION = 8000; // 8 seconds timeout

export function StatusIndicator() {
  const [status, setStatus] = useState("checking"); // 'checking', 'online', 'offline', 'unknown'
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);

  useEffect(() => {
    checkSystemStatus();

    // Check system status every 60 seconds
    const intervalId = setInterval(checkSystemStatus, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const checkSystemStatus = async (retries = 2) => {
    try {
      setStatus("checking");
      const controller = new AbortController();
      
      // Set a timeout that will abort the fetch request if it takes too long
      const timeoutId = setTimeout(() => {
        controller.abort();
        // Set status to 'unknown' instead of 'offline' on timeout
        setStatus("unknown");
        setLastCheck(new Date().toLocaleTimeString());
        
        // Add retry logic for unknown status (likely cold start)
        if (retries > 0) {
          console.log(`Server may be starting up. Retrying in 5 seconds... (${retries} retries left)`);
          // Retry with exponential backoff
          setTimeout(() => checkSystemStatus(retries - 1), 5000);
        }
      }, TIMEOUT_DURATION);

      const response = await fetch(`${API_URL}/health`, {
        method: "GET",
        signal: controller.signal,
        // Add cache control to prevent cached responses
        cache: 'no-store'
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setStatus("online");
      } else {
        setStatus("offline");
      }
      
      setLastCheck(new Date().toLocaleTimeString());
    } catch (err) {
      // Don't change status to offline on AbortError, keep it as 'unknown'
      if (err.name === 'AbortError') {
        // Already handled in the timeout callback
      } else {
        console.error('Error checking system status:', err);
        setStatus("offline");
        setLastCheck(new Date().toLocaleTimeString());
      }
    }
  };

  // Get the appropriate icon based on status
  const getStatusIcon = () => {
    switch (status) {
      case "online":
        return <Check size={14} />;
      case "offline":
        return <AlertCircle size={14} />;
      case "unknown":
        return <CloudOff size={14} />;
      default:
        return <Loader2 size={14} className="animate-spin" />;
    }
  };

  // Get the color based on status
  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-red-500";
      case "unknown":
        return "bg-blue-500";
      default:
        return "bg-yellow-500";
    }
  };

  // Get the glow color class based on status
  const getGlowColor = () => {
    switch (status) {
      case "online":
        return "shadow-green-500/50";
      case "offline":
        return "shadow-red-500/50";
      case "unknown":
        return "shadow-blue-500/50";
      default:
        return "shadow-yellow-500/50";
    }
  };

  // Get the shadow color for animations
  const getShadowColor = () => {
    switch (status) {
      case "online":
        return "#10B981";
      case "offline":
        return "#EF4444";
      case "unknown":
        return "#3B82F6";
      default:
        return "#F59E0B";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "online":
        return "All systems operational";
      case "offline":
        return "System disruption";
      case "unknown":
        return "Server may be warming up";
      default:
        return "Checking status...";
    }
  };

  return (
    <motion.div
      className="inline-flex items-center gap-2 cursor-pointer"
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
      onClick={checkSystemStatus}
      title={`Last checked: ${lastCheck || 'Not checked yet'}`}
    >
      <div className="flex items-center gap-2">
        <motion.div
          className={`relative w-1.5 h-1.5 rounded-full ${getStatusColor()} shadow-lg`}
          style={{
            boxShadow: `0 0 5px 2px ${getShadowColor()}`,
          }}
          animate={{
            boxShadow: [
              `0 0 5px 2px ${getShadowColor()}`,
              `0 0 10px 4px ${getShadowColor()}`,
              `0 0 5px 2px ${getShadowColor()}`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          {(status === "online" || status === "unknown") && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: getShadowColor() }}
              animate={{
                opacity: [0.7, 0.2, 0.7],
                scale: [1, 1.8, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          )}
        </motion.div>

        <motion.span
          className="text-xs"
          animate={{ opacity: isExpanded ? 1 : 0.7 }}
        >
          {isExpanded ? (
            <span className="flex items-center gap-1">
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </span>
          ) : (
            "System status"
          )}
        </motion.span>
      </div>
    </motion.div>
  );
}
