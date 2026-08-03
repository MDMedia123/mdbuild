export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, business, updates } = req.body;
    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      console.error('Missing Mailgun config:', { key: !!MAILGUN_API_KEY, domain: !!MAILGUN_DOMAIN });
      return res.status(500).json({ error: 'Server configuration error' });
    }

    if (!email || !name) {
      return res.status(400).json({ error: 'Name and email required' });
    }

    const authHeader = 'Basic ' + Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64');
    const toolLink = 'https://buildbymd.com/FreeBusinessPlanTemplate';

    const html = `<html><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f7f5f0;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:0;"><table width="100%" style="max-width:600px;background:#fff;" cellpadding="0" cellspacing="0"><tr><td style="padding:0;background:linear-gradient(135deg,#1a2847 0%,#0f1a3a 100%);text-align:center;"><div style="padding:48px 32px;"><div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:24px;"><div style="background:#212B42;padding:8px 12px;border-radius:8px;"><span style="color:#fff;font-size:16px;font-weight:700;">MD</span></div><span style="color:#fff;font-size:18px;font-weight:600;">Build</span></div><h1 style="margin:0 0 12px 0;font-size:36px;font-weight:700;color:#fff;line-height:1.2;">Build Better Businesses</h1><p style="margin:0;font-size:16px;color:#c1893d;line-height:1.6;">Everything you need to organize your idea, launch with clarity, and build better.</p></div></td></tr><tr><td style="padding:40px 32px;color:#1a2847;"><p style="margin:0 0 16px 0;font-size:15px;font-weight:600;">Hi ${name},</p><p style="margin:0 0 28px 0;font-size:14px;color:#5B6478;line-height:1.8;">Your free Business Plan Template is ready. With 8 guided sections—everything from market analysis to financial projections—you can build a professional business plan in minutes. No credit card. No commitment. Just clarity.</p><div style="background:#f7f5f0;border-radius:12px;padding:28px;margin:28px 0;border:1px solid #EAE6DA;"><p style="margin:0 0 16px 0;font-size:13px;font-weight:700;color:#1a2847;">Inside Your Template:</p><table style="width:100%;"><tr><td style="padding:8px 0;"><span style="font-size:12px;color:#5B6478;">✓ Executive Summary</span></td><td style="padding:8px 0;"><span style="font-size:12px;color:#5B6478;">✓ Market Analysis</span></td></tr><tr><td style="padding:8px 0;"><span style="font-size:12px;color:#5B6478;">✓ Product & Pricing</span></td><td style="padding:8px 0;"><span style="font-size:12px;color:#5B6478;">✓ Go-to-Market</span></td></tr><tr><td style="padding:8px 0;"><span style="font-size:12px;color:#5B6478;">✓ Financial Plan</span></td><td style="padding:8px 0;"><span style="font-size:12px;color:#5B6478;">✓ Operations</span></td></tr></table></div><div style="text-align:center;margin:32px 0;"><a href="${toolLink}" style="display:inline-block;background:#C1893D;color:white;padding:16px 56px;text-decoration:none;font-weight:600;font-size:15px;border-radius:10px;box-shadow:0 8px 24px rgba(33,43,66,0.12);">Start Building Your Plan</a></div><p style="margin:20px 0;font-size:12px;color:#6E6D62;text-align:center;font-style:italic;">Free to preview. Nothing to lose by taking a look.</p></td></tr><tr><td style="padding:0;background:#F7F5F0;"><table width="100%"><tr><td style="padding:32px 32px;text-align:center;border-top:1px solid #EAE6DA;"><h3 style="margin:0 0 12px 0;font-size:16px;font-weight:700;color:#1a2847;">Build Bigger With Business Blueprint</h3><p style="margin:0 0 16px 0;font-size:13px;color:#6E6D62;line-height:1.6;">21 guided modules covering strategy, branding, launch, growth, and everything between.</p><div style="background:#C1893D;padding:14px;border-radius:10px;margin:16px 0;"><p style="margin:0;font-size:14px;font-weight:700;color:#fff;">One-Time Purchase • $49</p></div><a href="https://buildbymd.com" style="display:inline-block;background:#212B42;color:white;padding:12px 40px;text-decoration:none;font-weight:600;font-size:13px;border-radius:10px;box-shadow:0 4px 12px rgba(33,43,66,0.1);">Explore Blueprint</a></td></tr></table></td></tr><tr><td style="padding:28px 32px;text-align:center;border-top:1px solid #EAE6DA;font-size:12px;color:#6E6D62;"><p style="margin:0 0 8px 0;"><strong style="color:#1a2847;">MD Build</strong></p><p style="margin:0;font-size:11px;">© 2026 MD Build. Built Better Businesses.</p></td></tr></table></td></tr></table></body></html>`;

    const formData = new URLSearchParams();
    formData.append('from', `MD Build <noreply@${MAILGUN_DOMAIN}>`);
    formData.append('to', email);
    formData.append('subject', 'Your Free Business Plan Template is Ready');
    formData.append('html', html);

    const mailgunResponse = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const responseText = await mailgunResponse.text();

    if (!mailgunResponse.ok) {
      console.error('Mailgun error:', { status: mailgunResponse.status, body: responseText });
      return res.status(500).json({ error: 'Failed to send email: ' + responseText });
    }

    return res.status(200).json({
      success: true,
      message: 'Email sent! Check your inbox.'
    });
  } catch (error) {
    console.error('Error in send-template-email:', error.message);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
}
