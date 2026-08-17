// The single source of truth for what things cost.
// Amounts are in the currency's minor unit, so ZAR is cents: R899.00 is 89900.
//
// Kept server-side only. The browser names a product; it never names a price.
const PRICES = {
  'business-blueprint': { amount: 89900, currency: 'ZAR' }
};

module.exports = { PRICES };
