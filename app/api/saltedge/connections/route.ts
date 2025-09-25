import { NextRequest, NextResponse } from 'next/server';
import { saltEdgeClient } from '@/lib/saltedge';

/**
 * List connections for a customer
 * GET /api/saltedge/connections?customer_id=123
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customer_id');

    if (!customerId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Customer ID is required.' 
        },
        { status: 400 }
      );
    }

    const response = await saltEdgeClient.listConnections(customerId);

    return NextResponse.json({
      success: true,
      data: response.data,
      meta: response.meta,
    });

  } catch (error) {
    console.error('[SaltEdge Connections API] Error listing connections:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to list connections.' 
      },
      { status: 500 }
    );
  }
}
