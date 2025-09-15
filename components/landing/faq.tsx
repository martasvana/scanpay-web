"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlinePlusCircle, HiOutlineMinusCircle, HiOutlineXMark, HiOutlineEnvelope } from "react-icons/hi2";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

// FAQ data
const faqData = [
  {
    id: 1,
    question: "Co je ScanPay?",
    answer: 'ScanPay je platební metoda pro obchodníky, která generuje dynamické české „QR Platba" kódy s unikátním identifikátorem. Zákazník zaplatí svou bankovní aplikací a peníze putují přímo na váš bankovní účet. ScanPay neuchovává prostředky.',
    category: "Základy"
  },
  {
    id: 2,
    question: "Jak ScanPay funguje v praxi?",
    answer: "Obsluha nebo POS vygeneruje QR kód pro konkrétní platbu → zákazník naskenuje QR v bankovní aplikaci a potvrdí platbu → ScanPay pomocí AISP monitoringu rozpozná přijatou transakci a automaticky ji spáruje s účtenkou.",
    category: "Základy"
  },
  {
    id: 3,
    question: "Nahrazuje ScanPay EET/účtování?",
    answer: "Ne. ScanPay není náhrada EET ani účetního systému. Je to doplňková platební metoda. Povinnosti ohledně EET/účetnictví zůstávají na provozovateli.",
    category: "Základy"
  },
  {
    id: 4,
    question: "Kolik to stojí?",
    answer: "ScanPay nemá transakční poplatek pro obchodníka (0% za transakci). Obchodní model je založen na fixním měsíčním tarifu 200 Kč/provozovna bez transakčních nebo jiných skrytých poplatků.",
    category: "Ceny"
  },
  {
    id: 5,
    question: "Potřebuji platební terminál?",
    answer: "Ne. Stačí zobrazit QR kód v aplikaci. Terminál nepotřebujete.",
    category: "Hardware"
  },
  {
    id: 6,
    question: "Kde se ScanPay nejvíc hodí?",
    answer: "Bary, kavárny, food-stánky, menší restaurace, posilovny, eventy, delivery nebo kdekoliv, kde chcete rychlé platební řešení bez terminálu.",
    category: "Použití"
  },
  {
    id: 7,
    question: "Jak rychle lze nasadit ScanPay?",
    answer: "Rychle - stačí jen registrace a nastavení v aplikaci. Nasazení je typicky od několika hodin do pár dnů dle interních procesů.",
    category: "Implementace"
  },
  {
    id: 8,
    question: "Jak probíhá párování plateb?",
    answer: "Párování probíhá podle unikátního identifikátoru, který je součástí QR. Díky tomu se platby automaticky přiřadí k účtence/objednávce.",
    category: "Technické"
  },
  {
    id: 9,
    question: "Kdo drží peníze a jak probíhá vyrovnání?",
    answer: "Platba jde přímo na bankovní účet obchodníka - ScanPay peníze nevyužívá ani neshromažďuje. Vyrovnání probíhá podle standardních bankovních pravidel (záleží na vaší bance).",
    category: "Finance"
  },
  {
    id: 10,
    question: "Co když zákazník zaplatí špatnou částku nebo bez správného variabilního symbolu?",
    answer: "V takových případech je potřeba manuální odsouhlasení plateb - systém obvykle poskytne informace, jak platbu přiřadit ručně. ScanPay podporuje nástroje pro rychlejší dohledávání a párování.",
    category: "Řešení problémů"
  }
];

// Category colors
const categoryColors: { [key: string]: string } = {
  "Základy": "bg-blue-50 text-blue-700",
  "Ceny": "bg-green-50 text-green-700",
  "Hardware": "bg-purple-50 text-purple-700",
  "Použití": "bg-orange-50 text-orange-700",
  "Implementace": "bg-cyan-50 text-cyan-700",
  "Technické": "bg-gray-50 text-gray-700",
  "Finance": "bg-emerald-50 text-emerald-700",
  "Řešení problémů": "bg-red-50 text-red-700"
};

export const FAQ = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Všechny");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // [FAQ] Function to handle support form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage("");

    try {
      // [FAQ] Check if reCAPTCHA is available
      if (!executeRecaptcha) {
        console.error('[FAQ] executeRecaptcha is not available - check if NEXT_PUBLIC_RECAPTCHA_SITE_KEY is set');
        setErrorMessage("reCAPTCHA není dostupná. Zkontrolujte prosím nastavení a zkuste to později.");
        setSubmitStatus('error');
        return;
      }

      // [FAQ] Execute reCAPTCHA v3 and get token
      console.log('[FAQ] Executing reCAPTCHA...');
      const recaptchaToken = await executeRecaptcha('contact_form');
      
      if (!recaptchaToken) {
        console.error('[FAQ] reCAPTCHA token is empty');
        setErrorMessage("Chyba při ověření reCAPTCHA. Zkuste to prosím znovu.");
        setSubmitStatus('error');
        return;
      }
      
      console.log('[FAQ] reCAPTCHA token obtained, submitting form...');

      // [FAQ] Send request to API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          message: message.trim(),
          recaptchaToken,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // [FAQ] Success state
        setSubmitStatus('success');
        setEmail("");
        setMessage("");
        
        // [FAQ] Close modal after delay
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitStatus('idle');
        }, 2500);
      } else {
        // [FAQ] API error
        setErrorMessage(data.message || "Nastala chyba při odesílání zprávy.");
        setSubmitStatus('error');
      }
      
    } catch (error) {
      // [FAQ] Network or other error
      console.error('[FAQ] Submit error:', error);
      setErrorMessage("Nastala chyba při odesílání zprávy. Zkuste to prosím znovu.");
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // [FAQ] Function to close modal and reset form
  const closeModal = () => {
    setIsModalOpen(false);
    setEmail("");
    setMessage("");
    setSubmitStatus('idle');
    setErrorMessage("");
  };

  // Get unique categories
  const categories = ["Všechny", ...Array.from(new Set(faqData.map(item => item.category)))];

  // Filter FAQ items by category
  const filteredFAQ = selectedCategory === "Všechny" 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  return (
    <div id="faq" className="w-full py-12 overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* Nadpis sekce */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
            Často kladené <span className="bg-gradient-to-r from-purple-500 to-violet-500 text-transparent bg-clip-text">otázky</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Máte otázky? Najděte odpovědi na nejčastější dotazy o ScanPay a jeho fungování.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ Items */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredFAQ.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[item.category]}`}>
                            {item.category}
                          </span>
                          <span className="text-sm text-gray-500">#{item.id}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {item.question}
                        </h3>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        {openItems.includes(item.id) ? (
                          <HiOutlineMinusCircle className="w-6 h-6 text-purple-600" />
                        ) : (
                          <HiOutlinePlusCircle className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openItems.includes(item.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="pt-2 border-t border-gray-100">
                            <p className="text-gray-700 leading-relaxed mt-4">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="bg-transparent rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Nenašli jste odpověď na svou otázku?
            </h3>
            <p className="text-gray-600 mb-6">
              Náš tým je připraven vám pomoci s jakýmkoli dotazem ohledně ScanPay.
            </p>
            <motion.button
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors duration-300"
            >
              Kontaktovat podporu
            </motion.button>
          </div>
        </motion.div>

        {/* [FAQ] Support Contact Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* [FAQ] Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <HiOutlineEnvelope className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Kontaktovat podporu
                    </h3>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
                  >
                    <HiOutlineXMark className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* [FAQ] Modal Content */}
                <div className="p-6">
                  {submitStatus === 'success' ? (
                    // [FAQ] Success Message
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        Zpráva odeslána!
                      </h4>
                      <p className="text-gray-600">
                        Děkujeme za váš dotaz. Ozveme se vám co nejdříve.
                      </p>
                    </motion.div>
                  ) : (
                    // [FAQ] Contact Form
                    <>
                      <p className="text-gray-600 mb-6">
                        Máte dotaz nebo potřebujete pomoc? Napište nám a my se vám ozveme co nejdříve.
                      </p>
                      
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* [FAQ] Email Input */}
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Váš email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            placeholder="vas@email.cz"
                          />
                        </div>

                        {/* [FAQ] Message Input */}
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            Vaše zpráva *
                          </label>
                          <textarea
                            id="message"
                            required
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                            placeholder="Popište váš dotaz nebo problém..."
                          />
                        </div>

                        {/* [FAQ] reCAPTCHA v3 info note */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p className="text-sm text-blue-800 font-medium">
                              Formulář je chráněn pomocí Google reCAPTCHA v3
                            </p>
                          </div>
                        </div>

                        {/* [FAQ] Error Message */}
                        {submitStatus === 'error' && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-red-50 border border-red-200 rounded-xl"
                          >
                            <p className="text-red-700 text-sm">
                              {errorMessage || "Nastala chyba při odesílání zprávy. Zkuste to prosím znovu."}
                            </p>
                          </motion.div>
                        )}

                        {/* [FAQ] Submit Buttons */}
                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                          >
                            Zrušit
                          </button>
                          <motion.button
                            type="submit"
                            disabled={isSubmitting || !email.trim() || !message.trim()}
                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                            className="flex-1 px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Odesílám...
                              </>
                            ) : (
                              'Odeslat zprávu'
                            )}
                          </motion.button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default FAQ;
