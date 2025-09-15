"use client";

import { useState, useEffect } from "react";

export function DevNotice() {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    // Only show in development and if reCAPTCHA is not configured
    const isDev = process.env.NODE_ENV === 'development';
    const hasRecaptcha = !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    
    if (isDev && !hasRecaptcha) {
      setShowNotice(true);
    }
  }, []);

  if (!showNotice) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-lg max-w-sm z-50">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700 font-medium">
            reCAPTCHA not configured
          </p>
          <p className="text-xs text-yellow-600 mt-1">
            Add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to .env.local to enable contact form
          </p>
          <button
            onClick={() => setShowNotice(false)}
            className="text-xs text-yellow-600 hover:text-yellow-700 underline mt-1"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
