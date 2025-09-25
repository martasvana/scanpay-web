'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Building2, ArrowRight, CheckCircle, AlertCircle, Bell } from 'lucide-react';
import type { 
  SaltEdgeCustomer, 
  SaltEdgeConnection, 
  SaltEdgeAccount,
  SaltEdgeTransaction 
} from '@/types/saltedge';

interface ConnectionData {
  connection: SaltEdgeConnection;
  accounts: SaltEdgeAccount[];
  transactions: SaltEdgeTransaction[];
}

export default function ConnectBankPage() {
  const [step, setStep] = useState<'customer' | 'connect' | 'connected'>('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerIdentifier, setCustomerIdentifier] = useState('');
  const [customer, setCustomer] = useState<SaltEdgeCustomer | null>(null);
  const [connectionData, setConnectionData] = useState<ConnectionData | null>(null);

  // Auto-generate customer identifier
  useEffect(() => {
    if (!customerIdentifier) {
      setCustomerIdentifier(`customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }
  }, [customerIdentifier]);

  const createCustomer = async () => {
    if (!customerIdentifier.trim()) {
      setError('Customer identifier is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/saltedge/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: customerIdentifier.trim() }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to create customer');
      }

      setCustomer(result.data);
      setStep('connect');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const startConnection = async () => {
    if (!customer) return;

    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        customer_id: customer.customer_id,
        consent: {
          scopes: ['accounts', 'transactions'],
          period_days: 90,
        },
        attempt: {
          fetch_scopes: ['accounts', 'transactions'],
          categorize: true,
          store_credentials: true,
        },
        locale: 'en',
        theme: 'default',
      };

      console.log('[Frontend] Starting connection with:', {
        customerId: customer.customer_id,
        customerIdentifier: customer.identifier,
        requestBody
      });

      const response = await fetch('/api/saltedge/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to create connect session');
      }

      // Open SaltEdge Connect Widget in a new window
      const connectWindow = window.open(
        result.data.connect_url,
        'saltedge_connect',
        'width=800,height=600,scrollbars=yes,resizable=yes'
      );

      // Poll for window closure or success
      const pollWindow = setInterval(() => {
        if (connectWindow?.closed) {
          clearInterval(pollWindow);
          // Check for successful connection
          checkForConnection();
        }
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const checkForConnection = async () => {
    if (!customer) return;

    setLoading(true);

    try {
      // Get connections for this customer
      const connectionsResponse = await fetch(`/api/saltedge/connections?customer_id=${customer.customer_id}`);
      const connectionsResult = await connectionsResponse.json();

      if (connectionsResult.success && connectionsResult.data.length > 0) {
        const connection = connectionsResult.data[0]; // Get the first connection

        // Get accounts for this connection
        const accountsResponse = await fetch(`/api/saltedge/accounts?connection_id=${connection.id}`);
        const accountsResult = await accountsResponse.json();

        let accounts: SaltEdgeAccount[] = [];
        let transactions: SaltEdgeTransaction[] = [];

        if (accountsResult.success) {
          accounts = accountsResult.data;

          // Get transactions for the first account
          if (accounts.length > 0) {
            const transactionsResponse = await fetch(
              `/api/saltedge/transactions?connection_id=${connection.id}&account_id=${accounts[0].id}`
            );
            const transactionsResult = await transactionsResponse.json();

            if (transactionsResult.success) {
              transactions = transactionsResult.data.slice(0, 10); // Show only first 10 transactions
            }
          }
        }

        setConnectionData({
          connection,
          accounts,
          transactions,
        });
        
        // Save connection data to localStorage for live monitoring
        localStorage.setItem('saltedge_connection', JSON.stringify({
          connection,
          accounts,
          transactions
        }));
        
        setStep('connected');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check connection');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Connect Your Bank</h1>
          <p className="text-lg text-gray-600">
            Securely connect your bank account using SaltEdge integration
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center space-x-4">
          <div className={`flex items-center space-x-2 ${step === 'customer' ? 'text-purple-600' : 'text-green-600'}`}>
            {step !== 'customer' ? <CheckCircle className="h-5 w-5" /> : <div className="h-5 w-5 rounded-full border-2 border-current" />}
            <span>Create Customer</span>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
          <div className={`flex items-center space-x-2 ${step === 'connect' ? 'text-purple-600' : step === 'connected' ? 'text-green-600' : 'text-gray-400'}`}>
            {step === 'connected' ? <CheckCircle className="h-5 w-5" /> : <div className="h-5 w-5 rounded-full border-2 border-current" />}
            <span>Connect Bank</span>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
          <div className={`flex items-center space-x-2 ${step === 'connected' ? 'text-green-600' : 'text-gray-400'}`}>
            {step === 'connected' ? <CheckCircle className="h-5 w-5" /> : <div className="h-5 w-5 rounded-full border-2 border-current" />}
            <span>View Data</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Create Customer */}
        {step === 'customer' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-6 w-6" />
                <span>Step 1: Create Customer</span>
              </CardTitle>
              <CardDescription>
                First, we need to create a customer identifier in the SaltEdge sandbox environment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Identifier
                </label>
                <Input
                  id="identifier"
                  value={customerIdentifier}
                  onChange={(e) => setCustomerIdentifier(e.target.value)}
                  placeholder="Enter a unique customer identifier"
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This identifier will be used to manage your bank connections.
                </p>
              </div>
              <Button 
                onClick={createCustomer} 
                disabled={loading || !customerIdentifier.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Customer...
                  </>
                ) : (
                  <>
                    Create Customer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Connect Bank */}
        {step === 'connect' && customer && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-6 w-6" />
                <span>Step 2: Connect Your Bank</span>
              </CardTitle>
              <CardDescription>
                Customer created successfully! Now let's connect your bank account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-green-50 p-4">
                <h3 className="font-medium text-green-800">Customer Created</h3>
                <p className="text-sm text-green-600">ID: {customer.customer_id}</p>
                <p className="text-sm text-green-600">Identifier: {customer.identifier}</p>
              </div>
              <Button 
                onClick={startConnection} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparing Connection...
                  </>
                ) : (
                  <>
                    Connect Bank Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-500 text-center">
                This will open the SaltEdge Connect Widget in a new window.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Connected - Show Bank Data */}
        {step === 'connected' && connectionData && (
          <div className="space-y-6">
            {/* Connection Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span>Bank Connected Successfully!</span>
                </CardTitle>
                <CardDescription>
                  Here's your bank connection information and account data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Provider</h4>
                    <p className="text-sm text-gray-600">{connectionData.connection.provider_name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Country</h4>
                    <p className="text-sm text-gray-600">{connectionData.connection.country_code}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Status</h4>
                    <Badge variant={connectionData.connection.status === 'active' ? 'default' : 'secondary'}>
                      {connectionData.connection.status}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Connected</h4>
                    <p className="text-sm text-gray-600">
                      {formatDate(connectionData.connection.created_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accounts */}
            <Card>
              <CardHeader>
                <CardTitle>Bank Accounts ({connectionData.accounts.length})</CardTitle>
                <CardDescription>
                  Your connected bank accounts and their current balances.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {connectionData.accounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{account.name}</h4>
                        <p className="text-sm text-gray-600">
                          {account.nature} • {account.extra.account_number || 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          {formatCurrency(account.balance, account.currency_code)}
                        </p>
                        <Badge variant="outline">{account.currency_code}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            {connectionData.transactions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions ({connectionData.transactions.length})</CardTitle>
                  <CardDescription>
                    Latest transactions from your connected accounts.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {connectionData.transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(transaction.made_on)} • {transaction.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount, transaction.currency_code)}
                          </p>
                          <Badge variant={transaction.status === 'posted' ? 'default' : 'secondary'}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => {
                  window.location.href = '/connect-bank/live';
                }}
                className="flex-1"
              >
                <Bell className="mr-2 h-4 w-4" />
                Live Transaction Monitor
              </Button>
              <Button
                onClick={() => {
                  setStep('customer');
                  setCustomer(null);
                  setConnectionData(null);
                  setCustomerIdentifier('');
                  setError(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Connect Another Account
              </Button>
              <Button
                onClick={checkForConnection}
                disabled={loading}
                variant="outline"
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  'Refresh Data'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
