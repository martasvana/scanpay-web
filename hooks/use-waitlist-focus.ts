// "use client";

// import { createContext, useContext, useRef, ReactNode, useState } from 'react';
// import { WaitlistHeroRef } from '@/components/landing/waitlist/waitlist-hero';

// // Context to manage the waitlist focus
// interface WaitlistFocusContextType {
//   heroRef: React.RefObject<WaitlistHeroRef> | null;
//   setHeroRef: (ref: React.RefObject<WaitlistHeroRef>) => void;
//   focusWaitlistInput: () => void;
// }

// const WaitlistFocusContext = createContext<WaitlistFocusContextType>({
//   heroRef: null,
//   setHeroRef: () => {},
//   focusWaitlistInput: () => {},
// });

// export function WaitlistFocusProvider({ children }: { children: ReactNode }) {
//   const [heroRef, setHeroRefState] = useState<React.RefObject<WaitlistHeroRef> | null>(null);

//   const setHeroRef = (ref: React.RefObject<WaitlistHeroRef>) => {
//     setHeroRefState(ref);
//   };

//   const focusWaitlistInput = () => {
//     if (heroRef && heroRef.current) {
//       heroRef.current.focusEmailInput();
//     }
//   };

//   return (
//     <WaitlistFocusContext.Provider 
//       value={{ 
//         heroRef, 
//         setHeroRef, 
//         focusWaitlistInput 
//       }}
//     >
//       {children}
//     </WaitlistFocusContext.Provider>
//   );
// }

// export function useWaitlistFocus() {
//   return useContext(WaitlistFocusContext);
// } 