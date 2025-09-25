import { NextRequest, NextResponse } from 'next/server';
import { saltEdgeClient } from '@/lib/saltedge';
import type { 
  SaltEdgeSuccessCallback, 
  SaltEdgeFailureCallback, 
  SaltEdgeNotifyCallback 
} from '@/types/saltedge';

/**
 * Handle new transactions from SaltEdge callback
 */
async function handleNewTransactions(connectionId: string) {
  try {
    console.log('[SaltEdge Callback] Fetching new transactions for connection:', connectionId);
    
    // Get all accounts for this connection
    const accountsResponse = await saltEdgeClient.listAccounts(connectionId);
    
    if (accountsResponse.data && accountsResponse.data.length > 0) {
      for (const account of accountsResponse.data) {
        console.log('[SaltEdge Callback] Processing account:', {
          account_id: account.id,
          account_name: account.name,
          balance: account.balance,
          currency: account.currency_code
        });
        
        // Get recent transactions for this account
        const transactionsResponse = await saltEdgeClient.listTransactions(
          account.id, 
          connectionId,
          {
            from_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Last 24 hours
          }
        );
        
        if (transactionsResponse.data && transactionsResponse.data.length > 0) {
          console.log('[SaltEdge Callback] Found new transactions:', {
            account_id: account.id,
            transaction_count: transactionsResponse.data.length
          });
          
          // Process each transaction
          for (const transaction of transactionsResponse.data) {
            await processNewTransaction(transaction, account);
          }
        } else {
          console.log('[SaltEdge Callback] No new transactions found for account:', account.id);
        }
      }
    }
  } catch (error) {
    console.error('[SaltEdge Callback] Error handling new transactions:', error);
  }
}

/**
 * Process a single new transaction
 */
async function processNewTransaction(transaction: any, account: any) {
  try {
    console.log('[SaltEdge Callback] Processing new transaction:', {
      transaction_id: transaction.id,
      amount: transaction.amount,
      currency: transaction.currency_code,
      description: transaction.description,
      date: transaction.made_on,
      status: transaction.status,
      account_name: account.name
    });
    
    // Check if this is an incoming payment (positive amount)
    if (transaction.amount > 0) {
      console.log('🎉 [SaltEdge Callback] INCOMING PAYMENT DETECTED!', {
        amount: transaction.amount,
        currency: transaction.currency_code,
        description: transaction.description,
        from: transaction.extra?.payer || 'Unknown',
        account: account.name
      });
      
      // TODO: Add your business logic here for incoming payments:
      // - Save to database
      // - Send email notifications
      // - Update user account balance
      // - Trigger webhook to other services
      // - Process payment confirmations
      
      // Example: Log the payment for now
      console.log(`💰 Received ${transaction.amount} ${transaction.currency_code} from ${transaction.extra?.payer || 'Unknown sender'}`);
    } else {
      console.log('📤 [SaltEdge Callback] Outgoing transaction:', {
        amount: Math.abs(transaction.amount),
        currency: transaction.currency_code,
        description: transaction.description,
        to: transaction.extra?.payee || 'Unknown'
      });
    }
    
    // TODO: Store transaction in your database
    // await storeTransactionInDatabase(transaction, account);
    
  } catch (error) {
    console.error('[SaltEdge Callback] Error processing transaction:', error);
  }
}

/**
 * Handle SaltEdge callbacks
 * POST /api/saltedge/callbacks
 * 
 * This endpoint handles success, failure, and notify callbacks from SaltEdge
 * https://docs.saltedge.com/v6/api_reference#callbacks
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[SaltEdge Callback] Received callback:', {
      stage: body.data?.stage,
      connection_id: body.data?.connection_id,
      customer_id: body.data?.customer_id,
      hasError: !!(body.data?.error_class && body.data?.error_message),
      timestamp: body.meta?.time
    });
    
    // Determine callback type based on the presence of certain fields
    if (body.data.error_class && body.data.error_message) {
      // This is a failure callback
      const failureCallback: SaltEdgeFailureCallback = body;
      console.log('[SaltEdge Callback] Failure callback received:', {
        customer_id: failureCallback.data.customer_id,
        connection_id: failureCallback.data.connection_id,
        error_class: failureCallback.data.error_class,
        error_message: failureCallback.data.error_message,
        stage: failureCallback.data.stage,
      });

      // TODO: Handle failure callback
      // - Update connection status in database
      // - Notify user about the failure
      // - Log the error for debugging

    } else if (body.data.stage === 'finish') {
      // This is a success callback - new data available!
      const successCallback: SaltEdgeSuccessCallback = body;
      console.log('[SaltEdge Callback] Success callback received:', {
        customer_id: successCallback.data.customer_id,
        connection_id: successCallback.data.connection_id,
        stage: successCallback.data.stage,
      });

      // Fetch new transactions when data changes
      await handleNewTransactions(successCallback.data.connection_id);
      
      // TODO: You can add additional logic here:
      // - Store connection status in your database
      // - Send notifications to users
      // - Trigger other business logic

    } else {
      // This is a notify callback (intermediate stage)
      const notifyCallback: SaltEdgeNotifyCallback = body;
      console.log('[SaltEdge Callback] Notify callback received:', {
        customer_id: notifyCallback.data.customer_id,
        connection_id: notifyCallback.data.connection_id,
        stage: notifyCallback.data.stage,
      });

      // TODO: Handle notify callback
      // - Update connection status in database
      // - Show progress to user if needed
    }

    // SaltEdge expects a 200 response for successful callback processing
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('[SaltEdge Callback] Error processing callback:', error);
    
    // Return 500 error so SaltEdge will retry the callback
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process callback.' 
      },
      { status: 500 }
    );
  }
}
