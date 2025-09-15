import Link from 'next/link';
import Image from 'next/image';

const PrivacyFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-10 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between mb-16">
          {/* Left column - Logo and email */}
          <div className="flex justify-between items-start md:block mb-8 md:mb-0 md:w-1/4">
            <div className="flex flex-col">
              <Link href="/">
              <div className="flex items-center mb-5">
                <div className="w-12 h-12 relative mr-2">
                  <Image
                    src="/logo/logo.svg"
                    alt="ScanPay.cz Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-semibold text-gray-900">ScanPay.cz</span>
              </div>
              </Link>
              <a 
                href="mailto:podpora@scanpay.cz" 
                className="text-purple-600 hover:text-purple-700 transition-colors text-sm block"
              >
                podpora@scanpay.cz
              </a>
            </div>
            
            {/* X button for mobile only */}
            <div className="md:hidden">
              <a 
                href="https://x.com/ShipItGuy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block border border-gray-300 rounded-md p-2.5 hover:bg-gray-50 transition-colors"
                aria-label="Follow us on X (Twitter)"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="w-5 h-5">
                  <path d="M13.3174 10.7749L19.1457 4H17.7646L12.7854 9.88256L8.80682 4H4L10.0311 13.3524L4 20.4118H5.38119L10.5639 14.2447L14.7255 20.4118H19.5324L13.3171 10.7749H13.3174ZM11.1047 13.4759L10.3996 12.4899L5.97434 5.94932H8.0643L11.5329 11.0538L12.2379 12.0397L16.8247 18.8219H14.7347L11.1047 13.4762V13.4759Z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Center columns - Product, Free Tools, Company */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:w-3/5">
            {/* Product column */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="https://scanpay.cz/#how-it-works" className="text-gray-500 hover:text-purple-600 transition-colors text-sm">
                    How it works
                  </Link>
                </li>
                {/* <li>
                  <Link href="/pricing" className="text-gray-500 hover:text-purple-600 transition-colors text-sm">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-500 hover:text-purple-600 transition-colors text-sm">
                    Blog
                  </Link>
                </li> */}
              </ul>
            </div>

            {/* Free Tools column - kept commented out as in original */}
            <div className="hidden md:block">
              {/* <h3 className="text-base font-medium text-gray-900 mb-4">Free Tools</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/tools/subscription-calculator" className="text-gray-500 hover:text-purple-600 transition-colors text-sm">
                    Subscription Calculator
                  </Link>
                </li>
                <li>
                  <Link href="/tools/budget-planner" className="text-gray-500 hover:text-purple-600 transition-colors text-sm">
                    Budget Planner
                  </Link>
                </li>
              </ul> */}
            </div>

            {/* Company column */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">Company</h3>
              <ul className="space-y-3">
                {/* <li>
                  <Link href="/about" className="text-gray-500 hover:text-purple-600 transition-colors text-sm">
                    Become Affiliate
                  </Link>
                </li> */}
                <li>
                  <Link href="/terms" className="text-gray-500 hover:text-purple-600 transition-colors text-sm">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-gray-500 hover:text-purple-600 transition-colors text-sm">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Right column - X button (desktop only) */}
          <div className="hidden md:flex md:items-start">
            <a 
              href="https://x.com/ShipItGuy" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block border border-gray-300 rounded-md p-2.5 hover:bg-gray-50 transition-colors"
              aria-label="Follow us on X (Twitter)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="w-5 h-5">
                <path d="M13.3174 10.7749L19.1457 4H17.7646L12.7854 9.88256L8.80682 4H4L10.0311 13.3524L4 20.4118H5.38119L10.5639 14.2447L14.7255 20.4118H19.5324L13.3171 10.7749H13.3174ZM11.1047 13.4759L10.3996 12.4899L5.97434 5.94932H8.0643L11.5329 11.0538L12.2379 12.0397L16.8247 18.8219H14.7347L11.1047 13.4762V13.4759Z"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright section */}
        <div className="text-center text-gray-500 text-sm pt-5 border-t border-gray-100">
          © {new Date().getFullYear()} All rights reserved ScanPay.cz
        </div>
      </div>
    </footer>
  );
};

export default PrivacyFooter; 