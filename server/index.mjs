import express from 'express';
import cors from 'cors';
import { Low, JSONFile } from 'lowdb';
import { nanoid } from 'nanoid';

const app = express();
app.use(cors());
app.use(express.json());

const adapter = new JSONFile('./db.json');
const db = new Low(adapter);
await db.read();
if (!db.data) {
  db.data = {
    users: [],
    conversations: [],
    messages: [],
    notifications: [],
    quoteRequests: [],
    projects: [],
    quotes: [],
    invoices: [],
    teamMembers: [],
    newsletterEmails: [],
    contactMessages: []
  };
  await db.write();
}

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/users', async (req, res) => {
  await db.read();
  const role = req.query.role;
  const users = db.data.users || [];
  if (role) return res.json(users.filter((user) => user.role === role));
  res.json(users);
});

app.get('/notifications', async (req, res) => {
  await db.read();
  const userId = req.query.userId;
  const notifications = db.data.notifications || [];
  if (!userId) return res.json(notifications);
  res.json(notifications.filter((item) => item.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.post('/notifications', async (req, res) => {
  const { userId, type, title, description, link } = req.body;
  if (!userId || !type || !title || !description) return res.status(400).json({ error: 'missing' });
  await db.read();
  const notification = {
    id: `n-${Date.now()}-${nanoid(4)}`,
    userId,
    type,
    title,
    description,
    link,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  db.data.notifications.push(notification);
  await db.write();
  res.status(201).json(notification);
});

app.get('/quote-requests', async (req, res) => {
  await db.read();
  const clientId = req.query.clientId;
  const quoteRequests = db.data.quoteRequests || [];
  if (clientId) return res.json(quoteRequests.filter((item) => item.clientId === clientId));
  res.json(quoteRequests);
});

app.post('/quote-requests', async (req, res) => {
  const { clientId, fullName, email, phone, services, description, budget, deadline, references, source } = req.body;
  if (!clientId || !fullName || !email || !phone || !services || !description) {
    return res.status(400).json({ error: 'missing' });
  }
  await db.read();
  const quoteRequest = {
    id: `qr-${Date.now()}-${nanoid(4)}`,
    clientId,
    fullName,
    email,
    phone,
    services,
    description,
    budget,
    deadline,
    references,
    source,
    status: 'NEW',
    createdAt: new Date().toISOString()
  };
  db.data.quoteRequests.push(quoteRequest);
  await db.write();
  res.status(201).json(quoteRequest);
});

app.get('/dashboard/projects', async (req, res) => {
  await db.read();
  res.json(db.data.projects || []);
});

app.post('/dashboard/projects', async (req, res) => {
  await db.read();
  const project = { id: `project-${Date.now()}-${nanoid(4)}`, ...req.body, createdAt: new Date().toISOString() };
  db.data.projects.push(project);
  await db.write();
  res.status(201).json(project);
});

app.patch('/dashboard/projects/:id', async (req, res) => {
  await db.read();
  const project = (db.data.projects || []).find((item) => item.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'not found' });
  Object.assign(project, req.body, { updatedAt: new Date().toISOString() });
  await db.write();
  res.json(project);
});

app.get('/dashboard/quotes', async (req, res) => {
  await db.read();
  res.json(db.data.quotes || []);
});

app.post('/dashboard/quotes', async (req, res) => {
  await db.read();
  const quote = { id: `quote-${Date.now()}-${nanoid(4)}`, ...req.body };
  db.data.quotes.push(quote);
  await db.write();
  res.status(201).json(quote);
});

app.get('/dashboard/invoices', async (req, res) => {
  await db.read();
  res.json(db.data.invoices || []);
});

app.post('/dashboard/invoices', async (req, res) => {
  await db.read();
  const invoice = { id: `invoice-${Date.now()}-${nanoid(4)}`, ...req.body };
  db.data.invoices.push(invoice);
  await db.write();
  res.status(201).json(invoice);
});

app.get('/dashboard/team', async (req, res) => {
  await db.read();
  res.json(db.data.teamMembers || []);
});

app.post('/dashboard/team', async (req, res) => {
  await db.read();
  const member = { id: `team-${Date.now()}-${nanoid(4)}`, ...req.body, createdAt: new Date().toISOString() };
  db.data.teamMembers.push(member);
  await db.write();
  res.status(201).json(member);
});

app.get('/newsletter-emails', async (req, res) => {
  await db.read();
  res.json(db.data.newsletterEmails || []);
});

app.post('/newsletter-emails', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'missing' });
  await db.read();
  if (!db.data.newsletterEmails.includes(email)) {
    db.data.newsletterEmails.push(email);
    await db.write();
  }
  res.status(201).json({ email });
});

app.get('/contact-messages', async (req, res) => {
  await db.read();
  res.json(db.data.contactMessages || []);
});

app.post('/contact-messages', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) return res.status(400).json({ error: 'missing' });
  await db.read();
  const contact = { id: `contact-${Date.now()}-${nanoid(4)}`, name, email, subject, message, createdAt: new Date().toISOString() };
  db.data.contactMessages.push(contact);
  await db.write();
  res.status(201).json(contact);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`MyMS stub API listening on http://localhost:${port}`));
