import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export const FlowingGradient = ({ 
  className = "", 
  intensity = "medium", // options: low, medium, high  
  colorScheme = "default", // options: default, blue, purple, sunset, neon
  blur = "medium", // options: none, low, medium, high
}) => {
  const containerRef = useRef(null);
  
  // Adjust animation speed and blur based on intensity
  const speedMap = {
    low: 40, // Reduced from 50 for faster animation
    medium: 25, // Reduced from 30 for faster animation
    high: 12  // Reduced from 15 for faster animation
  };
  
  const blurMap = {
    none: "blur-none",
    low: "blur-lg",
    medium: "blur-2xl",
    high: "blur-3xl"
  };
  
  // Color schemes with enhanced vibrancy
  const colorSchemes = {
    default: ["#6366f1", "#8b5cf6", "#ec4899", "#10b981"],
    blue: ["#60a5fa", "#3b82f6", "#1e40af", "#0ea5e9"],
    purple: ["#8b5cf6", "#a855f7", "#7e22ce", "#d946ef"]
  };

  const colors = colorSchemes[colorScheme] || colorSchemes.default;
  const speed = speedMap[intensity] || speedMap.medium;
  const blurClass = blurMap[blur] || blurMap.medium;

  const generateOrbs = () => {
    return colors.map((color, index) => ({
      color,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      size: Math.random() * 30 + 20,
      duration: Math.random() * speed + speed
    }));
  };

  const orbs = generateOrbs();

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      ref={containerRef}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/60 opacity-80" />
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full ${blurClass}`}
          style={{
            backgroundColor: orb.color,
            width: orb.size + 'vh',
            height: orb.size + 'vh',
          }}
          initial={{
            x: `${orb.initialX}%`,
            y: `${orb.initialY}%`,
          }}
          animate={{
            x: ['0%', '100%', '50%', '0%'],
            y: ['0%', '50%', '100%', '0%'],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default FlowingGradient;
