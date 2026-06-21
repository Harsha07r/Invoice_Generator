import PreviewTable from './PreviewTable';
import {
  getSubtotal, getGSTAmount, getTotal, formatCurrency, getCurrencySymbol,
} from '../../utils/calculations';
import { formatDate } from '../../utils/invoiceNumber';

/**
 * InvoicePreview — Full realistic invoice layout that updates in real time.
 * Fully mobile-responsive with overflow protection.
 */
export default function InvoicePreview({ seller, buyer, invoice, items, gstRate, currency }) {
  const subtotal  = getSubtotal(items);
  const gstAmount = getGSTAmount(subtotal, gstRate);
  const total     = getTotal(subtotal, gstAmount);
  const sym       = getCurrencySymbol(currency);

  return (
    <div id="invoice-preview" className="invoice-paper overflow-hidden w-full">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 px-5 sm:px-8 py-6 sm:py-7 text-white">
        <div className="flex items-start justify-between gap-3">
          {/* Logo + Company */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo: uploaded image OR default IF placeholder */}
            {seller.logo ? (
              <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 overflow-hidden flex items-center justify-center shrink-0">
                <img
                  src={seller.logo}
                  alt="Company logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="
                w-14 h-14 rounded-2xl bg-white/15 border border-white/25
                flex flex-col items-center justify-center text-white shrink-0
              ">
                <span className="text-lg font-black leading-none">IF</span>
                <span className="text-[8px] font-semibold tracking-widest leading-none mt-0.5 opacity-80">FORGE</span>
              </div>
            )}
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold leading-tight truncate">
                {seller.businessName || 'Your Business Name'}
              </h2>
              {seller.gstNumber && (
                <p className="text-xs text-white/70 mt-0.5">GSTIN: {seller.gstNumber}</p>
              )}
              {seller.email && (
                <p className="text-xs text-white/70 truncate">{seller.email}</p>
              )}
              {seller.phone && (
                <p className="text-xs text-white/70">{seller.phone}</p>
              )}
            </div>
          </div>

          {/* Invoice label */}
          <div className="text-right shrink-0">
            <p className="text-2xl sm:text-4xl font-black tracking-tight opacity-90">INVOICE</p>
            <p className="text-xs sm:text-sm font-medium text-white/70 mt-1 break-all">
              #{invoice.number || 'INV-XXXXXX'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Dates strip ─────────────────────────────────────── */}
      <div className="px-5 sm:px-8 py-3 sm:py-4 bg-surface-50 border-b border-surface-100">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-surface-400">Invoice Date</p>
            <p className="text-xs sm:text-sm font-semibold text-surface-800">{formatDate(invoice.date)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-surface-400">Due Date</p>
            <p className="text-xs sm:text-sm font-semibold text-surface-800">{formatDate(invoice.dueDate)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-surface-400">Currency</p>
            <p className="text-xs sm:text-sm font-semibold text-surface-800">{currency} ({sym})</p>
          </div>
        </div>
      </div>

      {/* ── Bill To / From ───────────────────────────────────── */}
      <div className="px-5 sm:px-8 py-5 sm:py-6 grid grid-cols-2 gap-4 sm:gap-6 border-b border-surface-100">
        {/* Bill To */}
        <div className="space-y-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Bill To</p>
          <p className="text-sm sm:text-base font-bold text-surface-900 break-words">
            {buyer.clientName || <span className="text-surface-300">Client Name</span>}
          </p>
          {buyer.clientEmail && (
            <p className="text-xs text-surface-500 break-all">{buyer.clientEmail}</p>
          )}
          {buyer.clientAddress && (
            <p className="text-xs text-surface-500 leading-relaxed whitespace-pre-wrap break-words">{buyer.clientAddress}</p>
          )}
          {!buyer.clientName && !buyer.clientEmail && !buyer.clientAddress && (
            <p className="text-xs text-surface-300 italic">Fill in client details…</p>
          )}
        </div>

        {/* From */}
        <div className="space-y-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary-500">From</p>
          <p className="text-xs sm:text-sm font-semibold text-surface-800 break-words">
            {seller.businessName || <span className="text-surface-300">Your Business</span>}
          </p>
          {seller.address && (
            <p className="text-xs text-surface-500 leading-relaxed whitespace-pre-wrap break-words">{seller.address}</p>
          )}
          {seller.gstNumber && (
            <p className="text-xs text-surface-500 break-all">GSTIN: {seller.gstNumber}</p>
          )}
        </div>
      </div>

      {/* ── Line Items — horizontal scroll on mobile ─────────── */}
      <div className="px-5 sm:px-8 pb-5 sm:pb-6 overflow-x-auto">
        <PreviewTable items={items} currency={currency} />
      </div>

      {/* ── Totals ───────────────────────────────────────────── */}
      <div className="px-5 sm:px-8 pb-6 sm:pb-8">
        <div className="flex justify-end">
          <div className="w-full sm:w-72 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-surface-500">Subtotal</span>
              <span className="font-semibold text-surface-800">{formatCurrency(subtotal, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-500">GST ({gstRate}%)</span>
              <span className="font-semibold text-surface-800">{formatCurrency(gstAmount, currency)}</span>
            </div>
            <div className="pt-2 border-t border-surface-200">
              <div className="flex justify-between items-center">
                <span className="font-bold text-surface-900">Grand Total</span>
                <span className="text-xl sm:text-2xl font-extrabold text-primary-600">{formatCurrency(total, currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer bar ───────────────────────────────────────── */}
      <div className="h-1.5 bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500" />
      <div className="px-5 sm:px-8 py-3 sm:py-4 bg-surface-50 border-t border-surface-100">
        <p className="text-xs text-surface-400 text-center">
          Thank you for your business! · Generated by <span className="font-semibold text-primary-500">InvoiceForge</span>
        </p>
      </div>
    </div>
  );
}
