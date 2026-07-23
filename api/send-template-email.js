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
    const toolLink = 'https://buildbymd.com/FreeBusinessPlanTemplate.html';

    const html = `<html><body style="margin:0;padding:0;font-family:Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center"><table width="100%" style="max-width:600px;background:#fff;" cellpadding="0" cellspacing="0"><tr><td style="padding:32px;background:#f9fafb;text-align:center;border-bottom:3px solid #c1893d;"><h1 style="margin:0;font-size:24px;font-weight:bold;color:#1a2847;">You're All Set!</h1><p style="margin:6px 0 0 0;font-size:13px;color:#6b7280;">Your free Business Plan Template is ready</p></td></tr><tr><td style="padding:28px 32px;color:#374151;font-size:13px;line-height:1.6;"><p style="margin:0 0 12px 0;font-weight:bold;">Hi ${name},</p><p style="margin:0 0 16px 0;">Your comprehensive Business Plan Template with all 21 sections is ready. Everything you need to launch with clarity.</p><p style="text-align:center;margin:20px 0;"><a href="${toolLink}" style="display:inline-block;background:#c1893d;color:white;padding:12px 40px;text-decoration:none;font-weight:bold;font-size:13px;border-radius:4px;">Start Building Your Plan</a></p></td></tr><tr><td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;"><p style="margin:0 0 10px 0;font-weight:bold;color:#1a2847;font-size:13px;">Ready to go deeper?</p><p style="margin:0 0 10px 0;font-size:12px;color:#6b7280;line-height:1.5;">Take your template to completion with MD Business Launch — 21 modules, everything from idea to first sale.</p><p style="margin:0 0 12px 0;font-weight:bold;color:#1a2847;font-size:13px;">Just $49 for lifetime access</p><p style="margin:0;"><a href="https://buildbymd.com" style="display:inline-block;background:#1a2847;color:white;padding:8px 28px;text-decoration:none;font-weight:bold;font-size:12px;border-radius:4px;">Learn More</a></p></td></tr><tr><td style="padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;"><p style="margin:0 0 4px 0;"><strong>MD Build</strong></p><p style="margin:0;">© 2025 MD Build. All rights reserved.</p></td></tr></table></td></tr></table></body></html>`;

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
