import React, { useEffect, useState } from 'react';
import Footer from '../MyComponents/Footer/Footer';
import Loader from '../MyComponents/loader/Loader';
import { AnimatedShapesBackground } from '../components/ui/animated-shapes-background';
import { FlowingGradient } from '../components/ui/flowing-gradient';
import { GridAnimation } from '../components/ui/grid-animation';
import { motion } from 'framer-motion';
import { fetchAllProducts } from '../lib/api/gumroad';
import { Link } from 'react-router-dom';

// Floating Go Back Home Button Component
const FloatingHomeButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="fixed top-8 left-8 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.3, type: "spring", stiffness: 300 }}
    >
      <Link to="/">
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
            className="absolute left-full ml-3 whitespace-nowrap bg-black text-white text-sm py-1 px-3 rounded-lg opacity-0 transition-opacity pointer-events-none"
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            Back to Home
          </motion.span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
            />
          </svg>
        </motion.button>
      </Link>
    </motion.div>
  );
};

// Product Card Component for regular products (2nd and onwards)
const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format price properly
  let formattedPrice;
  if (product.price === 0) {
    formattedPrice = product.price_options && product.price_options.includes('pwyw') ? '$0+' : 'Free';
  } else {
    formattedPrice = product.formatted_price || `${product.currency_symbol || '$'}${(product.price / 100).toFixed(2)}`;
  }
  
  // Extract features from tags if available
  const features = product.tags || [];
  
  return (
    <motion.div 
      className="relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-md h-full group"
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Product image with improved aspect ratio and shadow */}
      <div className="relative overflow-hidden h-56 sm:h-64 md:h-72 w-full">
        <motion.div 
          className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
          animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {product.preview_url ? (
            <img 
              src={product.preview_url} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : product.thumbnail_url ? (
            <img 
              src={product.thumbnail_url} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-sm text-gray-600">Product Preview</h4>
              </div>
            </div>
          )}
        </motion.div>
        
        <div className="absolute bottom-5 left-5">
          <motion.span 
            className="px-4 py-2 bg-black text-white rounded-full text-xs font-semibold shadow-lg inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {formattedPrice}
          </motion.span>
        </div>
        
        {/* Overlay gradient on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300"
          animate={isHovered ? { opacity: 0.4 } : { opacity: 0 }}
        />
      </div>
      
      {/* Product content with improved spacing for different screen sizes */}
      <div className="flex flex-col p-6 sm:p-7 md:p-8 flex-grow">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 group-hover:text-black transition-colors duration-200">{product.name}</h3>
        <div className="text-gray-600 mb-5 sm:mb-6 text-sm sm:text-base flex-grow line-clamp-3 prose prose-sm">
          {product.description ? (
            <div dangerouslySetInnerHTML={{ __html: product.description
              .replace(/<\/?p>/g, '') // Remove p tags
              .replace(/<\/?strong>/g, '') // Remove strong tags
              .replace(/<\/?br>/g, ' ') // Replace br tags with space
              .replace(/<\/?ul>/g, '') // Remove ul tags
              .replace(/<\/?li>/g, '') // Remove li tags
              .substring(0, 150) + (product.description.length > 150 ? '...' : '')
            }} />
          ) : (
            <p>No description available</p>
          )}
        </div>
        
        {/* Features list with improved display on small screens */}
        {features.length > 0 && (
          <div className="mb-6 sm:mb-7">
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {features.map((feature, index) => (
                <span key={index} className="text-xs sm:text-sm px-3 py-1.5 bg-gray-100 rounded-full text-gray-800 transition-colors duration-200 group-hover:bg-gray-200">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* View on Gumroad button with enhanced hover effect */}
        <a
          href={product.short_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center py-3 sm:py-3.5 px-5 sm:px-6 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
        >
          <span className="text-sm sm:text-base">View on Gumroad</span>
          <svg 
            className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </motion.div>
  );
};

// Featured Product Card Component (horizontal layout for the first product)
const FeaturedProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format price properly
  let formattedPrice;
  if (product.price === 0) {
    formattedPrice = product.price_options && product.price_options.includes('pwyw') ? '$0+' : 'Free';
  } else {
    formattedPrice = product.formatted_price || `${product.currency_symbol || '$'}${(product.price / 100).toFixed(2)}`;
  }
  
  // Extract features from tags if available
  const features = product.tags || [];
  
  return (
    <motion.div 
      className="mb-16 px-4 sm:px-0"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="relative flex flex-col md:flex-row overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-lg group"
        whileHover={{ 
          y: -5, 
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        }}
        whileTap={{ scale: 0.99 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product image with responsive height */}
        <div className="relative overflow-hidden w-full md:w-1/2">
          <motion.div 
            className="w-full h-72 sm:h-80 md:h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {product.preview_url ? (
              <img 
                src={product.preview_url} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : product.thumbnail_url ? (
              <img 
                src={product.thumbnail_url} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg text-gray-600">Digital Product</h4>
                </div>
              </div>
            )}
          </motion.div>
          
          <div className="absolute bottom-6 left-6 z-10">
            <motion.span 
              className="px-4 py-2 bg-black text-white rounded-full text-sm font-semibold shadow-lg inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {formattedPrice}
            </motion.span>
          </div>
          
          {/* Overlay gradient on hover */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 md:bg-gradient-to-t"
            animate={isHovered ? { opacity: 0.4 } : { opacity: 0 }}
          />
        </div>
        
        {/* Product content with improved spacing */}
        <div className="flex flex-col p-7 sm:p-8 md:p-10 flex-grow">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 group-hover:text-black transition-colors duration-200">{product.name}</h3>
          <div className="text-gray-600 mb-6 sm:mb-7 text-base sm:text-lg flex-grow prose prose-lg max-w-none">
            {product.description ? (
              <div dangerouslySetInnerHTML={{ __html: product.description
                .replace(/<\/?p>/g, '') // Remove p tags
                .replace(/<\/?strong>/g, '') // Remove strong tags
                .replace(/<\/?br>/g, ' ') // Replace br tags with space
                .replace(/<\/?ul>/g, '') // Remove ul tags
                .replace(/<\/?li>/g, '') // Remove li tags
                .substring(0, 200) + (product.description.length > 200 ? '...' : '')
              }} />
            ) : (
              <p>No description available</p>
            )}
          </div>
          
          {/* Features list with responsive design and enhanced hover */}
          {features.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {features.map((feature, index) => (
                  <span key={index} className="text-sm px-3 py-1.5 bg-gray-100 rounded-full text-gray-800 transition-colors duration-200 group-hover:bg-gray-200">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* View on Gumroad button with enhanced hover effect */}
          <a 
            href={product.short_url}
            target="_blank" 
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center py-3 sm:py-4 px-6 sm:px-7 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition-all duration-300 max-w-xs shadow-md hover:shadow-lg hover:scale-105"
          >
            <span className="text-base sm:text-lg">View on Gumroad</span>
            <svg 
              className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Products() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check if window is defined (for SSR)
    if (typeof window !== "undefined") {
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await fetchAllProducts();
        
        // Filter only published products
        const publishedProducts = productsData.filter(p => p.published);
        
        setProducts(publishedProducts);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Floating Go Back Home Button */}
      <FloatingHomeButton />
      
      {/* Global animated backgrounds with improved visibility - same as home page */}
      <div className="fixed inset-0 z-[-3]" style={{ pointerEvents: "none" }}>
        {/* Primary background with flowing gradients */}
        <FlowingGradient
          colorScheme="blue"
          intensity="high"
          blur="medium"
          className="opacity-50"
        />
      </div>

      {/* Global animated shapes background that will appear throughout the page */}
      <div className="fixed inset-0 z-[-2]" style={{ pointerEvents: "none" }}>
        <AnimatedShapesBackground
          variant="mixed"
          intensity="high"
          baseColor="#6366f1"
          accentColor="#8b5cf6"
          tertiaryColor="#10b981"
          className="opacity-40"
        />
      </div>

      {/* Additional background grid for texture */}
      <div className="fixed inset-0 z-[-1]" style={{ pointerEvents: "none" }}>
        <GridAnimation
          variant="wave"
          cellSize={50}
          opacity={0.07}
          color="#000000"
          animationSpeed={15}
          className="opacity-80"
        />
      </div>
      
      <main>
        <div className="relative">
          {/* Header section with consistent styling */}
          <div className="relative py-20 mb-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h1 
                className="text-4xl md:text-6xl font-bold text-center mb-6 text-gray-900"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Digital Products
              </motion.h1>
              <motion.p 
                className="text-center text-gray-600 max-w-3xl mx-auto text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Explore my premium digital products and resources to enhance your projects.
                Each product is crafted with care and attention to detail.
              </motion.p>
            </div>
          </div>
          
          {/* Products section */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24 md:pb-28">
            {error ? (
              <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl border border-red-200 mb-16 px-6">
                <h3 className="text-2xl font-medium text-red-600 mb-3">Error Loading Products</h3>
                <p className="text-gray-700 text-lg mb-6">{error}</p>
                <p className="text-gray-500">Please try again later or contact support if the issue persists.</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white/30 backdrop-blur-sm rounded-3xl border border-white/20 mb-16 px-6">
                <h3 className="text-2xl font-medium text-gray-700 mb-3">No products available yet</h3>
                <p className="text-gray-500 text-lg">Check back soon for exciting digital products!</p>
              </div>
            ) : (
              <>
                {/* Featured product (first product) - horizontal layout */}
                <FeaturedProductCard product={products[0]} />
                
                {/* Rest of products - grid layout with improved responsiveness */}
                {products.length > 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                    {products.slice(1).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </>
            )}
            
            {/* Contact section with consistent styling */}
            <motion.div 
              className="mt-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Need a Custom Solution?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                If you're looking for custom development or have questions about any of the products,
                feel free to get in touch.
              </p>
              <Link 
                to="/#contact" 
                className="inline-flex items-center py-3 px-6 bg-black text-white rounded-full hover:bg-gray-900 transition-colors duration-300"
              >
                Contact Me
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
