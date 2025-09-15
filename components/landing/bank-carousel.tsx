"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";

// Define the bank data - all logos are horizontal format
const banks = [
    { id: 1, name: "Air Bank", logo: "/banks/airbank.svg" },
    { id: 2, name: "Česká spořitelna", logo: "/banks/ceska_sporitelna.svg" },
    { id: 3, name: "Creditas", logo: "/banks/creditas.svg" },
    { id: 4, name: "ČSOB", logo: "/banks/csob.svg" },
    { id: 5, name: "Fio banka", logo: "/banks/fio.svg" },
    { id: 6, name: "Komerční banka", logo: "/banks/kb.svg" },
    { id: 7, name: "mBank", logo: "/banks/mbank.svg" },
    { id: 8, name: "MONETA", logo: "/banks/moneta.svg" },
    { id: 9, name: "Raiffeisenbank", logo: "/banks/raiffeisenbank.svg" },
    { id: 10, name: "Revolut", logo: "/banks/revolut.svg" },
    { id: 11, name: "UniCredit Bank", logo: "/banks/unicredit.svg" },
  ];  

export const BankCarousel = () => {
  const [width, setWidth] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);
  const innerCarousel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carousel.current && innerCarousel.current) {
      // Get the width of the visible carousel container
      const containerWidth = carousel.current.offsetWidth;
      
      // Get the width of all items in the carousel
      const scrollWidth = innerCarousel.current.scrollWidth;
      
      // Calculate how many complete sets of items we need to fill the screen width plus extra
      // for smooth looping (at least double the container width)
      setWidth(scrollWidth);
    }
  }, []);

  // Create three sets of the banks array for truly seamless scrolling
  // First set: Visible + being scrolled out
  // Second set: Coming in as first set leaves
  // Third set: Buffer to ensure no empty space
  const tripleBanks = [...banks, ...banks, ...banks];

  return (
    <div id="supported-banks" className="w-full py-12 overflow-hidden">
      <h2 className="text-2xl font-bold text-center mb-8">Kompatibilní se všemi významnými českými bankami</h2>
      
      <div className="relative w-full" ref={carousel}>
        <motion.div
          ref={innerCarousel}
          className="flex items-center"
          initial={{ x: 0 }}
          animate={{ 
            x: [-0, -width / 3], 
          }}
          transition={{ 
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 60, // Very slow animation for subtle effect
              ease: "linear",
            }
          }}
        >
          {tripleBanks.map((bank, index) => (
            <div key={`${bank.id}-${index}`} className="flex flex-col items-center mx-6 min-w-[140px]">
              {/* Container for horizontal bank logos with white background for transparent logos */}
              <div className="bg-white w-32 h-16 rounded-xl overflow-hidden shadow-sm p-3 flex items-center justify-center">
                <Image 
                  src={bank.logo}
                  alt={`${bank.name} logo`}
                  width={120}
                  height={40}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <p className="mt-2 text-sm text-gray-700 text-center">{bank.name}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BankCarousel;
