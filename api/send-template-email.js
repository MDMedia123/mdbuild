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

    const html = `<html><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f7f5f0;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:0;"><table width="100%" style="max-width:620px;background:#fff;" cellpadding="0" cellspacing="0"><tr><td style="padding:0;background:linear-gradient(135deg,#1a2847 0%,#0f1a3a 100%);text-align:center;"><div style="padding:56px 32px;"><div style="display:inline-flex;align-items:center;gap:12px;margin-bottom:28px;"><div style="background:#2d3a52;padding:10px 14px;border-radius:10px;"><span style="color:#fff;font-size:18px;font-weight:700;letter-spacing:0.5px;">MD</span></div><span style="color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Build</span></div><h1 style="margin:0 0 16px 0;font-size:40px;font-weight:700;color:#fff;line-height:1.15;letter-spacing:-0.5px;">Build Better Businesses</h1><p style="margin:0;font-size:17px;color:#c1893d;line-height:1.6;font-weight:500;">Your free business plan template is here</p></div></td></tr><tr><td style="padding:48px 40px;color:#1a2847;"><p style="margin:0 0 20px 0;font-size:16px;font-weight:600;line-height:1.4;">Hi ${name},</p><p style="margin:0 0 32px 0;font-size:15px;color:#5B6478;line-height:1.8;">We built this template to help you think through every aspect of your business—from market opportunity to financial projections. It's the same framework we use with founders we work with directly.</p><p style="margin:0 0 32px 0;font-size:15px;color:#5B6478;line-height:1.8;"><strong style="color:#1a2847;">8 guided sections:</strong> Executive summary, market analysis, product strategy, pricing, go-to-market, financial projections, operations, and launch timeline.</p><div style="background:linear-gradient(135deg,#f7f5f0 0%,#f0ede1 100%);border-radius:14px;padding:32px;margin:32px 0;border:1px solid #EAE6DA;"><p style="margin:0 0 20px 0;font-size:14px;font-weight:700;color:#1a2847;text-transform:uppercase;letter-spacing:0.5px;text-align:center;">What You Get</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;"><div><div style="font-size:28px;margin-bottom:8px;">📋</div><span style="font-size:13px;color:#1a2847;font-weight:500;">Interactive sections</span></div><div><div style="font-size:28px;margin-bottom:8px;">💾</div><span style="font-size:13px;color:#1a2847;font-weight:500;">Download as PDF</span></div><div><div style="font-size:28px;margin-bottom:8px;">🎯</div><span style="font-size:13px;color:#1a2847;font-weight:500;">Share with advisors</span></div><div><div style="font-size:28px;margin-bottom:8px;">⚡</div><span style="font-size:13px;color:#1a2847;font-weight:500;">Start now, no signup</span></div></div></div><div style="text-align:center;margin:36px 0;"><a href="${toolLink}" style="display:inline-block;background:#C1893D;color:white;padding:18px 64px;text-decoration:none;font-weight:700;font-size:16px;border-radius:12px;box-shadow:0 12px 32px rgba(193,137,61,0.25);transition:all 0.2s;border:2px solid #C1893D;">Build Your Plan Now</a></div></td></tr><tr><td style="padding:0;background:linear-gradient(135deg,#1a2847 0%,#0f1a3a 100%);"><table width="100%"><tr><td style="padding:40px 32px;text-align:center;"><h3 style="margin:0 0 14px 0;font-size:18px;font-weight:700;color:#fff;">Ready for the Full Picture?</h3><p style="margin:0 0 24px 0;font-size:14px;color:#c9ccd8;line-height:1.7;">Business Blueprint takes you through 21 guided modules—everything from brand strategy to post-launch growth. The same structured approach, now with templates, worksheets, and expert insights.</p><div style="background:#C1893D;padding:16px;border-radius:12px;margin:20px 0;"><p style="margin:0;font-size:15px;font-weight:700;color:#fff;">One-Time Purchase • $49</p><p style="margin:8px 0 0 0;font-size:12px;color:#fff;opacity:0.9;">Lifetime access</p></div><a href="https://buildbymd.com/checkout" style="display:inline-block;background:#fff;color:#1a2847;padding:14px 48px;text-decoration:none;font-weight:700;font-size:14px;border-radius:10px;box-shadow:0 8px 20px rgba(0,0,0,0.2);">Get Business Blueprint</a></td></tr></table></td></tr><tr><td style="padding:32px 32px;text-align:center;border-top:1px solid #EAE6DA;font-size:12px;color:#6E6D62;background:#f7f5f0;"><p style="margin:0 0 12px 0;"><strong style="color:#1a2847;">MD Build</strong> — Guided systems for building better businesses</p><p style="margin:0;font-size:11px;">© 2026 MD Build. All rights reserved.</p></td></tr></table></td></tr></table></body></html>`;

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
