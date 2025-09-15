"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

interface RecaptchaProviderProps {
  children: React.ReactNode;
}

export function RecaptchaProvider({ children }: RecaptchaProviderProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  
  // [RecaptchaProvider] Debug logging for missing site key
  if (!siteKey) {
    console.warn('[RecaptchaProvider] NEXT_PUBLIC_RECAPTCHA_SITE_KEY is missing! reCAPTCHA will not work.');
    console.warn('[RecaptchaProvider] Please add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to your .env.local file');
  }

  // [RecaptchaProvider] Don't render provider if no site key
  if (!siteKey) {
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
