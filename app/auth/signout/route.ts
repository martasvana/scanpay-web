import { createRouteHandler } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = createRouteHandler();
  
  // Sign out the user
  await supabase.auth.signOut();
  
  // Redirect to the signin page
  return NextResponse.redirect(new URL('/signin', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
} 