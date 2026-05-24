import { API_BASE } from './config';

const safeFetch = async <T>(path: string, options: RequestInit = {}): Promise<T | null> => {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

export const getNotifications = async (userId: string) => {
  return safeFetch<any[]>(`/notifications?userId=${encodeURIComponent(userId)}`) ?? [];
};

export const createNotification = async (payload: { userId: string; type: string; title: string; description: string; link?: string }) => {
  return safeFetch<any>('/notifications', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const getQuoteRequests = async (clientId?: string) => {
  const query = clientId ? `?clientId=${encodeURIComponent(clientId)}` : '';
  return safeFetch<any[]>(`/quote-requests${query}`) ?? [];
};

export const createQuoteRequest = async (payload: Record<string, unknown>) => {
  return safeFetch<any>('/quote-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const getProjects = async () => {
  return safeFetch<any[]>('/dashboard/projects') ?? [];
};

export const createProject = async (payload: Record<string, unknown>) => {
  return safeFetch<any>('/dashboard/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateProject = async (id: string, payload: Record<string, unknown>) => {
  return safeFetch<any>(`/dashboard/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

export const getDashboardQuotes = async () => {
  return safeFetch<any[]>('/dashboard/quotes') ?? [];
};

export const createDashboardQuote = async (payload: Record<string, unknown>) => {
  return safeFetch<any>('/dashboard/quotes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const getInvoices = async () => {
  return safeFetch<any[]>('/dashboard/invoices') ?? [];
};

export const createInvoice = async (payload: Record<string, unknown>) => {
  return safeFetch<any>('/dashboard/invoices', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const getTeamMembers = async () => {
  return safeFetch<any[]>('/dashboard/team') ?? [];
};

export const createTeamMember = async (payload: Record<string, unknown>) => {
  return safeFetch<any>('/dashboard/team', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const addContactMessage = async (payload: Record<string, unknown>) => {
  return safeFetch<any>('/contact-messages', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const addNewsletterEmail = async (payload: { email: string }) => {
  return safeFetch<any>('/newsletter-emails', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const getUsers = async (role?: string) => {
  const query = role ? `?role=${encodeURIComponent(role)}` : '';
  return safeFetch<any[]>(`/users${query}`) ?? [];
};
