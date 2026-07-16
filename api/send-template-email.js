import fetch from 'node-fetch';

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'sandbox0fa29ce7e82a4d5f85c51971eaaea6f2.mailgun.org';
const TEMPLATE_URL = 'https://mdbuild.vercel.app/Free_Business_Plan_Template.html';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, business, updates } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Name and email required' });
    }

    // Send email via Mailgun
    const emailData = new URLSearchParams();
    emailData.append('from', `MD Build <noreply@${MAILGUN_DOMAIN}>`);
    emailData.append('to', email);
    emailData.append('subject', 'Your Free Business Plan Template is Ready');
    emailData.append('html', `
      <h2>Hi ${name}!</h2>
      <p>Your free Business Plan Template is ready to download.</p>
      <p><a href="${TEMPLATE_URL}" style="background: #C1893D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Download Template</a></p>
      <p>This comprehensive template includes all 21 sections of a professional business plan.</p>
      <p>Ready for the full experience? Check out <strong>MD Business Launch</strong> — $49 for the complete 21-module guided platform.</p>
      <hr>
      <p style="color: #666; font-size: 12px;">
        ${updates ? 'You\'ve opted in to receive tips on building your business.' : 'You\'re all set. You won\'t receive additional emails unless you opt in.'}
      </p>
    `);

    const authHeader = 'Basic ' + Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64');

    const mailgunResponse = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: emailData.toString()
    });

    if (!mailgunResponse.ok) {
      const errorText = await mailgunResponse.text();
      console.error('Mailgun error:', errorText);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    // Success
    return res.status(200).json({
      success: true,
      message: 'Email sent! Check your inbox.'
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
