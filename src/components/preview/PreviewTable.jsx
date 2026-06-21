import { getItemAmount, getCurrencySymbol, formatCurrency } from '../../utils/calculations';

/**
 * PreviewTable — Styled line items table for the invoice preview.
 */
export default function PreviewTable({ items, currency }) {
  const sym = getCurrencySymbol(currency);

  const validItems = items.filter(i => i.description || i.qty || i.rate);

  return (
    <div className="overflow-hidden rounded-xl border border-surface-100 mt-6">
      <table className="w-full text-sm min-w-[420px]">
        <thead>
          <tr className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide w-8">#</th>
            <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">Description</th>
            <th className="px-4 py-3 text-center font-semibold text-xs uppercase tracking-wide w-16">Qty</th>
            <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wide w-24">Rate</th>
            <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wide w-28">Amount</th>
          </tr>
        </thead>
        <tbody>
          {validItems.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-surface-400 text-sm italic">
                No items added yet — fill in the form
              </td>
            </tr>
          ) : (
            validItems.map((item, idx) => {
              const amount = getItemAmount(item.qty, item.rate);
              return (
                <tr
                  key={item.id}
                  className={`
                    border-t border-surface-100
                    ${idx % 2 === 0 ? 'bg-white' : 'bg-surface-50'}
                  `}
                >
                  <td className="px-4 py-3 text-surface-400 text-xs">{idx + 1}</td>
                  <td className="px-4 py-3 text-surface-800 font-medium">{item.description || '—'}</td>
                  <td className="px-4 py-3 text-center text-surface-600">{item.qty || '0'}</td>
                  <td className="px-4 py-3 text-right text-surface-600">
                    {sym}{(parseFloat(item.rate) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-surface-900">
                    {formatCurrency(amount, currency)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
