import WaitlistNavigation from "@/components/landing/waitlist/waitlist-navigation";
import PrivacyFooter from "../privacy-policy/privacy-footer";
import GridBackground from "@/components/landing/grid-background";

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Custom navigation links for the terms page
  const customLinks = [
    {
      text: "Zásady ochrany osobních údajů",
      href: "/privacy-policy",
      isExternal: false
    },
    {
      text: "Podmínky služby",
      href: "/terms",
      isExternal: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <GridBackground />
      <WaitlistNavigation 
        hideWaitlistButton={true}
        trackSubscriptionsLink={{
          text: "Domů",
          href: "/",
          isExternal: false
        }}
        howItWorksLink={{
          text: "Jak to funguje?",
          href: "/#how-it-works",
          isExternal: false
        }}
        customLinks={customLinks}
      />
      <div className="pt-28 pb-8 flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-2xl mb-16">
          {children}
        </div>
      </div>
      <PrivacyFooter />
    </div>
  );
} 