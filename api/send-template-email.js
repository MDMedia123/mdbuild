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

    const html = `<html><body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f3f4f6;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:10px 0;"><table width="100%" style="max-width:620px;background:#fff;" cellpadding="0" cellspacing="0"><tr><td style="padding:0;background:linear-gradient(135deg,#1a2847 0%,#2d3e5f 100%);text-align:center;"><div style="padding:36px 32px;"><div style="display:inline-flex;align-items:center;gap:12px;margin-bottom:20px;"><div style="background:#c1893d;padding:10px 14px;border-radius:8px;font-size:18px;font-weight:700;color:#fff;">MD</div><span style="color:#fff;font-size:20px;font-weight:700;">Build</span></div><h1 style="margin:0 0 8px 0;font-size:28px;font-weight:700;color:#fff;">Your Business Plan Awaits</h1><p style="margin:0;font-size:14px;color:#c1893d;font-weight:600;">Everything you need to organize your idea, launch with clarity, and build better</p></div></td></tr><tr><td style="padding:32px 32px;color:#1a2847;"><p style="margin:0 0 20px 0;font-size:14px;font-weight:600;">Hi ${name},</p><p style="margin:0 0 24px 0;font-size:14px;color:#374151;line-height:1.7;">Your comprehensive Business Plan Template is ready to use right now. With 8 guided sections and everything you need to build from idea to launch, you're just minutes away from having a professional business plan in hand.</p><table width="100%" style="margin:24px 0;border-radius:8px;overflow:hidden;"><tr style="background:linear-gradient(135deg,#f0f9ff 0%,#e8f4ff 100%);"><td style="padding:20px;border-left:6px solid #2f8577;"><p style="margin:0 0 12px 0;font-size:13px;font-weight:700;color:#1a2847;">📋 What's Inside:</p><table style="width:100%;"><tr><td style="padding:6px 0;"><span style="font-size:12px;color:#374151;">✓ Executive Summary</span></td><td style="padding:6px 0;"><span style="font-size:12px;color:#374151;">✓ Market Analysis</span></td></tr><tr><td style="padding:6px 0;"><span style="font-size:12px;color:#374151;">✓ Product Strategy</span></td><td style="padding:6px 0;"><span style="font-size:12px;color:#374151;">✓ Go-to-Market</span></td></tr><tr><td style="padding:6px 0;"><span style="font-size:12px;color:#374151;">✓ Financial Projections</span></td><td style="padding:6px 0;"><span style="font-size:12px;color:#374151;">✓ Operations Plan</span></td></tr></table></td></tr></table><p style="text-align:center;margin:28px 0;"><a href="${toolLink}" style="display:inline-block;background:linear-gradient(135deg,#c1893d 0%,#a07230 100%);color:white;padding:16px 52px;text-decoration:none;font-weight:bold;font-size:15px;border-radius:8px;box-shadow:0 6px 16px rgba(193,137,61,0.35);transition:transform 0.2s;">Start Building Your Plan →</a></p><p style="margin:20px 0;font-size:13px;color:#6b7280;text-align:center;font-style:italic;">No credit card needed. Download anytime as PDF.</p></td></tr><tr><td style="padding:0;"><table width="100%" style="background:linear-gradient(135deg,#1a2847 0%,#2d3e5f 100%);"><tr><td style="padding:28px 32px;text-align:center;"><h3 style="margin:0 0 12px 0;font-size:15px;font-weight:700;color:#fff;">Ready to Go Deeper?</h3><p style="margin:0 0 16px 0;font-size:13px;color:rgba(255,255,255,0.9);line-height:1.6;">Business Blueprint gives you 21 guided modules covering everything from strategy and branding to operations and launch tracking.</p><table width="100%" style="margin:14px 0;"><tr><td style="background:#c1893d;padding:14px;border-radius:6px;text-align:center;"><p style="margin:0;font-size:13px;font-weight:bold;color:#fff;">Lifetime Access • Just $49</p></td></tr></table><p style="margin:14px 0;"><a href="https://buildbymd.com" style="display:inline-block;background:#fff;color:#1a2847;padding:10px 32px;text-decoration:none;font-weight:bold;font-size:12px;border-radius:6px;">Learn More</a></p></td></tr></table></td></tr><tr><td style="padding:20px 32px;text-align:center;border-top:2px solid #e5e7eb;font-size:11px;color:#6b7280;"><p style="margin:0 0 6px 0;"><strong style="color:#1a2847;">MD Build</strong> • Built Better Businesses</p><p style="margin:0;font-size:10px;">© 2026 MD Build. Questions? Reply to this email.</p></td></tr></table></td></tr></table></body></html>`;

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
