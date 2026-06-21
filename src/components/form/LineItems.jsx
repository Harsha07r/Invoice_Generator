import { getItemAmount } from '../../utils/calculations';
import { getCurrencySymbol } from '../../utils/calculations';

/**
 * LineItems — Dynamic line item table with add/remove and auto-calculated amounts.
 */
export default function LineItems({ items, currency, errors, onUpdate, onAdd, onRemove }) {
  const sym = getCurrencySymbol(currency);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="section-label mb-0">Line Items</p>
        <button
          type="button"
          onClick={onAdd}
          className="
            inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg
            bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400
            border border-primary-100 dark:border-primary-800
            hover:bg-primary-100 dark:hover:bg-primary-900/40
            transition-all duration-200 cursor-pointer
          "
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Item
        </button>
      </div>

      {errors?.items && (
        <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors.items}
        </p>
      )}

      {/* Header */}
      <div className="hidden sm:grid grid-cols-12 gap-2 px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-700/50">
        <div className="col-span-5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Description</div>
        <div className="col-span-2 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide text-center">Qty</div>
        <div className="col-span-2 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Rate ({sym})</div>
        <div className="col-span-2 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide text-right">Amount</div>
        <div className="col-span-1" />
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {items.map((item, idx) => {
          const amount = getItemAmount(item.qty, item.rate);
          return (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-2 items-center p-2 rounded-xl
                border border-surface-100 dark:border-surface-700
                bg-surface-50/50 dark:bg-surface-800/50
                hover:border-primary-200 dark:hover:border-primary-700
                transition-all duration-150 animate-slide-up"
            >
              {/* Description */}
              <div className="col-span-12 sm:col-span-5">
                <input
                  id={`item-desc-${item.id}`}
                  type="text"
                  value={item.description}
                  onChange={e => onUpdate(item.id, 'description', e.target.value)}
                  placeholder={`Item ${idx + 1} description`}
                  className="input-base text-sm w-full"
                />
              </div>

              {/* Qty */}
              <div className="col-span-4 sm:col-span-2">
                <input
                  id={`item-qty-${item.id}`}
                  type="number"
                  min="0"
                  step="any"
                  value={item.qty}
                  onChange={e => onUpdate(item.id, 'qty', e.target.value)}
                  placeholder="1"
                  className="input-base text-sm text-center w-full"
                />
              </div>

              {/* Rate */}
              <div className="col-span-4 sm:col-span-2">
                <input
                  id={`item-rate-${item.id}`}
                  type="number"
                  min="0"
                  step="any"
                  value={item.rate}
                  onChange={e => onUpdate(item.id, 'rate', e.target.value)}
                  placeholder="0.00"
                  className="input-base text-sm w-full"
                />
              </div>

              {/* Amount */}
              <div className="col-span-3 sm:col-span-2 text-right">
                <span className={`text-sm font-semibold ${amount > 0 ? 'text-primary-600 dark:text-primary-400' : 'text-surface-400'}`}>
                  {sym}{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Remove */}
              <div className="col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  disabled={items.length === 1}
                  title="Remove item"
                  className="
                    w-7 h-7 flex items-center justify-center rounded-lg
                    text-surface-400 hover:text-red-500
                    hover:bg-red-50 dark:hover:bg-red-900/20
                    disabled:opacity-30 disabled:cursor-not-allowed
                    transition-all duration-150 cursor-pointer
                  "
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile add button */}
      <button
        type="button"
        onClick={onAdd}
        className="
          w-full py-2 rounded-xl border border-dashed border-surface-300 dark:border-surface-600
          text-sm text-surface-400 dark:text-surface-500
          hover:border-primary-400 hover:text-primary-500
          hover:bg-primary-50/50 dark:hover:bg-primary-900/10
          transition-all duration-200 cursor-pointer sm:hidden
        "
      >
        + Add another item
      </button>
    </div>
  );
}
