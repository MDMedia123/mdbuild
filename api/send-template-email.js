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
