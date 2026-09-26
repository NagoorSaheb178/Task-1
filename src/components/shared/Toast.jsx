/**
 * Toast - Notification toast system rendered at bottom-right
 */
import { useApp } from '../../context/AppContext';

export default function ToastContainer() {
  const { toasts } = useApp();

  const typeStyles = {
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    info: 'bg-primary text-white',
    warning: 'bg-warning text-white',
  };

  const typeIcons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto animate-toast-in flex items-center gap-3 px-5 py-3.5 rounded-xl bg-on-surface text-white shadow-2xl max-w-sm"
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${typeStyles[toast.type]}`}>
            {typeIcons[toast.type]}
          </div>
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
