'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Volume2, VolumeX, RefreshCw } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  currency_code: string;
  description: string;
  made_on: string;
  status: string;
  extra?: {
    payer?: string;
    payee?: string;
  };
}

interface Account {
  id: string;
  name: string;
  balance: number;
  currency_code: string;
}

interface Connection {
  id: string;
  provider_name: string;
  status: string;
}

export default function LiveTransactionsPage() {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [newTransactionCount, setNewTransactionCount] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio
  useEffect(() => {
    // Create a simple notification sound using Web Audio API
    const createNotificationSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };

    if (typeof window !== 'undefined') {
      audioRef.current = { play: createNotificationSound } as any;
    }
  }, []);

  // Load connection data from localStorage or prompt user
  useEffect(() => {
    const savedConnection = localStorage.getItem('saltedge_connection');
    if (savedConnection) {
      const connectionData = JSON.parse(savedConnection);
      setConnection(connectionData.connection);
      setAccounts(connectionData.accounts);
      setTransactions(connectionData.transactions || []);
    } else {
      // If no saved connection, redirect to connect page
      alert('No bank connection found. Please connect a bank account first.');
      window.location.href = '/connect-bank';
    }
  }, []);

  // Function to play notification sound
  const playNotificationSound = () => {
    if (soundEnabled && audioRef.current) {
      try {
        audioRef.current.play();
      } catch (error) {
        console.log('Could not play notification sound:', error);
      }
    }
  };

  // Function to check for new transactions
  const checkForNewTransactions = async () => {
    if (!connection || !accounts.length) return;

    try {
      setLoading(true);
      let allNewTransactions: Transaction[] = [];

      for (const account of accounts) {
        const response = await fetch(
          `/api/saltedge/transactions?connection_id=${connection.id}&account_id=${account.id}&from_date=${lastChecked.toISOString().split('T')[0]}`
        );
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Filter transactions that are newer than last check
            const newTransactions = result.data.filter((t: Transaction) => 
              new Date(t.made_on) > lastChecked
            );
            allNewTransactions = [...allNewTransactions, ...newTransactions];
          }
        }
      }

      if (allNewTransactions.length > 0) {
        console.log(`🔔 Found ${allNewTransactions.length} new transactions!`);
        
        // Check for incoming payments
        const incomingPayments = allNewTransactions.filter(t => t.amount > 0);
        
        if (incomingPayments.length > 0) {
          console.log(`💰 ${incomingPayments.length} incoming payments detected!`);
          playNotificationSound();
          setNewTransactionCount(prev => prev + incomingPayments.length);
          
          // Show browser notification if supported
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New Payment Received!', {
              body: `Received ${incomingPayments[0].amount} ${incomingPayments[0].currency_code}`,
              icon: '/logo/logo.svg'
            });
          }
        }

        // Update transactions list
        setTransactions(prev => [...allNewTransactions, ...prev]);
        setLastChecked(new Date());
      }
    } catch (error) {
      console.error('Error checking for new transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-check for new transactions every 10 seconds
  useEffect(() => {
    if (connection && accounts.length > 0) {
      // Initial check
      checkForNewTransactions();
      
      // Set up periodic checks
      intervalRef.current = setInterval(checkForNewTransactions, 10000);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [connection, accounts, lastChecked]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!connection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-600">Loading connection...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Live Transaction Monitor
            {newTransactionCount > 0 && (
              <Badge className="ml-2 bg-green-600">
                {newTransactionCount} new
              </Badge>
            )}
          </h1>
          <p className="text-lg text-gray-600">
            Real-time monitoring for {connection.provider_name}
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Monitoring Controls</span>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  variant="outline"
                  size="sm"
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  {soundEnabled ? 'Sound On' : 'Sound Off'}
                </Button>
                <Button
                  onClick={checkForNewTransactions}
                  disabled={loading}
                  size="sm"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Check Now
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Checking for new transactions every 10 seconds. Last checked: {lastChecked.toLocaleTimeString()}
              {loading && <span className="text-blue-600 ml-2">Checking...</span>}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Account Balances */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {accounts.map((account) => (
                <div key={account.id} className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">{account.name}</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(account.balance, account.currency_code)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Live Transaction Feed ({transactions.length})
            </CardTitle>
            <CardDescription>
              Real-time transactions will appear here automatically
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No transactions yet. When new transactions arrive, they'll appear here with a notification sound.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions.map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className={`flex items-center justify-between rounded-lg border p-3 ${
                      transaction.amount > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                      <p className="text-sm text-gray-600">
                        {formatDate(transaction.made_on)}
                        {transaction.extra?.payer && ` • From: ${transaction.extra.payer}`}
                        {transaction.extra?.payee && ` • To: ${transaction.extra.payee}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount, transaction.currency_code)}
                      </p>
                      <Badge variant={transaction.status === 'posted' ? 'default' : 'secondary'}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
