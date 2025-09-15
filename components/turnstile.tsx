"use client";

import { useEffect, useRef } from 'react';
import Script from 'next/script';

// Add Turnstile types to the global Window interface
declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement, 
        options: {
          sitekey: string;
          callback: (token: string) => void;
          theme?: 'light' | 'dark' | 'auto';
          appearance?: 'always' | 'execute' | 'interaction-only';
        }
      ) => string;
      reset: (widgetId: string) => void;
    };
  }
}

interface TurnstileProps {
  onVerify: (token: string) => void;
}

const Turnstile = ({ onVerify }: TurnstileProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (widgetIdRef.current) {
        window.turnstile?.reset(widgetIdRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    if (!containerRef.current || !window.turnstile) return;
    
    // Render the widget when the script is loaded
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string,
      callback: (token: string) => {
        onVerify(token);
      },
      theme: 'light',
      appearance: 'execute',
    });
  };

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        onLoad={handleLoad}
      />
      <div ref={containerRef} className="mt-4 flex justify-center" />
    </>
  );
};

export default Turnstile; 