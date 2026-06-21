import { useState, useCallback } from 'react';
import Navbar               from './components/Navbar';
import HeroSection          from './components/HeroSection';
import Footer               from './components/Footer';
import InvoiceForm          from './components/form/InvoiceForm';
import InvoicePreview       from './components/preview/InvoicePreview';
import Button               from './components/ui/Button';
import CurrencySelector     from './components/ui/CurrencySelector';
import { ToastContainer }   from './components/ui/Toast';
import { useInvoice }       from './hooks/useInvoice';
import { useDarkMode }      from './hooks/useDarkMode';
import { generatePDF }      from './utils/pdfGenerator';
import { copyInvoiceSummary } from './utils/clipboard';

// ── Toast helper ───────────────────────────────────────────────────────────
let _toastId = 0;
function makeToast(message, type = 'success') {
  return { id: ++_toastId, message, type };
}

// ── Icon helpers ───────────────────────────────────────────────────────────
const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);
const PrintIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);
const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);
const ResetIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// ── App ────────────────────────────────────────────────────────────────────

export default function App() {
  const { isDark, toggle: toggleDark } = useDarkMode();

  const {
    seller, buyer, invoice, items, gstRate, currency, errors,
    updateSeller, updateBuyer, updateInvoice,
    updateItem, addItem, removeItem,
    setGstRate, setCurrency,
    resetForm, validate,
  } = useInvoice();

  // Toast state
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'success') => {
    setToasts(prev => [...prev, makeToast(message, type)]);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Other UI state
  const [pdfLoading, setPdfLoading] = useState(false);
  const [resetModal, setResetModal] = useState(false);

  // ── Handlers ─────────────────────────────────────────────

  const handleDownloadPDF = useCallback(async () => {
    if (!validate()) {
      const firstError = document.querySelector('.input-error');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      addToast('Please fix validation errors first', 'error');
      return;
    }
    setPdfLoading(true);
    try {
      generatePDF({ seller, buyer, invoice, items, gstRate, currency });
      addToast('✓ Invoice Downloaded', 'success');
    } catch (err) {
      addToast('Failed to generate PDF', 'error');
    } finally {
      setTimeout(() => setPdfLoading(false), 800);
    }
  }, [seller, buyer, invoice, items, gstRate, currency, validate, addToast]);

  const handlePrint = useCallback(() => {
    addToast('✓ Print dialog opened', 'success');
    setTimeout(() => window.print(), 300);
  }, [addToast]);

  const handleCopy = useCallback(async () => {
    const ok = await copyInvoiceSummary({ seller, buyer, invoice, items, gstRate, currency });
    if (ok) {
      addToast('✓ Copied to clipboard', 'success');
    } else {
      addToast('Copy failed — try manually', 'error');
    }
  }, [seller, buyer, invoice, items, gstRate, currency, addToast]);

  const handleReset = useCallback(() => {
    resetForm();
    setResetModal(false);
    addToast('Form reset successfully', 'info');
  }, [resetForm, addToast]);

  // ── Render ───────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors duration-300">

      {/* Navbar */}
      <Navbar isDark={isDark} onToggleDark={toggleDark} />

      {/* Hero */}
      <HeroSection />

      {/* ── Main workspace ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ── Action toolbar ── */}
        <div className="
          flex flex-col sm:flex-row sm:items-center sm:justify-between
          gap-3 mb-6 sm:mb-8 no-print
          p-3 sm:p-4 rounded-2xl card-md
        ">
          {/* Currency selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-surface-500 dark:text-surface-400 shrink-0 hidden sm:block">
              Currency:
            </span>
            <CurrencySelector value={currency} onChange={setCurrency} />
          </div>

          {/* Action buttons — wraps gracefully on small screens */}
          <div className="flex flex-wrap gap-2">
            <Button
              id="btn-copy"
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              icon={<CopyIcon />}
              className="flex-1 sm:flex-none justify-center"
            >
              Copy
            </Button>

            <Button
              id="btn-print"
              variant="ghost"
              size="sm"
              onClick={handlePrint}
              icon={<PrintIcon />}
              className="flex-1 sm:flex-none justify-center"
            >
              Print
            </Button>

            <Button
              id="btn-reset"
              variant="ghost"
              size="sm"
              onClick={() => setResetModal(true)}
              icon={<ResetIcon />}
              className="flex-1 sm:flex-none justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Reset
            </Button>

            <Button
              id="btn-download-pdf"
              variant="primary"
              size="sm"
              onClick={handleDownloadPDF}
              loading={pdfLoading}
              icon={!pdfLoading ? <DownloadIcon /> : undefined}
              className="flex-1 sm:flex-none justify-center"
            >
              Download PDF
            </Button>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 items-start">

          {/* LEFT: Form */}
          <div className="animate-fade-in">
            <InvoiceForm
              seller={seller}
              buyer={buyer}
              invoice={invoice}
              items={items}
              gstRate={gstRate}
              currency={currency}
              errors={errors}
              onUpdateSeller={updateSeller}
              onUpdateBuyer={updateBuyer}
              onUpdateInvoice={updateInvoice}
              onUpdateItem={updateItem}
              onAddItem={addItem}
              onRemoveItem={removeItem}
              onGSTChange={setGstRate}
            />
          </div>

          {/* RIGHT: Preview */}
          <div className="xl:sticky xl:top-24 animate-slide-up">
            {/* Preview header bar */}
            <div className="flex items-center justify-between mb-3 no-print">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
                <span className="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  Live Preview
                </span>
              </div>
              <span className="text-xs text-surface-400 dark:text-surface-500 hidden sm:block">
                Updates in real time
              </span>
            </div>

            {/* Invoice preview — horizontally scrollable on very small screens */}
            <div className="overflow-x-auto rounded-2xl">
              <div className="min-w-[320px]">
                <InvoicePreview
                  seller={seller}
                  buyer={buyer}
                  invoice={invoice}
                  items={items}
                  gstRate={gstRate}
                  currency={currency}
                />
              </div>
            </div>

            {/* Download CTA below preview */}
            <div className="mt-4 flex justify-end no-print">
              <Button
                id="btn-download-pdf-2"
                variant="primary"
                size="md"
                onClick={handleDownloadPDF}
                loading={pdfLoading}
                icon={!pdfLoading ? <DownloadIcon /> : undefined}
              >
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* ── Reset confirmation modal ── */}
      {resetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setResetModal(false)}
        >
          <div
            className="card-lg p-6 w-full max-w-sm animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-surface-900 dark:text-white">Reset Invoice?</h3>
                <p className="text-xs text-surface-500 dark:text-surface-400">This will clear all form data permanently.</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" size="sm" onClick={() => setResetModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleReset} icon={<ResetIcon />}>
                Reset Form
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast notifications ── */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
