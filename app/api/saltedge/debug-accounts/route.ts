import { NextRequest, NextResponse } from 'next/server';
import { saltEdgeClient } from '@/lib/saltedge';

/**
 * Debug endpoint to get detailed account information including IBAN
 * GET /api/saltedge/debug-accounts?connection_id=123
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get('connection_id');

    if (!connectionId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Connection ID is required.' 
        },
        { status: 400 }
      );
    }

    console.log('[Debug Accounts] Fetching detailed account info for connection:', connectionId);

    const response = await saltEdgeClient.listAccounts(connectionId);

    // Extract detailed account information
    const accountDetails = response.data.map(account => ({
      id: account.id,
      name: account.name,
      balance: account.balance,
      currency: account.currency_code,
      nature: account.nature,
      // Extract IBAN and other banking details from extra field
      iban: account.extra?.iban || 'Not available',
      account_number: account.extra?.account_number || account.name,
      swift: account.extra?.swift || 'Not available',
      sort_code: account.extra?.sort_code || 'Not available',
      routing_number: account.extra?.routing_number || 'Not available',
      bsb: account.extra?.bsb || 'Not available',
      all_extra_fields: account.extra
    }));

    console.log('[Debug Accounts] Account details with IBANs:', accountDetails);

    return NextResponse.json({
      success: true,
      connection_id: connectionId,
      accounts: accountDetails,
      total_accounts: accountDetails.length
    });

  } catch (error) {
    console.error('[Debug Accounts] Error fetching account details:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch account details.' 
      },
      { status: 500 }
    );
  }
}
