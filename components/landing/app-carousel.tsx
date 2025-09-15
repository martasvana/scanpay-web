"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";

// Define the app data
const apps = [
    { id: 1, name: "Cursor", logo: "/apps/cursor.svg" },
    { id: 2, name: "Github", logo: "/apps/github.svg" },
    { id: 3, name: "Perplexity", logo: "/apps/perplexity.svg" },
    { id: 4, name: "Disney+", logo: "/apps/disney.svg" },
    { id: 5, name: "Dropbox", logo: "/apps/dropbox.svg" },
    { id: 6, name: "DeepSeek", logo: "/apps/deepseek.svg" },
    { id: 7, name: "Notion", logo: "/apps/notion.png" },
    { id: 8, name: "Hulu", logo: "/apps/hulu.svg" },
    { id: 9, name: "Windsurf", logo: "/apps/windsurf.svg" },
    { id: 10, name: "X", logo: "/apps/x.svg" },
    { id: 11, name: "Canva", logo: "/apps/canva.png" },
    { id: 12, name: "Claude", logo: "/apps/claude.svg" },
    { id: 13, name: "HBO", logo: "/apps/hbo.png" },
    { id: 14, name: "Medium", logo: "/apps/medium.svg" },
    { id: 15, name: "Spotify", logo: "/apps/spotify.svg" },
    { id: 16, name: "Netflix", logo: "/apps/netflix.svg" },
    { id: 17, name: "YouTube", logo: "/apps/youtube.svg" },
    { id: 18, name: "Apple Music", logo: "/apps/apple-music.svg" },
    { id: 19, name: "Adobe", logo: "/apps/adobe.svg" },
    { id: 20, name: "ChatGPT", logo: "/apps/chatgpt.svg" },
    { id: 21, name: "Slack", logo: "/apps/slack.svg" },
    { id: 22, name: "1Password", logo: "/apps/1password.png" },
    { id: 23, name: "Todoist", logo: "/apps/todoist.png" },
    { id: 24, name: "Linear", logo: "/apps/linear.svg" },
    { id: 25, name: "Trello", logo: "/apps/trello.svg" },
    { id: 26, name: "Grok", logo: "/apps/grok.svg" },
  ];  

export const AppCarousel = () => {
  const [width, setWidth] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);
  const innerCarousel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carousel.current && innerCarousel.current) {
      // Get the width of the visible carousel container
      const containerWidth = carousel.current.offsetWidth;
      
      // Get the width of all items in the carousel
      const scrollWidth = innerCarousel.current.scrollWidth;
      
      // Calculate how many complete sets of items we need to fill the screen width plus extra
      // for smooth looping (at least double the container width)
      setWidth(scrollWidth);
    }
  }, []);

  // Create three sets of the apps array for truly seamless scrolling
  // First set: Visible + being scrolled out
  // Second set: Coming in as first set leaves
  // Third set: Buffer to ensure no empty space
  const tripleApps = [...apps, ...apps, ...apps];

  return (
    <div id="track-subscriptions" className="w-full py-12 overflow-hidden">
      <h2 className="text-2xl font-bold text-center mb-8">Track subscriptions from any app you use</h2>
      
      <div className="relative w-full" ref={carousel}>
        <motion.div
          ref={innerCarousel}
          className="flex items-center"
          initial={{ x: 0 }}
          animate={{ 
            x: [-0, -width / 3], 
          }}
          transition={{ 
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 60, // Very slow animation for subtle effect
              ease: "linear",
            }
          }}
        >
          {tripleApps.map((app, index) => (
            <div key={`${app.id}-${index}`} className="flex flex-col items-center mx-4 min-w-[100px]">
              <div className="bg-white w-16 h-16 rounded-xl overflow-hidden shadow-sm p-0">
                <Image 
                  src={app.logo}
                  alt={`${app.name} logo`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-2 text-sm text-gray-700">{app.name}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AppCarousel;
