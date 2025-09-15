import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import WelcomeEmail from '@/emails/welcome';
import { z } from 'zod'; // Add zod for validation

// Email validation regex (RFC 5322 compliant)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Create a validation schema with zod
const waitlistSchema = z.object({
  email: z.string()
    .trim()
    .min(1, "Email is required")
    .max(320, "Email is too long")
    .refine(value => EMAIL_REGEX.test(value), "Invalid email format"),
  utm_source: z.string().trim().nullable().optional(),
  turnstileToken: z.string().min(1, "Verification token is required"),
});

// Create a Supabase client with service role for server operations to bypass RLS
// This only works on the server side and should not be exposed to the client
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key instead of anon key for admin operations
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const resend = new Resend(process.env.RESEND_API_KEY);

// Validate Cloudflare Turnstile token
async function validateTurnstileToken(token: string, ip: string) {
  // Sanitize inputs
  const sanitizedToken = String(token).trim();
  const sanitizedIp = String(ip).trim();
  
  const formData = new FormData();
  formData.append('secret', process.env.TURNSTILE_SECRET_KEY!);
  formData.append('response', sanitizedToken);
  formData.append('remoteip', sanitizedIp);

  try {
    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData
    });

    const outcome = await result.json();
    return outcome.success === true;
  } catch (error) {
    console.error('Turnstile validation error:', error);
    return false;
  }
}

// Helper function to sanitize data before database insertion
function sanitizeForDatabase(value: string): string {
  if (!value) return '';
  
  // Basic sanitization by removing null characters, common in SQL injection attempts
  return String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .trim();
}

export async function POST(request: Request) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Parse request body
    const body = await request.json();
    
    // Use zod to validate and sanitize the input
    const result = waitlistSchema.safeParse({
      email: body.email,
      utm_source: body.utm_source,
      turnstileToken: body.turnstileToken
    });
    
    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || 'Invalid input data';
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }
    
    const { email, utm_source, turnstileToken } = result.data;
    
    // Double-check email validity (redundant but safer approach)
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Email is required and must be valid' },
        { status: 400 }
      );
    }

    // Validate Turnstile token
    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Missing verification token' },
        { status: 400 }
      );
    }

    const isValidToken = await validateTurnstileToken(turnstileToken, ip);
    if (!isValidToken) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 403 }
      );
    }

    // Additional sanitization before DB insertion
    const sanitizedEmail = sanitizeForDatabase(email.toLowerCase());
    const sanitizedUtmSource = utm_source ? sanitizeForDatabase(utm_source) : null;
    const sanitizedIp = sanitizeForDatabase(ip);

    // Store in Supabase using admin client to bypass RLS
    const { data, error } = await adminSupabase
      .from('waitlist')
      .insert([
        { 
          email: sanitizedEmail, 
          ip_address: sanitizedIp,
          utm_source: sanitizedUtmSource
        }
      ])
      .select();

    if (error) {
      // Handle unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'You are already on the waitlist!' },
          { status: 409 }
        );
      }
      
      throw error;
    }

    // Send welcome email if Resend API key is available
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Unrenewed <hello@unrenewed.app>',
        to: [sanitizedEmail],
        subject: 'Welcome to the Unrenewed Waitlist!',
        react: WelcomeEmail({ userEmail: sanitizedEmail }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: 'Failed to add to waitlist' },
      { status: 500 }
    );
  }
} 