// ===== GLOBAL APP STATE STORE =====
// Simple event-driven store for cross-component communication

import {
  createQuoteRequest as apiCreateQuoteRequest,
  addContactMessage as apiAddContactMessage,
  addNewsletterEmail as apiAddNewsletterEmail,
  getQuoteRequests as apiGetQuoteRequests,
} from '../api/backend';

type Listener = () => void;

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export interface QuoteRequestItem {
  id: string;
  clientId: string;
  fullName: string;
  company?: string;
  email: string;
  phone: string;
  services: string[];
  description: string;
  budget?: string;
  deadline?: string;
  references?: string;
  source?: string;
  status: 'NEW' | 'READ' | 'RESPONDED' | 'PROCESSED' | 'CONVERTED' | 'ACCEPTED' | 'REFUSED';
  createdAt: string;
}

interface AppState {
  toasts: Toast[];
  newsletterEmails: string[];
  contactMessages: { name: string; email: string; subject: string; message: string; createdAt: string }[];
  quoteRequests: QuoteRequestItem[];
}

const STORAGE_KEY = 'myms_app_state';

function loadState(): AppState {
  if (typeof window === 'undefined') {
    return {
      toasts: [],
      newsletterEmails: [],
      contactMessages: [],
      quoteRequests: [],
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        toasts: [],
        newsletterEmails: [],
        contactMessages: [],
        quoteRequests: [],
      };
    }
    const parsed = JSON.parse(raw) as AppState;
    return {
      toasts: parsed.toasts ?? [],
      newsletterEmails: parsed.newsletterEmails ?? [],
      contactMessages: parsed.contactMessages ?? [],
      quoteRequests: parsed.quoteRequests ?? [],
    };
  } catch {
    return {
      toasts: [],
      newsletterEmails: [],
      contactMessages: [],
      quoteRequests: [],
    };
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

let state: AppState = loadState();

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
    persist();
    notify();
    setTimeout(() => {
      state = { ...state, toasts: state.toasts.filter(t => t.id !== id) };
      persist();
      notify();
    }, 4000);
  },

  removeToast: (id: string) => {
    state = { ...state, toasts: state.toasts.filter(t => t.id !== id) };
    persist();
    notify();
  },

  addNewsletterEmail: (email: string) => {
    if (!state.newsletterEmails.includes(email)) {
      state = { ...state, newsletterEmails: [...state.newsletterEmails, email] };
      persist();
      notify();
      apiAddNewsletterEmail({ email }).catch(() => undefined);
    }
  },

  addContactMessage: (msg: Omit<AppState['contactMessages'][0], 'createdAt'>) => {
    const contactMessage = { ...msg, createdAt: new Date().toISOString() };
    state = { ...state, contactMessages: [...state.contactMessages, contactMessage] };
    persist();
    notify();
    apiAddContactMessage(contactMessage).catch(() => undefined);
  },

  addQuoteRequest: (req: Omit<QuoteRequestItem, 'id' | 'createdAt' | 'status'>) => {
    const quoteRequest: QuoteRequestItem = {
      ...req,
      id: `qr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };
    state = { ...state, quoteRequests: [...state.quoteRequests, quoteRequest] };
    persist();
    notify();
    apiCreateQuoteRequest(quoteRequest).catch(() => undefined);
    return quoteRequest;
  },

  updateQuoteRequest: (id: string, updates: Partial<Omit<QuoteRequestItem, 'id' | 'clientId' | 'createdAt'>>) => {
    state = {
      ...state,
      quoteRequests: state.quoteRequests.map((req) => req.id === id ? { ...req, ...updates } : req),
    };
    persist();
    notify();
    return state.quoteRequests.find((req) => req.id === id);
  },

  getQuoteRequests: () => state.quoteRequests,

  syncFromApi: async (clientId?: string) => {
    const apiQuoteRequests = await apiGetQuoteRequests(clientId);
    if (!apiQuoteRequests || apiQuoteRequests.length === 0) return;
    const merged = [
      ...state.quoteRequests,
      ...apiQuoteRequests.filter((apiReq) => !state.quoteRequests.some((localReq) => localReq.id === apiReq.id)),
    ];
    state = { ...state, quoteRequests: merged };
    persist();
    notify();
  },
};
