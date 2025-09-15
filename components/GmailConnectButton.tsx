"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SubscriptionCards from './SubscriptionCards';

// Demo credentials - replace these with your actual values in production
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY; 
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function GmailConnectButton() {
  const [isConnected, setIsConnected] = useState(false);
  const [emails, setEmails] = useState<any[]>([]);
  const [enrichedSubscriptions, setEnrichedSubscriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Google API client libraries
  useEffect(() => {
    // Load the Google API client script
    const loadGapiScript = () => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      script.onload = initGapiClient;
      document.body.appendChild(script);
    };

    // Load the Google Identity Services script
    const loadGisScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGisClient;
      document.body.appendChild(script);
    };

    loadGapiScript();
    loadGisScript();

    // Cleanup
    return () => {
      // Remove scripts if needed
    };
  }, []);

  // Initialize the Google API client
  const initGapiClient = () => {
    if (!window.gapi) {
      setError("Google API not loaded");
      return;
    }

    window.gapi.load('client', async () => {
      try {
        await window.gapi.client.init({
          apiKey: GOOGLE_API_KEY,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
        });
        console.log('GAPI client initialized');
      } catch (error) {
        console.error('Error initializing GAPI client', error);
        setError("Failed to initialize Google API client");
      }
    });
  };

  // Initialize Google Identity Services
  const initGisClient = () => {
    if (!window.google) {
      setError("Google Identity Services not loaded");
      return;
    }
    
    console.log('GIS client loaded');
  };

  // Handle Gmail connection
  const connectGmail = async () => {
    if (!window.gapi || !window.google) {
      alert('Google API not loaded yet. Please try again in a moment.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/gmail.readonly',
        callback: async (response: any) => {
          if (response.error) {
            throw response;
          }
          
          // Keep isLoading true while fetching emails
          await fetchEmails();
          setIsConnected(true);
        },
      });

      if (window.gapi.client.getToken() === null) {
        // Request a new token
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        // Reuse existing token
        tokenClient.requestAccessToken({ prompt: '' });
      }
    } catch (error) {
      console.error('Error connecting to Gmail', error);
      setError("Failed to connect to Gmail. Please try again.");
      setIsLoading(false);
    }
  };

  // Helper function to delay execution (for rate limiting)
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Helper functions for parsing subscription emails
  const parseService = (text: string): string | null => {
    const regex = /(?:from|by)\s+(Netflix|Spotify|Apple|Amazon|Google|Hulu|Dropbox|Notion|YouTube|Adobe)/i;
    const match = text.match(regex);
    return match ? match[1] : null;
  };

  const parseAmount = (text: string): string | null => {
    const regex = /(?:charged|paid|billed|amount)[^\d]{0,10}(?:[$£€])?\s?(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)/i;
    const match = text.match(regex);
    return match ? match[1] : null;
  };

  const parseRecurringType = (text: string): string | null => {
    const regex = /\b(monthly|yearly|annual|recurring|renewal|subscription|auto[-\s]?renew(?:al)?)\b/i;
    const match = text.match(regex);
    return match ? match[1] : null;
  };

  // Check if an email is likely a subscription email
  const isSubscriptionEmail = (subject: string, snippet: string): boolean => {
    const combinedText = subject + ' ' + snippet;
    
    // Keywords commonly found in subscription emails
    const subscriptionKeywords = /\b(subscri(be|ption|bing)|receipt|invoice|payment|renewal|bill|charged|confirm(ation|ed)|receipt|transaction|auto.?renew)\b/i;
    
    // Check for subscription-related words
    if (subscriptionKeywords.test(combinedText)) {
      // Further validate with additional checks
      const hasRecurringType = parseRecurringType(combinedText) !== null;
      const hasAmount = parseAmount(combinedText) !== null;
      const hasService = parseService(combinedText) !== null;
      
      // Return true if at least one additional indicator is found
      return hasRecurringType || hasAmount || hasService;
    }
    
    return false;
  };

  // Fetch email details with retry and backoff
  const fetchEmailDetails = async (msgId: string, retryCount = 0): Promise<any> => {
    try {
      // Add delay between requests to avoid rate limiting
      await delay(retryCount * 500); // Exponential backoff
      
      const msgDetail = await window.gapi.client.gmail.users.messages.get({
        userId: 'me',
        id: msgId,
      });
      
      const headers = msgDetail.result.payload.headers;
      const from = headers.find((h: any) => h.name === 'From')?.value || '(Unknown Sender)';
      const subject = headers.find((h: any) => h.name === 'Subject')?.value || '(No Subject)';
      const date = headers.find((h: any) => h.name === 'Date')?.value || '';
      const snippet = msgDetail.result.snippet || '';
      
      return {
        id: msgId,
        from,
        subject,
        date,
        snippet,
        isSubscription: isSubscriptionEmail(subject, snippet),
        service: parseService(`${subject} ${snippet}`),
        amount: parseAmount(`${subject} ${snippet}`),
        recurringType: parseRecurringType(`${subject} ${snippet}`)
      };
    } catch (error: any) {
      // Handle rate limiting (429 error)
      if (error.status === 429 && retryCount < 5) {
        console.log(`Rate limited, retrying after delay... (attempt ${retryCount + 1})`);
        // Wait longer for each retry attempt
        await delay(Math.pow(2, retryCount) * 1000);
        return fetchEmailDetails(msgId, retryCount + 1);
      }
      
      console.error('Error fetching email details:', error);
      throw error;
    }
  };

  // Enrich subscription data using the AI endpoint
  const enrichSubscriptionData = async (subscriptionEmails: any[]) => {
    if (!subscriptionEmails.length) return;
    
    setIsEnriching(true);
    try {
      const response = await fetch('/api/ai/get-subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails: subscriptionEmails }),
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.subscriptions && Array.isArray(data.subscriptions)) {
        // Combine original email data with enriched data
        const enriched = subscriptionEmails.map(email => {
          const enrichedData = data.subscriptions.find((s: any) => s.id === email.id) || {};
          
          // Ensure proper format for dates if they exist
          if (enrichedData.renewalDate && enrichedData.renewalDate !== 'unknown') {
            try {
              // Validate date format
              const dateObj = new Date(enrichedData.renewalDate);
              if (isNaN(dateObj.getTime())) {
                // If invalid date, remove it
                delete enrichedData.renewalDate;
              }
            } catch (e) {
              // If date causes error, remove it
              delete enrichedData.renewalDate;
            }
          }
          
          // Ensure currency symbol in amount
          if (enrichedData.amount && !enrichedData.amount.match(/[$£€¥]/)) {
            enrichedData.amount = `$${enrichedData.amount}`;
          }
          
          return { 
            ...email,
            ...enrichedData,
            // Keep original fields if they exist and the enriched data doesn't have a value
            service: enrichedData.service || email.service || 'Subscription',
            amount: enrichedData.amount || email.amount || null
          };
        });
        
        console.log('Enriched subscriptions:', enriched);
        setEnrichedSubscriptions(enriched);
      } else {
        console.error('Invalid response format from AI endpoint:', data);
        // Still use the original data even if enrichment failed
        setEnrichedSubscriptions(subscriptionEmails);
      }
    } catch (error) {
      console.error('Error enriching subscription data:', error);
      // Use original data if enrichment fails
      setEnrichedSubscriptions(subscriptionEmails);
    } finally {
      setIsEnriching(false);
    }
  };

  // Fetch emails from Gmail
  const fetchEmails = async () => {
    try {
      const response = await window.gapi.client.gmail.users.messages.list({
        userId: 'me',
        maxResults: 20, // Reduce the number for better reliability
        q: 'subject:(receipt OR invoice OR subscription OR bill OR subscribing OR payment OR renewal OR "renewal notice" OR "renewal confirmation" OR "renewal invoice" OR "renewal receipt" OR "renewal payment" OR "renewal subscription" OR "renewal bill") OR "payment confirmation" OR "your monthly bill"',
      });

      const messages = response.result.messages || [];
      
      // Process emails in smaller batches to avoid rate limiting
      const batchSize = 5;
      const emailDetails = [];
      
      for (let i = 0; i < messages.length; i += batchSize) {
        const batch = messages.slice(i, i + batchSize);
        console.log(`Processing batch ${i/batchSize + 1} of ${Math.ceil(messages.length/batchSize)}`);
        
        // Process a batch with a delay between each
        const batchResults = await Promise.all(
          batch.map(async (msg: any, index: number) => {
            // Add a small delay between each request in the batch
            await delay(index * 300);
            try {
              return await fetchEmailDetails(msg.id);
            } catch (error) {
              console.error(`Error processing message ${msg.id}:`, error);
              return null;
            }
          })
        );
        
        // Add successful results to our email details array
        emailDetails.push(...batchResults.filter(Boolean));
        
        // Add a delay between batches
        if (i + batchSize < messages.length) {
          await delay(1000);
        }
      }

      // Filter to only subscription emails
      const subscriptionEmails = emailDetails.filter(email => email && email.isSubscription);
      
      setEmails(subscriptionEmails);
      
      if (subscriptionEmails.length === 0) {
        setError("No subscription emails found. Try connecting a different Gmail account or check your email history.");
      } else {
        // After getting subscription emails, enrich them with AI
        await enrichSubscriptionData(subscriptionEmails);
      }
    } catch (error: any) {
      console.error('Error fetching emails:', error);
      if (error.status === 429) {
        setError("Rate limit exceeded. Please try again in a few minutes.");
      } else {
        setError("Failed to fetch emails. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Loading animation component
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin mb-4"></div>
      <p className="text-purple-700 font-medium">
        {isEnriching ? 'Analyzing your subscriptions...' : 'Scanning your inbox for subscriptions...'}
      </p>
      <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
    </div>
  );

  if (isConnected) {
    // Show the subscriptions view when connected
    return (
      <div className="w-full">
        {isLoading || isEnriching ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-8 mb-8 text-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Your Subscriptions</h2>
            {error && (
              <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            <SubscriptionCards subscriptions={enrichedSubscriptions.length > 0 ? enrichedSubscriptions : emails} />
          </div>
        )}
      </div>
    );
  }

  // Show the connect button when not connected
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-8 mb-8 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-4 -mr-4">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="60" fill="url(#paint0_linear)" fillOpacity="0.1"/>
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9333EA"/>
              <stop offset="1" stopColor="#4F46E5"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
          <img src="/assets/gmail.svg" alt="Gmail" width="28" height="28" className="text-purple-600" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Connect your Gmail account</h2>
      <p className="text-gray-600 mb-8 max-w-lg mx-auto">
        To start tracking your subscriptions, we need access to your Gmail account. Don't worry - we only look for subscription emails and never read your personal messages.
      </p>
      
      {error && (
        <div className="text-red-500 mb-4 p-2 bg-red-50 rounded-md">
          Error: {error}
        </div>
      )}
      
      <Button
        onClick={connectGmail}
        disabled={isLoading}
        className="px-10 py-6 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-full hover:from-purple-600 hover:to-purple-700 transition-colors flex items-center justify-center shadow-lg shadow-purple-200/50 border-4 border-purple-200 mx-auto cursor-pointer"
      >
        {isLoading ? 'Connecting...' : 'Connect Gmail Account'}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2">
          <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
        </svg>
      </Button>
      
      <div className="mt-6 flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span className="text-sm text-gray-500">Your data is always secure and private</span>
      </div>
    </div>
  );
}

// Declare global types for the Google API
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
} 