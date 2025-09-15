import { createRouteHandler } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  // Log the request URL to help debug redirect issues
  console.log('Auth callback URL:', requestUrl.toString());
  
  if (code) {
    const supabase = createRouteHandler();
    
    try {
      // Exchange the code for a session
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (sessionError) {
        console.error('Error exchanging code for session:', sessionError);
        return NextResponse.redirect(new URL('/signin?error=auth_callback_error', request.url));
      }
      
      // --- User Upsert Logic (Keep as is, but now session should be valid) ---
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check if user already exists in our table
        const { data: existingUser, error: selectError } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();
        
        if (selectError && selectError.code !== 'PGRST116') { // Ignore 'Row not found' error
          console.error('Error checking for existing user:', selectError);
        }
        
        const userData = {
          email: user.email,
          full_name: user.user_metadata?.full_name,
          avatar_url: user.user_metadata?.avatar_url,
          provider: user.app_metadata?.provider || 'email',
          email_verified: user.email_confirmed_at ? true : false,
          last_sign_in: new Date().toISOString()
        };
        
        if (!existingUser) {
          // Insert new user
          const { error: insertError } = await supabase.from('users').insert({
            id: user.id,
            ...userData
          });
          if (insertError) console.error('Error inserting user:', insertError);
        } else {
          // Update existing user
          const { error: updateError } = await supabase
            .from('users')
            .update(userData)
            .eq('id', user.id);
          if (updateError) console.error('Error updating user:', updateError);
        }
      }
      // --- End User Upsert Logic ---
      
    } catch (error: any) {
      console.error('Unhandled error in auth callback:', error);
      return NextResponse.redirect(new URL('/signin?error=auth_callback_unexpected_error', request.url));
    }
  } else {
    console.warn('No code found in auth callback URL');
    return NextResponse.redirect(new URL('/signin?error=auth_missing_code', request.url));
  }

  // Successfully exchanged code, redirect to the app
  return NextResponse.redirect(new URL('/app', request.url));
} 