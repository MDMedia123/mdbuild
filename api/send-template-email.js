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
    const TEMPLATE_URL = 'https://buildbymd.com/Free_Business_Plan_Template.html';

    const formData = new URLSearchParams();
    formData.append('from', `MD Build <noreply@${MAILGUN_DOMAIN}>`);
    formData.append('to', email);
    formData.append('subject', 'Your Free Business Plan Template is Ready');

    const htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;background:#fafafa;font-family:Arial,sans-serif;"><table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#fafafa;"><tr><td align="center" style="padding:20px 0;"><table cellpadding="0" cellspacing="0" border="0" width="600" style="background:#fff;"><tr><td style="padding:24px 30px;border-bottom:1px solid #e5e7eb;"><div style="font-size:16px;font-weight:bold;"><span style="background:#1a2847;color:#fff;padding:6px 10px;border-radius:4px;font-size:13px;margin-right:8px;">MD</span><span style="color:#1a2847;">Build</span></div></td></tr><tr><td style="padding:48px 30px;background:#f9fafb;text-align:center;"><h1 style="margin:0 0 16px 0;font-size:36px;font-weight:700;color:#1a2847;">You're all set!</h1><p style="margin:0 0 20px 0;font-size:16px;color:#6b7280;line-height:1.6;">Your free Business Plan Template is ready to download.</p></td></tr><tr><td style="padding:32px 30px;text-align:center;"><a href="${TEMPLATE_URL}" style="background:#b8860b;color:#fff;padding:14px 40px;text-decoration:none;font-weight:bold;font-size:15px;border-radius:6px;display:inline-block;margin:0;">Download Your Free Template</a></td></tr><tr><td style="padding:48px 30px;text-align:center;"><h2 style="margin:0 0 32px 0;font-size:22px;font-weight:700;color:#1a2847;">What you get</h2><table cellpadding="16" cellspacing="0" border="0" width="100%"><tr><td width="25%" style="text-align:center;"><div style="font-size:32px;margin-bottom:8px;">📋</div><p style="margin:0 0 8px 0;font-weight:600;color:#1a2847;font-size:13px;">Professionally Designed</p><p style="margin:0;font-size:12px;color:#6b7280;">Clean and easy to customize.</p></td><td width="25%" style="text-align:center;"><div style="font-size:32px;margin-bottom:8px;">⏱️</div><p style="margin:0 0 8px 0;font-weight:600;color:#1a2847;font-size:13px;">Save Time</p><p style="margin:0;font-size:12px;color:#6b7280;">Start with proven framework.</p></td><td width="25%" style="text-align:center;"><div style="font-size:32px;margin-bottom:8px;">🚀</div><p style="margin:0 0 8px 0;font-weight:600;color:#1a2847;font-size:13px;">Built for Action</p><p style="margin:0;font-size:12px;color:#6b7280;">Plan, launch and grow.</p></td><td width="25%" style="text-align:center;"><div style="font-size:32px;margin-bottom:8px;">📊</div><p style="margin:0 0 8px 0;font-weight:600;color:#1a2847;font-size:13px;">Focused on Results</p><p style="margin:0;font-size:12px;color:#6b7280;">Move closer to goals.</p></td></tr></table></td></tr><tr><td style="padding:48px 30px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;"><h2 style="margin:0 0 16px 0;font-size:22px;font-weight:700;color:#1a2847;">Ready to build more?</h2><p style="margin:0 0 24px 0;font-size:15px;color:#374151;line-height:1.6;">MD Build gives you everything to plan, launch and grow your business — all in one place.</p><a href="https://buildbymd.com" style="background:#b8860b;color:#fff;padding:12px 32px;text-decoration:none;font-weight:bold;font-size:14px;border-radius:6px;display:inline-block;">Explore MD Build →</a><p style="margin:16px 0 0 0;font-size:13px;color:#6b7280;"><strong>MD Business Launch</strong> — 21 modules, $49 lifetime</p></td></tr><tr><td style="padding:32px 30px;border-top:1px solid #e5e7eb;text-align:center;font-size:13px;color:#6b7280;"><p style="margin:0 0 8px 0;font-weight:bold;color:#1a2847;">MD Build</p><p style="margin:0 0 12px 0;">We're excited to be part of your journey</p><p style="margin:0 0 12px 0;"><a href="https://linkedin.com" style="color:#6b7280;text-decoration:none;margin:0 8px;">in</a><a href="https://instagram.com" style="color:#6b7280;text-decoration:none;margin:0 8px;">ig</a><a href="https://youtube.com" style="color:#6b7280;text-decoration:none;margin:0 8px;">yt</a></p><p style="margin:12px 0 0 0;font-size:11px;border-top:1px solid #e5e7eb;padding-top:12px;">© 2025 MD Build. All rights reserved.</p></td></tr></table></td></tr></table></body></html>`;

    formData.append('html', htmlContent);

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
