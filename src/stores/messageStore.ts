// ===== MESSAGERIE UNIVERSELLE =====
// Tout utilisateur peut discuter avec tout autre utilisateur
// Les conversations sont privées entre les 2 participants uniquement
// Persisté dans localStorage

import { API_BASE } from '../api/config';

// Annuaire de tous les utilisateurs connus du site
export interface KnownUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const KNOWN_USERS_KEY = 'myms_known_users';

const DEFAULT_KNOWN_USERS: KnownUser[] = [
  { id: 'admin-1', name: 'Admin Myms', email: 'admin@myms.com', role: 'SUPER_ADMIN' },
  { id: 'admin-2', name: 'Marie Diallo', email: 'manager@myms.com', role: 'PROJECT_MANAGER' },
  { id: 'admin-3', name: 'Amadou Ba', email: 'sales@myms.com', role: 'SALES_MANAGER' },
  { id: 'client-1', name: 'Sophie Martin', email: 'client@demo.com', role: 'CLIENT' },
];

function loadKnownUsers(): KnownUser[] {
  if (typeof window === 'undefined') {
    return DEFAULT_KNOWN_USERS;
  }
  const raw = localStorage.getItem(KNOWN_USERS_KEY);
  if (!raw) {
    localStorage.setItem(KNOWN_USERS_KEY, JSON.stringify(DEFAULT_KNOWN_USERS));
    return [...DEFAULT_KNOWN_USERS];
  }
  try {
    return JSON.parse(raw) as KnownUser[];
  } catch {
    localStorage.setItem(KNOWN_USERS_KEY, JSON.stringify(DEFAULT_KNOWN_USERS));
    return [...DEFAULT_KNOWN_USERS];
  }
}

function saveKnownUsers(users: KnownUser[]) {
  localStorage.setItem(KNOWN_USERS_KEY, JSON.stringify(users));
}

export const KNOWN_USERS: KnownUser[] = loadKnownUsers();

// Retrouver un utilisateur connu par son ID ; sinon on fabrique un placeholder
export function getKnownUser(id: string): KnownUser {
  return KNOWN_USERS.find(u => u.id === id) || { id, name: id, email: '', role: 'CLIENT' };
}

// Ajouter dynamiquement un utilisateur à l'annuaire (lors de l'inscription par ex.)
export function registerKnownUser(u: KnownUser) {
  const existing = KNOWN_USERS.find(x => x.id === u.id);
  if (existing) {
    if (existing.name !== u.name || existing.email !== u.email || existing.role !== u.role) {
      existing.name = u.name;
      existing.email = u.email;
      existing.role = u.role;
      saveKnownUsers(KNOWN_USERS);
    }
    return;
  }
  KNOWN_USERS.push(u);
  saveKnownUsers(KNOWN_USERS);
}

export function removeKnownUser(id: string) {
  const index = KNOWN_USERS.findIndex((user) => user.id === id);
  if (index !== -1) {
    KNOWN_USERS.splice(index, 1);
    saveKnownUsers(KNOWN_USERS);
    notify();
    return true;
  }
  return false;
}

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  status: MessageStatus; // sent → delivered → read
  attachments?: FileAttachment[];
}

// ===== STATUT EN LIGNE =====
const ONLINE_KEY = 'myms_online_users';
const ONLINE_TIMEOUT = 120_000; // 2 minutes

interface OnlineEntry { userId: string; lastSeen: number; }

export function setUserOnline(userId: string) {
  const entries: OnlineEntry[] = JSON.parse(localStorage.getItem(ONLINE_KEY) || '[]');
  const now = Date.now();
  const filtered = entries.filter(e => e.userId !== userId && now - e.lastSeen < ONLINE_TIMEOUT);
  filtered.push({ userId, lastSeen: now });
  localStorage.setItem(ONLINE_KEY, JSON.stringify(filtered));
  notify();
}

export function isUserOnline(userId: string): boolean {
  const entries: OnlineEntry[] = JSON.parse(localStorage.getItem(ONLINE_KEY) || '[]');
  const entry = entries.find(e => e.userId === userId);
  if (!entry) return false;
  return Date.now() - entry.lastSeen < ONLINE_TIMEOUT;
}

export function getOnlineUserIds(): string[] {
  const entries: OnlineEntry[] = JSON.parse(localStorage.getItem(ONLINE_KEY) || '[]');
  const now = Date.now();
  return entries.filter(e => now - e.lastSeen < ONLINE_TIMEOUT).map(e => e.userId);
}

export interface Conversation {
  id: string;
  subject: string;
  // Participants: tableau d'IDs
  participantIds: string[];
  // Infos affichées
  participants: { id: string; name: string; email: string }[];
  lastMessage: string;
  lastMessageAt: string;
  lastSenderId: string;
  // Non-lus par utilisateur: { [userId]: count }
  unread: Record<string, number>;
  createdAt: string;
}

interface MessageState {
  conversations: Conversation[];
  messages: ChatMessage[];
  typing: Record<string, Record<string, boolean>>;
}

type Listener = () => void;
const listeners: Set<Listener> = new Set();
const STORAGE_KEY = 'myms_messages_v2';

function loadState(): MessageState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...getDefaultState(),
        ...parsed,
        typing: parsed.typing || {},
      };
    }
  } catch { /* ignore */ }
  return getDefaultState();
}

function getDefaultState(): MessageState {
  const now = new Date();
  const d = (minAgo: number) => new Date(now.getTime() - minAgo * 60000).toISOString();

  return {
    conversations: [
      {
        id: 'conv-1',
        subject: 'Projet logo Café Lumière',
        participantIds: ['client-1', 'admin-1'],
        participants: [
          { id: 'client-1', name: 'Sophie Martin', email: 'client@demo.com' },
          { id: 'admin-1', name: 'Admin Myms', email: 'admin@myms.com' },
        ],
        lastMessage: 'Les fichiers finaux sont prêts ! Merci pour ce beau projet Sophie ! 😊',
        lastMessageAt: d(30),
        lastSenderId: 'admin-1',
        unread: { 'client-1': 1, 'admin-1': 0 },
        createdAt: d(2880),
      },
      {
        id: 'conv-2',
        subject: 'Visuels réseaux sociaux Q2',
        participantIds: ['client-1', 'admin-1'],
        participants: [
          { id: 'client-1', name: 'Sophie Martin', email: 'client@demo.com' },
          { id: 'admin-1', name: 'Admin Myms', email: 'admin@myms.com' },
        ],
        lastMessage: "D'accord, je vous envoie les références demain matin.",
        lastMessageAt: d(120),
        lastSenderId: 'client-1',
        unread: { 'client-1': 0, 'admin-1': 1 },
        createdAt: d(1440),
      },
      {
        id: 'conv-3',
        subject: 'Brief projet EcoVert',
        participantIds: ['admin-1', 'admin-2'],
        participants: [
          { id: 'admin-1', name: 'Admin Myms', email: 'admin@myms.com' },
          { id: 'admin-2', name: 'Marie Diallo', email: 'manager@myms.com' },
        ],
        lastMessage: 'Marie, tu peux prendre en charge le brief du nouveau client EcoVert ?',
        lastMessageAt: d(60),
        lastSenderId: 'admin-1',
        unread: { 'admin-1': 0, 'admin-2': 1 },
        createdAt: d(90),
      },
      {
        id: 'conv-4',
        subject: 'Devis client RestoBon',
        participantIds: ['admin-1', 'admin-3'],
        participants: [
          { id: 'admin-1', name: 'Admin Myms', email: 'admin@myms.com' },
          { id: 'admin-3', name: 'Amadou Ba', email: 'sales@myms.com' },
        ],
        lastMessage: 'Le devis pour RestoBon est prêt, tu peux le vérifier avant envoi ?',
        lastMessageAt: d(200),
        lastSenderId: 'admin-3',
        unread: { 'admin-1': 1, 'admin-3': 0 },
        createdAt: d(300),
      },
    ],
    typing: {},
    messages: [
      // Conv 1 — Sophie <-> Admin
      { id: 'msg-1', conversationId: 'conv-1', senderId: 'admin-1', senderName: 'Admin Myms', content: "Bonjour Sophie ! J'ai bien reçu votre brief pour le logo. Je commence le travail cette semaine.", createdAt: d(2880), isRead: true, status: 'read' as MessageStatus },
      { id: 'msg-2', conversationId: 'conv-1', senderId: 'client-1', senderName: 'Sophie Martin', content: "Super merci ! J'ai hâte de voir les premières propositions. N'hésitez pas si vous avez des questions.", createdAt: d(2820), isRead: true, status: 'read' as MessageStatus },
      { id: 'msg-3', conversationId: 'conv-1', senderId: 'admin-1', senderName: 'Admin Myms', content: 'Voici les 3 propositions de logo ! Dites-moi laquelle vous préférez. 🎨', createdAt: d(1440), isRead: true, status: 'read' as MessageStatus },
      { id: 'msg-4', conversationId: 'conv-1', senderId: 'client-1', senderName: 'Sophie Martin', content: "J'adore la proposition 2 ! On pourrait essayer avec une teinte plus chaude ?", createdAt: d(1400), isRead: true, status: 'read' as MessageStatus },
      { id: 'msg-5', conversationId: 'conv-1', senderId: 'admin-1', senderName: 'Admin Myms', content: "Bien sûr ! Voici la version révisée avec des tons plus chauds. Qu'en pensez-vous ?", createdAt: d(720), isRead: true, status: 'read' as MessageStatus },
      { id: 'msg-6', conversationId: 'conv-1', senderId: 'client-1', senderName: 'Sophie Martin', content: "C'est parfait ! 🎉 On valide cette version.", createdAt: d(680), isRead: true, status: 'read' as MessageStatus },
      { id: 'msg-7', conversationId: 'conv-1', senderId: 'admin-1', senderName: 'Admin Myms', content: 'Les fichiers finaux sont prêts ! Merci pour ce beau projet Sophie ! 😊', createdAt: d(30), isRead: false, status: 'delivered' as MessageStatus },

      // Conv 2 — Sophie <-> Admin
      { id: 'msg-8', conversationId: 'conv-2', senderId: 'admin-1', senderName: 'Admin Myms', content: "Pour le pack visuels Q2, avez-vous des références à partager ?", createdAt: d(180), isRead: true, status: 'read' as MessageStatus },
      { id: 'msg-9', conversationId: 'conv-2', senderId: 'client-1', senderName: 'Sophie Martin', content: "D'accord, je vous envoie les références demain matin.", createdAt: d(120), isRead: false, status: 'delivered' as MessageStatus },

      // Conv 3 — Admin <-> Marie
      { id: 'msg-10', conversationId: 'conv-3', senderId: 'admin-1', senderName: 'Admin Myms', content: 'Marie, tu peux prendre en charge le brief du nouveau client EcoVert ?', createdAt: d(60), isRead: false, status: 'delivered' as MessageStatus },

      // Conv 4 — Admin <-> Amadou
      { id: 'msg-11', conversationId: 'conv-4', senderId: 'admin-3', senderName: 'Amadou Ba', content: 'Le devis pour RestoBon est prêt, tu peux le vérifier avant envoi ?', createdAt: d(200), isRead: false, status: 'delivered' as MessageStatus },
    ],
  };
}

let state: MessageState = loadState();

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function notify() {
  listeners.forEach(l => l());
}

function hasApiBase() {
  return typeof window !== 'undefined' && !!API_BASE;
}

async function apiPost(path: string, body: any) {
  if (!hasApiBase()) {
    throw new Error('API base URL is not configured');
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }
  return res.json();
}

async function sendMessageToApi(opts: {
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  attachments?: FileAttachment[];
}) {
  return apiPost('/messages/send', opts);
}

async function createConversationToApi(opts: {
  subject: string;
  participants: { id: string; name: string; email: string }[];
  firstMessage: string;
  senderId: string;
  senderName: string;
}) {
  return apiPost('/conversations', opts);
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      try {
        const newState = event.newValue ? JSON.parse(event.newValue) : getDefaultState();
        state = newState;
        notify();
      } catch {
        // ignore malformed storage events
      }
    }
    if (event.key === ONLINE_KEY) {
      notify();
    }
  });
}

export const messageStore = {
  getState: () => state,

  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },

  // Toutes les conversations d'un utilisateur
  getUserConversations: (userId: string) =>
    state.conversations
      .filter(c => c.participantIds.includes(userId))
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()),

  // Messages d'une conversation
  getMessages: (conversationId: string) =>
    state.messages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),

  // Total non-lus pour un utilisateur
  getUnreadCount: (userId: string) =>
    state.conversations
      .filter(c => c.participantIds.includes(userId))
      .reduce((sum, c) => sum + (c.unread[userId] || 0), 0),

  getUserRecentMessages: (userId: string) => {
    const userConversations = state.conversations.filter((conversation) => conversation.participantIds.includes(userId));
    const messages = state.messages.filter((message) => userConversations.some((conversation) => conversation.id === message.conversationId));
    return messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Envoyer un message
  sendMessage: (opts: {
    conversationId: string;
    senderId: string;
    senderName: string;
    content: string;
    attachments?: FileAttachment[];
  }) => {
    const conv = state.conversations.find(c => c.id === opts.conversationId);
    if (!conv) return null;

    // Créer une notification pour chaque destinataire
    try {
      // Dynamic import to avoid circular dependency
      const { notificationStore } = require('./notificationStore');
      for (const pid of conv.participantIds) {
        if (pid !== opts.senderId) {
          notificationStore.add({
            userId: pid,
            type: 'message' as const,
            title: 'Nouveau message',
            description: `${opts.senderName} : ${opts.content.slice(0, 80)}${opts.content.length > 80 ? '…' : ''}`,
            link: pid.startsWith('client') ? '/client/messages' : '/admin/messages',
          });
        }
      }
    } catch { /* ignore if notificationStore not available */ }

    const msg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      conversationId: opts.conversationId,
      senderId: opts.senderId,
      senderName: opts.senderName,
      content: opts.content,
      createdAt: new Date().toISOString(),
      isRead: true,
      status: 'sent',
      attachments: opts.attachments,
    };

    // After a short delay, mark as delivered for the sender's sent message state
    setTimeout(() => {
      state = {
        ...state,
        messages: state.messages.map(m => m.id === msg.id ? { ...m, status: 'delivered' } : m),
      };
      persist();
      notify();
    }, 300);

    state = {
      ...state,
      messages: [...state.messages, msg],
      typing: {
        ...state.typing,
        [opts.conversationId]: {
          ...(state.typing[opts.conversationId] || {}),
          [opts.senderId]: false,
        },
      },
    };

    // Incrémenter les non-lus pour tous les autres participants
    const newUnread = { ...conv.unread };
    for (const pid of conv.participantIds) {
      if (pid !== opts.senderId) {
        newUnread[pid] = (newUnread[pid] || 0) + 1;
      }
    }

    state = {
      ...state,
      conversations: state.conversations.map(c => {
        if (c.id !== opts.conversationId) return c;
        return {
          ...c,
          lastMessage: opts.content,
          lastMessageAt: msg.createdAt,
          lastSenderId: opts.senderId,
          unread: newUnread,
        };
      }),
    };
    persist();
    notify();

    if (hasApiBase()) {
      sendMessageToApi(opts).catch(() => {
        // Fallback to localStorage if API is unavailable.
      });
    }

    return msg;
  },

  setTyping: (conversationId: string, userId: string, typing: boolean) => {
    state = {
      ...state,
      typing: {
        ...state.typing,
        [conversationId]: {
          ...(state.typing[conversationId] || {}),
          [userId]: typing,
        },
      },
    };
    persist();
    notify();
  },

  getTyping: (conversationId: string, userId: string) =>
    !!state.typing[conversationId]?.[userId],

  getTypingForConversation: (conversationId: string) =>
    state.typing[conversationId] || {},

  // Marquer comme lu pour un utilisateur
  markAsRead: (conversationId: string, userId: string) => {
    state = {
      ...state,
      messages: state.messages.map(m => {
        if (m.conversationId !== conversationId) return m;
        if (m.senderId === userId) return m; // own messages stay as-is
        return { ...m, isRead: true, status: 'read' as MessageStatus };
      }),
      conversations: state.conversations.map(c => {
        if (c.id !== conversationId) return c;
        return { ...c, unread: { ...c.unread, [userId]: 0 } };
      }),
    };
    persist();
    notify();
  },

  // Créer une conversation entre n'importe quels utilisateurs
  createConversation: (opts: {
    subject: string;
    participants: { id: string; name: string; email: string }[];
    firstMessage: string;
    senderId: string;
    senderName: string;
    attachments?: FileAttachment[];
  }): Conversation => {
    const convId = `conv-${Date.now()}`;
    const now = new Date().toISOString();
    const unread: Record<string, number> = {};
    for (const p of opts.participants) {
      unread[p.id] = p.id === opts.senderId ? 0 : 1;
    }
    const conv: Conversation = {
      id: convId,
      subject: opts.subject,
      participantIds: opts.participants.map(p => p.id),
      participants: opts.participants,
      lastMessage: opts.firstMessage,
      lastMessageAt: now,
      lastSenderId: opts.senderId,
      unread,
      createdAt: now,
    };
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: convId,
      senderId: opts.senderId,
      senderName: opts.senderName,
      content: opts.firstMessage,
      createdAt: now,
      isRead: true,
      status: 'read',
      attachments: opts.attachments,
    };
    state = {
      ...state,
      conversations: [...state.conversations, conv],
      messages: [...state.messages, msg],
      typing: {
        ...state.typing,
        [convId]: opts.participants.reduce((acc, participant) => ({
          ...acc,
          [participant.id]: false,
        }), {} as Record<string, boolean>),
      },
    };
    persist();
    notify();

    if (hasApiBase()) {
      createConversationToApi(opts).catch(() => {
        // Fallback to localStorage if API is unavailable.
      });
    }

    return conv;
  },

  // Réinitialiser (utile pour debug)
  reset: () => {
    state = getDefaultState();
    persist();
    notify();
  },

  // POC: synchroniser depuis un serveur API (Express + lowdb) si disponible
  syncFromApi: async (userId: string) => {
    if (!hasApiBase()) return false;
    try {
      const convRes = await fetch(`${API_BASE}/conversations?userId=${encodeURIComponent(userId)}`);
      if (!convRes.ok) return false;
      const convs = await convRes.json();
      const messagesPromises = convs.map((c: any) => fetch(`${API_BASE}/conversations/${c.id}/messages`).then(r => r.ok ? r.json() : []));
      const messagesArrays = await Promise.all(messagesPromises);
      state = {
        ...state,
        conversations: convs,
        messages: messagesArrays.flat(),
        typing: {},
      };
      persist();
      notify();
      return true;
    } catch (e) {
      return false;
    }
  },
};
