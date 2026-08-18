// The purchase confirmation email.
//
// Kept as a pure function with no dependencies so it can be rendered and eyeballed
// without making a purchase: `node scripts/preview-email.js` writes a file you can
// open in a browser.
//
// Everything here is nested tables with solid bgcolor attributes. Outlook ignores
// CSS gradients, flexbox and background-image, and an earlier version that relied
// on them collapsed to a bare "MD" strip with the headline missing entirely.
// No decorative glyphs either — they render as empty boxes in some clients.

const FONT = "Arial,'Segoe UI',Helvetica,sans-serif";

const INK = '#1a2847';
const INK_DEEP = '#131f38';
const GOLD = '#C1893D';
const PAPER = '#f7f5f0';
const BORDER = '#EAE6DA';
const MUTED = '#5B6478';
const FAINT = '#6E6D62';

function firstNameOf(name) {
  return String(name || '').trim().split(/\s+/)[0] || 'there';
}

// Basic escaping: names arrive from a payment provider and land in markup.
function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderPurchaseEmail({ name, reference, accessLink, portalUrl }) {
  const firstName = escapeHtml(firstNameOf(name));
  const link = escapeHtml(accessLink || portalUrl);
  const portal = escapeHtml(portalUrl);
  const ref = escapeHtml(reference);

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Welcome to Business Blueprint</title>
</head>
<body style="margin:0;padding:0;background:${PAPER};font-family:${FONT};">

<!-- Preview text: what shows in the inbox list next to the subject line -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">
  You're in, ${firstName}. All 21 modules are unlocked — set your password and start building.
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PAPER};">
<tr><td align="center" style="padding:24px 12px;">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;">

  <!-- Masthead -->
  <tr>
    <td bgcolor="${INK_DEEP}" align="center" style="background-color:${INK_DEEP};padding:18px 32px;">
      <span style="font-family:${FONT};font-size:13px;font-weight:700;color:#ffffff;letter-spacing:3px;">MD BUILD</span>
    </td>
  </tr>

  <!-- Hero -->
  <tr>
    <td bgcolor="${INK}" align="center" style="background-color:${INK};padding:56px 32px 48px 32px;">
      <p style="margin:0 0 18px 0;font-family:${FONT};font-size:12px;font-weight:700;color:${GOLD};letter-spacing:3px;">
        PURCHASE CONFIRMED
      </p>
      <h1 style="margin:0 0 18px 0;font-family:${FONT};font-size:42px;line-height:1.1;font-weight:700;color:#ffffff;">
        You're in, ${firstName}.
      </h1>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 20px auto;">
        <tr><td bgcolor="${GOLD}" height="4" style="background-color:${GOLD};font-size:0;line-height:0;width:64px;">&nbsp;</td></tr>
      </table>
      <p style="margin:0;font-family:${FONT};font-size:17px;line-height:1.6;color:#cbd2e0;">
        All 21 modules of Business Blueprint<br>are unlocked and waiting for you.
      </p>
    </td>
  </tr>

  <!-- Gold value strip -->
  <tr>
    <td bgcolor="${GOLD}" align="center" style="background-color:${GOLD};padding:16px 24px;">
      <span style="font-family:${FONT};font-size:13px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">
        21 MODULES&nbsp;&nbsp;&middot;&nbsp;&nbsp;LIFETIME ACCESS&nbsp;&nbsp;&middot;&nbsp;&nbsp;YOURS NOW
      </span>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="padding:44px 40px 8px 40px;font-family:${FONT};color:${INK};">
      <p style="margin:0 0 22px 0;font-size:16px;line-height:1.7;color:${MUTED};">
        You've just given yourself the thing most people skip: a plan. Strategy, brand,
        product, marketing, operations and launch &mdash; each one broken into steps you
        can actually finish.
      </p>
      <p style="margin:0 0 32px 0;font-size:16px;line-height:1.7;color:${MUTED};">
        There's one small thing between you and it.
      </p>

      <!-- Primary action -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 18px auto;">
        <tr>
          <td bgcolor="${GOLD}" align="center" style="background-color:${GOLD};">
            <a href="${link}" style="display:inline-block;padding:19px 56px;font-family:${FONT};font-size:17px;font-weight:700;color:#ffffff;text-decoration:none;">
              Choose Your Password &amp; Start
            </a>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 40px 0;font-size:12px;line-height:1.6;color:${FAINT};text-align:center;">
        Takes about ten seconds. This link is yours alone and expires in 24 hours &mdash;<br>
        if it lapses, go to <a href="${portal}" style="color:${GOLD};">your portal</a> and choose &ldquo;Forgot password?&rdquo;
      </p>
    </td>
  </tr>

  <!-- What's inside -->
  <tr>
    <td style="padding:0 40px 8px 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PAPER};border:1px solid ${BORDER};">
        <tr>
          <td style="padding:28px 30px;font-family:${FONT};">
            <p style="margin:0 0 18px 0;font-size:12px;font-weight:700;color:${INK};letter-spacing:2px;">WHAT'S INSIDE</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="16" valign="top" style="font-family:${FONT};font-size:15px;color:${GOLD};font-weight:700;line-height:1.6;">&mdash;</td>
                <td style="font-family:${FONT};font-size:14px;color:${MUTED};line-height:1.6;padding-bottom:10px;">21 guided modules, idea through launch</td>
              </tr>
              <tr>
                <td width="16" valign="top" style="font-family:${FONT};font-size:15px;color:${GOLD};font-weight:700;line-height:1.6;">&mdash;</td>
                <td style="font-family:${FONT};font-size:14px;color:${MUTED};line-height:1.6;padding-bottom:10px;">Strategic planning templates</td>
              </tr>
              <tr>
                <td width="16" valign="top" style="font-family:${FONT};font-size:15px;color:${GOLD};font-weight:700;line-height:1.6;">&mdash;</td>
                <td style="font-family:${FONT};font-size:14px;color:${MUTED};line-height:1.6;padding-bottom:10px;">Launch checklists</td>
              </tr>
              <tr>
                <td width="16" valign="top" style="font-family:${FONT};font-size:15px;color:${GOLD};font-weight:700;line-height:1.6;">&mdash;</td>
                <td style="font-family:${FONT};font-size:14px;color:${MUTED};line-height:1.6;">Lifetime access, including everything added later</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Sign off -->
  <tr>
    <td style="padding:32px 40px 8px 40px;font-family:${FONT};">
      <p style="margin:0 0 4px 0;font-size:15px;line-height:1.7;color:${MUTED};">Go build something good.</p>
      <p style="margin:0;font-size:15px;font-weight:700;color:${INK};">Michael &mdash; MD Build</p>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td bgcolor="${PAPER}" align="center" style="background-color:${PAPER};padding:26px 32px;border-top:1px solid ${BORDER};font-family:${FONT};">
      <p style="margin:0 0 8px 0;font-size:11px;color:${FAINT};">Reference: ${ref}</p>
      <p style="margin:0;font-size:11px;color:${FAINT};">&copy; 2026 MD Build &mdash; Build Better Businesses.</p>
    </td>
  </tr>

</table>

</td></tr>
</table>
</body>
</html>`;
}

module.exports = { renderPurchaseEmail };
