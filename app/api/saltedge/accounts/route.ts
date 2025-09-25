import { NextRequest, NextResponse } from 'next/server';
import { saltEdgeClient } from '@/lib/saltedge';

/**
 * List accounts for a connection
 * GET /api/saltedge/accounts?connection_id=123
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

    const response = await saltEdgeClient.listAccounts(connectionId);

    return NextResponse.json({
      success: true,
      data: response.data,
      meta: response.meta,
    });

  } catch (error) {
    console.error('[SaltEdge Accounts API] Error listing accounts:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to list accounts.' 
      },
      { status: 500 }
    );
  }
}
