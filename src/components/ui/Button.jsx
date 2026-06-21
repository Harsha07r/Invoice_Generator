/**
 * Button — reusable button with variant system and loading state.
 * Variants: primary | secondary | danger | ghost | outline
 */
export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  iconRight = null,
  type = 'button',
  className = '',
  ...rest
}) {
  const base = `
    inline-flex items-center justify-center gap-2 font-semibold rounded-xl
    transition-all duration-200 cursor-pointer select-none
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
  `;

  const sizes = {
    xs:  'px-2.5 py-1 text-xs',
    sm:  'px-3.5 py-1.5 text-sm',
    md:  'px-4 py-2.5 text-sm',
    lg:  'px-5 py-3 text-base',
    xl:  'px-6 py-3.5 text-base',
  };

  const variants = {
    primary: `
      bg-primary-500 hover:bg-primary-600 active:bg-primary-700
      text-white shadow-md hover:shadow-lg
      focus-visible:ring-primary-500
    `,
    secondary: `
      bg-surface-100 hover:bg-surface-200 active:bg-surface-300
      dark:bg-surface-700 dark:hover:bg-surface-600 dark:active:bg-surface-500
      text-surface-700 dark:text-surface-200
      border border-surface-200 dark:border-surface-600
      focus-visible:ring-surface-400
    `,
    danger: `
      bg-red-500 hover:bg-red-600 active:bg-red-700
      text-white shadow-md hover:shadow-lg
      focus-visible:ring-red-500
    `,
    ghost: `
      bg-transparent hover:bg-surface-100 dark:hover:bg-surface-700/60
      text-surface-600 dark:text-surface-400
      focus-visible:ring-surface-400
    `,
    outline: `
      bg-transparent border border-primary-300 dark:border-primary-600
      hover:bg-primary-50 dark:hover:bg-primary-900/20
      text-primary-600 dark:text-primary-400
      focus-visible:ring-primary-500
    `,
    accent: `
      bg-gradient-to-r from-accent-500 to-accent-600
      hover:from-accent-600 hover:to-accent-700
      active:from-accent-700 active:to-accent-800
      text-white shadow-md hover:shadow-lg
      focus-visible:ring-accent-500
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
      {...rest}
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
      {iconRight && !loading && iconRight}
    </button>
  );
}
