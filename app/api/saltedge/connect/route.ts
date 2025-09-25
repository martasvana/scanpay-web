import { NextRequest, NextResponse } from 'next/server';
import { saltEdgeClient } from '@/lib/saltedge';
import type { ConnectSessionRequest } from '@/types/saltedge';

/**
 * Create a SaltEdge Connect session
 * POST /api/saltedge/connect
 */
export async function POST(request: NextRequest) {
  try {
    const body: ConnectSessionRequest = await request.json();
    const { customer_id, consent, attempt } = body;

    // Debug logging
    console.log('[SaltEdge Connect API] Received request:', {
      customer_id,
      hasConsent: !!consent,
      consentScopes: consent?.scopes,
      hasAttempt: !!attempt,
      bodyKeys: Object.keys(body)
    });

    if (!customer_id) {
      console.log('[SaltEdge Connect API] Missing customer_id in request body:', body);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Customer ID is required.' 
        },
        { status: 400 }
      );
    }

    if (!consent || !consent.scopes || consent.scopes.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Consent with scopes is required.' 
        },
        { status: 400 }
      );
    }

    // Set default values for the connect session
    const connectData: ConnectSessionRequest = {
      customer_id,
      consent: {
        scopes: consent.scopes,
        period_days: consent.period_days || 90, // Default to 90 days
        from_date: consent.from_date,
        to_date: consent.to_date,
      },
      attempt: {
        return_connection_id: true,
        return_error_class: true,
        fetch_scopes: attempt?.fetch_scopes || ['accounts', 'transactions'],
        categorize: attempt?.categorize !== false, // Default to true
        store_credentials: attempt?.store_credentials !== false, // Default to true
        ...attempt,
      },
      locale: body.locale || 'en',
      theme: body.theme || 'default',
      return_to: body.return_to || `${process.env.NEXT_PUBLIC_BASE_URL}/connect-bank/success`,
      show_consent_confirmation: body.show_consent_confirmation !== false, // Default to true
      include_fake_providers: process.env.SALTEDGE_ENVIRONMENT === 'sandbox', // Include fake providers in sandbox
    };

    const response = await saltEdgeClient.createConnectSession(connectData);

    return NextResponse.json({
      success: true,
      data: response.data,
    });

  } catch (error) {
    console.error('[SaltEdge Connect API] Error creating connect session:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create connect session.' 
      },
      { status: 500 }
    );
  }
}
