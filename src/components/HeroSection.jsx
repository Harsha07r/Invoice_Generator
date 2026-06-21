/**
 * HeroSection — Landing hero with title, description, and feature badges.
 */
export default function HeroSection() {
  const features = [
    { icon: '⚡', label: 'Instant Preview' },
    { icon: '📄', label: 'PDF Download' },
    { icon: '🔒', label: 'No Sign-up' },
    { icon: '☁️', label: 'Auto-saved' },
    { icon: '🌙', label: 'Dark Mode' },
    { icon: '🇮🇳', label: 'GST Ready' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white dark:from-surface-900 dark:to-surface-950 border-b border-surface-100 dark:border-surface-800 no-print">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 0v40M40 0v40M0 0h40M0 40h40' stroke='%234361ee' stroke-width='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400/10 dark:bg-primary-400/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-accent-400/10 dark:bg-accent-400/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center max-w-3xl mx-auto">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-primary-50 dark:bg-primary-900/30
            border border-primary-100 dark:border-primary-800
            text-primary-600 dark:text-primary-400
            text-xs font-semibold mb-6 animate-fade-in"
          >
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-soft" />
            100% Free · No Registration · Works Offline
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-surface-900 dark:text-white tracking-tight leading-tight text-balance animate-slide-up">
            Generate Professional{' '}
            <span className="gradient-text">GST Invoices</span>{' '}
            Instantly
          </h1>

          {/* Description */}
          <p className="mt-4 text-base sm:text-lg text-surface-500 dark:text-surface-400 max-w-xl mx-auto leading-relaxed animate-slide-up">
            Create, preview, and download clean invoices in seconds.
            Fill in the form on the left and watch the preview update in real time.
          </p>

          {/* Social proof */}
          <div className="mt-5 flex items-center justify-center gap-3 animate-fade-in">
            {/* Avatar stack */}
            <div className="flex -space-x-2">
              {['F', 'A', 'S', 'B'].map((letter, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-white dark:border-surface-900 flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                  style={{
                    background: [
                      'linear-gradient(135deg,#4361ee,#3046d6)',
                      'linear-gradient(135deg,#f97316,#ea580c)',
                      'linear-gradient(135deg,#06b6d4,#0891b2)',
                      'linear-gradient(135deg,#8b5cf6,#7c3aed)',
                    ][i],
                  }}
                >
                  {letter}
                </div>
              ))}
            </div>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Trusted by{' '}
              <span className="font-semibold text-surface-700 dark:text-surface-200">
                freelancers, agencies
              </span>{' '}
              and{' '}
              <span className="font-semibold text-surface-700 dark:text-surface-200">
                small businesses
              </span>
            </p>
          </div>

          {/* Feature chips */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 animate-fade-in">
            {features.map(f => (
              <span
                key={f.label}
                className="
                  inline-flex items-center gap-1.5 px-3 py-1.5
                  bg-white dark:bg-surface-800
                  border border-surface-200 dark:border-surface-700
                  rounded-lg text-xs font-medium text-surface-600 dark:text-surface-300
                  shadow-card hover:shadow-card-md hover:-translate-y-0.5
                  transition-all duration-200
                "
              >
                <span>{f.icon}</span>
                {f.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
