import React from 'react';

interface TermsWrapperProps {
  children: React.ReactNode;
}

const TermsWrapper: React.FC<TermsWrapperProps> = ({ children }) => {
  return (
    <div className="py-8 px-6">
      <div className="prose prose-purple max-w-none">
        {children}
      </div>
      <div className="mt-12 pt-6 border-t border-gray-100 space-y-4">
        <p className="text-gray-700">
          Pokud máte dotazy k těmto Podmínkám služby, kontaktujte nás na{' '}
          <a href="mailto:podpora@scanpay.cz" className="text-purple-600 font-bold underline hover:text-purple-800">
            podpora@scanpay.cz
          </a>
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <a 
            href="https://www.saltedge.com/legal/privacy_policy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 underline hover:text-purple-800"
          >
            Salt Edge Zásady ochrany osobních údajů
          </a>
          <a 
            href="https://www.saltedge.com/legal/terms_of_service" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 underline hover:text-purple-800"
          >
            Salt Edge Obchodní podmínky
          </a>
        </div>
      </div>
    </div>
  );
};

export default TermsWrapper; 