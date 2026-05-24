// ===== SYSTÈME DE NOTIFICATIONS =====
// Notifications par utilisateur, persistées dans localStorage

import { createNotification as apiCreateNotification, getNotifications as apiGetNotifications } from '../api/backend';

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'quote' | 'invoice' | 'project' | 'delivery' | 'system';
  title: string;
  description: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'myms_notifications';
type Listener = () => void;
const listeners: Set<Listener> = new Set();

function loadState(): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return getDefaults();
}

function getDefaults(): Notification[] {
  const now = new Date();
  const d = (minAgo: number) => new Date(now.getTime() - minAgo * 60000).toISOString();

  return [
    // Client — Sophie
    { id: 'n1', userId: 'client-1', type: 'message', title: 'Nouveau message', description: 'Admin Myms vous a envoyé un message sur « Projet logo Café Lumière ».', link: '/client/messages', isRead: false, createdAt: d(30) },
    { id: 'n2', userId: 'client-1', type: 'delivery', title: 'Fichiers disponibles', description: 'Les livrables de votre projet logo sont prêts à télécharger.', link: '/client/fichiers', isRead: false, createdAt: d(35) },
    { id: 'n3', userId: 'client-1', type: 'invoice', title: 'Facture reçue', description: 'La facture MYMS-FAC-2024-004 de $90,000 est en attente de paiement.', link: '/client/factures', isRead: true, createdAt: d(1440) },

    // Admin
    { id: 'n4', userId: 'admin-1', type: 'message', title: 'Nouveau message', description: 'Sophie Martin vous a répondu sur « Visuels réseaux sociaux Q2 ».', link: '/admin/messages', isRead: false, createdAt: d(120) },
    { id: 'n5', userId: 'admin-1', type: 'quote', title: 'Nouvelle demande de devis', description: 'Julie Bernard a soumis une demande de devis pour un logo et une identité visuelle.', link: '/admin/demandes', isRead: false, createdAt: d(540) },
    { id: 'n6', userId: 'admin-1', type: 'message', title: 'Nouveau message', description: 'Amadou Ba a envoyé un message sur « Devis client RestoBon ».', link: '/admin/messages', isRead: false, createdAt: d(200) },
    { id: 'n7', userId: 'admin-1', type: 'project', title: 'Projet mis à jour', description: 'Le projet « Packaging Bio Délices » est passé en révision.', link: '/admin/projets', isRead: true, createdAt: d(2880) },
    { id: 'n8', userId: 'admin-1', type: 'system', title: 'Nouvel abonné newsletter', description: 'Un nouvel utilisateur s\'est inscrit à la newsletter.', link: '/admin/newsletter', isRead: true, createdAt: d(4320) },

    // Marie — chef de projet
    { id: 'n9', userId: 'admin-2', type: 'message', title: 'Nouveau message', description: 'Admin Myms vous a envoyé un message sur « Brief projet EcoVert ».', link: '/admin/messages', isRead: false, createdAt: d(60) },

    // Amadou — commercial
    { id: 'n10', userId: 'admin-3', type: 'message', title: 'Message lu', description: 'Admin Myms a lu votre message sur « Devis client RestoBon ».', link: '/admin/messages', isRead: false, createdAt: d(150) },
  ];
}

let state: Notification[] = loadState();

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function notify() {
  listeners.forEach(l => l());
}

export const notificationStore = {
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },

  // Notifications d'un utilisateur
  getUserNotifications: (userId: string) =>
    state
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

  // Non-lus
  getUnreadCount: (userId: string) =>
    state.filter(n => n.userId === userId && !n.isRead).length,

  // Ajouter une notification
  add: (n: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const notif: Notification = {
      ...n,
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    state = [notif, ...state];
    persist();
    notify();
    apiCreateNotification(notif).catch(() => undefined);
  },

  // Marquer une notification comme lue
  markAsRead: (id: string) => {
    state = state.map(n => n.id === id ? { ...n, isRead: true } : n);
    persist();
    notify();
  },

  // Tout marquer comme lu pour un utilisateur
  markAllAsRead: (userId: string) => {
    state = state.map(n => n.userId === userId ? { ...n, isRead: true } : n);
    persist();
    notify();
  },

  // Supprimer
  remove: (id: string) => {
    state = state.filter(n => n.id !== id);
    persist();
    notify();
  },

  syncFromApi: async (userId: string) => {
    const remoteNotifications = await apiGetNotifications(userId);
    if (!remoteNotifications || remoteNotifications.length === 0) return;
    const existingIds = new Set(state.map((n) => n.id));
    const merged = [
      ...remoteNotifications.filter((n) => !existingIds.has(n.id)),
      ...state,
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    state = merged;
    persist();
    notify();
  },
};
