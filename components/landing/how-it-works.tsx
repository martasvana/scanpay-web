"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineDevicePhoneMobile, HiOutlineBuildingLibrary, HiOutlineQrCode, HiOutlineBell } from "react-icons/hi2";

// Definice kroků
const steps = [
  {
    id: 1,
    title: "Stáhněte aplikaci",
    description: "Stáhněte si ScanPay aplikaci z App Store nebo Google Play a vytvořte si účet během 2 minut.",
    icon: <HiOutlineDevicePhoneMobile className="w-8 h-8 text-purple-600" />
  },
  {
    id: 2,
    title: "Propojte bankovní účet",
    description: "Bezpečně spojte svůj bankovní účet pomocí zabezpečeného API podle EU standardů.",
    icon: <HiOutlineBuildingLibrary className="w-8 h-8 text-purple-600" />
  },
  {
    id: 3,
    title: "Vygenerujte QR kód",
    description: "Vytvořte si personalizovaný QR kód pro příjem plateb, který můžete tisknout nebo zobrazit.",
    icon: <HiOutlineQrCode className="w-8 h-8 text-purple-600" />
  },
  {
    id: 4,
    title: "Dostávejte notifikace",
    description: "Buďte informováni o každé platbě v reálném čase. Peníze dorazí během několika sekund.",
    icon: <HiOutlineBell className="w-8 h-8 text-purple-600" />
  }
];

export const HowItWorks = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div id="jak-to-funguje" className="w-full py-12 overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* Nadpis sekce */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
            Jak to <span className="bg-gradient-to-r from-purple-500 to-violet-500 text-transparent bg-clip-text">funguje?</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Začněte přijímat platby během několika minut. Proces je jednoduchý, rychlý a bezpečný.
          </p>
        </motion.div>

        {/* Kroky */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.2 + (index * 0.1) }}
              className="text-center"
            >
              
              {/* Ikona */}
              <div className="w-16 h-16 bg-white rounded-xl shadow-sm p-4 flex items-center justify-center mx-auto mb-4">
                {step.icon}
              </div>
              
              {/* Číslo kroku */}
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">
                {step.id}
              </div>
              
              {/* Obsah */}
              <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
              
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default HowItWorks;
