# Stripe Integration Setup

This document outlines the steps needed to fully integrate Stripe payment processing for Business Blueprint purchases.

## Environment Variables

Add the following environment variables to your Vercel project settings:

```
STRIPE_SECRET_KEY=sk_test_... (or sk_live_... for production)
STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_... for production)
STRIPE_WEBHOOK_SECRET=whsec_... (from webhook endpoint configuration)
```

### How to get these keys:

1. **Create a Stripe Account** at https://stripe.com
2. **Get API Keys:**
   - Go to Stripe Dashboard → Developers → API Keys
   - Copy your Secret Key and Publishable Key
   - Replace placeholders in checkout.html line 251 with your Publishable Key

3. **Set up Webhook:**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://buildbymd.com/api/webhook`
   - Listen to: `payment_intent.succeeded`
   - Copy the Signing Secret to `STRIPE_WEBHOOK_SECRET`

## Files Modified/Created

- **checkout.html** - Payment form with Stripe card element
- **api/create-payment-intent.js** - Creates payment intent on server
- **api/webhook.js** - Listens for successful payments and records purchase
- **checkout-success.html** - Success page shown after payment
- **vercel.json** - Added routes for /checkout and /checkout-success

## Database Schema Required

Create a `purchases` table in Supabase with columns:

```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  product VARCHAR(100) NOT NULL,
  stripe_payment_intent_id VARCHAR(255) NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_email ON purchases(email);
CREATE INDEX idx_product ON purchases(product);
```

## Testing Payments

Use Stripe's test card numbers:

- **Visa (Success):** 4242 4242 4242 4242
- **Visa (Declined):** 4000 0000 0000 0002
- **AmEx (Success):** 3782 822463 10005
- Expiry: Any future date (e.g., 12/26)
- CVV: Any 3 digits (e.g., 123)

## Post-Purchase Flow

1. **Customer completes checkout** → Pays via Stripe
2. **Webhook receives `payment_intent.succeeded`** → Records purchase in database
3. **Customer redirected to success page** → Shows transaction details
4. **Customer signs in with email** → Gains access to Business Blueprint

## Next Steps

1. Set up Stripe account and get API keys
2. Add environment variables to Vercel
3. Create `purchases` table in Supabase
4. Test payment flow with test card numbers
5. Add confirmation email after purchase (currently has TODO in webhook handler)
6. Set up admin dashboard to view purchases
