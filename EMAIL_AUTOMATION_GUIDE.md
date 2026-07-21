# MD Build Email Automation Guide

## Current Status: Email Sequences Feature Complete ✅

Your admin portal now includes:
- **Tasks/To-Do List** - Track launch activities with checkoff and notes
- **Email Sequences** - 5-email nurturing sequence for free template leads
- **Email Campaign** - Bulk email sender using Mailgun API

---

## Phase 1: Email Automation (Next Step)

### What It Will Do
Automatically send the 5-email sequence to leads who download your free template, on this schedule:
- **Day 0**: Welcome + template delivery
- **Day 2**: How to use template + tips
- **Day 5**: Social proof example
- **Day 9**: Business Blueprint intro ($49)
- **Day 14**: Final offer with urgency

### Implementation Steps

#### 1. Modify Lead Capture (Your Free Template Landing Page)
Add these fields when capturing emails:
```javascript
{
  email: "user@example.com",
  name: "Jane Doe",
  downloadedAt: new Date().toISOString(),
  source: "free_template",
  sequenceEnrolled: true
}
```

Store in Supabase table: `leads` with columns:
- `id` (UUID)
- `email` (text)
- `name` (text)
- `downloaded_at` (timestamp)
- `source` (text)
- `sequence_enrolled` (boolean)
- `created_at` (timestamp)

#### 2. Create Automation Serverless Function
Create `api/send-sequence-email.js`:

```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { leadId, emailKey, recipientEmail, recipientName } = req.body;
    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

    // Get email content from your sequence
    const emailSequence = {
      email1: {
        subject: "Your free Business Blueprint template is ready",
        body: "Hi [Name],\n\nThank you for downloading..."
      },
      email2: {
        subject: "3 ways successful founders use this template",
        body: "Hi [Name],\n\nHoping you've had a chance..."
      },
      // etc...
    };

    const email = emailSequence[emailKey];
    if (!email) {
      return res.status(400).json({ error: 'Email not found' });
    }

    const authHeader = 'Basic ' + Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64');

    const formData = new URLSearchParams();
    formData.append('from', `MD Build <noreply@${MAILGUN_DOMAIN}>`);
    formData.append('to', recipientEmail);
    formData.append('subject', email.subject);
    formData.append('html', email.body.replace('[Name]', recipientName));

    const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to send email' });
    }

    // Log the send in your database
    // UPDATE leads SET email1_sent_at = NOW() WHERE id = leadId

    return res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

#### 3. Create Sequence Trigger (Cron Job or Event-Driven)

**Option A: Vercel Cron (Recommended)**
Create `.vercel/crons/send-sequence.js`:

```javascript
export default async function sendSequenceEmails(req, res) {
  // 1. Query Supabase for leads who should receive emails today
  const leadQuery = `
    SELECT id, email, name, downloaded_at FROM leads
    WHERE sequence_enrolled = true
    AND downloaded_at <= NOW()
  `;

  // 2. Calculate which email each lead should receive
  const leads = await supabase.from('leads').select('*').eq('sequence_enrolled', true);

  for (const lead of leads) {
    const daysElapsed = Math.floor(
      (new Date() - new Date(lead.downloaded_at)) / (1000 * 60 * 60 * 24)
    );

    let emailToSend = null;
    if (daysElapsed === 0 && !lead.email1_sent_at) emailToSend = 'email1';
    else if (daysElapsed === 2 && !lead.email2_sent_at) emailToSend = 'email2';
    else if (daysElapsed === 5 && !lead.email3_sent_at) emailToSend = 'email3';
    else if (daysElapsed === 9 && !lead.email4_sent_at) emailToSend = 'email4';
    else if (daysElapsed === 14 && !lead.email5_sent_at) emailToSend = 'email5';

    // 3. Send via Mailgun
    if (emailToSend) {
      await fetch('/api/send-sequence-email', {
        method: 'POST',
        body: JSON.stringify({
          leadId: lead.id,
          emailKey: emailToSend,
          recipientEmail: lead.email,
          recipientName: lead.name
        })
      });

      // Mark as sent
      await supabase.from('leads')
        .update({ [`${emailToSend}_sent_at`]: new Date().toISOString() })
        .eq('id', lead.id);
    }
  }

  return res.status(200).json({ success: true });
}
```

Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/send-sequence",
    "schedule": "0 9 * * *"
  }]
}
```

---

## Phase 2: Email Analytics (After Automation Works)

Track:
- **Opens** - Mailgun webhook for open events
- **Clicks** - Mailgun webhook for click events
- **Conversions** - Supabase trigger when lead purchases

Create `api/mailgun-webhook.js` to handle events:
- Store in `email_events` table
- Link to lead via email address
- Calculate conversion rate

---

## Phase 3: Stripe Integration

### Current Setup Needed:
1. Create Stripe account at stripe.com
2. Get API keys (public and secret)
3. Add to Vercel environment variables

### What You'll Need:
- Product ID for "Business Blueprint" ($49)
- Product ID for "Creative Studios" (TBD on pricing)
- Webhook endpoint to track purchases

---

## Quick Checklist

- [ ] Modify free template landing page to capture signup date
- [ ] Create Supabase `leads` table with all required fields
- [ ] Deploy `send-sequence-email.js` serverless function
- [ ] Set up Vercel cron job for daily email sending
- [ ] Test by downloading template and checking emails arrive on schedule
- [ ] Set up Mailgun webhooks for open/click tracking
- [ ] Create analytics dashboard in admin portal
- [ ] Complete Stripe integration
- [ ] Finalize Creative Studios pricing

---

## Files to Create/Modify

### New Files:
- `api/send-sequence-email.js` - Email sending function
- `.vercel/crons/send-sequence.js` - Daily automation trigger
- `admin/email-analytics.html` - Analytics dashboard
- Database migrations for email tracking

### Modify:
- Your free template landing page (capture `downloadedAt`)
- `MD_Admin_Portal.html` (add Analytics link)

---

## Testing Checklist

1. ✅ **Sequences page loads** - DONE
2. ✅ **Can view email copy** - DONE
3. ✅ **Can activate sequence** - DONE (stored in localStorage)
4. ⏳ **Automation sends emails on schedule** - Next test
5. ⏳ **Analytics dashboard shows opens/clicks** - After webhooks
6. ⏳ **Stripe checkout works** - After Stripe integration

---

## Success Metrics

Once automation is live, track:
- **Email delivery rate** - Should be >95%
- **Open rate** - Target 25-35% (free template offers typically get 15-20%)
- **Click rate** - Target 3-5%
- **Conversion rate** - Target 2-5% (free template → paid course)
- **Average days to purchase** - Track from Day 0 to purchase

**Goal for first 100 template downloads:**
- 25-30 email opens on Day 0
- 2-3 conversions to Business Blueprint ($49)
- **Revenue generated: $98-$147 from 100 leads**
