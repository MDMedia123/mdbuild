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
            <div style="color:#D1D5DB;font-size:14px;">Your template is ready!</div>
          </div>

          <!-- Content -->
          <div style="padding:32px 24px;color:#374151;line-height:1.6;">
            <div style="margin-bottom:24px;">
              <p style="margin-top:0;font-size:18px;font-weight:600;">Hi ${name}!</p>
              <p>Your free Business Plan Template is ready to download. This comprehensive template includes all 21 sections of a professional business plan — everything you need to launch with clarity.</p>
            </div>

            <div style="margin:32px 0;text-align:center;">
              <a href="${TEMPLATE_URL}" style="display:inline-block;background-color:#C1893D;color:white;padding:14px 40px;border-radius:6px;text-decoration:none;font-weight:600;font-size:16px;">
                📥 Download Template
              </a>
            </div>

            <div style="background-color:#f9fafb;border-left:4px solid #C1893D;padding:16px;margin:24px 0;border-radius:4px;">
              <div style="font-weight:600;margin-bottom:8px;">Ready to go deeper?</div>
              <p style="margin:0 0 12px 0;">Take your template to completion with <strong>MD Business Launch</strong> — a 21-module guided platform that walks you through everything from idea validation to first sale.</p>
              <p style="margin:0;"><strong>Just $49 for lifetime access.</strong></p>
              <div style="margin-top:12px;">
                <a href="https://buildbymd.com" style="display:inline-block;background-color:#374151;color:white;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">
                  Explore MD Business Launch
                </a>
              </div>
            </div>

            <div style="font-size:12px;color:#6b7280;margin-top:24px;">
              ${updates ? '<p style="margin:0;">✓ You\'ve opted in to receive tips on building your business.</p>' : '<p style="margin:0;">You won\'t receive additional emails unless you opt in.</p>'}
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
