import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { appStore } from '../../stores/appStore';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-success" />,
  error: <AlertCircle className="w-5 h-5 text-error" />,
  warning: <AlertTriangle className="w-5 h-5 text-warning" />,
  info: <Info className="w-5 h-5 text-info" />,
};

const borders = {
  success: 'border-success/30',
  error: 'border-error/30',
  warning: 'border-warning/30',
  info: 'border-info/30',
};

export function ToastContainer() {
  const [toasts, setToasts] = useState(appStore.getState().toasts);

  useEffect(() => {
    const unsub = appStore.subscribe(() => {
      setToasts([...appStore.getState().toasts]);
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            className={`pointer-events-auto bg-surface-alt border ${borders[toast.type]} rounded-3xl p-4 shadow-card flex items-start gap-3`}
          >
            <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary">{toast.title}</p>
              {toast.message && <p className="text-xs text-text-secondary mt-0.5">{toast.message}</p>}
            </div>
            <button
              onClick={() => appStore.removeToast(toast.id)}
              className="flex-shrink-0 text-text-muted hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
