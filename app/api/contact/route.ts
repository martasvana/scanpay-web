import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// [ContactAPI] Interface for contact form data
interface ContactFormData {
  email: string;
  message: string;
  recaptchaToken: string;
}

// [ContactAPI] Interface for reCAPTCHA v3 response
interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

// [ContactAPI] Function to verify reCAPTCHA v3 token with score checking
async function verifyRecaptcha(token: string): Promise<{ success: boolean; score?: number; message?: string }> {
  try {
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
    
    const response = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data: RecaptchaResponse = await response.json();
    
    if (!data.success) {
      console.log('[ContactAPI] reCAPTCHA verification failed:', data['error-codes']);
      return {
        success: false,
        message: 'reCAPTCHA ověření selhalo.'
      };
    }

    // [ContactAPI] Check reCAPTCHA v3 score (0.0 = bot, 1.0 = human)
    // Recommended threshold for forms is 0.5
    const minimumScore = 0.5;
    
    if (data.score < minimumScore) {
      console.log(`[ContactAPI] reCAPTCHA score too low: ${data.score} (minimum: ${minimumScore})`);
      return {
        success: false,
        score: data.score,
        message: 'Váš požadavek byl označen jako podezřelý. Zkuste to prosím později.'
      };
    }

    // [ContactAPI] Verify action matches
    if (data.action !== 'contact_form') {
      console.log(`[ContactAPI] reCAPTCHA action mismatch: ${data.action}`);
      return {
        success: false,
        message: 'Neplatné reCAPTCHA ověření.'
      };
    }

    console.log(`[ContactAPI] reCAPTCHA verification successful with score: ${data.score}`);
    return {
      success: true,
      score: data.score
    };

  } catch (error) {
    console.error('[ContactAPI] reCAPTCHA verification error:', error);
    return {
      success: false,
      message: 'Chyba při ověřování reCAPTCHA.'
    };
  }
}

// [ContactAPI] Function to send email using NodeMailer
async function sendEmail(email: string, message: string): Promise<boolean> {
  try {
    // [ContactAPI] Create transporter with SMTP settings
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      // [ContactAPI] Additional settings for better compatibility
      tls: {
        rejectUnauthorized: false
      }
    });

    // [ContactAPI] Verify SMTP connection
    await transporter.verify();

    // [ContactAPI] Email content configuration
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: 'Nová zpráva ze ScanPay kontaktního formuláře',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">ScanPay Podpora</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Nová zpráva od zákazníka</p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border-left: 4px solid #9333ea;">
            <h2 style="color: #1f2937; margin-top: 0; font-size: 18px;">Detaily zprávy:</h2>
            
            <div style="margin: 20px 0;">
              <strong style="color: #374151;">Email zákazníka:</strong>
              <div style="background: white; padding: 12px; border-radius: 8px; margin-top: 5px; border: 1px solid #e5e7eb;">
                ${email}
              </div>
            </div>
            
            <div style="margin: 20px 0;">
              <strong style="color: #374151;">Zpráva:</strong>
              <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 5px; border: 1px solid #e5e7eb; line-height: 1.6;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: #f1f5f9; border-radius: 8px; text-align: center;">
            <p style="color: #64748b; margin: 0; font-size: 14px;">
              Tato zpráva byla odeslána ze ScanPay kontaktního formuláře dne ${new Date().toLocaleDateString('cs-CZ')} v ${new Date().toLocaleTimeString('cs-CZ')}
            </p>
          </div>
        </div>
      `,
      // [ContactAPI] Plain text fallback
      text: `
        Nová zpráva ze ScanPay kontaktního formuláře
        
        Email zákazníka: ${email}
        
        Zpráva:
        ${message}
        
        Odesláno: ${new Date().toLocaleString('cs-CZ')}
      `,
    };

    // [ContactAPI] Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('[ContactAPI] Email sent successfully:', info.messageId);
    return true;

  } catch (error) {
    console.error('[ContactAPI] Email sending error:', error);
    return false;
  }
}

// [ContactAPI] POST endpoint handler
export async function POST(request: NextRequest) {
  try {
    // [ContactAPI] Parse request body
    const body: ContactFormData = await request.json();
    const { email, message, recaptchaToken } = body;

    // [ContactAPI] Validate required fields
    if (!email || !message || !recaptchaToken) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Všechna pole jsou povinná.' 
        },
        { status: 400 }
      );
    }

    // [ContactAPI] Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Neplatný formát emailové adresy.' 
        },
        { status: 400 }
      );
    }

    // [ContactAPI] Verify reCAPTCHA v3 with score checking
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: recaptchaResult.message || 'Ověření reCAPTCHA selhalo. Zkuste to prosím znovu.' 
        },
        { status: 400 }
      );
    }

    // [ContactAPI] Send email
    const emailSent = await sendEmail(email, message);
    if (!emailSent) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Chyba při odesílání emailu. Zkuste to prosím později.' 
        },
        { status: 500 }
      );
    }

    // [ContactAPI] Success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Zpráva byla úspěšně odeslána. Děkujeme za váš dotaz!' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('[ContactAPI] Unexpected error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Nastala neočekávaná chyba. Zkuste to prosím později.' 
      },
      { status: 500 }
    );
  }
}
