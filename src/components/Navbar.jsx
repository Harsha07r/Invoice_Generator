/**
 * Navbar — top navigation with logo, subtitle, and dark mode toggle.
 */
export default function Navbar({ isDark, onToggleDark }) {
  return (
    <nav className="
      sticky top-0 z-50
      bg-white/80 dark:bg-surface-900/80 backdrop-blur-md
      border-b border-surface-100 dark:border-surface-800
      shadow-card transition-colors duration-300
      no-print
    ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="
              w-9 h-9 rounded-xl
              bg-gradient-to-br from-primary-500 to-primary-700
              flex flex-col items-center justify-center text-white shrink-0
              shadow-md
            ">
              <span className="text-sm font-black leading-none">IF</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-extrabold text-surface-900 dark:text-white tracking-tight">
                InvoiceForge
              </span>
              <span className="text-[10px] text-surface-400 dark:text-surface-500 font-medium hidden sm:block">
                Professional GST Invoice Generator
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Badge */}
            <span className="hidden md:inline-flex badge badge-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse-soft" />
              Free &amp; Open
            </span>

            {/* Dark mode toggle */}
            <button
              id="dark-mode-toggle"
              type="button"
              onClick={onToggleDark}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="
                w-9 h-9 rounded-xl flex items-center justify-center
                bg-surface-100 dark:bg-surface-700
                text-surface-600 dark:text-surface-300
                hover:bg-surface-200 dark:hover:bg-surface-600
                border border-surface-200 dark:border-surface-600
                transition-all duration-200 cursor-pointer
              "
            >
              {isDark ? (
                /* Sun */
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14A7 7 0 0012 5z" />
                </svg>
              ) : (
                /* Moon */
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
