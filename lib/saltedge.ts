// SaltEdge AIS API v6 Client Library
// Based on: https://docs.saltedge.com/v6/api_reference#ais

import crypto from 'crypto';
import type {
  SaltEdgeCustomer,
  CreateCustomerRequest,
  CreateCustomerResponse,
  ConnectSessionRequest,
  ConnectSessionResponse,
  ListConnectionsResponse,
  ShowConnectionResponse,
  ListAccountsResponse,
  ListTransactionsResponse,
} from '@/types/saltedge';

class SaltEdgeClient {
  private appId: string;
  private secret: string;
  private baseUrl: string;
  private environment: string;

  constructor() {
    this.appId = process.env.SALTEDGE_APP_ID!;
    this.secret = process.env.SALTEDGE_SECRET!;
    this.baseUrl = process.env.SALTEDGE_BASE_URL || 'https://www.saltedge.com/api/v6';
    this.environment = process.env.SALTEDGE_ENVIRONMENT || 'sandbox';

    // Debug logging for environment variables
    console.log('[SaltEdge Client] Environment check:', {
      hasAppId: !!this.appId,
      hasSecret: !!this.secret,
      appIdLength: this.appId?.length || 0,
      secretLength: this.secret?.length || 0,
      baseUrl: this.baseUrl,
      environment: this.environment
    });

    if (!this.appId || !this.secret) {
      throw new Error('SaltEdge App ID and Secret not found in environment variables');
    }
  }

  /**
   * Generate request signature according to SaltEdge AIS API v6 specification
   * Format: Expires-at|HTTP_METHOD|REQUEST_URL|REQUEST_BODY
   */
  private generateSignature(
    method: string,
    url: string,
    expiresAt: number,
    body?: string
  ): string {
    const requestString = `${expiresAt}|${method.toUpperCase()}|${url}|${body || ''}`;
    const signature = crypto.createHmac('sha256', this.secret).update(requestString).digest('base64');
    
    // Debug logging for signature generation
    console.log('[SaltEdge Signature] Generated:', {
      requestString,
      signatureLength: signature.length,
      expiresAt,
      method: method.toUpperCase(),
      url,
      hasBody: !!body
    });
    
    return signature;
  }

  /**
   * Make authenticated request to SaltEdge API
   */
  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // For sandbox, try simplified authentication without signature
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'App-id': this.appId,
      'Secret': this.secret,
    };

    // Only add signature headers for live environment
    if (this.environment === 'live') {
      const expiresAt = Math.floor(Date.now() / 1000) + 60;
      const bodyString = body ? JSON.stringify(body) : undefined;
      const signature = this.generateSignature(method, url, expiresAt, bodyString);
      
      headers['Expires-at'] = expiresAt.toString();
      headers['Signature'] = signature;
    }

    const bodyString = body ? JSON.stringify(body) : undefined;

    // Debug logging for API request
    console.log('[SaltEdge API] Making request:', {
      method,
      url,
      appId: this.appId,
      secretLength: this.secret.length,
      environment: this.environment,
      headers: Object.keys(headers),
      hasBody: !!bodyString
    });

    const response = await fetch(url, {
      method,
      headers,
      body: bodyString,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[SaltEdge API] Error (${response.status}):`, {
        status: response.status,
        statusText: response.statusText,
        url,
        method,
        headers: Object.keys(headers),
        errorResponse: errorText
      });
      
      let errorMessage = `SaltEdge API Error: ${response.status} ${response.statusText}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error_message) {
          errorMessage += ` - ${errorJson.error_message}`;
        }
        if (errorJson.error_class) {
          errorMessage += ` (${errorJson.error_class})`;
        }
      } catch (e) {
        // If JSON parsing fails, use the raw error text
        if (errorText) {
          errorMessage += ` - ${errorText}`;
        }
      }
      
      throw new Error(errorMessage);
    }

    const jsonResponse = await response.json();
    
    // Debug logging for successful responses
    console.log('[SaltEdge API] Successful response:', {
      url,
      method,
      status: response.status,
      responseKeys: Object.keys(jsonResponse),
      dataKeys: jsonResponse.data ? Object.keys(jsonResponse.data) : 'no data field'
    });

    return jsonResponse;
  }

  /**
   * Create a new customer
   * https://docs.saltedge.com/v6/api_reference#customers-create
   */
  async createCustomer(data: CreateCustomerRequest): Promise<CreateCustomerResponse> {
    const requestBody = { data };
    console.log('[SaltEdge Client] Creating customer with body:', requestBody);
    return this.makeRequest<CreateCustomerResponse>('POST', '/customers', requestBody);
  }

  /**
   * List customers
   * https://docs.saltedge.com/v6/api_reference#customers-list
   */
  async listCustomers(): Promise<{ data: SaltEdgeCustomer[] }> {
    return this.makeRequest<{ data: SaltEdgeCustomer[] }>('GET', '/customers');
  }

  /**
   * Show customer
   * https://docs.saltedge.com/v6/api_reference#customers-show
   */
  async showCustomer(customerId: string): Promise<{ data: SaltEdgeCustomer }> {
    return this.makeRequest<{ data: SaltEdgeCustomer }>('GET', `/customers/${customerId}`);
  }

  /**
   * Create a connect session for the SaltEdge Connect Widget
   * https://docs.saltedge.com/v6/api_reference#connections-connect
   */
  async createConnectSession(data: ConnectSessionRequest): Promise<ConnectSessionResponse> {
    const requestBody = { data };
    console.log('[SaltEdge Client] Creating connect session with body:', requestBody);
    return this.makeRequest<ConnectSessionResponse>('POST', '/connections/connect', requestBody);
  }

  /**
   * List connections for a customer
   * https://docs.saltedge.com/v6/api_reference#connections-list
   */
  async listConnections(customerId: string): Promise<ListConnectionsResponse> {
    return this.makeRequest<ListConnectionsResponse>('GET', `/connections?customer_id=${customerId}`);
  }

  /**
   * Show a specific connection
   * https://docs.saltedge.com/v6/api_reference#connections-show
   */
  async showConnection(connectionId: string): Promise<ShowConnectionResponse> {
    return this.makeRequest<ShowConnectionResponse>('GET', `/connections/${connectionId}`);
  }

  /**
   * List accounts for a connection
   * https://docs.saltedge.com/v6/api_reference#accounts-list
   */
  async listAccounts(connectionId: string): Promise<ListAccountsResponse> {
    return this.makeRequest<ListAccountsResponse>('GET', `/accounts?connection_id=${connectionId}`);
  }

  /**
   * List transactions for an account
   * https://docs.saltedge.com/v6/api_reference#transactions-list
   */
  async listTransactions(
    accountId: string,
    connectionId: string,
    options?: {
      from_id?: string;
      from_date?: string;
      to_date?: string;
    }
  ): Promise<ListTransactionsResponse> {
    const params = new URLSearchParams({
      connection_id: connectionId,
      account_id: accountId,
      ...options,
    });

    console.log('[SaltEdge Client] Listing transactions with params:', {
      connection_id: connectionId,
      account_id: accountId,
      options
    });

    return this.makeRequest<ListTransactionsResponse>('GET', `/transactions?${params}`);
  }

  /**
   * Refresh a connection
   * https://docs.saltedge.com/v6/api_reference#connections-refresh
   */
  async refreshConnection(
    connectionId: string,
    options?: {
      categorize?: boolean;
      include_natures?: string[];
      exclude_accounts?: string[];
      from_date?: string;
      to_date?: string;
    }
  ): Promise<{ data: { attempt_id: string } }> {
    return this.makeRequest<{ data: { attempt_id: string } }>(
      'POST',
      `/connections/${connectionId}/refresh`,
      { data: options || {} }
    );
  }

  /**
   * Remove a connection
   * https://docs.saltedge.com/v6/api_reference#connections-remove
   */
  async removeConnection(connectionId: string): Promise<{ data: { id: string; removed: boolean } }> {
    return this.makeRequest<{ data: { id: string; removed: boolean } }>(
      'DELETE',
      `/connections/${connectionId}`
    );
  }
}

// Export a singleton instance
export const saltEdgeClient = new SaltEdgeClient();
export default saltEdgeClient;
