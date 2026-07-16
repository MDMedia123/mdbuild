# MD Build — Incident Response Guide

## Site is Down — What to Do

### Step 1: Check if it's YOU or VERCEL (5 min)

**Is buildbymd.com returning an error?**
- Yes → Go to Step 2
- No → Go to Step 3

### Step 2: Check Vercel Status

1. Go to **vercel.com/status** 
2. Look for outages or incidents
3. If Vercel is down:
   - Wait (they fix it, usually <1 hour)
   - Tweet "We're experiencing downtime, back soon"
   - Nothing you can do

### Step 3: Check Your Code

**Most likely:** You broke something in a recent update

1. Go to **GitHub.com** → Your repository
2. Look at recent commits (last 24 hours)
3. Find the commit that might have caused it
4. Options:
   - **If you know the fix:** Edit file → push → Vercel redeploys (2 min)
   - **If unsure:** Revert to previous version:
     - GitHub → find good commit
     - Click "Revert" → Vercel auto-deploys
     - Debug later

### Step 4: Check Database (Supabase)

1. Go to **supabase.com** → Your project
2. Check if database is responsive
3. If down:
   - Wait (they'll fix it)
   - Users can't save data
   - Notify customers

### Step 5: Notify Customers

**Email template:**

```
Subject: MD Build — Brief Downtime [RESOLVED]

Hi everyone,

We experienced a brief outage from [TIME] to [TIME]. 
We've identified and fixed the issue.

Everything is working now. Thank you for your patience.

— MD Build Team
```

---

## Prevention Checklist

- [ ] Test locally before pushing to GitHub
- [ ] Review changes before pushing
- [ ] Keep recent commits saved (easy rollback)
- [ ] Monitor Vercel deployments (takes 2 min)
- [ ] Have a monitoring tool (Uptime Robot - free)

---

## Emergency Contacts

- **Vercel Support:** vercel.com/help
- **Supabase Support:** supabase.com/support
- **Your Developer:** [Your contact or you]

---

## Response Time Goals

- Detect issue: 5 minutes
- Diagnose: 10 minutes
- Fix/rollback: 5 minutes
- **Total: 20 minutes max downtime**
