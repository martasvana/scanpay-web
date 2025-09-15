// import Navigation from "@/components/navigation";
import GridBackground from "@/components/landing/grid-background";
// import Hero from "@/components/landing/hero";
import { AppCarousel } from "@/components/landing/app-carousel";
import WaitlistHeroWrapper from "@/components/landing/waitlist/waitlist-hero-wrapper";
import WaitlistNavigation from "@/components/landing/waitlist/waitlist-navigation";
// import NotificationPopups from "@/components/landing/notification-popups";
import WaitlistGetNotified from "@/components/landing/waitlist/calculator";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import FaqSchema from "@/components/seo/FaqSchema";
import { Metadata } from "next";
import Navigation from "@/components/navigation";
import Hero from "@/components/landing/hero";
import BankCarousel from "@/components/landing/bank-carousel";
import HowItWorks from "@/components/landing/how-it-works";
import WhyChooseScanPay from "@/components/landing/why-choose-scanpay";
import Pricing from "@/components/landing/pricing";
import FAQ from "@/components/landing/faq";
import Footer from "@/components/footer";

export default function Home() {

  const metadata: Metadata = {
    title: 'ScanPay.cz',
    description: 'Never get charged for an unused subscription again.',
    icons: {
      icon: '/favicon.ico',
    },
    openGraph: {
      title: "ScanPay.cz | Never get charged for an unused subscription again.",
      description:
        "Never get charged for an unused subscription again.",
      type: "website",
      url: "https://scanpay.cz",
      images: [
        {
          url: "https://scanpay.cz/seo/og-image.png",
          width: 1200,
          height: 630,
          alt: "ScanPay.cz | Never get charged for an unused subscription again.",
        },
      ],
      locale: "en_US",
      siteName: "ScanPay.cz",
    },
    twitter: {
      card: "summary_large_image",
      title: "ScanPay.cz | Never get charged for an unused subscription again.",
      description:
        "Never get charged for an unused subscription again.",
      images: [
        "https://scanpay.cz/seo/og-image.png",
      ],
    }
  };
  
  return (
    <>
      <GridBackground />
      {/* <WaitlistNavigation /> */}
      <Navigation />
      {/* <WaitlistHeroWrapper /> */}
      <Hero />
      <BankCarousel />
      <WaitlistGetNotified />
      <HowItWorks />
      <WhyChooseScanPay />
      <Pricing />
      <FAQ />
      <Footer />
      {/* <NotificationPopups /> */}
      <JsonLd />
      <Breadcrumbs />
      <FaqSchema />
    </>
  );
}
