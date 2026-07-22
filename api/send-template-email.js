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
<body style="margin:0;padding:0;background-color:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
<table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#fafafa;">
<tr>
<td align="center" style="padding:20px;">
<table width="100%" max-width="600" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;">

<!-- Header -->
<tr>
<td style="padding:24px;border-bottom:1px solid #e5e7eb;">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td style="font-size:16px;font-weight:bold;">
<span style="background-color:#1a2847;color:white;padding:6px 10px;border-radius:4px;font-size:14px;margin-right:8px;">MD</span><span style="color:#1a2847;font-weight:bold;">Build</span>
</td>
<td align="right" style="font-size:12px;color:#6b7280;">
Free Template | Your first step starts now.
</td>
</tr>
</table>
</td>
</tr>

<!-- Hero Section -->
<tr>
<td style="padding:48px 24px;background-color:#f9fafb;text-align:center;">
<h1 style="margin:0 0 16px 0;font-size:36px;font-weight:700;color:#1a2847;line-height:1.2;">You're all set!</h1>
<p style="margin:0 0 24px 0;font-size:16px;color:#6b7280;line-height:1.6;">Your free Business Plan Template is ready to download.</p>
<p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.5;">We've created this template to help you take the first step toward building a stronger, smarter business.</p>
</td>
</tr>

<!-- CTA Button -->
<tr>
<td style="padding:32px 24px;text-align:center;">
<a href="${TEMPLATE_URL}" style="background-color:#b8860b;color:white;padding:14px 40px;text-decoration:none;font-weight:bold;font-size:15px;border-radius:6px;display:inline-block;">Download Your Free Template ↓</a>
<p style="margin:12px 0 0 0;font-size:12px;color:#6b7280;">Or copy this link: ${TEMPLATE_URL}</p>
</td>
</tr>

<!-- What You Get Section -->
<tr>
<td style="padding:48px 24px;text-align:center;">
<h2 style="margin:0 0 32px 0;font-size:24px;font-weight:700;color:#1a2847;">What you get</h2>
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td width="25%" style="padding:16px;">
<div style="font-size:28px;margin-bottom:8px;">📋</div>
<p style="margin:0 0 8px 0;font-weight:600;color:#1a2847;font-size:13px;">Professionally Designed</p>
<p style="margin:0;font-size:12px;color:#6b7280;">Clean, easy-to-use and ready to customise.</p>
</td>
<td width="25%" style="padding:16px;">
<div style="font-size:28px;margin-bottom:8px;">⏱️</div>
<p style="margin:0 0 8px 0;font-weight:600;color:#1a2847;font-size:13px;">Save Time</p>
<p style="margin:0;font-size:12px;color:#6b7280;">Skip the blank page and start with a proven framework.</p>
</td>
<td width="25%" style="padding:16px;">
<div style="font-size:28px;margin-bottom:8px;">🚀</div>
<p style="margin:0 0 8px 0;font-weight:600;color:#1a2847;font-size:13px;">Built for Action</p>
<p style="margin:0;font-size:12px;color:#6b7280;">Practical structure to help you plan, launch and grow.</p>
</td>
<td width="25%" style="padding:16px;">
<div style="font-size:28px;margin-bottom:8px;">📊</div>
<p style="margin:0 0 8px 0;font-weight:600;color:#1a2847;font-size:13px;">Focused on Results</p>
<p style="margin:0;font-size:12px;color:#6b7280;">Every section helps you move closer to your goals.</p>
</td>
</tr>
</table>
</td>
</tr>

<!-- Ready to Build More Section -->
<tr>
<td style="padding:48px 24px;background-color:#f9fafb;border-top:1px solid #e5e7eb;">
<h2 style="margin:0 0 16px 0;font-size:24px;font-weight:700;color:#1a2847;">Ready to build more?</h2>
<p style="margin:0 0 24px 0;font-size:15px;color:#374151;line-height:1.6;">MD Build gives you everything you need to plan, launch and grow your business — all in one place.</p>
<a href="https://buildbymd.com" style="background-color:#b8860b;color:white;padding:12px 32px;text-decoration:none;font-weight:bold;font-size:14px;border-radius:6px;display:inline-block;">Explore MD Build →</a>
<p style="margin:16px 0 0 0;font-size:13px;color:#6b7280;"><strong>MD Business Launch</strong> — 21 guided modules, $49 lifetime access</p>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:32px 24px;border-top:1px solid #e5e7eb;text-align:center;">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td style="text-align:center;padding-bottom:16px;">
<div style="font-weight:bold;color:#1a2847;margin-bottom:4px;">MD Build</div>
<div style="font-size:13px;color:#6b7280;margin-bottom:12px;">We're excited to be part of your journey</div>
<div>
<a href="https://linkedin.com" style="margin:0 8px;text-decoration:none;color:#6b7280;">in</a>
<a href="https://instagram.com" style="margin:0 8px;text-decoration:none;color:#6b7280;">ig</a>
<a href="https://youtube.com" style="margin:0 8px;text-decoration:none;color:#6b7280;">yt</a>
</div>
</td>
</tr>
<tr>
<td style="border-top:1px solid #e5e7eb;padding-top:16px;font-size:11px;color:#9ca3af;">
<p style="margin:0 0 8px 0;"><a href="#" style="color:#b8860b;text-decoration:none;">Privacy Policy</a> | <a href="#" style="color:#b8860b;text-decoration:none;">Terms of Use</a> | <a href="#" style="color:#b8860b;text-decoration:none;">Unsubscribe</a></p>
<p style="margin:0;">© 2025 MD Build. All rights reserved.</p>
</td>
</tr>
</table>
</td>
</tr>

</table>
</td>
</tr>
</table>
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
