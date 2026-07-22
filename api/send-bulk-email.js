export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { emails, subject, body } = req.body;
    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      console.error('Missing Mailgun config:', { key: !!MAILGUN_API_KEY, domain: !!MAILGUN_DOMAIN });
      return res.status(500).json({ error: 'Server configuration error' });
    }

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: 'Valid email array required' });
    }

    if (!subject || !body) {
      return res.status(400).json({ error: 'Subject and body required' });
    }

    const authHeader = 'Basic ' + Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64');

    // Send emails in batches (Mailgun allows multiple recipients)
    const batchSize = 50;
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);

      const formData = new URLSearchParams();
      formData.append('from', `MD Build <noreply@${MAILGUN_DOMAIN}>`);

      // Add each recipient
      batch.forEach(email => {
        formData.append('to', email.trim());
      });

      formData.append('subject', subject);

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
All your tools. One platform.
</td>
</tr>
</table>
</td>
</tr>

<!-- Main Content -->
<tr>
<td style="padding:48px 24px;text-align:center;color:#374151;font-size:15px;line-height:1.6;">
${body.replace(/\n/g, '<br>')}
</td>
</tr>

<!-- CTA Button -->
<tr>
<td style="padding:16px 24px;text-align:center;">
<a href="https://buildbymd.com" style="background-color:#b8860b;color:white;padding:12px 32px;text-decoration:none;font-weight:bold;font-size:14px;border-radius:6px;display:inline-block;">Get Started</a>
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

      try {
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
          failureCount += batch.length;
        } else {
          successCount += batch.length;
        }
      } catch (batchError) {
        console.error('Error sending batch:', batchError.message);
        failureCount += batch.length;
      }
    }

    return res.status(200).json({
      success: successCount > 0,
      message: `Sent ${successCount} emails${failureCount > 0 ? `, ${failureCount} failed` : ''}`
    });
  } catch (error) {
    console.error('Error in send-bulk-email:', error.message);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
}
