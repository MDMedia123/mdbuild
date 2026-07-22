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
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:20px auto;background-color:#ffffff;border-radius:8px;">
<div style="background:#1F2937;padding:32px 24px;text-align:center;">
<div style="font-size:28px;font-weight:bold;color:#C1893D;margin:0 0 8px 0;">MD Build</div>
<div style="color:#D1D5DB;font-size:14px;margin:0;">All your tools. One platform.</div>
</div>
<div style="padding:32px 24px;color:#374151;font-size:15px;line-height:1.6;">
${body.replace(/\n/g, '<br>')}
<div style="margin:32px 0;">
<a href="https://buildbymd.com" style="background-color:#C1893D;color:white;padding:12px 32px;text-decoration:none;font-weight:bold;font-size:14px;border-radius:6px;display:inline-block;">Get Started</a>
</div>
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
