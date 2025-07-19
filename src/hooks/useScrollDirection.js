import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY;
      
      // Update scroll direction
      setIsScrollingUp(currentScrollY < lastScrollY);
      
      // Update scroll progress
      setScrollProgress(prev => {
        // When scrolling down
        if (currentScrollY > lastScrollY) {
          return Math.min(100, prev + Math.abs(scrollDiff));
        }
        // When scrolling up
        return Math.max(0, prev - Math.abs(scrollDiff));
      });
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return { isScrollingUp, scrollProgress };
} 