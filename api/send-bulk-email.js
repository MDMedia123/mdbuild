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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>${body.replace(/\n/g, '<br>')}</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            MD Build — All your tools. One platform.<br>
            <a href="https://mdbuild.vercel.app" style="color: #C1893D; text-decoration: none;">mdbuild.vercel.app</a>
          </p>
        </div>
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
