import React from 'react';

interface PrivacyPolicyWrapperProps {
  children: React.ReactNode;
}

const PrivacyPolicyWrapper: React.FC<PrivacyPolicyWrapperProps> = ({ children }) => {
  return (
    <div className="py-8 px-6 bg-transparent">
      {/* <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500">Created: September 13, 2025</p>
      </div> */}
      <div className="prose prose-purple max-w-none">
        {children}
      </div>
      <div className="mt-12 pt-6 border-t border-gray-100 space-y-4">
        <p className="text-gray-700">
          Pokud máte otázky týkající se těchto Zásad ochrany osobních údajů, kontaktujte nás na{' '}
          <a href="mailto:podpora@scanpay.cz" className="text-purple-600 font-bold underline hover:text-purple-800">
            podpora@scanpay.cz
          </a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyWrapper; 