"use client";

import { useState, ReactNode } from 'react';

interface Subscription {
  id: string;
  from: string;
  subject: string;
  date: string;
  snippet: string;
  service: string | null;
  amount: string | null;
  recurringType: string | null;
  renewalDate?: string;
  frequency?: string;
  category?: string;
}

interface SubscriptionCardsProps {
  subscriptions: Subscription[];
}

export default function SubscriptionCards({ subscriptions }: SubscriptionCardsProps) {
  const [sortOrder, setSortOrder] = useState<'date' | 'amount' | 'service'>('date');

  if (!subscriptions.length) {
    return <p className="text-gray-500">No subscription emails found.</p>;
  }

  // Helper function to calculate renewal date if not provided by API
  const calculateRenewalInfo = (subscription: Subscription) => {
    // If we have enriched data with a renewalDate, use it
    if (subscription.renewalDate && subscription.renewalDate !== 'unknown') {
      try {
        // Parse the renewal date
        const renewalDate = new Date(subscription.renewalDate);
        
        // Check if the date is valid
        if (!isNaN(renewalDate.getTime())) {
          const now = new Date();
          const diffTime = Math.abs(renewalDate.getTime() - now.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return {
            daysLeft: diffDays,
            renewalDate: renewalDate.toLocaleDateString('en-US', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })
          };
        }
      } catch (e) {
        console.error("Error parsing renewal date:", e);
        // Fall through to default calculation
      }
    }
    
    // Fall back to original behavior
    const now = new Date();
    let renewalDate = new Date(now);
    renewalDate.setDate(now.getDate() + 30); // Default to 30 days from now
    
    // Try to determine period from frequency or recurringType
    let daysTillRenewal = 30;
    
    if (subscription.frequency) {
      if (subscription.frequency.includes('annual') || subscription.frequency.includes('year')) {
        renewalDate.setDate(now.getDate() + 365);
        daysTillRenewal = 365;
      } else if (subscription.frequency.includes('month')) {
        // Keep the default 30 days
      } else if (subscription.frequency.includes('week')) {
        renewalDate.setDate(now.getDate() + 7);
        daysTillRenewal = 7;
      }
    } else if (subscription.recurringType) {
      if (subscription.recurringType.includes('annual') || subscription.recurringType.includes('yearly')) {
        renewalDate.setDate(now.getDate() + 365);
        daysTillRenewal = 365;
      } else if (subscription.recurringType.includes('month')) {
        // Keep the default 30 days
      } else if (subscription.recurringType.includes('week')) {
        renewalDate.setDate(now.getDate() + 7);
        daysTillRenewal = 7;
      }
    }
    
    return {
      daysLeft: daysTillRenewal,
      renewalDate: renewalDate.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      })
    };
  };

  // Helper function to get icon for a service
  const getServiceIcon = (service: string | null): ReactNode => {
    const defaultIcon = (
      <div className="rounded-full bg-purple-100 flex items-center justify-center w-10 h-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-600">
          <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
          <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
        </svg>
      </div>
    );

    if (!service) return defaultIcon;

    const serviceIcons: Record<string, ReactNode> = {
      netflix: (
        <div className="rounded-full bg-red-100 flex items-center justify-center w-10 h-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-600">
            <path d="M10 2c.552 0 1 .448 1 1v18c0 .552-.448 1-1 1H8c-.552 0-1-.448-1-1V3c0-.552.448-1 1-1h2zm8 0c.552 0 1 .448 1 1v18c0 .552-.448 1-1 1h-2c-.552 0-1-.448-1-1V3c0-.552.448-1 1-1h2z" />
          </svg>
        </div>
      ),
      spotify: (
        <div className="rounded-full bg-green-100 flex items-center justify-center w-10 h-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-600">
            <path d="M19.098 10.638c-3.868-2.297-10.248-2.508-13.941-1.387-.593.18-1.22-.155-1.399-.748-.18-.593.154-1.22.748-1.4 4.239-1.287 11.285-1.038 15.738 1.605.533.317.708 1.005.392 1.538-.316.533-1.005.709-1.538.392zm-.126 3.403c-.272.44-.847.578-1.287.308-3.225-1.982-8.142-2.557-11.958-1.399-.494.15-1.017-.129-1.167-.623-.149-.495.13-1.016.624-1.167 4.358-1.322 9.776-.682 13.48 1.595.44.27.578.847.308 1.286zm-1.469 3.267c-.215.354-.676.465-1.028.249-2.818-1.722-6.365-2.111-10.542-1.157-.402.092-.803-.16-.895-.562-.092-.403.159-.804.562-.896 4.571-1.045 8.492-.595 11.655 1.338.353.215.464.676.248 1.028z" />
          </svg>
        </div>
      ),
      apple: (
        <div className="rounded-full bg-gray-100 flex items-center justify-center w-10 h-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-700">
            <path d="M16.213 13.998C16.151 16.38 18.355 17.13 18.42 17.155c-.045.14-.847 2.9-2.799 5.752-1.689 2.466-3.439 4.928-6.202 4.978-2.714.05-3.585-1.606-6.684-1.606-3.099 0-4.068 1.557-6.632 1.656-2.663.1-4.688-2.67-6.4-5.128C-3.069 18.061-.248 12.133 2.421 8.222c1.32-1.923 3.707-3.147 6.295-3.19 2.629-.044 4.12 1.77 6.265 1.77 2.143 0 3.33-1.77 6.303-1.77 2.683 0 4.404 1.115 5.707 2.78-5.01 2.616-4.199 9.38.737 11.044z" />
            <path d="M13.44 5.11c-1.28 1.575-2.048 3.625-1.728 5.766 1.808.097 3.648-1.307 4.143-3.036.545-1.697-.477-3.355-2.415-2.73z" />
          </svg>
        </div>
      ),
      amazon: (
        <div className="rounded-full bg-yellow-100 flex items-center justify-center w-10 h-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-700">
            <path d="M14.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L16.586 8H5a1 1 0 0 1 0-2h11.586l-2.293-2.293a1 1 0 0 1 0-1.414z" />
            <path d="M18 12a1 1 0 0 1 1 1v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5a1 1 0 1 1 0 2H5v12h12v-5a1 1 0 0 1 1-1z" />
          </svg>
        </div>
      ),
      google: (
        <div className="rounded-full bg-blue-100 flex items-center justify-center w-10 h-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
            <path d="M12.545 12.151L12.542 15.097L16.425 15.097C16.098 16.693 14.93 17.713 13.209 17.713C11.008 17.713 9.25 15.95 9.25 13.717C9.25 11.5 11.02 9.722 13.196 9.722C14.426 9.722 15.341 10.231 15.972 10.843L18.206 8.633C16.985 7.497 15.276 6.772 13.196 6.772C9.345 6.772 6.229 9.916 6.229 13.717C6.229 17.533 9.338 20.662 13.196 20.662C16.822 20.662 20.001 18.044 20.001 13.717C20.001 13.211 19.952 12.729 19.852 12.151H12.545V12.151Z" />
          </svg>
        </div>
      ),
      microsoft: (
        <div className="rounded-full bg-blue-100 flex items-center justify-center w-10 h-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
            <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
          </svg>
        </div>
      ),
      cloudflare: (
        <div className="rounded-full bg-orange-100 flex items-center justify-center w-10 h-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-600">
            <path d="M16.5 6a3 3 0 0 0-3 3v1.5a.75.75 0 0 1-.75.75H9a.75.75 0 0 1 0-1.5h2.25a.75.75 0 0 0 .75-.75V6a4.5 4.5 0 0 1 9 0v3.75c0 .41.34.75.75.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75V6a3 3 0 0 0-4.5 0z" />
            <path d="M9 12A.75.75 0 0 0 9 13.5H5.25a.75.75 0 0 0-.75.75v3a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-3a.75.75 0 0 0-.75-.75H18a.75.75 0 0 0 0 1.5h1.5V17a1.5 1.5 0 0 1-1.5 1.5H7.5A1.5 1.5 0 0 1 6 17v-2a3 3 0 0 1 3-3z" />
          </svg>
        </div>
      ),
      zoho: (
        <div className="rounded-full bg-green-100 flex items-center justify-center w-10 h-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-600">
            <path d="M3 8.688C3 7.201 4.201 6 5.688 6H18.312c1.487 0 2.688 1.201 2.688 2.688v8.625c0 1.487-1.201 2.688-2.688 2.688H5.688C4.201 20 3 18.799 3 17.312v-8.624z" />
            <path d="M6 7.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM18 7.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
          </svg>
        </div>
      ),
      unrenewed: (
        <div className="rounded-full bg-purple-100 flex items-center justify-center w-10 h-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-600">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
          </svg>
        </div>
      ),
    };

    // Normalize service name to lowercase for matching
    const normalizedService = service.toLowerCase();
    
    // Find the matching icon or use default
    for (const [key, icon] of Object.entries(serviceIcons)) {
      if (normalizedService.includes(key)) {
        return icon;
      }
    }
    
    return defaultIcon;
  };

  // Format amount with currency
  const formatAmount = (amount: string | null) => {
    if (!amount) return "";
    
    // Try to detect currency symbol or default to $
    const currencySymbols = ['$', '£', '€', '¥'];
    let currencySymbol = '$';
    
    for (const symbol of currencySymbols) {
      if (amount.includes(symbol)) {
        currencySymbol = symbol;
        break;
      }
    }
    
    // Clean amount string to just numbers
    const cleanAmount = amount.replace(/[^0-9.]/g, '');
    
    if (!cleanAmount) return "";
    
    return `${currencySymbol}${cleanAmount}`;
  };

  // Get frequency text
  const getFrequencyText = (subscription: Subscription) => {
    if (subscription.frequency && subscription.frequency !== 'unknown') {
      return subscription.frequency.charAt(0).toUpperCase() + subscription.frequency.slice(1);
    }
    
    if (subscription.recurringType) {
      if (subscription.recurringType.includes('annual') || subscription.recurringType.includes('year')) {
        return 'Yearly';
      }
      if (subscription.recurringType.includes('month')) {
        return 'Monthly';
      }
      if (subscription.recurringType.includes('week')) {
        return 'Weekly';
      }
      if (subscription.recurringType.includes('subscription') || 
          subscription.recurringType.includes('recurring')) {
        return 'Recurring';
      }
    }
    
    return 'Recurring';
  };

  // Sort subscriptions
  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    if (sortOrder === 'amount') {
      const amountA = parseFloat(a.amount?.replace(/[^0-9.]/g, '') || '0');
      const amountB = parseFloat(b.amount?.replace(/[^0-9.]/g, '') || '0');
      return amountB - amountA; // Sort by amount (highest first)
    } else if (sortOrder === 'service') {
      return (a.service || '').localeCompare(b.service || ''); // Sort by service name
    } else {
      // Default sort by renewal date
      const { daysLeft: daysA } = calculateRenewalInfo(a);
      const { daysLeft: daysB } = calculateRenewalInfo(b);
      return daysA - daysB; // Sort by days left (soonest first)
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-500">
          {subscriptions.length} Active Subscriptions
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setSortOrder('date')}
            className={`px-2 py-1 text-xs rounded-md ${sortOrder === 'date' 
              ? 'bg-purple-100 text-purple-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            By Renewal
          </button>
          <button 
            onClick={() => setSortOrder('amount')}
            className={`px-2 py-1 text-xs rounded-md ${sortOrder === 'amount' 
              ? 'bg-purple-100 text-purple-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            By Cost
          </button>
          <button 
            onClick={() => setSortOrder('service')}
            className={`px-2 py-1 text-xs rounded-md ${sortOrder === 'service' 
              ? 'bg-purple-100 text-purple-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            By Name
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {sortedSubscriptions.map(subscription => {
          const { daysLeft, renewalDate } = calculateRenewalInfo(subscription);
          const formattedAmount = formatAmount(subscription.amount);
          const serviceName = subscription.service || 'Subscription';
          const frequency = getFrequencyText(subscription);
          
          return (
            <div key={subscription.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="p-4 flex items-center">
                <div className="mr-4">
                  {getServiceIcon(subscription.service)}
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg text-gray-900">{serviceName}</h3>
                  <div className="flex flex-wrap gap-x-2 text-sm text-gray-600">
                    <p>Renews in {daysLeft} days • {renewalDate}</p>
                    {subscription.category && subscription.category !== 'unknown' && (
                      <p className="flex items-center">
                        <span className="w-1 h-1 rounded-full bg-gray-400 mx-1 inline-block"></span>
                        {subscription.category.charAt(0).toUpperCase() + subscription.category.slice(1)}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="text-right flex flex-col items-end">
                  {formattedAmount && (
                    <span className="font-bold text-lg text-purple-600">{formattedAmount}</span>
                  )}
                  <span className="text-xs text-gray-500">{frequency}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 