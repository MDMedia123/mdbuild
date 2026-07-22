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

      const htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;background:#fafafa;font-family:Arial,sans-serif;"><table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#fafafa;"><tr><td align="center" style="padding:20px 0;"><table cellpadding="0" cellspacing="0" border="0" width="600" style="background:#fff;"><tr><td style="padding:24px 30px;border-bottom:1px solid #e5e7eb;"><div style="font-size:16px;font-weight:bold;"><span style="background:#1a2847;color:#fff;padding:6px 10px;border-radius:4px;font-size:13px;margin-right:8px;">MD</span><span style="color:#1a2847;">Build</span></div></td></tr><tr><td style="padding:32px 30px;color:#374151;font-size:15px;line-height:1.6;">${body.replace(/\n/g, '<br>')}</td></tr><tr><td style="padding:32px 30px;text-align:center;"><a href="https://buildbymd.com" style="background:#b8860b;color:#fff;padding:12px 32px;text-decoration:none;font-weight:bold;font-size:14px;border-radius:6px;display:inline-block;">Get Started</a></td></tr><tr><td style="padding:32px 30px;border-top:1px solid #e5e7eb;text-align:center;font-size:13px;color:#6b7280;"><p style="margin:0 0 8px 0;font-weight:bold;color:#1a2847;">MD Build</p><p style="margin:0 0 12px 0;">We're excited to be part of your journey</p><p style="margin:0 0 12px 0;"><a href="https://linkedin.com" style="color:#6b7280;text-decoration:none;margin:0 8px;">in</a><a href="https://instagram.com" style="color:#6b7280;text-decoration:none;margin:0 8px;">ig</a><a href="https://youtube.com" style="color:#6b7280;text-decoration:none;margin:0 8px;">yt</a></p><p style="margin:12px 0 0 0;font-size:11px;border-top:1px solid #e5e7eb;padding-top:12px;">© 2025 MD Build. All rights reserved.</p></td></tr></table></td></tr></table></body></html>`;

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
