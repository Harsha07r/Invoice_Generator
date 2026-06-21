/**
 * Pure calculation helpers for invoice totals.
 */

/**
 * Calculate subtotal from line items.
 * @param {Array} items - Array of { qty, rate } objects
 * @returns {number}
 */
export function getSubtotal(items) {
  return items.reduce((sum, item) => {
    const qty  = parseFloat(item.qty)  || 0;
    const rate = parseFloat(item.rate) || 0;
    return sum + qty * rate;
  }, 0);
}

/**
 * Calculate GST amount from subtotal and rate.
 * @param {number} subtotal
 * @param {number} gstRate - e.g. 18 for 18%
 * @returns {number}
 */
export function getGSTAmount(subtotal, gstRate) {
  return subtotal * (parseFloat(gstRate) || 0) / 100;
}

/**
 * Calculate grand total.
 * @param {number} subtotal
 * @param {number} gstAmount
 * @returns {number}
 */
export function getTotal(subtotal, gstAmount) {
  return subtotal + gstAmount;
}

/**
 * Format a number as currency string.
 * @param {number} amount
 * @param {string} currencyCode - 'INR' | 'USD' | 'EUR'
 * @returns {string}
 */
export function formatCurrency(amount, currencyCode = 'INR') {
  const locales = { INR: 'en-IN', USD: 'en-US', EUR: 'de-DE' };
  try {
    return new Intl.NumberFormat(locales[currencyCode] || 'en-IN', {
      style:                 'currency',
      currency:              currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${getCurrencySymbol(currencyCode)}${amount.toFixed(2)}`;
  }
}

/**
 * Get currency symbol string.
 */
export function getCurrencySymbol(currencyCode = 'INR') {
  const symbols = { INR: '₹', USD: '$', EUR: '€' };
  return symbols[currencyCode] || '₹';
}

/**
 * Calculate per-item amount.
 */
export function getItemAmount(qty, rate) {
  return (parseFloat(qty) || 0) * (parseFloat(rate) || 0);
}
