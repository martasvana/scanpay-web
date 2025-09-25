# SaltEdge Payment Testing Guide

## 🎯 **How to Create Test Payments and Test Live Notifications**

Your webhook system is working perfectly! Now let's create test transactions to see real-time notifications in action.

## 📝 **Step-by-Step: Creating Test Payments in SaltEdge Dashboard**

### **Method 1: Using SaltEdge Dashboard "Create a new payment" (PIS)**

1. **Go to your SaltEdge Dashboard**
2. **Navigate to**: "Applications" → Your App → "Payments" or "PIS Testing"
3. **Click**: "Create a new payment"

#### **Fill in the Payment Form:**

**Required Fields:**
```
Provider Name: Air Bank (Sandbox)
Template Selection: SEPA
Customer IP Address: 127.0.0.1
```

**Payment Details:**
```
End to End Identification: TEST_PAYMENT_001
Amount: 50.00
Currency: CZK (or EUR/USD based on your account)
Creditor Name: Your Connected Account Name
Creditor IBAN: [Use your connected account's IBAN - see below]
Description: Test real-time notification
```

**Customer Details:**
```
Customer Device OS: iOS 17
Customer User Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)
Customer Last Logged At: 2025-09-25T18:00:00Z
```

#### **🔍 How to Find Your Account IBAN:**

From your webhook test logs, use one of these account numbers:
```
Account 1 (CZK): 1000053019/3030 → IBAN format needed
Account 2 (EUR): 1000053027/3030 → IBAN format needed  
Account 3 (USD): 1000053035/3030 → IBAN format needed
Account 4 (CZK): 1000053043/3030 → IBAN format needed
```

For Czech accounts, the IBAN format is typically:
```
CZ[check digits][bank code][account number]
Example: CZ6530300000001000053019
```

### **Method 2: Using Sandbox Transaction Simulation**

1. **In SaltEdge Dashboard**: Go to "Sandbox" or "Testing Tools"
2. **Select**: "Simulate Transaction"
3. **Choose**: Your connected account
4. **Set**: Positive amount (incoming payment)
5. **Trigger**: The simulation

### **Method 3: Manual Transaction Refresh**

You can also trigger a manual refresh to simulate new data:

```bash
curl -X POST http://localhost:3002/api/saltedge/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "connection_id": "1638084913456486823"
  }'
```

## 🔔 **Testing the Live Notification System**

### **Step 1: Set Up Live Monitoring**

1. **Connect a bank account** via `/connect-bank`
2. **Click "Live Transaction Monitor"** button
3. **Allow notifications** when prompted by browser
4. **Enable sound** (default: on)

### **Step 2: Create Test Payment**

1. **Use the SaltEdge Dashboard** method above
2. **Send payment TO your connected account** (positive amount)
3. **Wait 10-30 seconds** for processing

### **Step 3: Watch for Notifications**

You should see:

1. **Console Logs:**
```
🔔 Found 1 new transactions!
💰 1 incoming payments detected!
```

2. **Browser Notification:**
```
"New Payment Received!"
"Received 50.00 CZK"
```

3. **Sound Notification:** 🔊 *Beep beep beep*

4. **UI Updates:**
   - Green notification badge
   - New transaction in live feed
   - Updated account balance

## 🎵 **Sound Notification Details**

The system includes:
- **✅ Built-in notification sound** (Web Audio API)
- **✅ Browser notifications** (if permission granted)
- **✅ Visual badges** for new transactions
- **✅ Auto-refresh** every 10 seconds
- **✅ Manual refresh** button

### **Sound Settings:**
- Toggle sound on/off with 🔊/🔇 button
- Sound only plays for **incoming payments** (positive amounts)
- Uses Web Audio API (works in all modern browsers)

## 🕐 **Real-Time Monitoring Features**

### **Auto-Detection:**
- **Checks every 10 seconds** for new transactions
- **Filters by date** (only shows new transactions since last check)
- **Detects incoming payments** (positive amounts)
- **Shows live account balances**

### **Notification Types:**
1. **🔊 Sound Alert** - Plays for incoming payments
2. **📱 Browser Notification** - Shows payment details
3. **🔴 Visual Badge** - Shows count of new transactions
4. **📝 Live Feed** - Real-time transaction list

## 🚀 **Complete Testing Workflow**

### **1. Initial Setup:**
```bash
# Start your app
npm run dev

# Start ngrok tunnel (if needed for real webhooks)
ngrok http 3002
```

### **2. Connect Bank Account:**
1. Go to `http://localhost:3002/connect-bank`
2. Create customer → Connect bank → Complete flow
3. Click "Live Transaction Monitor"

### **3. Create Test Payment:**
1. **SaltEdge Dashboard** → Create new payment
2. **Amount**: 25.00 CZK
3. **Creditor**: Your connected account IBAN
4. **Submit** payment

### **4. Watch Live Notifications:**
1. **Within 10-30 seconds** you should see:
   - 🔊 Sound notification
   - 📱 Browser notification  
   - 🔴 "1 new" badge
   - 💚 Green transaction in feed

## 🔧 **Troubleshooting**

### **No Notifications Received:**
1. ✅ Check browser allows notifications
2. ✅ Verify sound is enabled (🔊 button)
3. ✅ Ensure payment amount is **positive** (incoming)
4. ✅ Check account IBAN matches connected account
5. ✅ Wait up to 60 seconds for processing

### **Sound Not Playing:**
1. ✅ Check sound toggle (🔊/🔇 button)
2. ✅ Try clicking page first (Chrome requires user interaction)
3. ✅ Check browser volume settings
4. ✅ Test with different browser

### **No New Transactions:**
1. ✅ Verify payment was sent TO your account (not FROM)
2. ✅ Check IBAN format is correct
3. ✅ Ensure sandbox provider supports instant transactions
4. ✅ Try manual refresh button

## 📊 **Expected Results**

After sending a test payment, you should see:

```
[SaltEdge Callback] Found 1 new transactions!
💰 1 incoming payments detected!
🎉 [SaltEdge Callback] INCOMING PAYMENT DETECTED! {
  amount: 25.00,
  currency: 'CZK',
  description: 'Test real-time notification',
  from: 'Test Sender',
  account: '1000053019/3030'
}
💰 Received 25.00 CZK from Test Sender
```

Your live monitoring page will show:
- ✅ Sound notification plays
- ✅ Browser notification appears
- ✅ Green "1 new" badge
- ✅ Transaction appears in live feed
- ✅ Account balance updates

## 🎉 **Success!**

Your real-time payment notification system is now fully functional! Every time someone sends money to your connected bank account, you'll get instant audio and visual notifications. Perfect for monitoring payments in real-time! 🔔💰
