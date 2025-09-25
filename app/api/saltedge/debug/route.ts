import { NextResponse } from 'next/server';

/**
 * Debug endpoint to check environment variables
 * GET /api/saltedge/debug
 */
export async function GET() {
  try {
    const env = {
      SALTEDGE_APP_ID: process.env.SALTEDGE_APP_ID,
      SALTEDGE_SECRET: process.env.SALTEDGE_SECRET ? '***PRESENT***' : 'MISSING',
      SALTEDGE_BASE_URL: process.env.SALTEDGE_BASE_URL,
      SALTEDGE_ENVIRONMENT: process.env.SALTEDGE_ENVIRONMENT,
      NODE_ENV: process.env.NODE_ENV,
    };

    console.log('[Debug] Environment variables:', env);

    return NextResponse.json({
      success: true,
      env: {
        ...env,
        // Show lengths for debugging without exposing secrets
        SALTEDGE_APP_ID_LENGTH: process.env.SALTEDGE_APP_ID?.length || 0,
        SALTEDGE_SECRET_LENGTH: process.env.SALTEDGE_SECRET?.length || 0,
      },
      message: 'Environment variables check complete'
    });

  } catch (error) {
    console.error('[Debug] Error checking environment:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to check environment variables',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
