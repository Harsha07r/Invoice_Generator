import { getSubtotal, getGSTAmount, getTotal, formatCurrency } from '../../utils/calculations';

const GST_RATES = ['0', '5', '12', '18', '28'];

/**
 * GSTSection — GST rate picker and totals summary.
 */
export default function GSTSection({ items, gstRate, currency, onGSTChange }) {
  const subtotal  = getSubtotal(items);
  const gstAmount = getGSTAmount(subtotal, gstRate);
  const total     = getTotal(subtotal, gstAmount);

  return (
    <div className="space-y-4">
      <p className="section-label">Tax & Totals</p>

      {/* GST Rate Selector */}
      <div>
        <label className="text-xs font-semibold text-surface-600 dark:text-surface-400 tracking-wide block mb-2">
          GST Rate
        </label>
        <div className="flex flex-wrap gap-2">
          {GST_RATES.map(rate => (
            <button
              key={rate}
              type="button"
              onClick={() => onGSTChange(rate)}
              className={`
                px-3.5 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-200 cursor-pointer
                ${gstRate === rate
                  ? 'bg-primary-500 border-primary-500 text-white shadow-md'
                  : 'bg-surface-50 dark:bg-surface-700/50 border-surface-200 dark:border-surface-600 text-surface-600 dark:text-surface-300 hover:border-primary-300 hover:text-primary-500'
                }
              `}
            >
              {rate}%
            </button>
          ))}
        </div>
      </div>

      {/* Totals Summary */}
      <div className="rounded-2xl overflow-hidden border border-surface-100 dark:border-surface-700">
        <div className="p-4 space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-surface-500 dark:text-surface-400">Subtotal</span>
            <span className="text-sm font-semibold text-surface-700 dark:text-surface-200">
              {formatCurrency(subtotal, currency)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-surface-500 dark:text-surface-400">
              GST ({gstRate}%)
            </span>
            <span className="text-sm font-semibold text-surface-700 dark:text-surface-200">
              {formatCurrency(gstAmount, currency)}
            </span>
          </div>

          <div className="border-t border-surface-100 dark:border-surface-700 pt-2.5">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-surface-900 dark:text-surface-50">
                Grand Total
              </span>
              <span className="text-xl font-extrabold text-primary-600 dark:text-primary-400">
                {formatCurrency(total, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500" />
      </div>
    </div>
  );
}
