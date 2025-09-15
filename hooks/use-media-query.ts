"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if the screen matches a specific media query
 * @param query Media query string (e.g., "(max-width: 768px)")
 * @returns Boolean indicating if the screen matches the query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const media = window.matchMedia(query);
    
    // Initial check
    setMatches(media.matches);
    
    // Create listener
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    
    // Add listener
    media.addEventListener("change", listener);
    
    // Cleanup
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);
  
  return matches;
} 