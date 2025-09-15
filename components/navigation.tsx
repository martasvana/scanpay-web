"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "../lib/utils";

// Smooth scroll function with navigation offset
const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    const navHeight = 100; // Account for navigation height + some padding
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - navHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full flex justify-center pt-4 fixed top-0 left-0 z-50">
      <nav className="w-[85%] py-3 px-5 flex items-center justify-between bg-white rounded-full border border-gray-300">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo/logo.svg" 
              alt="ScanPay Logo" 
              width={32} 
              height={32} 
              className="mr-2"
            />
            <span className="font-semibold text-black text-lg">ScanPay.cz</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10">
          <button 
            onClick={() => smoothScrollTo('kalkulacka')} 
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            Kolik ušetřím?
          </button>
          <button 
            onClick={() => smoothScrollTo('jak-to-funguje')} 
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            Jak to funguje?
          </button>
          <button 
            onClick={() => smoothScrollTo('proc-vybrat-scanpay')} 
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            Proč vybrat ScanPay?
          </button>
          <button 
            onClick={() => smoothScrollTo('cenik')} 
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            Ceník
          </button>
          <button 
            onClick={() => smoothScrollTo('faq')} 
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            Časté otázky
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-3">
          <Link 
            href="#stahnout-aplikaci"
            className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50"
          >
            {/* Google Play Store Icon */}
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
            </svg>
            {/* Apple App Store Icon */}
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.19 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
            </svg>
            Stáhnout aplikaci
          </Link>
          <Link 
            href="/signup" 
            className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-full hover:from-purple-600 hover:to-purple-700 transition-colors flex items-center justify-center shadow-purple-200 border-4 border-purple-200"
          >
            Začněte šetřit
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="w-6 h-6"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>

        {/* Mobile Navigation */}
        <div className={cn(
          "absolute top-16 left-0 right-0 bg-white shadow-md md:hidden transition-all duration-300 ease-in-out z-50 rounded-lg mx-2",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        )}>
          <div className="flex flex-col p-4 space-y-4">
            <button 
              onClick={() => { smoothScrollTo('kalkulacka'); setIsOpen(false); }} 
              className="text-sm text-gray-600 hover:text-gray-900 py-2 text-left transition-colors duration-200"
            >
              Kolik ušetřím?
            </button>
            <button 
              onClick={() => { smoothScrollTo('jak-to-funguje'); setIsOpen(false); }} 
              className="text-sm text-gray-600 hover:text-gray-900 py-2 text-left transition-colors duration-200"
            >
              Jak to funguje?
            </button>
            <button 
              onClick={() => { smoothScrollTo('proc-vybrat-scanpay'); setIsOpen(false); }} 
              className="text-sm text-gray-600 hover:text-gray-900 py-2 text-left transition-colors duration-200"
            >
              Proč vybrat ScanPay?
            </button>
            <button 
              onClick={() => { smoothScrollTo('cenik'); setIsOpen(false); }} 
              className="text-sm text-gray-600 hover:text-gray-900 py-2 text-left transition-colors duration-200"
            >
              Ceník
            </button>
            <button 
              onClick={() => { smoothScrollTo('faq'); setIsOpen(false); }} 
              className="text-sm text-gray-600 hover:text-gray-900 py-2 text-left transition-colors duration-200"
            >
              Časté otázky
            </button>
            {/* Mobile Action Buttons */}
            <div className="pt-2 space-y-3 border-t border-gray-200">
              <Link 
                href="#stahnout-aplikaci"
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                {/* Google Play Store Icon */}
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                {/* Apple App Store Icon */}
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.19 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                </svg>
                Stáhnout aplikaci
              </Link>
              <Link 
                href="/signup" 
                className="flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-full hover:from-purple-600 hover:to-purple-700 transition-colors shadow-purple-200 border-4 border-purple-200"
                onClick={() => setIsOpen(false)}
              >
                Začněte šetřit
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
