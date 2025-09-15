"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Notification {
  id: number;
  icon: string;
  service: string;
  amount: string;
  date: string;
  message?: string;
  color?: string;
  type?: 'payment' | 'reminder' | 'usage' | 'trial';
  uniqueId?: number;
}

const notifications: Notification[] = [
  // Payment notifications
  {
    id: 1,
    icon: "/apps/chatgpt.svg",
    service: "ChatGPT",
    amount: "$20.00",
    date: "Just now",
    color: "bg-green-50 border-green-200",
    type: 'payment'
  },
  {
    id: 2,
    icon: "/apps/netflix.svg",
    service: "Netflix",
    amount: "$15.49",
    date: "5 mins ago",
    message: "You haven't watched in 2 months",
    color: "bg-red-50 border-red-200",
    type: 'payment'
  },
  {
    id: 3,
    icon: "/apps/spotify.svg",
    service: "Spotify",
    amount: "$9.99",
    date: "15 mins ago",
    color: "bg-green-50 border-green-200",
    type: 'payment'
  },
  {
    id: 4,
    icon: "/apps/disney.svg",
    service: "Disney+",
    amount: "$7.99",
    date: "2 hours ago",
    message: "Renewal scheduled for tomorrow",
    color: "bg-blue-50 border-blue-200",
    type: 'payment'
  },
  {
    id: 5,
    icon: "/apps/youtube.svg",
    service: "YouTube Premium",
    amount: "$11.99",
    date: "Yesterday",
    color: "bg-red-50 border-red-200",
    type: 'payment'
  },
  {
    id: 6,
    icon: "/apps/hbo.png",
    service: "HBO Max",
    amount: "$15.99",
    date: "3 hours ago",
    message: "Last watched: 45 days ago",
    color: "bg-red-50 border-red-200",
    type: 'payment'
  },
  {
    id: 7,
    icon: "/apps/adobe.svg",
    service: "Adobe CC",
    amount: "$52.99",
    date: "Today",
    color: "bg-red-50 border-red-200",
    type: 'payment'
  },
  {
    id: 8,
    icon: "/apps/apple-music.svg",
    service: "Apple Music",
    amount: "$9.99",
    date: "Yesterday",
    message: "Family plan - 3 unused accounts",
    color: "bg-yellow-50 border-yellow-200",
    type: 'payment'
  },
  {
    id: 9,
    icon: "/apps/slack.svg",
    service: "Slack",
    amount: "$8.75",
    date: "2 days ago",
    color: "bg-green-50 border-green-200",
    type: 'payment'
  },
  {
    id: 10,
    icon: "/apps/1password.png",
    service: "1Password",
    amount: "$2.99",
    date: "Yesterday",
    color: "bg-green-50 border-green-200",
    type: 'payment'
  },

  // Reminder notifications
  {
    id: 11,
    icon: "/apps/x.svg",
    service: "X",
    amount: "$8.00",
    date: "Tomorrow",
    message: "Trial ends in 24 hours",
    color: "bg-blue-50 border-blue-200",
    type: 'reminder'
  },
  {
    id: 12,
    icon: "/apps/hulu.svg",
    service: "Hulu",
    amount: "$14.99",
    date: "In 3 days",
    message: "Upcoming renewal",
    color: "bg-blue-50 border-blue-200",
    type: 'reminder'
  },
  {
    id: 13,
    icon: "/apps/medium.svg",
    service: "Medium",
    amount: "$5.00",
    date: "Today",
    message: "Price increase from $5 to $7",
    color: "bg-yellow-50 border-yellow-200",
    type: 'reminder'
  },
  {
    id: 14,
    icon: "/apps/canva.png",
    service: "Canva Pro",
    amount: "$12.99",
    date: "Tomorrow",
    message: "Annual plan available for $119.99",
    color: "bg-blue-50 border-blue-200",
    type: 'reminder'
  },
  {
    id: 15,
    icon: "/apps/linear.svg",
    service: "Linear",
    amount: "$8.00",
    date: "In 2 days",
    message: "Monthly renewal",
    color: "bg-blue-50 border-blue-200",
    type: 'reminder'
  },

  // Usage notifications
  {
    id: 16,
    icon: "/apps/trello.svg",
    service: "Trello",
    amount: "$5.00",
    date: "Last month",
    message: "Not used in 60 days",
    color: "bg-red-50 border-red-200",
    type: 'usage'
  },
  {
    id: 17,
    icon: "/apps/todoist.png",
    service: "Todoist",
    amount: "$4.00",
    date: "Last week",
    message: "App opened only once this month",
    color: "bg-red-50 border-red-200",
    type: 'usage'
  },
  {
    id: 18,
    icon: "/apps/dropbox.svg",
    service: "Dropbox",
    amount: "$11.99",
    date: "2 weeks ago",
    message: "Using only 2% of storage",
    color: "bg-red-50 border-red-200",
    type: 'usage'
  }
];

export default function NotificationPopups() {
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>([]);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [initialDelayPassed, setInitialDelayPassed] = useState(false);

  useEffect(() => {
    // Longer initial delay before showing the first notification
    const initialTimeout = setTimeout(() => {
      setInitialDelayPassed(true);
      addRandomNotification();
    }, 5000);

    return () => {
      clearTimeout(initialTimeout);
    };
  }, []);

  // Only set up the interval after initial delay has passed
  useEffect(() => {
    if (!initialDelayPassed) return;

    // Set up interval with longer delay between notifications
    const interval = setInterval(() => {
      // Only add a new notification if we have fewer than 2 showing
      if (activeNotifications.length < 2) {
        addRandomNotification();
      }
    }, 15000); // 15 seconds between notifications

    return () => clearInterval(interval);
  }, [initialDelayPassed, activeNotifications.length]);

  const addRandomNotification = () => {
    // Maximum of 2 notifications at once
    if (activeNotifications.length >= 2) {
      return;
    }

    // Avoid repeating the same notification until we've gone through most of them
    let availableIndices = Array.from(
      { length: notifications.length }, 
      (_, i) => i
    ).filter(i => !usedIndices.includes(i));

    // If we've used most notifications, reset the used indices
    if (availableIndices.length < 5) {
      setUsedIndices([]);
      availableIndices = Array.from({ length: notifications.length }, (_, i) => i);
    }

    // Choose a random notification
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    const newNotification = { ...notifications[randomIndex], uniqueId: Date.now() };
    
    // Add to used indices
    setUsedIndices(prev => [...prev, randomIndex]);
    
    // Add the new notification
    setActiveNotifications(prev => [...prev, newNotification]);

    // Remove the notification after a reasonable time
    setTimeout(() => {
      setActiveNotifications(prev => 
        prev.filter(notification => notification.uniqueId !== newNotification.uniqueId)
      );
    }, 10000); // 10 seconds display time
  };

  return (
    <div className="fixed top-24 right-5 z-50 w-72 pointer-events-none">
      <AnimatePresence>
        {activeNotifications.map((notification, index) => (
          <motion.div
            key={notification.uniqueId}
            initial={{ opacity: 0, y: -10, x: 50 }}
            animate={{ opacity: 0.95, y: 0, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ 
              type: "spring", 
              damping: 30, 
              stiffness: 280,
              delay: index * 0.05
            }}
            className={`rounded-lg shadow-md p-3 mb-3 flex items-center border ${notification.color || 'bg-white/95 border-gray-200'}`}
          >
            <div className="relative flex-shrink-0 mr-4 bg-white rounded-md shadow-sm">
              <Image 
                src={notification.icon} 
                alt={notification.service} 
                width={60} 
                height={60}
                className="w-10 h-10 object-cover"
              />
              
              {/* Subtler pulse animation */}
              <motion.div
                initial={{ opacity: 0.5, scale: 0.95 }}
                animate={{ 
                  opacity: 0, 
                  scale: 1.3,
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeOut"
                }}
                className="absolute inset-0 rounded-md bg-purple-300/50 -z-10"
              />
            </div>
            <div className="flex-grow">
              {notification.type === 'payment' && (
                <p className="text-xs font-semibold text-gray-900">
                  Payment of {notification.amount} to {notification.service}
                </p>
              )}
              {notification.type === 'reminder' && (
                <p className="text-xs font-semibold text-gray-900">
                  {notification.service}: {notification.amount} due {notification.date.toLowerCase()}
                </p>
              )}
              {notification.type === 'usage' && (
                <p className="text-xs font-semibold text-gray-900">
                  {notification.service}: {notification.amount}/mo
                </p>
              )}
              {!notification.type && (
                <p className="text-xs font-semibold text-gray-900">
                  Payment of {notification.amount} to {notification.service}
                </p>
              )}
              {notification.message && (
                <p className="text-xs font-medium text-purple-600 mt-0.5">
                  {notification.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-0.5">
                {notification.date}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 