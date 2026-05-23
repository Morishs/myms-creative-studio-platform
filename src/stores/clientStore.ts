import type { User } from '../contexts/AuthContext';
import { registerKnownUser, removeKnownUser } from './messageStore';

type Listener = () => void;

const CLIENTS_KEY = 'myms_clients';
const REGISTERED_USERS_KEY = 'myms_registered_users';
const PASSWORDS_KEY = 'myms_user_passwords';

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

function saveClients(clients: User[]) {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

function loadClients(): User[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(CLIENTS_KEY);
  if (raw) {
    return parseStored<User[]>(raw, []);
  }
  const initialClients: User[] = [];
  saveClients(initialClients);
  return initialClients;
}

function saveRegisteredUsers(users: User[]) {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

function loadRegisteredUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(REGISTERED_USERS_KEY);
  return parseStored<User[]>(raw, []);
}

function savePasswords(passwords: Record<string, string>) {
  localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
}

function loadPasswords(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(PASSWORDS_KEY);
  return parseStored<Record<string, string>>(raw, {});
}

export function getClients(): User[] {
  return loadClients();
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isEmailRegistered(email: string, excludeId?: string): boolean {
  const emailLower = email.toLowerCase().trim();
  const hasRegistered = loadRegisteredUsers().some((user) => user.email === emailLower && user.id !== excludeId);
  const hasClient = loadClients().some((client) => client.email === emailLower && client.id !== excludeId);
  return hasRegistered || hasClient;
}

export function addClient(client: User, password?: string): User | null {
  const emailLower = client.email.toLowerCase().trim();
  if (isEmailRegistered(emailLower)) {
    return null;
  }

  const clients = [...loadClients(), client];
  saveClients(clients);

  const registeredUsers = [...loadRegisteredUsers(), client];
  saveRegisteredUsers(registeredUsers);

  if (password) {
    const passwords = loadPasswords();
    passwords[emailLower] = password;
    savePasswords(passwords);
  }

  registerKnownUser({
    id: client.id,
    name: `${client.firstName} ${client.lastName}`.trim(),
    email: client.email,
    role: client.role
  });

  notify();
  return client;
}

export function updateClient(id: string, updates: Partial<User>, password?: string): User | null {
  const clients = loadClients();
  const existing = clients.find((client) => client.id === id);
  if (!existing) return null;

  const updatedEmail = updates.email?.toLowerCase().trim() ?? existing.email;
  if (isEmailRegistered(updatedEmail, id)) {
    return null;
  }

  const updatedClient: User = {
    ...existing,
    ...updates,
    email: updatedEmail,
  };
  const updatedClients = clients.map((client) => client.id === id ? updatedClient : client);
  saveClients(updatedClients);

  const registeredUsers = loadRegisteredUsers();
  const updatedRegisteredUsers = registeredUsers.map((user) => user.id === id ? updatedClient : user);
  saveRegisteredUsers(updatedRegisteredUsers);

  if (password) {
    const passwords = loadPasswords();
    passwords[updatedEmail] = password;
    savePasswords(passwords);
  }

  registerKnownUser({
    id: updatedClient.id,
    name: `${updatedClient.firstName} ${updatedClient.lastName}`.trim(),
    email: updatedClient.email,
    role: updatedClient.role,
  });

  notify();
  return updatedClient;
}

export function deleteClient(id: string): boolean {
  const clients = loadClients();
  const client = clients.find((item) => item.id === id);
  if (!client) return false;

  const remainingClients = clients.filter((item) => item.id !== id);
  saveClients(remainingClients);

  const registeredUsers = loadRegisteredUsers();
  const remainingUsers = registeredUsers.filter((user) => user.id !== id);
  saveRegisteredUsers(remainingUsers);

  const passwords = loadPasswords();
  const emailKey = client.email.toLowerCase().trim();
  if (passwords[emailKey]) {
    delete passwords[emailKey];
    savePasswords(passwords);
  }

  removeKnownUser(id);
  notify();
  return true;
}

export function getClientById(id: string): User | undefined {
  return loadClients().find((client) => client.id === id);
}
