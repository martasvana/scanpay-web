"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { focusWaitlistInput } from "./waitlist-hero-wrapper";
import { useRouter, usePathname } from "next/navigation";

interface NavigationLink {
  text: string;
  href: string;
  targetId?: string;
  isExternal?: boolean;
}

interface WaitlistNavigationProps {
  trackSubscriptionsLink?: NavigationLink;
  howItWorksLink?: NavigationLink;
  waitlistLink?: NavigationLink;
  hideWaitlistButton?: boolean;
  customLinks?: NavigationLink[];
}

const defaultLinks = {
  trackSubscriptions: {
    text: "Which apps can I track?",
    href: "#track-subscriptions",
    targetId: "track-subscriptions"
  },
  howItWorks: {
    text: "How does it work?",
    href: "#how-it-works",
    targetId: "how-it-works"
  },
  waitlist: {
    text: "Join the waitlist",
    href: "#waitlist-form",
    targetId: "waitlist-form"
  }
};

const WaitlistNavigation = ({
  trackSubscriptionsLink,
  howItWorksLink,
  waitlistLink,
  hideWaitlistButton = false,
  customLinks = []
}: WaitlistNavigationProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Get final links with defaults applied if not provided
  const trackLink = trackSubscriptionsLink || defaultLinks.trackSubscriptions;
  const howLink = howItWorksLink || defaultLinks.howItWorks;
  const ctaLink = waitlistLink || defaultLinks.waitlist;
  
  // Handle navigation and scrolling
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavigationLink) => {
    // Close mobile menu if open
    if (isOpen) setIsOpen(false);
    
    // Skip for external links
    if (link.isExternal) return;
    
    e.preventDefault();
    
    // Check if the link contains a hash and goes to a different page
    if (link.href.includes('#') && link.href.startsWith('/') && !link.href.startsWith(pathname)) {
      // If it's a different page with a hash, navigate to that page
      const [pagePath, hash] = link.href.split('#');
      router.push(pagePath);
      return;
    }

    // If it's a root page with hash like "/#section"
    if (link.href.startsWith('/#') && pathname !== '/') {
      router.push(link.href);
      return;
    }
    
    // For same-page navigation with hash
    if (link.targetId) {
      const element = document.getElementById(link.targetId);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 80,
          behavior: 'smooth'
        });
      }
      return;
    }
    
    // For navigation without hash
    router.push(link.href);
  };

  // Handle join waitlist click
  const handleJoinWaitlistClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavigationLink) => {
    e.preventDefault();
    
    // Close mobile menu if open
    if (isOpen) setIsOpen(false);
    
    // If the link contains a hash and goes to a different page
    if (link.href.includes('#') && link.href.startsWith('/') && !link.href.startsWith(pathname)) {
      // If it's a different page with a hash, navigate to that page
      const [pagePath, hash] = link.href.split('#');
      router.push(pagePath);
      return;
    }

    // If it's a root page with hash like "/#section"
    if (link.href.startsWith('/#') && pathname !== '/') {
      router.push(link.href);
      return;
    }
    
    // For same-page navigation with hash
    if (link.targetId) {
      const element = document.getElementById(link.targetId);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 100,
          behavior: 'smooth'
        });
        
        // Focus the input field after a small delay to allow scrolling to complete
        if (link.targetId === 'waitlist-form') {
          setTimeout(() => {
            focusWaitlistInput();
          }, 500);
        }
      }
      return;
    }
    
    // For navigation without hash
    router.push(link.href);
  };

  // Initialize smooth scrolling behavior
  useEffect(() => {
    // Set scroll behavior for the whole document
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      // Clean up
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  // Render a navigation link
  const renderNavLink = (link: NavigationLink) => {
    if (link.isExternal) {
      return (
        <Link 
          href={link.href}
          className="text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.text}
        </Link>
      );
    }
    
    return (
      <a 
        href={link.href} 
        onClick={(e) => handleLinkClick(e, link)}
        className="text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
      >
        {link.text}
      </a>
    );
  };

  return (
    <div className="w-full flex justify-center pt-4 fixed top-0 left-0 z-50">
      <nav className="w-[85%] py-3 px-5 flex items-center justify-between bg-white rounded-full border border-gray-300">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-0">
            <Image 
              src="/logo/logo.svg" 
              alt="ScanPay Logo" 
              width={50} 
              height={50} 
              className="mr-0"
            />
            <span className="font-semibold text-black text-lg -ml-1">ScanPay.cz</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10">
          {renderNavLink(trackLink)}
          {renderNavLink(howLink)}
          
          {/* Custom links */}
          {customLinks.map((link, index) => (
            <div key={`nav-link-${index}`}>
              {renderNavLink(link)}
            </div>
          ))}
        </div>

        {!hideWaitlistButton && (
          <div className="hidden md:flex items-center space-x-3">
            <a 
              href={ctaLink.href} 
              onClick={(e) => handleJoinWaitlistClick(e, ctaLink)}
              className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-full hover:from-purple-600 hover:to-purple-700 transition-colors flex items-center justify-center shadow-purple-200 border-4 border-purple-200"
            >
              {ctaLink.text}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        )}

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
          "absolute top-16 left-0 right-0 bg-white shadow-md md:hidden transition-all duration-300 ease-in-out z-50",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        )}>
          <div className="flex flex-col p-4 space-y-4">
            <a 
              href={trackLink.href} 
              onClick={(e) => handleLinkClick(e, trackLink)}
              className="text-sm text-gray-600 hover:text-gray-900 py-2"
            >
              {trackLink.text}
            </a>
            <a 
              href={howLink.href} 
              onClick={(e) => handleLinkClick(e, howLink)}
              className="text-sm text-gray-600 hover:text-gray-900 py-2"
            >
              {howLink.text}
            </a>
            
            {/* Custom links */}
            {customLinks.map((link, index) => (
              <div key={`mobile-link-${index}`}>
                {link.isExternal ? (
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 py-2 block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.text}
                  </Link>
                ) : (
                  <a 
                    href={link.href} 
                    onClick={(e) => handleLinkClick(e, link)}
                    className="text-sm text-gray-600 hover:text-gray-900 py-2"
                  >
                    {link.text}
                  </a>
                )}
              </div>
            ))}
            
            {!hideWaitlistButton && (
              <a 
                href={ctaLink.href} 
                onClick={(e) => handleJoinWaitlistClick(e, ctaLink)}
                className="text-sm text-gray-600 hover:text-gray-900 py-2"
              >
                {ctaLink.text}
              </a>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default WaitlistNavigation;
