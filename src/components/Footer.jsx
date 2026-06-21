/**
 * Footer — Credits, email, and Digital Heroes CTA button.
 */
export default function Footer() {
  return (
    <footer className="
      mt-16 border-t border-surface-100 dark:border-surface-800
      bg-white dark:bg-surface-900
      no-print
    ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col items-center gap-6 text-center">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="
              w-8 h-8 rounded-lg
              bg-gradient-to-br from-primary-500 to-primary-700
              flex items-center justify-center text-white
            ">
              <span className="text-xs font-black">IF</span>
            </div>
            <span className="text-base font-extrabold text-surface-900 dark:text-white">InvoiceForge</span>
          </div>

          {/* Author */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-surface-700 dark:text-surface-300">
              Harsha Vardhan
            </p>
            <a
              href="mailto:harshaalapati1324@gmail.com"
              className="text-sm text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              harshaalapati1324@gmail.com
            </a>
          </div>

          {/* CTA Button */}
          <a
            id="digital-heroes-btn"
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="
              group inline-flex items-center gap-2.5
              px-6 py-3 rounded-2xl
              bg-gradient-to-r from-accent-500 to-accent-600
              hover:from-accent-600 hover:to-accent-700
              active:scale-95
              text-white font-bold text-sm
              shadow-lg hover:shadow-xl hover:shadow-accent-500/25
              transition-all duration-200
            "
          >
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Built for Digital Heroes
            <svg
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* Bottom line */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs text-surface-400 dark:text-surface-600">
            <span>© {new Date().getFullYear()} InvoiceForge</span>
            <span>·</span>
            <span>No data sent to servers</span>
            <span>·</span>
            <span>Open source &amp; free</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
