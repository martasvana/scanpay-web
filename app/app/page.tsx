import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
import Navigation from '@/components/navigation';
import PrivacyFooter from '../privacy-policy/privacy-footer';
import GmailConnectButton from '@/components/GmailConnectButton';
import GridBackground from '@/components/landing/grid-background';

export default async function DashboardPage() {
  // Make sure to await the createClient function
  const supabase = createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // Redirect to login if there is no session
    redirect('/signin');
  }
  
  // Fetch user data from the database
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  
  // Check if Gmail is connected
  const isGmailConnected = userData?.gmail_connected || false;
  
  return (
    <div className="relative min-h-screen">
      <GridBackground />
      
      <div className="relative z-10 min-h-screen bg-transparent">
        {/* Navigation */}
        <Navigation />
        
        <main className="container mx-auto py-45 px-4">
          {/* Gmail Connection Prompt */}
          <div className="max-w-3xl mx-auto">
            {/* Gmail Connect Component - This entire component will now handle its own UI states */}
            <GmailConnectButton />
            {isGmailConnected && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg">Popular Services</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  We detect and track subscriptions from Netflix, Spotify, HBO, and over 200+ services automatically.
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">Netflix</div>
                  <div className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">Spotify</div>
                  <div className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">HBO Max</div>
                  <div className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">Canva</div>
                  <div className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">+200 more</div>
                </div>
              </div>
              
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                      <path d="M2 9V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1"/>
                      <path d="M2 13h10"/>
                      <path d="m9 16 3-3-3-3"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg">How it Works</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">1.</span>
                    <span>Connect your Gmail account</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">2.</span>
                    <span>We scan for subscription emails</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">3.</span>
                    <span>Track your subscriptions in one place</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">4.</span>
                    <span>Get notified before you're charged</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
          </div>
        </main>
        
        {/* Footer */}
        <PrivacyFooter />
      </div>
    </div>
  );
} 