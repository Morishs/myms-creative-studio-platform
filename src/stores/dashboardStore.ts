type Listener = () => void;

const PROJECTS_KEY = 'myms_dashboard_projects';

const QUOTES_KEY = 'myms_dashboard_quotes';
const INVOICES_KEY = 'myms_dashboard_invoices';

export interface DashboardProject {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  serviceType: string;
  status: string;
  progress: number;
  startDate: string;
  estimatedEndDate: string;
  description: string;
}

export interface DashboardQuote {
  id: string;
  clientId: string;
  clientName: string;
  quoteNumber: string;
  title: string;
  total: number;
  currency: string;
  status: string;
  issuedAt: string;
  validUntil: string;
}

export interface DashboardInvoice {
  id: string;
  clientId: string;
  clientName: string;
  invoiceNumber: string;
  title: string;
  total: number;
  amountPaid: number;
  amountDue: number;
  currency: string;
  status: string;
  issuedAt: string;
  dueDate: string;
}

const listeners: Set<Listener> = new Set();

function notify() {
  listeners.forEach((listener) => listener());
}

function parseStored<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveState<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadState<T>(key: string): T {
  if (typeof window === 'undefined') return [] as unknown as T;
  const raw = localStorage.getItem(key);
  return parseStored<T>(raw, [] as unknown as T);
}

export const dashboardStore = {
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getProjects: (): DashboardProject[] => loadState<DashboardProject[]>(PROJECTS_KEY),
  getQuotes: (): DashboardQuote[] => loadState<DashboardQuote[]>(QUOTES_KEY),
  getInvoices: (): DashboardInvoice[] => loadState<DashboardInvoice[]>(INVOICES_KEY),

  setProjects: (projects: DashboardProject[]) => {
    saveState(PROJECTS_KEY, projects);
    notify();
  },

  setQuotes: (quotes: DashboardQuote[]) => {
    saveState(QUOTES_KEY, quotes);
    notify();
  },

  setInvoices: (invoices: DashboardInvoice[]) => {
    saveState(INVOICES_KEY, invoices);
    notify();
  },

  addProject: (project: DashboardProject) => {
    const projects = loadState<DashboardProject[]>(PROJECTS_KEY);
    saveState(PROJECTS_KEY, [...projects, project]);
    notify();
  },

  addQuote: (quote: DashboardQuote) => {
    const quotes = loadState<DashboardQuote[]>(QUOTES_KEY);
    saveState(QUOTES_KEY, [...quotes, quote]);
    notify();
  },

  addInvoice: (invoice: DashboardInvoice) => {
    const invoices = loadState<DashboardInvoice[]>(INVOICES_KEY);
    saveState(INVOICES_KEY, [...invoices, invoice]);
    notify();
  },
};
