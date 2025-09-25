# SaltEdge Webhook Testing Guide

## 🔔 Webhook System Overview

Your SaltEdge integration now includes a comprehensive webhook system that automatically detects and processes incoming transactions. Here's how it works:

### **Webhook Flow:**
1. **SaltEdge detects** new transactions in connected accounts
2. **SaltEdge sends** a callback to your webhook URL
3. **Your app processes** the callback and fetches new transaction data
4. **Your app identifies** incoming payments and triggers business logic

## 🚀 Testing Your Webhook System

### **Method 1: Test via Webhook Tester (Recommended)**

1. **Go to the webhook tester**: `http://localhost:3002/api/saltedge/test-webhook`
2. **Enter connection details**:
   - **Connection ID**: Get this from your bank connection (visible in logs)
   - **Customer ID**: Get this from your customer creation (visible in logs)
3. **Click "Send Test Webhook"**
4. **Check your server logs** for transaction processing

### **Method 2: Manual Connection Refresh**

Send a POST request to trigger manual refresh:

```bash
curl -X POST http://localhost:3002/api/saltedge/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "connection_id": "your_connection_id_here"
  }'
```

### **Method 3: Create Test Payment in SaltEdge Dashboard**

Since you're in **sandbox mode**, you can create test payments:

#### **In SaltEdge Dashboard "Create a new payment" section:**

1. **Provider Name**: `Air Bank (Sandbox)` or any sandbox provider
2. **Template Selection**: `SEPA`
3. **End to End Identification**: `TEST12345`
4. **Customer IP Address**: `127.0.0.1`
5. **Creditor Name**: `Test Merchant`
6. **Description**: `Test webhook payment`
7. **Amount**: `10.50`
8. **Creditor IBAN**: Use your connected account's IBAN
9. **Currency**: `EUR` (or your account currency)
10. **Optional Fields**: Leave as default
11. **Customer Device OS**: `iOS 17`
12. **Customer User Agent**: `Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)`

#### **Important Notes for Test Payments:**
- Use **IBAN of your connected sandbox account** as the creditor
- This simulates someone **sending money TO your account**
- Amount should be **positive** (you're receiving money)
- Use realistic but fake data for testing

## 📊 What Happens During Webhook Processing

When a webhook is received, your system:

### **1. Logs the Callback**
```
[SaltEdge Callback] Received callback: {
  stage: 'finish',
  connection_id: '12345',
  customer_id: '67890',
  timestamp: '2025-09-25T15:30:00Z'
}
```

### **2. Fetches New Transactions**
```
[SaltEdge Callback] Fetching new transactions for connection: 12345
[SaltEdge Callback] Processing account: {
  account_id: 'acc123',
  account_name: 'Main Account',
  balance: 1250.75,
  currency: 'EUR'
}
```

### **3. Detects Incoming Payments**
```
🎉 [SaltEdge Callback] INCOMING PAYMENT DETECTED! {
  amount: 10.50,
  currency: 'EUR',
  description: 'Test webhook payment',
  from: 'Test Merchant',
  account: 'Main Account'
}
💰 Received 10.50 EUR from Test Merchant
```

## 🔧 Webhook Configuration

### **Your Current Setup:**
- **Webhook URL**: `https://5074eabc06f4.ngrok-free.app/api/saltedge/callbacks`
- **Environment**: Sandbox
- **Ngrok Tunnel**: Port 3002 → External URL

### **Required SaltEdge Dashboard Settings:**
1. **Success Callback URL**: `https://your-ngrok-url.ngrok-free.app/api/saltedge/callbacks`
2. **Failure Callback URL**: `https://your-ngrok-url.ngrok-free.app/api/saltedge/callbacks`
3. **Notify Callback URL**: `https://your-ngrok-url.ngrok-free.app/api/saltedge/callbacks`

## 🎯 Business Logic Integration

### **Current Webhook Handler Includes:**

✅ **Automatic transaction fetching**  
✅ **Incoming payment detection**  
✅ **Detailed logging and monitoring**  
✅ **Error handling and retry logic**  

### **TODO: Add Your Business Logic**

In `/app/api/saltedge/callbacks/route.ts`, you can add:

```typescript
// Example business logic for incoming payments
if (transaction.amount > 0) {
  // 💳 Save to database
  await saveTransactionToDatabase(transaction);
  
  // 📧 Send email notification
  await sendPaymentNotification(transaction);
  
  // 🔔 Push notification to mobile app
  await sendPushNotification(transaction);
  
  // 📊 Update analytics
  await updatePaymentAnalytics(transaction);
  
  // 🔗 Trigger other webhooks
  await triggerExternalWebhooks(transaction);
}
```

## 🚨 Production Considerations

### **Before Going Live:**

1. **Replace Ngrok** with a permanent webhook URL
2. **Add database persistence** for transactions
3. **Implement proper error handling** and retry logic
4. **Add webhook signature verification** for security
5. **Set up monitoring** and alerting for failed webhooks
6. **Configure rate limiting** for webhook endpoints

### **Security Best Practices:**

- Verify webhook signatures from SaltEdge
- Use HTTPS for all webhook URLs
- Implement idempotency to handle duplicate webhooks
- Log all webhook events for audit purposes
- Set up monitoring for webhook failures

## 🧪 Testing Checklist

- [ ] Test webhook tester form works
- [ ] Manual refresh triggers webhooks
- [ ] Incoming payments are detected correctly
- [ ] Outgoing payments are logged properly
- [ ] Error handling works for invalid webhooks
- [ ] Ngrok tunnel is stable and accessible
- [ ] SaltEdge dashboard callbacks are configured
- [ ] Server logs show detailed webhook processing

## 📞 Troubleshooting

### **Common Issues:**

1. **No webhooks received**: Check Ngrok tunnel and SaltEdge dashboard URLs
2. **Webhooks received but no transactions**: Verify connection is active and has recent activity
3. **Errors in processing**: Check server logs for detailed error messages
4. **Duplicate webhooks**: This is normal - SaltEdge may send multiple callbacks for the same event

### **Debug Commands:**

```bash
# Check if webhook endpoint is accessible
curl https://your-ngrok-url.ngrok-free.app/api/saltedge/callbacks

# Test webhook manually
curl -X POST https://your-ngrok-url.ngrok-free.app/api/saltedge/callbacks \
  -H "Content-Type: application/json" \
  -d '{"data":{"stage":"finish","connection_id":"test"},"meta":{"version":"6","time":"2025-09-25T15:30:00Z"}}'
```

Your webhook system is now ready to detect and process incoming payments automatically! 🎉
