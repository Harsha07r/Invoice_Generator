import { useRef, useCallback } from 'react';
import InputField from '../ui/InputField';

/**
 * LogoUploader — drag-and-drop / click-to-upload logo with instant preview.
 */
function LogoUploader({ logo, onLogoChange }) {
  const inputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo must be under 2 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => onLogoChange(e.target.result);
    reader.readAsDataURL(file);
  }, [onLogoChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-surface-600 dark:text-surface-400 tracking-wide">
        Company Logo <span className="text-surface-400 font-normal">(optional)</span>
      </span>

      {logo ? (
        /* ── Logo preview ── */
        <div className="flex items-center gap-3 p-3 rounded-xl border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700/30">
          <div className="w-16 h-16 rounded-xl border border-surface-200 dark:border-surface-600 overflow-hidden flex items-center justify-center bg-white dark:bg-surface-800 shrink-0">
            <img
              src={logo}
              alt="Company logo"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Logo uploaded
            </p>
            <p className="text-xs text-surface-400 mt-0.5">Appears in invoice preview &amp; PDF</p>
          </div>
          <div className="flex flex-col gap-1 shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-xs px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800 hover:bg-primary-100 transition-colors cursor-pointer font-medium"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onLogoChange('')}
              className="text-xs px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-100 dark:border-red-900/30 hover:bg-red-100 transition-colors cursor-pointer font-medium"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* ── Upload zone ── */
        <div
          className="logo-upload-zone group"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          role="button"
          tabIndex={0}
          aria-label="Upload company logo"
          onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2 pointer-events-none">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-surface-600 dark:text-surface-300">
                <span className="text-primary-500">Click to upload</span> or drag &amp; drop
              </p>
              <p className="text-[10px] text-surface-400 mt-0.5">PNG, JPG, SVG · Max 2 MB</p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFile(e.target.files[0])}
      />
    </div>
  );
}

/**
 * SellerInfo — Seller / Business information form section with logo upload.
 */
export default function SellerInfo({ seller, onUpdate, errors }) {
  return (
    <div className="space-y-4">
      <p className="section-label">Your Business</p>

      {/* Logo uploader */}
      <LogoUploader
        logo={seller.logo}
        onLogoChange={v => onUpdate('logo', v)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <InputField
            id="seller-businessName"
            label="Business Name"
            value={seller.businessName}
            onChange={v => onUpdate('businessName', v)}
            placeholder="Acme Corporation"
            required
            error={errors['seller.businessName']}
          />
        </div>

        <InputField
          id="seller-email"
          label="Email Address"
          type="email"
          value={seller.email}
          onChange={v => onUpdate('email', v)}
          placeholder="hello@acme.com"
          required
          error={errors['seller.email']}
        />

        <InputField
          id="seller-phone"
          label="Phone Number"
          type="tel"
          value={seller.phone}
          onChange={v => onUpdate('phone', v)}
          placeholder="+91 98765 43210"
        />

        <div className="sm:col-span-2">
          <InputField
            id="seller-address"
            label="Business Address"
            value={seller.address}
            onChange={v => onUpdate('address', v)}
            placeholder="123 Business Park, Mumbai, Maharashtra 400001"
            multiline
            rows={2}
            required
            error={errors['seller.address']}
          />
        </div>

        <InputField
          id="seller-gstNumber"
          label="GST Number"
          value={seller.gstNumber}
          onChange={v => onUpdate('gstNumber', v.toUpperCase())}
          placeholder="22AAAAA0000A1Z5"
          helpText="15-digit GSTIN (optional)"
        />
      </div>
    </div>
  );
}
