"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";

// Define types of subscription alerts
interface SubscriptionAlert {
  id: number;
  service: string;
  logo: string;
  type: "inactive" | "price-increase" | "new-plan";
  message: string;
  cta: string;
  days: number;
  color: string;
  savedAmount?: number;
  timestamp?: string;
}

const subscriptionAlerts: SubscriptionAlert[] = [
  {
    id: 1,
    service: "Netflix",
    logo: "/apps/netflix.svg",
    type: "inactive",
    message: "You haven't used Netflix in 34 days",
    cta: "Save $15.99/month",
    days: 34,
    color: "bg-red-50 border-red-200",
    savedAmount: 15.99,
    timestamp: "2d"
  },
  {
    id: 2,
    service: "Spotify",
    logo: "/apps/spotify.svg",
    type: "inactive",
    message: "Last used 48 days ago",
    cta: "Save $9.99/month",
    days: 48,
    color: "bg-green-50 border-green-200",
    savedAmount: 9.99,
    timestamp: "6d"
  },
  {
    id: 3,
    service: "Disney+",
    logo: "/apps/disney.svg",
    type: "price-increase",
    message: "Price increases next month",
    cta: "Review plan options",
    days: 22,
    color: "bg-blue-50 border-blue-200",
    savedAmount: 7.99,
    timestamp: "now"
  },
  {
    id: 4,
    service: "HBO",
    logo: "/apps/hbo.png",
    type: "inactive",
    message: "Not used in 63 days",
    cta: "Save $14.99/month",
    days: 63,
    color: "bg-purple-50 border-purple-200",
    savedAmount: 14.99,
    timestamp: "4d"
  },
  {
    id: 5,
    service: "YouTube Premium",
    logo: "/apps/youtube.svg",
    type: "new-plan",
    message: "Cheaper plan available",
    cta: "Save $5/month",
    days: 15,
    color: "bg-red-50 border-red-200",
    savedAmount: 5,
    timestamp: "now"
  },
  {
    id: 6,
    service: "Adobe",
    logo: "/apps/adobe.svg",
    type: "inactive",
    message: "Last used 87 days ago",
    cta: "Save $52.99/month",
    days: 87,
    color: "bg-rose-50 border-rose-200",
    savedAmount: 52.99,
    timestamp: "8d"
  },
  {
    id: 8,
    service: "Netflix",
    logo: "/apps/netflix.svg",
    type: "inactive",
    message: "Daily Average: 5h 36min",
    cta: "Your startup won't grow by binge watching all day",
    days: 2,
    color: "bg-red-50 border-red-200",
    savedAmount: 15.99,
    timestamp: "2d"
  },
];

// Savings Calculator Component
const SavingsCalculator = ({ isLoaded }: { isLoaded: boolean }) => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [revenue, setRevenue] = useState<number>(100000);
  const [cardFeePercent, setCardFeePercent] = useState<number>(1.8);
  
  // Calculate annual values
  const annualRevenue = isAnnual ? revenue : revenue * 12;
  const monthlyRevenue = isAnnual ? revenue / 12 : revenue;
  
  // Calculate costs
  const annualCardFees = annualRevenue * (cardFeePercent / 100);
  const monthlyCardFees = annualCardFees / 12;
  const scanPayAnnualCost = 200 * 12; // 200 Kč/month
  
  // Calculate savings for different periods
  const calculateSavings = (years: number) => {
    const totalCardCosts = annualCardFees * years;
    const totalScanPayCosts = scanPayAnnualCost * years;
    return totalCardCosts - totalScanPayCosts;
  };
  
  const savings1Year = calculateSavings(1);
  const savings5Years = calculateSavings(5);
  const savings10Years = calculateSavings(10);
  
  // Format currency in Czech format
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      {/* Calculator Input Section */}
      <div className="bg-gradient-to-br from-purple-50 to-white rounded-3xl p-6 sm:p-8 mb-8 border border-purple-100 shadow-lg">
        <div className="mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center">
            Kalkulačka úspor ScanPay
          </h3>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Zjistěte, kolik ušetříte nahrazením klasických terminálů za QR platby ScanPay
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Controls */}
          <div className="space-y-6">
            {/* Period Toggle */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                Období pro zadání tržeb
              </label>
              <div className="relative inline-flex items-center p-1 bg-gray-100 rounded-xl">
                <button
                  onClick={() => {
                    if (isAnnual) {
                      // Converting from annual to monthly
                      setRevenue(revenue / 12);
                    }
                    setIsAnnual(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    !isAnnual 
                      ? 'bg-white text-purple-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Měsíčně
                </button>
                <button
                  onClick={() => {
                    if (!isAnnual) {
                      // Converting from monthly to annual
                      setRevenue(revenue * 12);
                    }
                    setIsAnnual(true);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isAnnual 
                      ? 'bg-white text-purple-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Ročně
                </button>
              </div>
            </div>
            
            {/* Revenue Input */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                {isAnnual ? 'Roční tržby' : 'Měsíční tržby'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-xl text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">
                  Kč
                </span>
              </div>
            </div>
            
            {/* Card Fee Input */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                Poplatek za platbu kartou (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={cardFeePercent}
                  onChange={(e) => setCardFeePercent(Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-xl text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="1.8"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">
                  %
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Typicky 1.5-2.5% podle banky a typu karty
              </p>
            </div>
          </div>
          
          {/* Current Costs Display */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Současné náklady</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Měsíční tržby:</span>
                <span className="font-semibold">{formatCurrency(monthlyRevenue)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Roční tržby:</span>
                <span className="font-semibold">{formatCurrency(annualRevenue)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Měsíční karetní poplatky:</span>
                <span className="font-semibold text-red-600">{formatCurrency(monthlyCardFees)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Roční karetní poplatky:</span>
                <span className="font-semibold text-red-600">{formatCurrency(annualCardFees)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comparison Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 1 Year */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-center mb-6">
            <h4 className="text-xl font-bold text-gray-800 mb-2">1 rok</h4>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-violet-500 rounded mx-auto"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-600">Terminály:</span>
              <span className="font-bold text-red-600">{formatCurrency(annualCardFees)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-600">ScanPay:</span>
              <span className="font-bold text-green-600">{formatCurrency(scanPayAnnualCost)}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="text-center">
                <span className="text-sm text-gray-600">Úspora:</span>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(Math.max(0, savings1Year))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* 5 Years */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-center mb-6">
            <h4 className="text-xl font-bold text-gray-800 mb-2">5 let</h4>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-violet-500 rounded mx-auto"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-600">Terminály:</span>
              <span className="font-bold text-red-600">{formatCurrency(annualCardFees * 5)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-600">ScanPay:</span>
              <span className="font-bold text-green-600">{formatCurrency(scanPayAnnualCost * 5)}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="text-center">
                <span className="text-sm text-gray-600">Úspora:</span>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(Math.max(0, savings5Years))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* 10 Years */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-center mb-6">
            <h4 className="text-xl font-bold text-gray-800 mb-2">10 let</h4>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-violet-500 rounded mx-auto"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-600">Terminály:</span>
              <span className="font-bold text-red-600">{formatCurrency(annualCardFees * 10)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-600">ScanPay:</span>
              <span className="font-bold text-green-600">{formatCurrency(scanPayAnnualCost * 10)}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="text-center">
                <span className="text-sm text-gray-600">Úspora:</span>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(Math.max(0, savings10Years))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const WaitlistGetNotified = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleAlerts, setVisibleAlerts] = useState<(SubscriptionAlert & { uniqueId: string })[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedTotal, setSavedTotal] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const alertsContainerRef = useRef<HTMLDivElement>(null);
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  
  // Limit visible alerts based on screen size
  const maxVisibleAlerts = isSmallScreen ? 2 : 3;

  // Initialize component and start animations
  useEffect(() => {
    setIsLoaded(true);
    
    // Add initial alerts after a delay
    const loadDelay = setTimeout(() => {
      addAlert(0);
      setTimeout(() => addAlert(1), 800);
    }, 600);
    
    return () => clearTimeout(loadDelay);
  }, []);
  
  // Add a new alert every few seconds
  useEffect(() => {
    if (!isLoaded) return;
    
    const interval = setInterval(() => {
      if (currentIndex < subscriptionAlerts.length) {
        addAlert(currentIndex);
        setCurrentIndex(prev => (prev + 1) % subscriptionAlerts.length);
      }
    }, 3500);
    
    return () => clearInterval(interval);
  }, [isLoaded, currentIndex]);

  // Function to add an alert
  const addAlert = (index: number) => {
    if (!alertsContainerRef.current) return;
    
    const alert = {
      ...subscriptionAlerts[index],
      uniqueId: `${subscriptionAlerts[index].id}-${Date.now()}`
    };
    
    // Limit to visible alerts in the column
    setVisibleAlerts(prev => {
      const newAlerts = [...prev, alert];
      if (newAlerts.length > maxVisibleAlerts) {
        return newAlerts.slice(-maxVisibleAlerts);
      }
      return newAlerts;
    });
    
    // Update total saved amount
    if (alert.savedAmount) {
      setSavedTotal(prev => prev + alert.savedAmount!);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    } 
  };

  return (
    <div id="kalkulacka" className="w-full py-12 sm:py-16 md:py-24 relative overflow-hidden bg-transparent">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
            Spočítejte si, kolik pomocí ScanPay <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-purple-500 to-violet-500 text-transparent bg-clip-text">
              ušetříte oproti karetním poplatkům!
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            ScanPay sráží karetní poplatky na 0% díky QR platbám a platíte tak pouze malý měsíční poplatek za aplikaci, který pokryje náš provoz.
          </p>
        </motion.div>

        {/* Savings Calculator */}
        <SavingsCalculator isLoaded={isLoaded} />
      </div>
    </div>
  );
};

export default WaitlistGetNotified;
