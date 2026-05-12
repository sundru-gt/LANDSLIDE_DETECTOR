import { useEffect } from 'react';

/**
 * Handles the morphing header pill state based on page scroll depth.
 * @param {number} threshold
 */
export function useScrollState(threshold = 40) {
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > threshold;
      const bar = document.querySelector(".bar");
      if (bar) bar.classList.toggle("scrolled", isScrolled);
      document.body.classList.toggle("sc", isScrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);
}

