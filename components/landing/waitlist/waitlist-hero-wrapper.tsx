"use client";

import { useRef, useEffect } from 'react';
import WaitlistHero, { WaitlistHeroRef } from './waitlist-hero';

// Global variable to store the focus function
let globalFocusFunction: (() => void) | null = null;

// Function to set the focus function
export function setWaitlistFocusFunction(fn: () => void) {
  globalFocusFunction = fn;
}

// Function to trigger the focus from anywhere
export function focusWaitlistInput() {
  if (globalFocusFunction) {
    globalFocusFunction();
  }
}

export default function WaitlistHeroWrapper() {
  const heroRef = useRef<WaitlistHeroRef>(null);
  
  useEffect(() => {
    // Register the focus function globally
    setWaitlistFocusFunction(() => {
      if (heroRef.current) {
        heroRef.current.focusEmailInput();
      }
    });
    
    // Cleanup
    return () => {
      globalFocusFunction = null;
    };
  }, []);
  
  return <WaitlistHero ref={heroRef} />;
} 