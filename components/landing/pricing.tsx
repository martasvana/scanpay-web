"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineCheckCircle, HiOutlineInformationCircle } from "react-icons/hi2";

// What's included in the subscription
const includedFeatures = [
  "Neomezený počet QR plateb",
  "Automatické párování transakcí",
  "Real-time notifikace o platbách",
  "Analytika a reporting",
  "Online podpora a dokumentace"
];

export const Pricing = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div id="cenik" className="w-full py-12 overflow-hidden bg-transparent">
      <div className="container mx-auto px-4">
        
        {/* Nadpis sekce */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-purple-500 to-violet-500 text-transparent bg-clip-text">Ceník</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Jednoduché předplatné pro každou provozovnu — žádné transakční poplatky, rychlé nasazení.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex justify-center mb-8"
        >
          <div className="relative inline-flex items-center p-1 bg-white rounded-xl border border-gray-200 shadow-sm">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
                !isAnnual 
                  ? 'bg-purple-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Měsíčně
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
                isAnnual 
                  ? 'bg-purple-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Ročně
            </button>
          </div>
        </motion.div>

        {/* Pricing Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="max-w-md mx-auto"
        >
           <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 relative overflow-hidden">
             
             {/* 0% Badge */}
             <div className="flex justify-end mb-4">
               <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                 0% transakční poplatek
               </div>
             </div>

             {/* Plan Name */}
             <div className="text-center mb-8">
               <h3 className="text-2xl font-bold text-gray-800 mb-2">Standard</h3>
               <p className="text-gray-600">Vše co potřebujete pro QR platby</p>
             </div>

            {/* Price */}
            <div className="text-center mb-8">
              {!isAnnual ? (
                <div>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-gray-800">200</span>
                    <span className="text-xl text-gray-600">Kč</span>
                  </div>
                  <p className="text-gray-600 mt-2">měsíc / provozovna</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-gray-800">2 160</span>
                    <span className="text-xl text-gray-600">Kč</span>
                  </div>
                  <p className="text-gray-600 mt-2">rok / provozovna</p>
                  <p className="text-sm text-green-600 font-medium mt-1">
                    (ekvivalent 180 Kč/měsíc - sleva 10%)
                  </p>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="space-y-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-purple-700 transition-colors duration-300"
              >
                Vyzkoušet na měsíc zdarma
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full border-2 border-purple-600 text-purple-600 py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-purple-50 transition-colors duration-300"
              >
                Kontaktovat podporu
              </motion.button>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-semibold text-gray-700">Co je zahrnuto:</span>
                <HiOutlineInformationCircle className="w-4 h-4 text-gray-400 cursor-help" title="Více informací v FAQ sekci" />
              </div>
              
              {includedFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <HiOutlineCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>

          </div>
        </motion.div>

        {/* Legal Notice */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center mt-8"
        >
          <div className="max-w-2xl mx-auto">
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              <strong>ScanPay NENÍ náhrada EET.</strong> ScanPay nezpracovává ani neuchovává platby — peníze jdou přímo na váš bankovní účet.
            </p>
            <p className="text-xs text-gray-400">
              Měsíčně / ročně — zrušit lze kdykoli. Faktury zasíláme elektronicky.
            </p>
          </div>
        </motion.div>

        {/* FAQ Link */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="text-center mt-8"
        >
          <a 
            href="#faq" 
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors duration-300"
          >
            <HiOutlineInformationCircle className="w-4 h-4" />
            Máte otázky? Podívejte se na FAQ
          </a>
        </motion.div>

      </div>
    </div>
  );
};

export default Pricing;
