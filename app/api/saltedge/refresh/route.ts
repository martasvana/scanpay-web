import { NextRequest, NextResponse } from 'next/server';
import { saltEdgeClient } from '@/lib/saltedge';

/**
 * Manually refresh a connection to fetch new transactions
 * POST /api/saltedge/refresh
 */
export async function POST(request: NextRequest) {
  try {
    const { connection_id } = await request.json();

    if (!connection_id) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Connection ID is required.' 
        },
        { status: 400 }
      );
    }

    console.log('[SaltEdge Refresh] Refreshing connection:', connection_id);

    // Trigger a refresh to fetch new transactions
    const response = await saltEdgeClient.refreshConnection(connection_id, {
      categorize: true,
      from_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Last 7 days
    });

    console.log('[SaltEdge Refresh] Refresh initiated:', {
      connection_id,
      attempt_id: response.data.attempt_id
    });

    return NextResponse.json({
      success: true,
      message: 'Connection refresh initiated successfully',
      data: response.data
    });

  } catch (error) {
    console.error('[SaltEdge Refresh] Error refreshing connection:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to refresh connection.' 
      },
      { status: 500 }
    );
  }
}
