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

export interface DashboardProjectFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  uploadedAt: string;
  uploadedBy?: string;
}

export interface DashboardProjectComment {
  id: string;
  authorId: string;
  authorName: string;
  role: string;
  content: string;
  createdAt: string;
}

export interface DashboardProjectActivity {
  id: string;
  type: 'status' | 'progress' | 'file' | 'comment' | 'general';
  createdAt: string;
  details: string;
}

export interface DashboardProject {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  serviceType: string;
  status: string;
  progress: number;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo?: string;
  amount?: number;
  startDate: string;
  estimatedEndDate: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  notes?: string;
  tags?: string[];
  files?: DashboardProjectFile[];
  comments?: DashboardProjectComment[];
  activities?: DashboardProjectActivity[];
}

export interface DashboardQuote {
  id: string;
  clientId: string;
  clientEmail?: string;
  clientName: string;
  quoteNumber: string;
  title: string;
  total: number;
  currency: string;
  status: string;
  issuedAt: string;
  validUntil: string;
  sentAt?: string;
  emailStatus?: 'DRAFT' | 'SENT' | 'VIEWED' | 'ACCEPTED' | 'REFUSED' | 'EXPIRED';
  history?: Array<{ id: string; createdAt: string; type: string; label: string; details?: string }>;
  notes?: string;
  lineItems?: Array<{ id: string; description: string; quantity: number; unitPrice: number }>;
}

export interface DashboardInvoice {
  id: string;
  clientId: string;
  clientEmail?: string;
  clientName: string;
  quoteId?: string;
  quoteNumber?: string;
  invoiceNumber: string;
  title: string;
  total: number;
  amountPaid: number;
  amountDue: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  issuedAt: string;
  dueDate: string;
  notes?: string;
  lineItems?: Array<{ id: string; description: string; quantity: number; unitPrice: number }>;
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
    const normalizedProject: DashboardProject = {
      ...project,
      createdAt: project.createdAt || new Date().toISOString(),
      updatedAt: project.updatedAt || new Date().toISOString(),
      notes: project.notes || '',
      tags: project.tags || [],
      files: project.files || [],
      comments: project.comments || [],
      activities: project.activities || [
        {
          id: `activity-${Date.now()}`,
          type: 'general',
          createdAt: new Date().toISOString(),
          details: 'Projet créé.',
        },
      ],
    };
    saveState(PROJECTS_KEY, [...projects, normalizedProject]);
    notify();
    apiCreateProject(normalizedProject).catch(() => undefined);
  },

  updateProject: (id: string, updates: Partial<DashboardProject>) => {
    const projects = loadState<DashboardProject[]>(PROJECTS_KEY);
    const updatedProjects = projects.map((project) => {
      if (project.id !== id) return project;
      const updatedProject = { ...project, ...updates, updatedAt: new Date().toISOString() };
      const activityDetails: string[] = [];
      if (updates.status && updates.status !== project.status) {
        activityDetails.push(`Statut mis à jour : ${project.status} → ${updates.status}`);
      }
      if (typeof updates.progress === 'number' && updates.progress !== project.progress) {
        activityDetails.push(`Progression mise à jour : ${updates.progress}%`);
      }
      if (activityDetails.length > 0) {
        updatedProject.activities = [
          ...(project.activities || []),
          {
            id: `activity-${Date.now()}`,
            type: updates.status && updates.status !== project.status ? 'status' : 'progress',
            createdAt: new Date().toISOString(),
            details: activityDetails.join(' / '),
          },
        ];
      }
      return updatedProject;
    });
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

  addProjectFile: (projectId: string, file: DashboardProjectFile) => {
    const projects = loadState<DashboardProject[]>(PROJECTS_KEY);
    const updatedProjects = projects.map((project) => project.id === projectId
      ? { ...project, files: [...(project.files || []), file], updatedAt: new Date().toISOString() }
      : project
    );
    saveState(PROJECTS_KEY, updatedProjects);
    notify();
  },

  removeProjectFile: (projectId: string, fileId: string) => {
    const projects = loadState<DashboardProject[]>(PROJECTS_KEY);
    const updatedProjects = projects.map((project) => project.id === projectId
      ? { ...project, files: (project.files || []).filter((file) => file.id !== fileId), updatedAt: new Date().toISOString() }
      : project
    );
    saveState(PROJECTS_KEY, updatedProjects);
    notify();
  },

  addProjectComment: (projectId: string, comment: DashboardProjectComment) => {
    const projects = loadState<DashboardProject[]>(PROJECTS_KEY);
    const updatedProjects = projects.map((project) => project.id === projectId
      ? {
        ...project,
        comments: [...(project.comments || []), comment],
        activities: [
          ...(project.activities || []),
          {
            id: `activity-${Date.now()}`,
            type: 'comment',
            createdAt: new Date().toISOString(),
            details: `${comment.authorName} a ajouté un commentaire.`,
          },
        ],
        updatedAt: new Date().toISOString(),
      }
      : project
    );
    saveState(PROJECTS_KEY, updatedProjects);
    notify();
  },

  addProjectActivity: (projectId: string, activity: DashboardProjectActivity) => {
    const projects = loadState<DashboardProject[]>(PROJECTS_KEY);
    const updatedProjects = projects.map((project) => project.id === projectId
      ? {
        ...project,
        activities: [...(project.activities || []), activity],
        updatedAt: new Date().toISOString(),
      }
      : project
    );
    saveState(PROJECTS_KEY, updatedProjects);
    notify();
  },

  getProjectById: (id: string) => {
    const projects = loadState<DashboardProject[]>(PROJECTS_KEY);
    return projects.find((project) => project.id === id);
  },

  getClientProjects: (clientId: string) => {
    const projects = loadState<DashboardProject[]>(PROJECTS_KEY);
    return projects.filter((project) => project.clientId === clientId);
  },

  addQuote: (quote: DashboardQuote) => {
    const quotes = loadState<DashboardQuote[]>(QUOTES_KEY);
    saveState(QUOTES_KEY, [...quotes, quote]);
    notify();
    apiCreateQuote(quote).catch(() => undefined);
  },

  updateQuote: (id: string, updates: Partial<DashboardQuote>) => {
    const quotes = loadState<DashboardQuote[]>(QUOTES_KEY);
    const updatedQuotes = quotes.map((quote) => quote.id === id ? { ...quote, ...updates } : quote);
    saveState<DashboardQuote[]>(QUOTES_KEY, updatedQuotes);
    notify();
    apiGetQuotes().catch(() => undefined);
  },

  deleteQuote: (id: string) => {
    const quotes = loadState<DashboardQuote[]>(QUOTES_KEY);
    const remainingQuotes = quotes.filter((quote) => quote.id !== id);
    saveState(QUOTES_KEY, remainingQuotes);
    notify();
  },

  addInvoice: (invoice: DashboardInvoice) => {
    const invoices = loadState<DashboardInvoice[]>(INVOICES_KEY);
    saveState(INVOICES_KEY, [...invoices, invoice]);
    notify();
    apiCreateInvoice(invoice).catch(() => undefined);
  },

  updateInvoice: (id: string, updates: Partial<DashboardInvoice>) => {
    const invoices = loadState<DashboardInvoice[]>(INVOICES_KEY);
    const updatedInvoices = invoices.map((invoice) => invoice.id === id ? { ...invoice, ...updates } : invoice);
    saveState<DashboardInvoice[]>(INVOICES_KEY, updatedInvoices);
    notify();
    apiGetInvoices().catch(() => undefined);
  },

  deleteInvoice: (id: string) => {
    const invoices = loadState<DashboardInvoice[]>(INVOICES_KEY);
    const remainingInvoices = invoices.filter((invoice) => invoice.id !== id);
    saveState(INVOICES_KEY, remainingInvoices);
    notify();
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
