"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  HiOutlineCurrencyDollar, 
  HiOutlineComputerDesktop, 
  HiOutlineClock, 
  HiOutlineBuildingOffice, 
  HiOutlineLink,
  HiOutlineInformationCircle,
  HiOutlineCheckCircle,
  HiOutlineCurrencyEuro
} from "react-icons/hi2";

// Porovnávací data
const comparisonData = [
  {
    category: "Poplatek pro obchodníka",
    icon: <HiOutlineCurrencyEuro className="w-5 h-5" />,
    scanpay: "0% (provozovatel neplatí transakční poplatek)",
    qerko: "poplatek + transakční sazba — viz jejich ceník (např. 2,90 Kč + ~1.35%)",
    terminal: "typicky procento + případná fixní částka; běžně v ČR v rozmezí ~0,6-3% + možné měsíční poplatky",
    teya: "model založený na plánech (měsíční členství + transakční sazby — plány mají různé sazby)"
  },
  {
    category: "Potřebný hardware",
    icon: <HiOutlineComputerDesktop className="w-5 h-5" />,
    scanpay: "jen zobrazení QR v mobilní aplikaci - žádný terminál",
    qerko: "funguje přes QR (potřebujete QR-kódy u stolů + případnou POS integraci)",
    terminal: "fyzický terminál nebo mobilní terminál (pořizovací náklady cca 10,000 Kč)",
    teya: "card machines / tap-on-phone / různé hardware možnosti (pronájem od 250 Kč/měsíc)"
  },
  {
    category: "Rychlost nasazení / onboarding",
    icon: <HiOutlineClock className="w-5 h-5" />,
    scanpay: "rychlé, bez hardware — registrace a nasazení do provozu během hodin až dnů",
    qerko: "standardní onboarding, balíčky a možnost osobní instalace (poplatky za balíček/počáteční nastavení)",
    terminal: "může vyžadovat smlouvy s bankou/provider, doručení terminálu (dny–týdny)",
    teya: "online registrace na plány, dodání zařízení podle zvoleného balíčku"
  },
  {
    category: "Kde se hodí nejvíc (use-case)",
    icon: <HiOutlineBuildingOffice className="w-5 h-5" />,
    scanpay: "bary, kavárny, stánky, posilovny, eventy - tam, kde chcete rychlý bezplatný způsob platby bez terminálu",
    qerko: "restaurace a provozy, které chtějí split-bill, rezervace a digitální menu",
    terminal: "obchody s vyšším obratem, kde jsou karty primární platební metodou",
    teya: "malé a střední podniky, které chtějí kombinaci terminálu + účetních funkcí v balíčku"
  },
  {
    category: "Párování plateb / integrace",
    icon: <HiOutlineLink className="w-5 h-5" />,
    scanpay: "párování pomocí unikátního identifikátoru (automatické párování přes AISP monitoring)",
    qerko: "podporuje POS-QR a párování plateb (dokumentace POS QR)",
    terminal: "settlement přes acquirer; refundy a spory se řeší přes banku/provider",
    teya: "nabízí API / integrace v závislosti na plánu (viz jejich docs)"
  }
];

// Benefits pro ScanPay
const benefits = [
  "0% transakční poplatek pro obchodníka",
  "Žádný terminál - stačí QR v aplikaci",
  "Automatické instantní párování plateb",
  "Nízké provozní náklady, rychlé nasazení",
  "Peníze dorazí na váš účet během několika sekund",
  "Jednoduše přístupná analytika a historie transakcí"
];

// FAQ data
const faqData = [
  {
    question: "Je ScanPay náhradou EET?",
    answer: "Ne — ScanPay NENÍ náhrada EET; je to platební metoda. Účetnictví a EET řeší provozovatel standardně dál."
  }
];

export const WhyChooseScanPay = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div id="proc-vybrat-scanpay" className="w-full py-12 overflow-hidden bg-transparent">
      <div className="container mx-auto px-4">
        
        {/* Nadpis sekce */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
            Proč vybrat <span className="bg-gradient-to-r from-purple-500 to-violet-500 text-transparent bg-clip-text">ScanPay</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto">
            Rychlá a bezproblémová QR platba pro kavárny, bary a malé provozy — bez potřeby platebního terminálu a <strong>s 0% poplatkem za transakci</strong> pro obchodníka.
          </p>
        </motion.div>

        {/* Desktop - Porovnávací tabulka */}
        <div className="hidden lg:block mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-6 font-semibold text-gray-700 w-1/5">Kritérium</th>
                  <th className="text-center p-6 font-bold text-purple-600 w-1/5 bg-purple-50">
                    <div className="flex items-center justify-center gap-2">
                      ScanPay
                      <div className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                        NEJLEVNĚJŠÍ
                      </div>
                    </div>
                  </th>
                  <th className="text-center p-6 font-semibold text-gray-700 w-1/5">Qerko</th>
                  <th className="text-center p-6 font-semibold text-gray-700 w-1/5">Platební terminál</th>
                  <th className="text-center p-6 font-semibold text-gray-700 w-1/5">Teya</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-6 font-medium text-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="text-purple-600">{row.icon}</div>
                        {row.category}
                      </div>
                    </td>
                    <td className="p-6 text-center bg-purple-25 font-semibold text-purple-800">
                      {row.scanpay.includes("0%") ? (
                        <div className="flex items-center justify-center gap-2">
                          <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-bold text-green-600">0%</span>
                        </div>
                      ) : (
                        <span className="text-sm">{row.scanpay}</span>
                      )}
                    </td>
                    <td className="p-6 text-center text-sm text-gray-600">{row.qerko}</td>
                    <td className="p-6 text-center text-sm text-gray-600">{row.terminal}</td>
                    <td className="p-6 text-center text-sm text-gray-600">{row.teya}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>

        {/* Mobile - Karty */}
        <div className="lg:hidden mb-12">
          <div className="flex overflow-x-auto gap-4 pb-4 mb-6">
            {["ScanPay", "Qerko", "Platební terminál", "Teya"].map((provider, index) => (
              <button
                key={provider}
                onClick={() => setActiveTab(index)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === index 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {provider}
              </button>
            ))}
          </div>
          
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-xl font-bold text-center mb-6 text-purple-600">
              {["ScanPay", "Qerko", "Platební terminál", "Teya"][activeTab]}
              {activeTab === 0 && (
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                  NEJLEVNĚJŠÍ
                </span>
              )}
            </h3>
            
            <div className="space-y-4">
              {comparisonData.map((row, index) => {
                const values = [row.scanpay, row.qerko, row.terminal, row.teya];
                return (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-purple-600">{row.icon}</div>
                      <h4 className="font-semibold text-gray-800">{row.category}</h4>
                    </div>
                    <p className="text-sm text-gray-600 ml-7">{values[activeTab]}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Benefits */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Klíčové výhody ScanPay
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : -20 }}
                transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-200"
              >
                <HiOutlineCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-purple-500 to-violet-500 rounded-3xl p-8 md:p-12 text-white shadow-xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Připraveni začít s 0% poplatky?
            </h3>
            <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
              Přidejte se k podnikatelům, kteří ušetřili tisíce korun díky ScanPay
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Vyzkoušet ScanPay zdarma
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 flex items-center gap-3"
              >
                Stáhnout mobilní aplikaci ScanPay
                {/* Google Play Store Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                {/* Apple App Store Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.19 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                </svg>
              </motion.button>
            </div>
            
            <p className="text-sm text-purple-200 mt-6">
              Žádné skryté poplatky, žádné závazky. Začněte během 24 hodin.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default WhyChooseScanPay;
