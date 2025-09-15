"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const subscriptionServices = [
  "Netflix",
  "Spotify",
  "Cursor",
  "Disney+",
  "ChatGPT",
  "HBO Max",
  "YouTube",
  "Claude",
  "Canva",
  "Lovable",
  "Amazon",
  "Hulu",
];

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    
    const interval = setInterval(() => {
      setCurrentSubscription((prev) => (prev + 1) % subscriptionServices.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-24 mt-14 relative overflow-hidden">
      {/* Floating Spotify Card */}
      {/* <motion.div 
        className={`absolute -rotate-6 top-[20%] left-[14%] bg-white p-3 rounded-lg shadow-lg transition-all duration-1000 ease-out ${
          isLoaded ? "opacity-100" : "opacity-0 -translate-x-16"
        }`}
        style={{ transitionDelay: "200ms" }}
        animate={isLoaded ? {
          y: [0, -10, 0],
          transition: {
            y: {
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
              repeatType: "mirror"
            }
          }
        } : {}}
      >
        <Image src="/subscriptions/spotify-tile.svg" alt="Spotify" width={50} height={50} />
      </motion.div> */}

      {/* Floating YouTube Card */}
      {/* <motion.div 
        className={`absolute rotate-6 bottom-[38%] left-[11%] bg-white p-3 rounded-lg shadow-lg transition-all duration-1000 ease-out ${
          isLoaded ? "opacity-100" : "opacity-0 -translate-x-16 translate-y-8"
        }`}
        style={{ transitionDelay: "400ms" }}
        animate={isLoaded ? {
          y: [0, -12, 0],
          transition: {
            y: {
              repeat: Infinity,
              duration: 3.5,
              ease: "easeInOut",
              repeatType: "mirror",
              delay: 0.3
            }
          }
        } : {}}
      >
        <Image src="/subscriptions/youtube-icon.svg" alt="YouTube" width={50} height={50} />
      </motion.div> */}

      {/* Floating Netflix */}
      {/* <motion.div 
        className={`absolute rotate-6 bottom-[25%] right-[16%] bg-white p-3 rounded-lg shadow-lg transition-all duration-1000 ease-out ${
          isLoaded ? "opacity-100" : "opacity-0 translate-x-16 translate-y-8"
        }`}
        style={{ transitionDelay: "600ms" }}
        animate={isLoaded ? {
          y: [0, -8, 0],
          transition: {
            y: {
              repeat: Infinity,
              duration: 2.8,
              ease: "easeInOut",
              repeatType: "mirror",
              delay: 0.7
            }
          }
        } : {}}
      >
        <Image src="/subscriptions/netflix-icon.svg" alt="Netflix" width={50} height={50} />
      </motion.div> */}

      {/* Additional subscription: Canva */}
      {/* <motion.div 
        className={`absolute -rotate-6 top-[15%] right-[16%] bg-white p-3 rounded-lg shadow-lg transition-all duration-1000 ease-out ${
          isLoaded ? "opacity-100" : "opacity-0 translate-x-16"
        }`}
        style={{ transitionDelay: "300ms" }}
        animate={isLoaded ? {
          y: [0, -12, 0],
          transition: {
            y: {
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
              repeatType: "mirror",
              delay: 0.2
            }
          }
        } : {}}
      >
        <Image src="/subscriptions/canva-icon.svg" alt="Canva" width={50} height={50} />
      </motion.div> */}

      {/* Additional subscription: Lovable */}
      {/* <motion.div 
        className={`absolute rotate-5 top-[38%] right-[8%] bg-white p-3 rounded-lg shadow-lg transition-all duration-1000 ease-out ${
          isLoaded ? "opacity-100" : "opacity-0 translate-x-16"
        }`}
        style={{ transitionDelay: "300ms" }}
        animate={isLoaded ? {
          y: [0, -10, 0],
          transition: {
            y: {
              repeat: Infinity,
              duration: 3.2,
              ease: "easeInOut",
              repeatType: "mirror",
              delay: 1.1
            }
          }
        } : {}}
      >
        <Image src="/subscriptions/lovable-icon.svg" alt="Lovable" width={50} height={50} />
      </motion.div> */}

      {/* Additional subscription: ChatGPT */}
      {/* <motion.div 
        className={`absolute rotate-6 top-[65%] left-[25%] bg-white p-3 rounded-lg shadow-lg transition-all duration-1000 ease-out ${
          isLoaded ? "opacity-100" : "opacity-0 -translate-y-8"
        }`}
        style={{ transitionDelay: "500ms" }}
        animate={isLoaded ? {
          y: [0, -9, 0],
          transition: {
            y: {
              repeat: Infinity,
              duration: 3.7,
              ease: "easeInOut",
              repeatType: "mirror",
              delay: 0.5
            }
          }
        } : {}}
      >
        <Image src="/subscriptions/chatgpt-icon.svg" alt="ChatGPT" width={50} height={50} />
      </motion.div> */}

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-8 text-center">
        <h1 
          className={`text-6xl font-bold mb-6 transition-all duration-700 ease-out ${
            isLoaded ? "opacity-100 transform-none" : "opacity-0 -translate-y-8"
          }`}
        >
          Řekněte sbohem karetním poplatkům. <br />
          <span 
            className={`bg-gradient-to-r from-purple-500 to-violet-500 text-transparent bg-clip-text transition-all duration-1000 ease-out ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >Přijímejte QR platby a ušetřete peníze.</span>
          {/* <span 
            className={`transition-all duration-700 ease-out ${
              isLoaded ? "opacity-100 transform-none" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "600ms" }}
          >peníze.</span> */}
        </h1>
        <p 
          className={`text-xl text-gray-600 max-w-3xl mx-auto mb-10 transition-all duration-1000 ease-out ${
            isLoaded ? "opacity-100 transform-none" : "opacity-0 -translate-y-4"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          Scanpay generuje jedinečné platební QR kódy. Jakmile platba dorazí, ihned se zobrazí v aplikaci pro okamžité potvrzení.
          {/* <span className="relative inline-block w-auto">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentSubscription}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ 
                  duration: 0.5, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
                className="inline-block font-semibold text-purple-600"
              >
                {subscriptionServices[currentSubscription]}
              </motion.span>
            </AnimatePresence>
          </span>{" "}
          subscription? We've got you covered. */}
        </p>

        <div 
          className={`flex items-center justify-center gap-4 mb-8 transition-all duration-1000 ease-out ${
            isLoaded ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <Link 
            href="#kalkulacka" 
            className={`px-6 py-3 text-black bg-white border-purple-400 border-4 rounded-full hover:bg-gray-50 flex items-center transition-transform duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 ${
              isLoaded ? "animate-fade-in" : ""
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Spočítat kolik ušetřím
          </Link>
          <Link
            href="/signin"
            className={`px-6 py-3 text-sm font-medium text-white bg-gradient-to-r border-purple-200 border-4 from-purple-500 to-violet-500 rounded-full hover:from-purple-600 hover:to-violet-600 flex items-center gap-2 transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 ${
              isLoaded ? "animate-fade-in" : ""
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            Stáhnout aplikaci
            {/* Google Play Store Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
            </svg>
            {/* Apple App Store Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.19 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
            </svg>
        </Link>
        </div>

        {/* User Avatars */}
        <div 
          className={`flex flex-col items-center transition-all duration-1000 ease-out ${
            isLoaded ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "900ms" }}
        >
          <div className="flex items-center -space-x-2 mb-2">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
            <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
            <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
          </div>
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  className={`w-5 h-5 text-yellow-400 fill-current transition-all duration-300 ${
                    isLoaded ? "opacity-100 transform-none" : "opacity-0 scale-50"
                  }`}
                  style={{ transitionDelay: `${1000 + i * 100}ms` }}
                >
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              ))}
            </div>
            <span 
              className={`ml-2 text-sm font-medium text-gray-600 transition-all duration-1000 ease-out ${
                isLoaded ? "opacity-100 transform-none" : "opacity-0 translate-x-4"
              }`}
              style={{ transitionDelay: "1500ms" }}
            >
              50,000 Kč ušetřeno na karetních poplatcích tento měsíc
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
