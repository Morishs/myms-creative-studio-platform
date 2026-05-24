import {
  getProjects as apiGetProjects,
  getDashboardQuotes as apiGetQuotes,
  getInvoices as apiGetInvoices,
  getTeamMembers as apiGetTeamMembers,
  createProject as apiCreateProject,
  createDashboardQuote as apiCreateQuote,
  createInvoice as apiCreateInvoice,
  createTeamMember as apiCreateTeamMember,
} from '../api/backend';

type Listener = () => void;

const PROJECTS_KEY = 'myms_dashboard_projects';

const QUOTES_KEY = 'myms_dashboard_quotes';
const INVOICES_KEY = 'myms_dashboard_invoices';
const NEWSLETTER_KEY = 'myms_dashboard_newsletter';
const TEAM_KEY = 'myms_dashboard_team';

export interface DashboardProject {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  serviceType: string;
  status: string;
  progress: number;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  startDate: string;
  estimatedEndDate: string;
  createdAt?: string;
  updatedAt?: string;
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
  notes?: string;
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

export interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  subscribedAt: string;
}

export interface DashboardTeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string | null;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  tasksAssigned: string[];
  description?: string;
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
    apiCreateProject(project).catch(() => undefined);
  },

  updateProject: (id: string, updates: Partial<DashboardProject>) => {
    const projects = loadState<DashboardProject[]>(PROJECTS_KEY);
    const updatedProjects = projects.map((project) => project.id === id ? { ...project, ...updates } : project);
    saveState(PROJECTS_KEY, updatedProjects);
    notify();
    apiGetProjects().catch(() => undefined);
  },

  deleteProject: (id: string) => {
    const projects = loadState<DashboardProject[]>(PROJECTS_KEY);
    const remainingProjects = projects.filter((project) => project.id !== id);
    saveState(PROJECTS_KEY, remainingProjects);
    notify();
  },

  addQuote: (quote: DashboardQuote) => {
    const quotes = loadState<DashboardQuote[]>(QUOTES_KEY);
    saveState(QUOTES_KEY, [...quotes, quote]);
    notify();
    apiCreateQuote(quote).catch(() => undefined);
  },

  addInvoice: (invoice: DashboardInvoice) => {
    const invoices = loadState<DashboardInvoice[]>(INVOICES_KEY);
    saveState(INVOICES_KEY, [...invoices, invoice]);
    notify();
    apiCreateInvoice(invoice).catch(() => undefined);
  },

  getNewsletterSubscribers: (): NewsletterSubscriber[] => loadState<NewsletterSubscriber[]>(NEWSLETTER_KEY),
  setNewsletterSubscribers: (subscribers: NewsletterSubscriber[]) => {
    saveState(NEWSLETTER_KEY, subscribers);
    notify();
  },
  addNewsletterSubscriber: (subscriber: NewsletterSubscriber) => {
    const subscribers = loadState<NewsletterSubscriber[]>(NEWSLETTER_KEY);
    saveState(NEWSLETTER_KEY, [...subscribers, subscriber]);
    notify();
  },

  getTeamMembers: (): DashboardTeamMember[] => loadState<DashboardTeamMember[]>(TEAM_KEY),
  setTeamMembers: (members: DashboardTeamMember[]) => {
    saveState(TEAM_KEY, members);
    notify();
  },
  addTeamMember: (member: DashboardTeamMember) => {
    const members = loadState<DashboardTeamMember[]>(TEAM_KEY);
    saveState(TEAM_KEY, [...members, member]);
    notify();
    apiCreateTeamMember(member).catch(() => undefined);
  },

  syncFromApi: async () => {
    const [projects, quotes, invoices, teamMembers] = await Promise.all([
      apiGetProjects(),
      apiGetQuotes(),
      apiGetInvoices(),
      apiGetTeamMembers(),
    ]);

    if (projects?.length) saveState(PROJECTS_KEY, projects);
    if (quotes?.length) saveState(QUOTES_KEY, quotes);
    if (invoices?.length) saveState(INVOICES_KEY, invoices);
    if (teamMembers?.length) saveState(TEAM_KEY, teamMembers);
    notify();
  },
  addTeamMember: (member: DashboardTeamMember) => {
    const members = loadState<DashboardTeamMember[]>(TEAM_KEY);
    saveState(TEAM_KEY, [...members, member]);
    notify();
  },

  updateTeamMember: (id: string, updates: Partial<DashboardTeamMember>) => {
    const members = loadState<DashboardTeamMember[]>(TEAM_KEY);
    const updatedMembers = members.map((member) => member.id === id ? { ...member, ...updates } : member);
    saveState(TEAM_KEY, updatedMembers);
    notify();
  },
};
