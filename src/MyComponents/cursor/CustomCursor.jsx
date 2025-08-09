import React, { useRef, useEffect } from 'react';
import './cursor.css';

const CustomCursor = () => {
  // Use refs instead of state for better performance with frequent updates
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isClickedRef = useRef(false);
  const isOverFooterRef = useRef(false);
  const requestRef = useRef(null);
  const previousTimeRef = useRef(null);
  
  // Cursor position with some smoothing variables
  const cursorPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Cache DOM references
    const dotElement = dotRef.current;
    const ringElement = ringRef.current;
    
    if (!dotElement || !ringElement) return;
    
    // Track mouse position
    const updateMousePosition = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };
    
    // More efficient check for interactive elements using event delegation
    const checkIfInteractive = (e) => {
      const target = e.target;
      
      // Check if cursor is over footer
      const isOverFooter = target.closest('footer') !== null;
      
      // Update footer state if changed
      if (isOverFooter !== isOverFooterRef.current) {
        isOverFooterRef.current = isOverFooter;
        if (isOverFooter) {
          dotElement.classList.add('cursor-over-footer');
          ringElement.classList.add('cursor-over-footer');
        } else {
          dotElement.classList.remove('cursor-over-footer');
          ringElement.classList.remove('cursor-over-footer');
        }
      }
      
      // Check for interactive elements
      const isInteractive = target.matches('a, button, [role="button"], .cursor-pointer') || 
                            target.closest('a, button, [role="button"], .cursor-pointer');
      
      if (isInteractive) {
        if (!isHoveredRef.current) {
          isHoveredRef.current = true;
          dotElement.classList.add('cursor-dot--hover');
          ringElement.classList.add('cursor-ring--hover');
        }
      } else if (isHoveredRef.current) {
        isHoveredRef.current = false;
        dotElement.classList.remove('cursor-dot--hover');
        ringElement.classList.remove('cursor-ring--hover');
      }
    };
    
    // Mouse click handlers
    const handleMouseDown = () => {
      isClickedRef.current = true;
      dotElement.classList.add('cursor-dot--clicked');
      ringElement.classList.add('cursor-ring--clicked');
    };
    
    const handleMouseUp = () => {
      isClickedRef.current = false;
      dotElement.classList.remove('cursor-dot--clicked');
      ringElement.classList.remove('cursor-ring--clicked');
    };
    
    // Hide/show cursor when leaving/entering page
    const handleMouseLeave = () => {
      dotElement.style.opacity = '0';
      ringElement.style.opacity = '0';
    };
    
    const handleMouseEnter = () => {
      dotElement.style.opacity = '1';
      ringElement.style.opacity = '1';
    };

    // Animation loop with RAF for butter-smooth animations
    const animateCursor = (time) => {
      if (previousTimeRef.current !== undefined) {
        // Smoothing factor (lower = smoother but more lag)
        const smoothing = 0.15; 
        
        // Calculate smooth movement with linear interpolation
        cursorPos.current.x += (targetPos.current.x - cursorPos.current.x) * smoothing;
        cursorPos.current.y += (targetPos.current.y - cursorPos.current.y) * smoothing;
        
        // Apply position - much faster than using React state
        dotElement.style.transform = `translate3d(${cursorPos.current.x - 4}px, ${cursorPos.current.y - 4}px, 0)`;
        ringElement.style.transform = `translate3d(${cursorPos.current.x - 16}px, ${cursorPos.current.y - 16}px, 0)`;
      }
      
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animateCursor);
    };

    // Start animation loop
    requestRef.current = requestAnimationFrame(animateCursor);

    // Add passive flag for better touch performance
    document.addEventListener('mousemove', updateMousePosition, { passive: true });
    document.addEventListener('mousemove', checkIfInteractive, { passive: true });
    document.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Cleanup event listeners
    return () => {
      cancelAnimationFrame(requestRef.current);
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mousemove', checkIfInteractive);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Main dot cursor */}
      <div ref={dotRef} className="cursor-dot" />
      
      {/* Outer ring cursor */}
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
};

export default CustomCursor;