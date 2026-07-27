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

    const html = `<html><body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f3f4f6;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:20px 0;"><table width="100%" style="max-width:600px;background:#fff;" cellpadding="0" cellspacing="0"><tr><td style="padding:40px 32px;background:linear-gradient(135deg,#1a2847 0%,#2d3e5f 100%);text-align:center;"><h1 style="margin:0;font-size:32px;font-weight:bold;color:#fff;">You're All Set! 🎉</h1><p style="margin:8px 0 0 0;font-size:14px;color:#c1893d;font-weight:600;">Your free Business Plan Template is ready to use</p></td></tr><tr><td style="padding:32px;color:#1a2847;"><p style="margin:0 0 8px 0;font-size:14px;font-weight:600;">Hi ${name},</p><p style="margin:0 0 20px 0;font-size:14px;color:#374151;line-height:1.6;">Your comprehensive Business Plan Template with all 21 sections is ready. Start building your business plan with clarity and structure.</p><table width="100%" style="margin:24px 0;"><tr><td style="background:#f0f9ff;border-left:4px solid #2f8577;padding:16px;border-radius:4px;"><p style="margin:0;font-size:12px;color:#1a2847;"><strong>What's inside:</strong></p><p style="margin:6px 0 0 0;font-size:12px;color:#374151;">✓ 8 guided sections<br>✓ Auto-save to local storage<br>✓ Professional PDF download<br>✓ Editable templates</p></td></tr></table><p style="text-align:center;margin:24px 0;"><a href="${toolLink}" style="display:inline-block;background:#c1893d;color:white;padding:14px 48px;text-decoration:none;font-weight:bold;font-size:14px;border-radius:6px;box-shadow:0 4px 12px rgba(193,137,61,0.3);">Start Building Your Plan →</a></p></td></tr><tr><td style="padding:0;"><table width="100%" style="background:#f9fafb;"><tr><td style="padding:32px;text-align:center;border-top:1px solid #e5e7eb;"><h3 style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#1a2847;">Want the Full Platform?</h3><p style="margin:0 0 12px 0;font-size:13px;color:#6b7280;line-height:1.5;">Get MD Business Blueprint — 21 modules with everything from idea to first sale, plus lifetime access and future updates.</p><table width="100%" style="margin:12px 0;"><tr><td style="background:#fff4e6;padding:12px;border-radius:6px;text-align:center;"><p style="margin:0;font-size:12px;font-weight:bold;color:#8A5A1E;">Just $49 for Lifetime Access</p></td></tr></table><p style="margin:12px 0 0 0;"><a href="https://buildbymd.com" style="display:inline-block;background:#1a2847;color:white;padding:10px 32px;text-decoration:none;font-weight:bold;font-size:12px;border-radius:6px;">Explore Business Blueprint</a></p></td></tr></table></td></tr><tr><td style="padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;font-size:11px;color:#6b7280;"><p style="margin:0 0 4px 0;"><strong>MD Build</strong> • Built Better Businesses</p><p style="margin:0;">© 2025 MD Build. All rights reserved.</p></td></tr></table></td></tr></table></body></html>`;

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
