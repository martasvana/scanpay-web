import { NextRequest, NextResponse } from 'next/server';
import { saltEdgeClient } from '@/lib/saltedge';
import type { CreateCustomerRequest } from '@/types/saltedge';

/**
 * Create a new SaltEdge customer
 * POST /api/saltedge/customers
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateCustomerRequest = await request.json();
    const { identifier } = body;

    if (!identifier) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Customer identifier is required.' 
        },
        { status: 400 }
      );
    }

    const response = await saltEdgeClient.createCustomer({ identifier });

    // Debug logging for customer creation
    console.log('[SaltEdge Customer API] Full response:', response);
    console.log('[SaltEdge Customer API] Response data:', response.data);
    console.log('[SaltEdge Customer API] Customer created:', {
      customer_id: response.data.customer_id,
      identifier: response.data.identifier,
      created_at: response.data.created_at,
      allKeys: Object.keys(response.data)
    });

    return NextResponse.json({
      success: true,
      data: response.data,
    });

  } catch (error) {
    console.error('[SaltEdge Customer API] Error creating customer:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create customer.' 
      },
      { status: 500 }
    );
  }
}

/**
 * List all customers
 * GET /api/saltedge/customers
 */
export async function GET() {
  try {
    const response = await saltEdgeClient.listCustomers();

    return NextResponse.json({
      success: true,
      data: response.data,
    });

  } catch (error) {
    console.error('[SaltEdge Customer API] Error listing customers:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to list customers.' 
      },
      { status: 500 }
    );
  }
}
