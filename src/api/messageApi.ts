import { API_BASE } from './config';

async function apiPost(path: string, body: any) {
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

export async function getConversations(userId: string) {
  const res = await fetch(`${API_BASE}/conversations?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error('Failed to fetch conversations');
  return res.json();
}

export async function getMessages(conversationId: string) {
  const res = await fetch(`${API_BASE}/conversations/${conversationId}/messages`);
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

export async function sendMessage(payload: { conversationId: string; senderId: string; senderName: string; content: string; attachments?: any[] }) {
  return apiPost('/messages/send', payload);
}

export async function createConversation(payload: { subject: string; participants: any[]; firstMessage: string; senderId: string; senderName: string }) {
  return apiPost('/conversations', payload);
}
