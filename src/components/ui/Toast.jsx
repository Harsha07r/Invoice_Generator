import { useEffect, useState } from 'react';

/**
 * Toast — animated success/error notification that auto-dismisses.
 * @param {{ message: string, type?: 'success'|'error'|'info', onClose: Function }} props
 */
export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Mount → fade in
    const showTimer = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss after 3s
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // wait for fade-out animation
    }, 3000);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, [onClose]);

  const icons = {
    success: (
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/40 shrink-0">
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </span>
    ),
    error: (
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/40 shrink-0">
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
    ),
    info: (
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 shrink-0">
        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </span>
    ),
  };

  const bars = {
    success: 'bg-green-500',
    error:   'bg-red-500',
    info:    'bg-blue-500',
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        relative overflow-hidden
        flex items-center gap-3 px-4 py-3 pr-10
        bg-white dark:bg-surface-800
        border border-surface-100 dark:border-surface-700
        rounded-2xl shadow-card-lg
        transition-all duration-300 ease-out
        ${visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'}
      `}
    >
      {icons[type]}

      <p className="text-sm font-semibold text-surface-900 dark:text-surface-100 leading-snug">
        {message}
      </p>

      {/* Close button */}
      <button
        type="button"
        onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
        className="
          absolute right-2 top-1/2 -translate-y-1/2
          w-6 h-6 flex items-center justify-center rounded-lg
          text-surface-400 hover:text-surface-600 dark:hover:text-surface-200
          hover:bg-surface-100 dark:hover:bg-surface-700
          transition-colors cursor-pointer
        "
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 ${bars[type]} animate-[shrink_3s_linear_forwards]`}
        style={{ width: '100%', animationFillMode: 'forwards' }}
      />
    </div>
  );
}

/**
 * ToastContainer — fixed-position stack of toasts.
 * @param {{ toasts: Array<{id, message, type}>, onRemove: Function }} props
 */
export function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-6 right-4 sm:right-6 z-[100] flex flex-col gap-2 w-[calc(100vw-2rem)] sm:w-80 max-w-xs sm:max-w-none no-print"
    >
      {toasts.map(t => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() => onRemove(t.id)}
        />
      ))}
    </div>
  );
}
