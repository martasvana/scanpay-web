import Link from 'next/link';
import Image from 'next/image';
import GridBackground from '@/components/landing/grid-background';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <GridBackground />
      
      <div className="container mx-auto px-4 py-24 flex flex-1 flex-col items-center justify-center z-10">
        <Link href="/" className="flex items-center gap-1 mb-12">
          <Image 
            src="/logo/logo.svg" 
            alt="ScanPay Logo" 
            width={50} 
            height={50} 
          />
          <span className="font-semibold text-black text-lg">ScanPay.cz</span>
        </Link>

        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 text-gray-800">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-700">Page Not Found</h2>
          
          <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-purple-100">
            <p className="text-gray-600 mb-2">The page you're looking for doesn't exist or has been moved.</p>
            <p className="text-gray-600">
              Like an unused subscription, sometimes webpages disappear too.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-violet-500 rounded-full hover:from-purple-600 hover:to-violet-600 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Return Home
            </Link>
            
            <a
              href="mailto:podpora@scanpay.cz"
              className="px-6 py-3 text-sm font-medium text-purple-600 bg-white border-2 border-purple-200 rounded-full hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 