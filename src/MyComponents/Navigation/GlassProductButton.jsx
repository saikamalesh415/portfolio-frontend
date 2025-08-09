import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

// Glass-style product navigation button that appears in the top-right corner
const GlassProductButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="fixed top-24 right-8 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.3, type: "spring", stiffness: 300 }}
    >
      <Link to="/products">
        <motion.button
          className="flex items-center justify-center p-4 bg-white/20 backdrop-blur-md text-black rounded-full shadow-lg hover:shadow-xl border border-white/30"
          whileHover={{ 
            scale: 1.1, 
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.span 
            className="absolute right-full mr-3 whitespace-nowrap bg-black text-white text-sm py-1 px-3 rounded-lg opacity-0 transition-opacity pointer-events-none"
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            View Products
          </motion.span>
          <ShoppingBag className="h-6 w-6" />
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default GlassProductButton;