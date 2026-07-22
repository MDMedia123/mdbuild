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
      formData.append('html', `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background-color:#f5f5f5;">
          <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#1F2937 0%,#111827 100%);padding:32px 24px;text-align:center;">
              <div style="font-size:28px;font-weight:700;color:#C1893D;margin-bottom:8px;">MD Build</div>
              <div style="color:#D1D5DB;font-size:14px;">All your tools. One platform.</div>
            </div>

            <!-- Content -->
            <div style="padding:32px 24px;color:#374151;line-height:1.6;">
              <div style="margin-bottom:24px;font-size:16px;">
                ${body.replace(/\n/g, '<br>')}
              </div>

              <div style="margin:32px 0;">
                <a href="https://buildbymd.com" style="display:inline-block;background-color:#C1893D;color:white;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">
                  Get Started
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color:#f9fafb;border-top:1px solid #e5e7eb;padding:24px;text-align:center;font-size:12px;color:#6b7280;">
              <div style="margin-bottom:12px;">
                <strong>MD Build</strong><br>
                All your tools. One platform.
              </div>
              <div>
                <a href="https://buildbymd.com" style="color:#C1893D;text-decoration:none;">buildbymd.com</a>
              </div>
              <div style="margin-top:12px;font-size:11px;color:#9ca3af;">
                © 2025 MD Media. All rights reserved.
              </div>
            </div>
          </div>
        </body>
        </html>
      `);

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
