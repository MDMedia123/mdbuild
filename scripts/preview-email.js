// Renders the purchase confirmation email to a file so it can be reviewed
// without making a purchase.
//
//   node scripts/preview-email.js            -> writes email-preview.html
//   node scripts/preview-email.js "Sarah"    -> preview with a different name
//
// Open the file in a browser to check layout. Note that Outlook is stricter than
// any browser: the template sticks to nested tables and solid bgcolor attributes
// for that reason, so if it looks right here it should hold up there too.

const fs = require('fs');
const path = require('path');
const { renderPurchaseEmail } = require('../lib/email-template');

const name = process.argv[2] || 'Michael Downes';
const outputPath = path.join(__dirname, '..', 'email-preview.html');

const html = renderPurchaseEmail({
  name: name,
  reference: 'txn_01hq3preview0example0000',
  accessLink: 'https://www.buildbymd.com/customer-portal#preview-link',
  portalUrl: 'https://www.buildbymd.com/customer-portal'
});

fs.writeFileSync(outputPath, html);
console.log('Wrote', outputPath, `(${(html.length / 1024).toFixed(1)} KB, addressed to ${name})`);
