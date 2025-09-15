'use client';

import { useEffect } from 'react';

export default function FaqSchema() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does Unrenewed help me save money on subscriptions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Unrenewed tracks your subscription usage and notifies you before you're charged for services you don't use. Our intelligent tracking shows you which subscriptions are inactive, helping you avoid wasting money on unused services."
          }
        },
        {
          "@type": "Question",
          "name": "What types of subscriptions can I track with Unrenewed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Unrenewed supports tracking for a wide range of digital subscriptions including streaming services (Netflix, Spotify, Disney+), productivity tools (Adobe, Notion), and many more popular subscription-based services."
          }
        },
        {
          "@type": "Question",
          "name": "How do I join the Unrenewed waitlist?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can join our waitlist by entering your email on our homepage. Once you're on the waitlist, you'll be among the first to know when Unrenewed launches and may get early access to our platform."
          }
        },
        {
          "@type": "Question",
          "name": "How much money can I save with Unrenewed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The average person wastes hundreds of dollars annually on unused subscriptions. Unrenewed can help you identify and cancel these forgotten services, potentially saving you $15-50 per month depending on your subscription habits."
          }
        },
        {
          "@type": "Question",
          "name": "Is Unrenewed free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Unrenewed will offer both free and premium plans. Our free plan will include basic subscription tracking and notifications, while premium features will include advanced analytics, automatic cancellation assistance, and more."
          }
        }
      ]
    });
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  
  return null;
} 