import { NextRequest, NextResponse } from 'next/server';
import { saltEdgeClient } from '@/lib/saltedge';

/**
 * List transactions for an account
 * GET /api/saltedge/transactions?connection_id=123&account_id=456&from_date=2024-01-01&to_date=2024-12-31
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get('connection_id');
    const accountId = searchParams.get('account_id');
    const fromId = searchParams.get('from_id');
    const fromDate = searchParams.get('from_date');
    const toDate = searchParams.get('to_date');

    if (!connectionId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Connection ID is required.' 
        },
        { status: 400 }
      );
    }

    if (!accountId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Account ID is required.' 
        },
        { status: 400 }
      );
    }

    const options: {
      from_id?: string;
      from_date?: string;
      to_date?: string;
    } = {};

    if (fromId) options.from_id = fromId;
    if (fromDate) options.from_date = fromDate;
    if (toDate) options.to_date = toDate;

    const response = await saltEdgeClient.listTransactions(accountId, connectionId, options);

    return NextResponse.json({
      success: true,
      data: response.data,
      meta: response.meta,
    });

  } catch (error) {
    console.error('[SaltEdge Transactions API] Error listing transactions:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to list transactions.' 
      },
      { status: 500 }
    );
  }
}
