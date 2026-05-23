// ===== GLOBAL APP STATE STORE =====
// Simple event-driven store for cross-component communication

type Listener = () => void;

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppState {
  toasts: Toast[];
  newsletterEmails: string[];
  contactMessages: { name: string; email: string; subject: string; message: string; createdAt: string }[];
  quoteRequests: { fullName: string; email: string; phone: string; service: string; description: string; createdAt: string }[];
}

let state: AppState = {
  toasts: [],
  newsletterEmails: [],
  contactMessages: [],
  quoteRequests: [],
};

const listeners: Set<Listener> = new Set();

function notify() {
  listeners.forEach(l => l());
}

export const appStore = {
  getState: () => state,
  
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  addToast: (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}`;
    state = { ...state, toasts: [...state.toasts, { ...toast, id }] };
    notify();
    // Auto remove after 4 seconds
    setTimeout(() => {
      state = { ...state, toasts: state.toasts.filter(t => t.id !== id) };
      notify();
    }, 4000);
  },

  removeToast: (id: string) => {
    state = { ...state, toasts: state.toasts.filter(t => t.id !== id) };
    notify();
  },

  addNewsletterEmail: (email: string) => {
    if (!state.newsletterEmails.includes(email)) {
      state = { ...state, newsletterEmails: [...state.newsletterEmails, email] };
      notify();
    }
  },

  addContactMessage: (msg: Omit<AppState['contactMessages'][0], 'createdAt'>) => {
    state = { ...state, contactMessages: [...state.contactMessages, { ...msg, createdAt: new Date().toISOString() }] };
    notify();
  },

  addQuoteRequest: (req: Omit<AppState['quoteRequests'][0], 'createdAt'>) => {
    state = { ...state, quoteRequests: [...state.quoteRequests, { ...req, createdAt: new Date().toISOString() }] };
    notify();
  },
};
