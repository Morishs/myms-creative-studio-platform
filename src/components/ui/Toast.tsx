import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { appStore } from '../../stores/appStore';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-[#10B981]" />,
  error: <AlertCircle className="w-5 h-5 text-[#EF4444]" />,
  warning: <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />,
  info: <Info className="w-5 h-5 text-[#3B82F6]" />,
};

const borders = {
  success: 'border-[#10B981]/30',
  error: 'border-[#EF4444]/30',
  warning: 'border-[#F59E0B]/30',
  info: 'border-[#3B82F6]/30',
};

export function ToastContainer() {
  const [toasts, setToasts] = useState(appStore.getState().toasts);

  useEffect(() => {
    const unsub = appStore.subscribe(() => {
      setToasts([...appStore.getState().toasts]);
    });
    return () => { unsub(); };
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
            className={`pointer-events-auto bg-[#1A1A1A] border ${borders[toast.type]} rounded-xl p-4 shadow-lg flex items-start gap-3`}
          >
            <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{toast.title}</p>
              {toast.message && <p className="text-xs text-[#A0A0A0] mt-0.5">{toast.message}</p>}
            </div>
            <button 
              onClick={() => appStore.removeToast(toast.id)} 
              className="flex-shrink-0 text-[#6B7280] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
