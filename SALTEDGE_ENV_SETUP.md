# SaltEdge AIS API v6 Environment Setup

## Required Environment Variables for SaltEdge Integration

Add the following environment variables to your `.env.local` file:

```env
# SaltEdge API Configuration
SALTEDGE_APP_ID=your_saltedge_app_id_here
SALTEDGE_SECRET=your_saltedge_secret_here
SALTEDGE_BASE_URL=https://www.saltedge.com/api/v6
SALTEDGE_ENVIRONMENT=sandbox

# SaltEdge Connect Widget
NEXT_PUBLIC_SALTEDGE_CUSTOMER_IDENTIFIER=your_customer_identifier_here

# Base URL for callbacks (required for SaltEdge redirects)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## How to Get SaltEdge Credentials

### Step 1: Create SaltEdge Account
1. Visit [SaltEdge Dashboard](https://www.saltedge.com/dashboard)
2. Sign up for a developer account
3. Complete the verification process

### Step 2: Create Application
1. In the SaltEdge Dashboard, go to "Applications"
2. Click "Create Application"
3. Fill in your application details:
   - **Name**: Your application name (e.g., "ScanPay Integration")
   - **Description**: Brief description of your app
   - **Environment**: Select "Sandbox" for testing

### Step 3: Get API Credentials
After creating the application, you'll receive:
- **App ID** → Use as `SALTEDGE_APP_ID`
- **Secret** → Use as `SALTEDGE_SECRET`

### Step 4: Upload Public Key (IMPORTANT!)
**For SaltEdge API v6, you MUST upload a public key to your dashboard:**

1. **Generate RSA Key Pair**:
   ```bash
   # Generate private key
   openssl genrsa -out private_key.pem 2048
   
   # Generate public key from private key
   openssl rsa -in private_key.pem -pubout -out public_key.pem
   ```

2. **Upload Public Key to SaltEdge Dashboard**:
   - Go to your application settings in SaltEdge Dashboard
   - Find the "Public Key" section
   - Upload the contents of `public_key.pem`
   - Save the settings

3. **Add Private Key to Environment**:
   ```env
   SALTEDGE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
   MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...
   -----END PRIVATE KEY-----"
   ```

### Step 5: Configure Callback URLs
In your SaltEdge application settings, configure these callback URLs:
- **Success URL**: `http://localhost:3000/connect-bank/success`
- **Failure URL**: `http://localhost:3000/connect-bank/failure`
- **Notify URL**: `http://localhost:3000/api/saltedge/callbacks`

## API Endpoints Created

The following API endpoints are now available:

### Customer Management
- `POST /api/saltedge/customers` - Create a new customer
- `GET /api/saltedge/customers` - List all customers

### Bank Connections
- `POST /api/saltedge/connect` - Create a connect session
- `GET /api/saltedge/connections?customer_id=123` - List connections
- `GET /api/saltedge/connections/[connectionId]` - Show specific connection
- `DELETE /api/saltedge/connections/[connectionId]` - Remove connection

### Account & Transaction Data
- `GET /api/saltedge/accounts?connection_id=123` - List accounts
- `GET /api/saltedge/transactions?account_id=123` - List transactions

### Callbacks
- `POST /api/saltedge/callbacks` - Handle SaltEdge callbacks

## Pages Created

### Connect Bank Page
- **URL**: `/connect-bank`
- **Description**: Main page for connecting bank accounts using SaltEdge Connect Widget
- **Features**:
  - Create customer
  - Initiate bank connection
  - Display connected account information
  - Show recent transactions

### Success Page
- **URL**: `/connect-bank/success`
- **Description**: Success page after bank connection completion
- **Features**:
  - Confirmation message
  - Connection details
  - Navigation options

## Security Notes

⚠️ **IMPORTANT SECURITY CONSIDERATIONS:**

1. **API Credentials**: Never expose `SALTEDGE_SECRET` in client-side code
2. **Customer Data**: Store customer identifiers securely in your database
3. **HTTPS Required**: Use HTTPS in production for all SaltEdge communications
4. **Callback Verification**: Implement proper signature verification for callbacks
5. **Data Storage**: Follow GDPR/PCI compliance when storing financial data

## Testing in Sandbox

The sandbox environment provides:
- Fake bank providers for testing
- Simulated bank login flows
- Sample account and transaction data
- Safe testing without real bank connections

## Common Issues & Solutions

### 1. PublicKeyNotProvided Error
**This is the most common error with SaltEdge API v6!**

- **Solution**: You MUST upload a public key to your SaltEdge Dashboard
- **Steps**:
  1. Generate RSA key pair (see Step 4 above)
  2. Upload public key to SaltEdge Dashboard
  3. Add private key to your environment variables
  4. Restart your development server

### 2. ApiKeyNotFound Error
- **Check file name**: Use `.env.local` instead of `.env` for Next.js
- **Restart server**: Always restart your development server after adding environment variables
- **Check format**: Ensure no spaces around the `=` sign: `SALTEDGE_APP_ID=your_app_id`
- **Verify values**: Use the debug endpoint `/api/saltedge/debug` to check if variables are loaded
- **Check quotes**: Don't use quotes around values unless they contain spaces

Example correct format:
```env
SALTEDGE_APP_ID=12345abcdef
SALTEDGE_SECRET=abcd1234567890efgh
```

### 2. Invalid Signature Error
- Verify your `SALTEDGE_SECRET` is correct
- Check that the request URL and body match the signature generation
- Ensure timestamps are within the allowed window

### 3. Customer Already Exists
- Customer identifiers must be unique
- Use a different identifier or retrieve the existing customer

### 4. Connection Failed
- Check that the provider supports the requested features
- Verify consent scopes are properly configured
- Review callback URLs in SaltEdge dashboard

### 5. Environment Variables Not Loading
- Use `.env.local` for local development (this file is automatically loaded by Next.js)
- Restart your development server after adding new environment variables
- Verify all required variables are present and correctly formatted
- Check the debug endpoint at `/api/saltedge/debug` to verify variables are loaded

## Production Checklist

Before going live:
- [ ] Switch `SALTEDGE_ENVIRONMENT` to `live`
- [ ] Update `SALTEDGE_BASE_URL` if needed
- [ ] Configure production callback URLs
- [ ] Implement proper error handling
- [ ] Add data persistence layer
- [ ] Set up monitoring and logging
- [ ] Review security measures
- [ ] Test with real bank providers
