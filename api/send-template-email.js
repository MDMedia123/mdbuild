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
    const TEMPLATE_URL = 'https://mdbuild.vercel.app/Free_Business_Plan_Template.html';

    const formData = new URLSearchParams();
    formData.append('from', `MD Build <noreply@${MAILGUN_DOMAIN}>`);
    formData.append('to', email);
    formData.append('subject', 'Your Free Business Plan Template is Ready');
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MD Build</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:20px auto;background-color:#ffffff;border-radius:8px;">
<div style="background:#1F2937;padding:32px 24px;text-align:center;">
<div style="font-size:28px;font-weight:bold;color:#C1893D;margin:0 0 8px 0;">MD Build</div>
<div style="color:#D1D5DB;font-size:14px;margin:0;">Your template is ready!</div>
</div>
<div style="padding:32px 24px;color:#374151;font-size:15px;line-height:1.6;">
<p style="margin:0 0 16px 0;font-weight:600;font-size:16px;">Hi ${name}!</p>
<p style="margin:0 0 24px 0;">Your free Business Plan Template is ready to download. This comprehensive template includes all 21 sections of a professional business plan — everything you need to launch with clarity.</p>
<div style="margin:32px 0;text-align:center;">
<a href="${TEMPLATE_URL}" style="background-color:#C1893D;color:white;padding:14px 40px;text-decoration:none;font-weight:bold;font-size:16px;border-radius:6px;display:inline-block;">Download Template</a>
</div>
<div style="background-color:#f9fafb;border-left:4px solid #C1893D;padding:16px;margin:24px 0;">
<p style="margin:0 0 8px 0;font-weight:bold;">Ready to go deeper?</p>
<p style="margin:0 0 12px 0;">Take your template to completion with <strong>MD Business Launch</strong> — a 21-module guided platform that walks you through everything from idea validation to first sale.</p>
<p style="margin:0 0 16px 0;"><strong>Just $49 for lifetime access.</strong></p>
<a href="https://buildbymd.com" style="background-color:#374151;color:white;padding:10px 24px;text-decoration:none;font-weight:bold;font-size:14px;border-radius:6px;display:inline-block;">Explore MD Business Launch</a>
</div>
<p style="margin:24px 0 0 0;font-size:12px;color:#6b7280;">${updates ? '✓ You\'ve opted in to receive tips on building your business.' : 'You won\'t receive additional emails unless you opt in.'}</p>
</div>
<div style="background-color:#f9fafb;border-top:1px solid #e5e7eb;padding:24px;text-align:center;font-size:12px;color:#6b7280;">
<p style="margin:0 0 12px 0;"><strong>MD Build</strong><br>All your tools. One platform.</p>
<p style="margin:0 0 12px 0;"><a href="https://buildbymd.com" style="color:#C1893D;text-decoration:none;">buildbymd.com</a></p>
<p style="margin:0;font-size:11px;">© 2025 MD Media. All rights reserved.</p>
</div>
</div>
</body>
</html>`;

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
