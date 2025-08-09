import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../lib/themeContext";

export const FlowingGradient = ({ 
  className = "", 
  intensity = "medium", 
  colorScheme = "default", 
  blur = "medium",
}) => {
  const { isDarkMode } = useTheme();
  
  const speedMap = {
    low: 40,
    medium: 25,
    high: 12
  };
  
  const blurMap = {
    none: "blur-none",
    low: "blur-lg",
    medium: "blur-2xl",
    high: "blur-3xl"
  };
  
  const colorSchemes = {
    default: {
      light: ["#6366f1", "#8b5cf6", "#ec4899", "#10b981"],
      dark: ["#818cf8", "#a78bfa", "#f472b6", "#34d399"]
    },
    blue: {
      light: ["#60a5fa", "#3b82f6", "#1e40af", "#0ea5e9"],
      dark: ["#93c5fd", "#60a5fa", "#3b82f6", "#38bdf8"]
    },
    purple: {
      light: ["#8b5cf6", "#a855f7", "#7e22ce", "#d946ef"],
      dark: ["#a78bfa", "#c084fc", "#9333ea", "#e879f9"]
    }
  };

  const colors = colorSchemes[colorScheme]?.[isDarkMode ? 'dark' : 'light'] || colorSchemes.default[isDarkMode ? 'dark' : 'light'];
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
      className={`fixed inset-0 overflow-hidden ${className} transition-colors duration-300`}
    >
      <div 
        className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-900/40 to-gray-900/60' 
            : 'bg-gradient-to-br from-white/40 to-white/60'
        } opacity-80`} 
      />
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
