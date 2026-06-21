/**
 * Generate a unique invoice number in the format INV-YYYYMMDD-XXXX
 * @returns {string}
 */
export function generateInvoiceNumber() {
  const now    = new Date();
  const year   = now.getFullYear();
  const month  = String(now.getMonth() + 1).padStart(2, '0');
  const day    = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}${month}${day}-${random}`;
}

/**
 * Get today's date in YYYY-MM-DD format (for input[type=date] default)
 * @returns {string}
 */
export function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Get due date 30 days from now in YYYY-MM-DD format
 * @returns {string}
 */
export function getDefaultDueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

/**
 * Format a YYYY-MM-DD date string into a human-readable format
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', {
    day:   '2-digit',
    month: 'long',
    year:  'numeric',
  });
}
