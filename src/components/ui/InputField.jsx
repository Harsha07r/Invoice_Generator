/**
 * InputField — reusable labeled input / textarea with error state.
 */
export default function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  multiline = false,
  rows = 3,
  className = '',
  helpText = '',
  ...rest
}) {
  const baseClass = `input-base ${error ? 'input-error' : ''} ${className}`;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-surface-600 dark:text-surface-400 tracking-wide flex items-center gap-1"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {multiline ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${baseClass} resize-none`}
          {...rest}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseClass}
          {...rest}
        />
      )}

      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1 animate-fade-in">
          <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {helpText && !error && (
        <p className="text-xs text-surface-400 dark:text-surface-500">{helpText}</p>
      )}
    </div>
  );
}
