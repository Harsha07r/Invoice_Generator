import InputField from '../ui/InputField';
import { useCallback } from 'react';

/**
 * InvoiceDetails — Invoice number, date, and due date section.
 */
export default function InvoiceDetails({ invoice, onUpdate }) {
  const handleRegenerate = useCallback(() => {
    const now    = new Date();
    const y      = now.getFullYear();
    const m      = String(now.getMonth() + 1).padStart(2, '0');
    const d      = String(now.getDate()).padStart(2, '0');
    const rnd    = Math.floor(1000 + Math.random() * 9000);
    onUpdate('number', `INV-${y}${m}${d}-${rnd}`);
  }, [onUpdate]);

  return (
    <div className="space-y-4">
      <p className="section-label">Invoice Details</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Invoice number with regenerate */}
        <div className="sm:col-span-1">
          <label
            htmlFor="invoice-number"
            className="text-xs font-semibold text-surface-600 dark:text-surface-400 tracking-wide block mb-1"
          >
            Invoice Number
          </label>
          <div className="flex gap-2">
            <input
              id="invoice-number"
              type="text"
              value={invoice.number}
              onChange={e => onUpdate('number', e.target.value)}
              className="input-base flex-1 min-w-0"
            />
            <button
              type="button"
              onClick={handleRegenerate}
              title="Generate new invoice number"
              className="
                shrink-0 w-9 h-[42px] flex items-center justify-center
                rounded-xl border border-surface-200 dark:border-surface-600
                bg-surface-50 dark:bg-surface-700/50
                text-surface-500 dark:text-surface-400
                hover:bg-primary-50 dark:hover:bg-primary-900/20
                hover:text-primary-500 hover:border-primary-300
                transition-all duration-200 cursor-pointer
              "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        <InputField
          id="invoice-date"
          label="Invoice Date"
          type="date"
          value={invoice.date}
          onChange={v => onUpdate('date', v)}
        />

        <InputField
          id="invoice-dueDate"
          label="Due Date"
          type="date"
          value={invoice.dueDate}
          onChange={v => onUpdate('dueDate', v)}
        />
      </div>
    </div>
  );
}
