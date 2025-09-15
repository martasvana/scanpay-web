"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Turnstile from "@/components/turnstile";
import { Toaster, toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-media-query";

// Create a ref type for external access
export interface WaitlistHeroRef {
  focusEmailInput: () => void;
}

// Email validation regex (RFC 5322 compliant)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const subscriptionServices = [
  "Netflix",
  "Spotify",
  "Cursor",
  "Disney+",
  "ChatGPT",
  "HBO Max",
  "YouTube",
  "Claude",
  "Canva",
  "Lovable",
  "Amazon",
  "Hulu",
];

// Helper function to sanitize user input
function sanitizeInput(value: string): string {
  if (!value) return '';
  
  return String(value)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim();
}

// Helper function to validate email format
function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

const WaitlistHero = forwardRef<WaitlistHeroRef, {}>((props, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(0);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error" | "already-on-waitlist">(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const isMediumScreen = useMediaQuery("(min-width: 769px) and (max-width: 1280px)");

  // Expose the focus function to parent components
  useImperativeHandle(ref, () => ({
    focusEmailInput: () => {
      emailInputRef.current?.focus();
      
      // Scroll to ensure the input is visible
      emailInputRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  }));

  useEffect(() => {
    setIsLoaded(true);
    
    const interval = setInterval(() => {
      setCurrentSubscription((prev) => (prev + 1) % subscriptionServices.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Show toast based on submit status
  useEffect(() => {
    if (submitStatus === 'success') {
      toast.success("Successfully joined the waitlist!");
    } else if (submitStatus === 'already-on-waitlist') {
      toast.info("You're already on the waitlist!");
    } else if (submitStatus === 'error') {
      toast.error("Error joining waitlist. Please try again.");
    }
  }, [submitStatus]);

  // Email validation handler
  const validateEmail = (inputEmail: string): boolean => {
    if (!inputEmail) {
      setEmailError("Email is required");
      return false;
    }
    
    if (!isValidEmail(inputEmail)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    
    setEmailError(null);
    return true;
  };

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setEmail(sanitizedValue);
    
    // Clear error when user types
    if (emailError) {
      setEmailError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email before submission
    if (!validateEmail(email) || isSubmitting || !turnstileToken) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Get UTM source from URL if present
      const urlParams = new URLSearchParams(window.location.search);
      const utm_source = urlParams.get('utm_source') 
        ? sanitizeInput(urlParams.get('utm_source') || '')
        : null;

      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(),
          utm_source,
          turnstileToken
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setEmail('');
      } else {
        const data = await response.json();
        // Handle case where user is already on waitlist
        if (response.status === 409) {
          setSubmitStatus('already-on-waitlist');
          setEmail('');
        } else {
          setSubmitStatus('error');
          // Display error message from the server if available
          if (data?.error) {
            toast.error(data.error);
          }
        }
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTurnstileToken(null);
      // We'll let the Turnstile component handle its own reset
    }
  };

  // Handle the Turnstile verification
  const handleTurnstileVerify = (token: string) => {
    setTurnstileToken(token);
  };

  return (
    <div id="waitlist-form" className="w-full py-12 md:py-24 mt-10 md:mt-14 relative overflow-hidden">
      {/* Only show floating subscription cards on medium screens and above */}
      {!isSmallScreen && (
        <> 
          {/* Floating Spotify Card */}
          <motion.div 
            className={`absolute -rotate-6 ${isMediumScreen ? "top-[12%] left-[4%]" : "top-[20%] left-[14%]"} bg-white p-3 rounded-lg shadow-lg transition-all duration-1000 ease-out ${
              isLoaded ? "opacity-100" : "opacity-0 -translate-x-16"
            }`}
            style={{ transitionDelay: "200ms" }}
            initial={{ opacity: 0, x: -16 }}
            animate={{ 
              opacity: isLoaded ? 1 : 0,
              x: isLoaded ? 0 : -16,
              y: isLoaded ? [0, -10, 0] : 0,
              rotate: isLoaded ? [-6, -3, -6] : -6,
              scale: isLoaded ? [1, 1.05, 1] : 1
            }}
            transition={{
              opacity: { duration: 1, delay: 0.2 },
              x: { duration: 1, delay: 0.2 },
              y: {
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
                repeatType: "mirror"
              },
              rotate: {
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
                repeatType: "mirror"
              },
              scale: {
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
                repeatType: "mirror"
              }
            }}
          >
            <Image src="/subscriptions/spotify-tile.svg" alt="Spotify" width={50} height={50} />
          </motion.div>

          {/* Floating YouTube Card */}
          <motion.div 
            className={`absolute rotate-6 ${isMediumScreen ? "bottom-[47%] left-[4%]" : "bottom-[38%] left-[11%]"} bg-white p-3 rounded-lg shadow-lg transition-all duration-1000 ease-out ${
              isLoaded ? "opacity-100" : "opacity-0 -translate-x-16 translate-y-8"
            }`}
            style={{ transitionDelay: "400ms" }}
            initial={{ opacity: 0, x: -16, y: 8 }}
            animate={isLoaded ? { 
              opacity: 1, 
              x: 0,
              y: [0, -12, 0],
              rotate: [6, 9, 6],
              scale: [1, 1.03, 1]
            } : {}}
            transition={{
              opacity: { duration: 1, delay: 0.4 },
              x: { duration: 1, delay: 0.4 },
              y: {
                repeat: Infinity,
                duration: 3.5,
                ease: "easeInOut",
                repeatType: "reverse"
              },
              rotate: {
                repeat: Infinity,
                duration: 4.5,
                ease: "easeInOut",
                repeatType: "reverse"
              },
              scale: {
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
                repeatType: "reverse",
                delay: 0.5
              }
            }}
          >
            <Image src="/subscriptions/youtube-icon.svg" alt="YouTube" width={50} height={50} />
          </motion.div>

          {/* Floating Netflix */}
          <motion.div 
            className={`absolute rotate-6 ${isMediumScreen ? "bottom-[14%] right-[5%]" : "bottom-[25%] right-[16%]"} bg-white p-3 rounded-lg shadow-lg transition-all duration-1000 ease-out ${
              isLoaded ? "opacity-100" : "opacity-0 translate-x-16 translate-y-8"
            }`}
            style={{ transitionDelay: "600ms" }}
            initial={{ opacity: 0, x: 16, y: 8 }}
            animate={isLoaded ? { 
              opacity: 1, 
              x: [0, 5, 0, -5, 0],
              y: [0, -8, 0],
              rotate: [6, 2, 6],
              scale: [1, 1.04, 1]
            } : {}}
            transition={{
              opacity: { duration: 1, delay: 0.6 },
              x: {
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
                repeatType: "reverse"
              },
              y: {
                repeat: Infinity,
                duration: 2.8,
                ease: "easeInOut",
                repeatType: "reverse"
              },
              rotate: {
                repeat: Infinity,
                duration: 3.5,
                ease: "easeInOut",
                repeatType: "reverse"
              },
              scale: {
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
                repeatType: "reverse"
              }
            }}
          >
            <Image src="/subscriptions/netflix-icon.svg" alt="Netflix" width={50} height={50} />
          </motion.div>

          {/* Additional subscription: Canva */}
          <motion.div 
            className={`absolute -rotate-6 ${isMediumScreen ? "top-[8%] right-[6%]" : "top-[15%] right-[16%]"} bg-white p-3 rounded-lg shadow-lg transition-all duration-1000 ease-out ${
              isLoaded ? "opacity-100" : "opacity-0 translate-x-16"
            }`}
            style={{ transitionDelay: "300ms" }}
            initial={{ opacity: 0, x: 16 }}
            animate={isLoaded ? { 
              opacity: 1, 
              x: [0, -4, 0, 4, 0],
              y: [0, -12, 0],
              rotate: [-6, -9, -6],
              scale: [1, 1.05, 1]
            } : {}}
            transition={{
              opacity: { duration: 1, delay: 0.3 },
              x: {
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
                repeatType: "reverse"
              },
              y: {
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
                repeatType: "reverse"
              },
              rotate: {
                repeat: Infinity,
                duration: 3.8,
                ease: "easeInOut",
                repeatType: "reverse"
              },
              scale: {
                repeat: Infinity,
                duration: 4.5,
                ease: "easeInOut",
                repeatType: "reverse"
              }
            }}
          >
            <Image src="/subscriptions/canva-icon.svg" alt="Canva" width={50} height={50} />
          </motion.div>

          {/* Additional subscription: Lovable */}
          <motion.div 
            className={`absolute rotate-5 ${isMediumScreen ? "top-[37%] right-[4%]" : "top-[38%] right-[8%]"} bg-white p-3 rounded-lg shadow-lg transition-all duration-1000 ease-out ${
              isLoaded ? "opacity-100" : "opacity-0 translate-x-16"
            }`}
            style={{ transitionDelay: "300ms" }}
            initial={{ opacity: 0, x: 16 }}
            animate={isLoaded ? { 
              opacity: 1, 
              x: [0, 6, 0, -6, 0],
              y: [0, -10, 0],
              rotate: [5, 8, 5],
              scale: [1, 1.06, 1]
            } : {}}
            transition={{
              opacity: { duration: 1, delay: 0.3 },
              x: {
                repeat: Infinity,
                duration: 5.5,
                ease: "easeInOut",
                repeatType: "reverse"
              },
              y: {
                repeat: Infinity,
                duration: 3.2,
                ease: "easeInOut",
                repeatType: "reverse"
              },
              rotate: {
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
                repeatType: "reverse"
              },
              scale: {
                repeat: Infinity,
                duration: 4.8,
                ease: "easeInOut",
                repeatType: "reverse"
              }
            }}
          >
            <Image src="/subscriptions/lovable-icon.svg" alt="Lovable" width={50} height={50} />
          </motion.div>

          {/* Additional subscription: ChatGPT */}
          <motion.div 
            className={`absolute rotate-6 ${isMediumScreen ? "top-[75%] left-[7%]" : "top-[68%] left-[22%]"} bg-white p-3 rounded-lg shadow-lg transition-all duration-1000 ease-out ${
              isLoaded ? "opacity-100" : "opacity-0 -translate-y-8"
            }`}
            style={{ transitionDelay: "500ms" }}
            initial={{ opacity: 0, y: -8 }}
            animate={isLoaded ? { 
              opacity: 1, 
              x: [0, 5, 0, -5, 0],
              y: [0, -9, 0],
              rotate: [6, 2, 6],
              scale: [1, 1.03, 1]
            } : {}}
            transition={{
              opacity: { duration: 1, delay: 0.5 },
              x: {
                repeat: Infinity,
                duration: 4.8,
                ease: "easeInOut",
                repeatType: "reverse"
              },
              y: {
                repeat: Infinity,
                duration: 3.7,
                ease: "easeInOut",
                repeatType: "reverse"
              },
              rotate: {
                repeat: Infinity,
                duration: 4.2,
                ease: "easeInOut",
                repeatType: "reverse"
              },
              scale: {
                repeat: Infinity,
                duration: 3.5,
                ease: "easeInOut",
                repeatType: "reverse"
              }
            }}
          >
            <Image src="/subscriptions/chatgpt-icon.svg" alt="ChatGPT" width={50} height={50} />
          </motion.div>
        </>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-12 md:mt-8 text-center">
        <h1 
          className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 transition-all duration-700 ease-out ${
            isLoaded ? "opacity-100 transform-none" : "opacity-0 -translate-y-8"
          }`}
        >
          Řekněte sbohem karetním poplatkům.<br />
          <span 
            className={`bg-gradient-to-r from-purple-500 to-violet-500 text-transparent bg-clip-text transition-all duration-1000 ease-out ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >Přijímejte QR platby a ušetřete peníze.</span>
          <span 
            className={`transition-all duration-700 ease-out ${
              isLoaded ? "opacity-100 transform-none" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "600ms" }}
          >again</span>
        </h1>
        <p 
          className={`text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 md:mb-10 transition-all duration-1000 ease-out ${
            isLoaded ? "opacity-100 transform-none" : "opacity-0 -translate-y-4"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          Forgot to cancel your{" "}
          <span className="relative inline-block w-auto">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentSubscription}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ 
                  duration: 0.5, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
                className="inline-block font-semibold text-purple-600"
              >
                {subscriptionServices[currentSubscription]}
              </motion.span>
            </AnimatePresence>
          </span>{" "}
          subscription? We've got you covered.
        </p>

        <form onSubmit={handleSubmit}>
          <div 
            className={`flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8 transition-all duration-1000 ease-out ${
              isLoaded ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            <div className="relative w-full max-w-md">
              <input 
                ref={emailInputRef}
                type="email" 
                placeholder="Enter your email address" 
                className={`w-full px-4 sm:px-6 py-2 sm:py-3 text-gray-800 bg-white border-2 ${emailError ? 'border-red-400' : 'border-purple-200'} rounded-full focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300`}
                value={email}
                onChange={handleEmailChange}
                onBlur={() => email && validateEmail(email)}
                required
                aria-invalid={emailError ? 'true' : 'false'}
                aria-describedby={emailError ? 'email-error' : undefined}
              />
              {emailError && (
                <p id="email-error" className="text-red-500 text-xs mt-1 ml-3 text-left">
                  {emailError}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !turnstileToken || !!emailError}
              className={`whitespace-nowrap px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium text-white bg-gradient-to-r border-purple-200 border-4 from-purple-500 to-violet-500 rounded-full hover:from-purple-600 hover:to-violet-600 flex items-center gap-1 transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 ${
                isLoaded ? "animate-fade-in" : ""
              } ${(isSubmitting || !turnstileToken || !!emailError) ? "opacity-70 cursor-not-allowed" : ""}`}
              style={{ transitionDelay: "100ms" }}
            >
              {isSubmitting ? "Joining..." : "Join the waitlist"}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Add Turnstile widget */}
          <div className={`${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}>
            <Turnstile onVerify={handleTurnstileVerify} />
          </div>
        </form>

        {/* User Avatars */}
        <div 
          className={`flex flex-col items-center transition-all duration-1000 ease-out ${
            isLoaded ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "900ms" }}
        >
          <div className="flex items-center -space-x-2 mb-2">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white" />
            <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="User" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white" />
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white" />
            <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="User" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white" />
          </div>
          <div className="flex items-center">
            <span 
              className={`ml-2 text-xs sm:text-sm font-medium text-gray-600 transition-all duration-1000 ease-out ${
                isLoaded ? "opacity-100 transform-none" : "opacity-0 translate-x-4"
              }`}
              style={{ transitionDelay: "1500ms" }}
            >
              Join 15+ people ready to stop wasting money on forgotten subscriptions
            </span>
          </div>
        </div>
      </div>
      
      {/* Add Toaster component */}
      <Toaster position="bottom-center" theme="light" richColors />
    </div>
  );
});

// Add display name for React DevTools
WaitlistHero.displayName = "WaitlistHero";

export default WaitlistHero;
