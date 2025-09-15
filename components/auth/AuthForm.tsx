"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthFormProps {
  type: "signin" | "signup";
  onSubmit?: (email: string) => void;
}

export const AuthForm = ({ type, onSubmit }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();
  
  // Check for existing session
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        router.push('/app'); // Redirect to /app if already logged in
      }
    };
    
    checkUser();
  }, [router, supabase]);

  // Handle magic link signin
  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || loading) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        throw error;
      }
      
      alert("Check your email for the login link!");
      
      if (onSubmit) {
        onSubmit(email);
      }
    } catch (error: any) {
      console.error("Error sending magic link:", error);
      alert(error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth signin
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      
      // Make sure this exact URI is registered in Google Cloud Console
      // The URI must match exactly, including http/https, domain, path, and any trailing slashes
      const redirectUri = `${window.location.origin}/auth/callback`;
      
      console.log('Using redirect URI:', redirectUri);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          // Don't use queryParams that might interfere with the redirect
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      alert(error.message || "An error occurred during Google sign in");
    } finally {
      setLoading(false);
    }
  };

  const title = "Welcome to";
  const subtitle = "Stop paying for your unused subscriptions on auto-pilot!";
  const buttonText = loading ? "Loading..." : "Send Magic Link";

  return (
    <div className="max-w-md w-full mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {title} <span className="text-purple-600">Unrenewed!</span>
        </h1>
        <p className="text-gray-600 mt-2">{subtitle}</p>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="flex -space-x-2 mb-3">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
          <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
          <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
        </div>
        <div className="flex items-center">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 text-yellow-400 fill-current">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-sm font-medium">$50k+ Saved on Unused Subscriptions</span>
        </div>
      </div>

      <div className="mb-6">
        <button 
          onClick={handleGoogleSignIn} 
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border-4 border-purple-400 cursor-pointer hover:border-purple-500 rounded-full bg-white py-3 px-4 text-sm font-medium transition-colors hover:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR CONTINUE WITH EMAIL</span>
        </div>
      </div>

      <form onSubmit={handleMagicLinkSignIn}>
        <div className="mb-4">
          <input
            type="email"
            placeholder="name@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-0 focus:border-purple-400 focus:border-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-3 px-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 border-4 border-purple-200 cursor-pointer transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {buttonText} <span className="ml-1">→</span>
        </button>
      </form>
    </div>
  );
};