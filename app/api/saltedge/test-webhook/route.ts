import { NextRequest, NextResponse } from 'next/server';

/**
 * Test webhook simulation endpoint
 * POST /api/saltedge/test-webhook
 * 
 * This endpoint simulates a SaltEdge success callback to test your webhook handling
 */
export async function POST(request: NextRequest) {
  try {
    const { connection_id, customer_id } = await request.json();

    if (!connection_id || !customer_id) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'connection_id and customer_id are required' 
        },
        { status: 400 }
      );
    }

    // Simulate a SaltEdge success callback
    const simulatedCallback = {
      data: {
        connection_id,
        customer_id,
        stage: 'finish'
      },
      meta: {
        version: '6',
        time: new Date().toISOString()
      }
    };

    console.log('[Test Webhook] Simulating SaltEdge callback:', simulatedCallback);

    // Send the simulated callback to your webhook endpoint
    const webhookResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/saltedge/callbacks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simulatedCallback),
    });

    const webhookResult = await webhookResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Test webhook sent successfully',
      webhook_response: webhookResult,
      simulated_payload: simulatedCallback
    });

  } catch (error) {
    console.error('[Test Webhook] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send test webhook.' 
      },
      { status: 500 }
    );
  }
}

/**
 * Get webhook test form
 * GET /api/saltedge/test-webhook
 */
export async function GET() {
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SaltEdge Webhook Tester</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #9333ea; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #7c3aed; }
        .result { margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <h1>🔔 SaltEdge Webhook Tester</h1>
      <p>Use this form to test your webhook handling by simulating a SaltEdge success callback.</p>
      
      <form id="webhookForm">
        <div class="form-group">
          <label for="connection_id">Connection ID:</label>
          <input type="text" id="connection_id" name="connection_id" placeholder="Enter connection ID" required>
        </div>
        
        <div class="form-group">
          <label for="customer_id">Customer ID:</label>
          <input type="text" id="customer_id" name="customer_id" placeholder="Enter customer ID" required>
        </div>
        
        <button type="submit">Send Test Webhook</button>
      </form>
      
      <div id="result" class="result" style="display: none;"></div>

      <script>
        document.getElementById('webhookForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const formData = new FormData(e.target);
          const data = Object.fromEntries(formData);
          
          try {
            const response = await fetch('/api/saltedge/test-webhook', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            const resultDiv = document.getElementById('result');
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = '<h3>Result:</h3><pre>' + JSON.stringify(result, null, 2) + '</pre>';
            
            if (result.success) {
              resultDiv.style.background = '#d4edda';
              resultDiv.style.color = '#155724';
            } else {
              resultDiv.style.background = '#f8d7da';
              resultDiv.style.color = '#721c24';
            }
          } catch (error) {
            const resultDiv = document.getElementById('result');
            resultDiv.style.display = 'block';
            resultDiv.style.background = '#f8d7da';
            resultDiv.style.color = '#721c24';
            resultDiv.innerHTML = '<h3>Error:</h3><p>' + error.message + '</p>';
          }
        });
      </script>
    </body>
    </html>
  `, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
