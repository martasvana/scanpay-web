import { NextRequest, NextResponse } from 'next/server';
import { saltEdgeClient } from '@/lib/saltedge';

interface RouteParams {
  params: {
    connectionId: string;
  };
}

/**
 * Show a specific connection
 * GET /api/saltedge/connections/[connectionId]
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { connectionId } = params;

    if (!connectionId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Connection ID is required.' 
        },
        { status: 400 }
      );
    }

    const response = await saltEdgeClient.showConnection(connectionId);

    return NextResponse.json({
      success: true,
      data: response.data,
    });

  } catch (error) {
    console.error('[SaltEdge Connection API] Error showing connection:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to show connection.' 
      },
      { status: 500 }
    );
  }
}

/**
 * Remove a connection
 * DELETE /api/saltedge/connections/[connectionId]
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { connectionId } = params;

    if (!connectionId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Connection ID is required.' 
        },
        { status: 400 }
      );
    }

    const response = await saltEdgeClient.removeConnection(connectionId);

    return NextResponse.json({
      success: true,
      data: response.data,
    });

  } catch (error) {
    console.error('[SaltEdge Connection API] Error removing connection:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to remove connection.' 
      },
      { status: 500 }
    );
  }
}
