"use client";

import Link from 'next/link';
import Image from 'next/image';

/**
 * Main Footer Component for ScanPay.cz
 * 
 * Designed following Apple's Human Interface Guidelines with:
 * - Clean, minimal design with proper hierarchy
 * - Consistent spacing and typography
 * - Smooth hover interactions and transitions
 * - Responsive design that works beautifully on all devices
 * - Purple accent colors matching the ScanPay brand
 * - Modern glass-morphism effect with subtle backdrop blur
 */
const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand section - Left column */}
          <div className="lg:col-span-4">
            <div className="flex flex-col space-y-6">
              {/* Logo and brand */}
              <Link href="/" className="group">
                <div className="flex items-center transition-transform duration-200 group-hover:scale-105">
                  <div className="w-12 h-12 relative mr-3">
                    <Image
                      src="/logo/logo.svg"
                      alt="ScanPay.cz Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-2xl font-semibold text-gray-900">ScanPay.cz</span>
                </div>
              </Link>
              
              {/* Tagline */}
              <p className="text-gray-600 max-w-sm leading-relaxed">
                Bez terminálu, bez starostí. Rychlé a bezpečné platby přímo na váš účet.
              </p>
              
              {/* Contact email */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <a 
                  href="mailto:podpora@scanpay.cz" 
                  className="text-purple-600 hover:text-purple-700 transition-colors font-medium"
                >
                  podpora@scanpay.cz
                </a>
              </div>
            </div>
          </div>

          {/* Navigation columns */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              
              {/* Product column */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Produkt
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href="#jak-to-funguje" 
                      className="text-gray-600 hover:text-purple-600 transition-colors text-sm block py-1"
                    >
                      Jak to funguje
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#proc-vybrat-scanpay" 
                      className="text-gray-600 hover:text-purple-600 transition-colors text-sm block py-1"
                    >
                      Výhody
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#cenik" 
                      className="text-gray-600 hover:text-purple-600 transition-colors text-sm block py-1"
                    >
                      Ceník
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#kalkulacka" 
                      className="text-gray-600 hover:text-purple-600 transition-colors text-sm block py-1"
                    >
                      Kalkulačka úspor
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support column */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Podpora
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href="#faq" 
                      className="text-gray-600 hover:text-purple-600 transition-colors text-sm block py-1"
                    >
                      Časté otázky
                    </Link>
                  </li>
                  <li>
                    <a 
                      href="mailto:podpora@scanpay.cz" 
                      className="text-gray-600 hover:text-purple-600 transition-colors text-sm block py-1"
                    >
                      Kontakt
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal column */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Právní informace
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href="/privacy-policy" 
                      className="text-gray-600 hover:text-purple-600 transition-colors text-sm block py-1"
                    >
                      Ochrana údajů
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/terms" 
                      className="text-gray-600 hover:text-purple-600 transition-colors text-sm block py-1"
                    >
                      Obchodní podmínky
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Download column */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Aplikace
                </h3>
                <div className="space-y-3">
                  {/* App Store buttons */}
                  <div className="flex flex-col space-y-2">
                    <a 
                      href="#stahnout-aplikaci"
                      className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.19 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                      </svg>
                      App Store
                    </a>
                    <a 
                      href="#stahnout-aplikaci"
                      className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                      </svg>
                      Google Play
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with social and copyright */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Social media */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sledujte nás:</span>
              <a 
                href="https://tiktok.com/@scanpay.cz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-purple-100 transition-colors"
                aria-label="Sledujte nás na X (Twitter)"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  aria-hidden="true" 
                  fill="currentColor" 
                  className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com/scanpay.cz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-purple-100 transition-colors"
                aria-label="Sledujte nás na X (Twitter)"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  aria-hidden="true" 
                  fill="currentColor" 
                  className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://x.com/ScanPay.cz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-purple-100 transition-colors"
                aria-label="Sledujte nás na X (Twitter)"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  aria-hidden="true" 
                  fill="currentColor" 
                  className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors"
                >
                  <path d="M13.3174 10.7749L19.1457 4H17.7646L12.7854 9.88256L8.80682 4H4L10.0311 13.3524L4 20.4118H5.38119L10.5639 14.2447L14.7255 20.4118H19.5324L13.3171 10.7749H13.3174ZM11.1047 13.4759L10.3996 12.4899L5.97434 5.94932H8.0643L11.5329 11.0538L12.2379 12.0397L16.8247 18.8219H14.7347L11.1047 13.4762V13.4759Z"></path>
                </svg>
              </a>
                           
            </div>

            {/* Copyright */}
            <div className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} ScanPay.cz. Všechna práva vyhrazena.
            </div>
          </div>
        </div>
      </div>

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent pointer-events-none" />
    </footer>
  );
};

export default Footer;
