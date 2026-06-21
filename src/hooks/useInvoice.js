import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { generateInvoiceNumber, getTodayString, getDefaultDueDate } from '../utils/invoiceNumber';

// ── Default state shapes ────────────────────────────────────────────────────

const defaultSeller = {
  businessName: '',
  email:        '',
  phone:        '',
  address:      '',
  gstNumber:    '',
  logo:         '', // base64 data URL
};

const defaultBuyer = {
  clientName:    '',
  clientEmail:   '',
  clientAddress: '',
};

const defaultInvoice = {
  number:  generateInvoiceNumber(),
  date:    getTodayString(),
  dueDate: getDefaultDueDate(),
};

const defaultItem = () => ({
  id:          crypto.randomUUID(),
  description: '',
  qty:         '1',
  rate:        '',
});

const defaultItems = [defaultItem()];

const STORAGE_KEY = 'invoiceforge-data';

// ── Hook ────────────────────────────────────────────────────────────────────

/**
 * useInvoice — central state management for the invoice generator.
 * Persists all state to localStorage automatically via useLocalStorage.
 *
 * @returns {{ seller, buyer, invoice, items, gstRate, currency, errors,
 *             updateSeller, updateBuyer, updateInvoice,
 *             updateItem, addItem, removeItem,
 *             setGstRate, setCurrency,
 *             resetForm, validate }}
 */
export function useInvoice() {
  const [state, setState] = useLocalStorage(STORAGE_KEY, {
    seller:  defaultSeller,
    buyer:   defaultBuyer,
    invoice: defaultInvoice,
    items:   defaultItems,
    gstRate: '18',
    currency:'INR',
    errors:  {},
  });

  // ── Updaters ─────────────────────────────────────────────

  const updateSeller  = useCallback((field, value) =>
    setState(prev => ({ ...prev, seller:  { ...prev.seller,  [field]: value }, errors: { ...prev.errors, [`seller.${field}`]: '' } })),
  [setState]);

  const updateBuyer   = useCallback((field, value) =>
    setState(prev => ({ ...prev, buyer:   { ...prev.buyer,   [field]: value }, errors: { ...prev.errors, [`buyer.${field}`]: '' } })),
  [setState]);

  const updateInvoice = useCallback((field, value) =>
    setState(prev => ({ ...prev, invoice: { ...prev.invoice, [field]: value } })),
  [setState]);

  const setGstRate = useCallback((value) =>
    setState(prev => ({ ...prev, gstRate: value })),
  [setState]);

  const setCurrency = useCallback((value) =>
    setState(prev => ({ ...prev, currency: value })),
  [setState]);

  // ── Line Items ───────────────────────────────────────────

  const addItem = useCallback(() =>
    setState(prev => ({ ...prev, items: [...prev.items, defaultItem()] })),
  [setState]);

  const removeItem = useCallback((id) =>
    setState(prev => ({
      ...prev,
      items: prev.items.length > 1
        ? prev.items.filter(item => item.id !== id)
        : prev.items, // Keep at least one row
    })),
  [setState]);

  const updateItem = useCallback((id, field, value) =>
    setState(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    })),
  [setState]);

  // ── Reset ────────────────────────────────────────────────

  const resetForm = useCallback(() => {
    setState({
      seller:   defaultSeller,
      buyer:    defaultBuyer,
      invoice:  {
        number:  generateInvoiceNumber(),
        date:    getTodayString(),
        dueDate: getDefaultDueDate(),
      },
      items:    [defaultItem()],
      gstRate:  '18',
      currency: 'INR',
      errors:   {},
    });
  }, [setState]);

  // ── Validation ───────────────────────────────────────────

  const validate = useCallback(() => {
    const errs = {};
    const s = state.seller;
    const b = state.buyer;

    if (!s.businessName?.trim()) errs['seller.businessName'] = 'Business name is required';
    if (!s.email?.trim())        errs['seller.email']        = 'Email is required';
    if (!s.address?.trim())      errs['seller.address']      = 'Address is required';
    if (!b.clientName?.trim())   errs['buyer.clientName']    = 'Client name is required';
    if (!b.clientEmail?.trim())  errs['buyer.clientEmail']   = 'Client email is required';

    const hasValidItem = state.items.some(
      item => item.description?.trim() && parseFloat(item.qty) > 0 && parseFloat(item.rate) > 0,
    );
    if (!hasValidItem) errs['items'] = 'Add at least one valid line item';

    setState(prev => ({ ...prev, errors: errs }));
    return Object.keys(errs).length === 0;
  }, [state, setState]);

  return {
    ...state,
    updateSeller,
    updateBuyer,
    updateInvoice,
    updateItem,
    addItem,
    removeItem,
    setGstRate,
    setCurrency,
    resetForm,
    validate,
  };
}
