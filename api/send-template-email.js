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
    const dlLink = 'https://buildbymd.com/Free_Business_Plan_Template.html';

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: #f9fafb;">
<table width="100%" cellpadding="0" cellspacing="0" style="background: #f9fafb;">
<tr><td align="center" style="padding: 40px 0;">
<table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; overflow: hidden;">

<!-- Header -->
<tr><td style="padding: 40px 40px 20px 40px; text-align: center; border-bottom: 1px solid #e5e7eb;">
<div style="font-size: 24px; font-weight: 700; color: #c1893d; margin: 0;">MD Build</div>
<div style="font-size: 14px; color: #6b7280; margin-top: 4px;">Your first step starts now</div>
</td></tr>

<!-- Hero -->
<tr><td style="padding: 40px 40px; text-align: center; background: #f9fafb;">
<h1 style="margin: 0 0 12px 0; font-size: 32px; font-weight: 700; color: #1a2847; line-height: 1.3;">You're all set!</h1>
<p style="margin: 0 0 24px 0; font-size: 16px; color: #6b7280; line-height: 1.5;">Your free Business Plan Template is ready to download.</p>
</td></tr>

<!-- Content -->
<tr><td style="padding: 0 40px; color: #374151; font-size: 15px; line-height: 1.6;">
<p style="margin: 0 0 20px 0;">Hi ${name},</p>
<p style="margin: 0 0 24px 0;">Your comprehensive Business Plan Template with all 21 sections is ready. Everything you need to launch with clarity.</p>
</td></tr>

<!-- CTA Button -->
<tr><td style="padding: 24px 40px; text-align: center;">
<a href="${dlLink}" style="background: #c1893d; color: white; padding: 14px 40px; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 6px; display: inline-block; border: none;">Download Your Free Template</a>
</td></tr>

<!-- Upsell -->
<tr><td style="padding: 24px 40px; background: #f9fafb; border-top: 1px solid #e5e7eb;">
<p style="margin: 0 0 12px 0; font-weight: 600; color: #1a2847;">Ready to go deeper?</p>
<p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280; line-height: 1.6;">Take your template to completion with <strong>MD Business Launch</strong> — 21 guided modules that walk you through everything from idea validation to first sale.</p>
<p style="margin: 0 0 16px 0; font-weight: 600; color: #1a2847;">Just $49 for lifetime access</p>
<a href="https://buildbymd.com" style="background: #1a2847; color: white; padding: 10px 24px; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 6px; display: inline-block;">Learn More</a>
</td></tr>

<!-- Footer -->
<tr><td style="padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
<p style="margin: 0 0 8px 0;"><strong>MD Build</strong><br>All your tools. One platform.</p>
<p style="margin: 8px 0; font-size: 11px;">© 2025 MD Build. All rights reserved.</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

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
