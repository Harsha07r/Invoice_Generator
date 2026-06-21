/**
 * CurrencySelector — pill-group selector for INR / USD / EUR.
 */
const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'INR' },
  { code: 'USD', symbol: '$', label: 'USD' },
  { code: 'EUR', symbol: '€', label: 'EUR' },
];

export default function CurrencySelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 p-1 bg-surface-100 dark:bg-surface-700/50 rounded-xl">
      {CURRENCIES.map(cur => (
        <button
          key={cur.code}
          type="button"
          onClick={() => onChange(cur.code)}
          className={`
            flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold
            transition-all duration-200 cursor-pointer
            ${value === cur.code
              ? 'bg-white dark:bg-surface-600 text-primary-600 dark:text-primary-400 shadow-card'
              : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200'
            }
          `}
        >
          <span className="text-base leading-none">{cur.symbol}</span>
          <span>{cur.label}</span>
        </button>
      ))}
    </div>
  );
}
