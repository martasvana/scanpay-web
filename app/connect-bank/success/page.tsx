'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [connectionId, setConnectionId] = useState<string | null>(null);

  useEffect(() => {
    // SaltEdge may pass connection_id as a URL parameter after successful connection
    const connId = searchParams?.get('connection_id');
    if (connId) {
      setConnectionId(connId);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mt-20">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">
                Bank Connected Successfully!
              </CardTitle>
              <CardDescription>
                Your bank account has been successfully connected to ScanPay.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {connectionId && (
                <div className="rounded-lg bg-green-50 p-4">
                  <h3 className="font-medium text-green-800">Connection Details</h3>
                  <p className="text-sm text-green-600">Connection ID: {connectionId}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">What happens next?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-600" />
                    <span>Your account information is being securely imported</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-600" />
                    <span>Transaction data will be available shortly</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-600" />
                    <span>You can now use all ScanPay features with your bank data</span>
                  </li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <Button asChild className="flex-1">
                  <Link href="/connect-bank">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Connect Bank
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/">
                    Go to Dashboard
                  </Link>
                </Button>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  <strong>Security Note:</strong> Your banking credentials are encrypted and stored securely. 
                  ScanPay never sees your login details - they are processed directly by SaltEdge's 
                  secure infrastructure.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ConnectBankSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="mx-auto max-w-2xl">
          <div className="mt-20">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                  <p className="text-gray-600">Loading...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
