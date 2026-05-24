import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { Link, useParams, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, FolderKanban, FileText, Receipt, Download as DownloadIcon, 
  ShoppingBag, MessageSquare, User, LogOut, Menu, X, Home,
  TrendingUp, Clock, CheckCircle, AlertCircle, ArrowRight, Send, Smile, Paperclip, File
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Logo } from '../../components/Logo';
import { useAuth } from '../../contexts/AuthContext';
import { appStore } from '../../stores/appStore';
import { dashboardStore } from '../../stores/dashboardStore';
import { notificationStore } from '../../stores/notificationStore';
import { messageStore, KNOWN_USERS, setUserOnline, isUserOnline } from '../../stores/messageStore';
import { MessageStatusIcon, OnlineBadge, OfflineBadge } from '../../components/ui/MessageStatus';
import { NotificationBell } from '../../components/NotificationPanel';
import { 
  formatCurrency, formatDate, 
  formatDateTime, getStatusConfig
} from '../../data/mockData';
import { downloadInvoicePdf, downloadQuotePdf } from '../../utils/pdf';

const emptyClientFiles: any[] = [];
const emptyClientPurchases: any[] = [];

// ===== CLIENT LAYOUT =====
const clientNavItems = [
  { label: 'Tableau de bord', href: '/client/dashboard', icon: LayoutDashboard },
  { label: 'Mes projets', href: '/client/projets', icon: FolderKanban },
  { label: 'Mes devis', href: '/client/devis', icon: FileText },
  { label: 'Mes factures', href: '/client/factures', icon: Receipt },
  { label: 'Mes fichiers', href: '/client/fichiers', icon: DownloadIcon },
  { label: 'Mes achats', href: '/client/achats', icon: ShoppingBag },
  { label: 'Messages', href: '/client/messages', icon: MessageSquare },
  { label: 'Mon profil', href: '/client/profil', icon: User },
];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [unreadTotal, setUnreadTotal] = useState(messageStore.getUnreadCount(user?.id || ''));

  // Heartbeat: mark this user as online
  useEffect(() => {
    if (!user) return;
    setUserOnline(user.id);
    messageStore.syncFromApi(user.id).catch(() => undefined);
    notificationStore.syncFromApi(user.id).catch(() => undefined);
    dashboardStore.syncFromApi().catch(() => undefined);
    appStore.syncFromApi(user.id).catch(() => undefined);
    const interval = setInterval(() => setUserOnline(user.id), 30_000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const updateUnread = () => setUnreadTotal(messageStore.getUnreadCount(user.id));
    const unsub = messageStore.subscribe(updateUnread);
    updateUnread();
    return unsub;
  }, [user]);

  if (isLoading) {
    return <div className="min-h-screen pt-16 bg-surface-alt" />;
  }

  if (!isAuthenticated || user?.role !== 'CLIENT') {
    return <Navigate to="/auth/connexion" replace state={{ from: location.pathname }} />;
  }

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-surface-alt pt-16">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-surface border-b border-border-dark z-40 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-white"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Logo logoClassName="h-8 w-auto md:h-10" />
          <span className="hidden sm:inline text-text-muted">/</span>
          <span className="hidden sm:inline text-text-muted text-sm">Espace Client</span>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell userId={user?.id || ''} />
          <div className="hidden md:flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white text-sm font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <span className="text-sm text-white">{user?.firstName} {user?.lastName}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="text-text-muted hover:text-error-light transition-colors"
            title="Déconnexion"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-surface border-r border-border-dark
          transition-transform duration-300 z-30 overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4 space-y-1">
            {clientNavItems.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/client/dashboard' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                    isActive ? 'bg-brand/10 text-brand font-medium' : 'text-text-muted hover:text-white hover:bg-surface-dark'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.href === '/client/messages' && unreadTotal > 0 && (
                    <span className="w-5 h-5 rounded-full bg-brand text-white text-[10px] flex items-center justify-center font-bold">
                      {unreadTotal > 99 ? '99+' : unreadTotal}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-4 mt-4 border-t border-border-dark">
              <Link
                to="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:text-white hover:bg-surface-dark transition-colors text-sm"
              >
                <Home className="w-5 h-5" />
                Retour au site
              </Link>
            </div>
          </nav>
        </aside>

        {/* Overlay mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

// ===== CLIENT DASHBOARD =====
export function ClientDashboard() {
  const { user } = useAuth();
  const [, setRefreshKey] = useState(0);

  useEffect(() => {
    const unsubscribeMessages = messageStore.subscribe(() => setRefreshKey((value) => value + 1));
    const unsubscribeDashboard = dashboardStore.subscribe(() => setRefreshKey((value) => value + 1));
    return () => {
      unsubscribeMessages();
      unsubscribeDashboard();
    };
  }, []);

  const allProjects = dashboardStore.getProjects();
  const allQuotes = dashboardStore.getQuotes();
  const allInvoices = dashboardStore.getInvoices();

  const userProjects = allProjects.filter((project) => project.clientId === user?.id);
  const userQuotes = allQuotes.filter((quote) => quote.clientId === user?.id);
  const userInvoices = allInvoices.filter((invoice) => invoice.clientId === user?.id);

  const activeProjects = userProjects.filter((project) => project.status !== 'COMPLETED' && project.status !== 'DELIVERED');
  const pendingQuotes = userQuotes.filter((quote) => quote.status === 'SENT');
  const unpaidInvoices = userInvoices.filter((invoice) => invoice.status !== 'PAID');
  const totalDue = unpaidInvoices.reduce((sum, invoice) => sum + invoice.amountDue, 0);
  const recentMessages = messageStore.getUserRecentMessages(user?.id || '').slice(0, 3);
  const recentQuotes = userQuotes.slice(0, 3);
  const recentInvoices = userInvoices.slice(0, 3);

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Bonjour, {user?.firstName} 👋
        </h1>
        <p className="text-text-muted">Voici un aperçu de votre activité.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
              <FolderKanban className="w-5 h-5" />
            </div>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <p className="text-3xl font-bold text-white">{activeProjects.length}</p>
          <p className="text-sm text-text-muted">Projets en cours</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
              <FileText className="w-5 h-5" />
            </div>
            <Clock className="w-4 h-4 text-warning" />
          </div>
          <p className="text-3xl font-bold text-white">{pendingQuotes.length}</p>
          <p className="text-sm text-text-muted">Devis en attente</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-error-light/10 flex items-center justify-center text-error-light">
              <Receipt className="w-5 h-5" />
            </div>
            <AlertCircle className="w-4 h-4 text-error-light" />
          </div>
          <p className="text-3xl font-bold text-white">{unpaidInvoices.length}</p>
          <p className="text-sm text-text-muted">Factures impayées</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(totalDue)}</p>
          <p className="text-sm text-text-muted">Total à payer</p>
        </Card>
      </div>

      {/* Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Projets en cours</h2>
              <Link to="/client/projets" className="text-sm text-brand hover:underline">
                Voir tout
              </Link>
            </div>
            <div className="space-y-4">
              {activeProjects.slice(0, 3).map((project) => {
                const status = getStatusConfig(project.status);
                return (
                  <Link
                    key={project.id}
                    to={`/client/projets/${project.id}`}
                    className="block p-4 bg-surface-alt rounded-lg border border-border-dark hover:border-brand/20 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-white">{project.name}</h3>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <p className="text-sm text-text-muted mb-3">{project.serviceType}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-border-dark rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-brand to-accent rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-text-muted">{project.progress}%</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Derniers messages</h2>
            <div className="space-y-3">
              {recentMessages.length === 0 ? (
                <p className="text-text-muted text-sm">Aucun nouveau message pour le moment.</p>
              ) : (
                recentMessages.map((message) => (
                  <Link key={message.id} to="/client/messages" className="block p-3 bg-surface-alt rounded-lg border border-border-dark hover:border-brand/20 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-white truncate">{message.senderName}</p>
                      <span className="text-[10px] text-text-muted">{formatDateTime(message.createdAt)}</span>
                    </div>
                    <p className="text-sm text-text-muted truncate">{message.content}</p>
                  </Link>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Actions rapides</h2>
            <div className="space-y-2">
              <Link to="/client/devis" className="flex items-center justify-between p-3 bg-surface-alt rounded-lg hover:bg-surface-dark transition-colors">
                <span className="text-sm text-text-muted">Voir mes devis</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/client/factures" className="flex items-center justify-between p-3 bg-surface-alt rounded-lg hover:bg-surface-dark transition-colors">
                <span className="text-sm text-text-muted">Voir mes factures</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/client/fichiers" className="flex items-center justify-between p-3 bg-surface-alt rounded-lg hover:bg-surface-dark transition-colors">
                <span className="text-sm text-text-muted">Mes livrables</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/client/messages" className="flex items-center justify-between p-3 bg-surface-alt rounded-lg hover:bg-surface-dark transition-colors">
                <span className="text-sm text-text-muted">Messages</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Devis récents</h2>
              <p className="text-text-muted text-sm">Accédez aux derniers devis qui vous concernent.</p>
            </div>
            <Link to="/client/devis" className="text-sm text-brand hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-3">
            {recentQuotes.length === 0 ? (
              <p className="text-text-muted">Aucun devis récent.</p>
            ) : (
              recentQuotes.map((quote) => {
                const status = getStatusConfig(quote.status);
                return (
                  <Link key={quote.id} to={`/client/devis/${quote.id}`} className="block p-3 bg-surface-alt rounded-lg hover:bg-surface-dark transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-white font-semibold">{quote.title}</p>
                        <p className="text-xs text-text-muted">{quote.quoteNumber}</p>
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-text-muted flex items-center justify-between">
                      <span>{formatCurrency(quote.total, quote.currency)}</span>
                      <span>{formatDate(quote.issuedAt)}</span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Factures récentes</h2>
              <p className="text-text-muted text-sm">Suivez les dernières échéances et paiements.</p>
            </div>
            <Link to="/client/factures" className="text-sm text-brand hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-3">
            {recentInvoices.length === 0 ? (
              <p className="text-text-muted">Aucune facture récente.</p>
            ) : (
              recentInvoices.map((invoice) => {
                const status = getStatusConfig(invoice.status);
                return (
                  <Link key={invoice.id} to={`/client/factures/${invoice.id}`} className="block p-3 bg-surface-alt rounded-lg hover:bg-surface-dark transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-white font-semibold">{invoice.title}</p>
                        <p className="text-xs text-text-muted">{invoice.invoiceNumber}</p>
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-text-muted flex items-center justify-between">
                      <span>{formatCurrency(invoice.amountDue, invoice.currency)} à payer</span>
                      <span>{formatDate(invoice.dueDate)}</span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ===== CLIENT PROJECTS =====
export function ClientProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState(dashboardStore.getProjects());

  useEffect(() => {
    const updateProjects = () => setProjects(dashboardStore.getProjects());
    const unsubscribe = dashboardStore.subscribe(updateProjects);
    updateProjects();
    return unsubscribe;
  }, []);

  const userProjects = projects.filter((project) => project.clientId === user?.id);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-white mb-2">Mes projets</h1>
      <p className="text-text-muted mb-8">Suivez l'avancement de tous vos projets</p>

      {userProjects.length === 0 ? (
        <Card className="p-6">
          <p className="text-text-muted">Vous n'avez aucun projet associé pour le moment. Si vous pensez que c'est une erreur, contactez votre gestionnaire.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userProjects.map((project) => {
            const status = getStatusConfig(project.status);
            return (
              <Link key={project.id} to={`/client/projets/${project.id}`}>
                <Card hover className="h-full">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <span className="text-xs text-text-muted">{project.serviceType}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                  <p className="text-sm text-text-muted mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-border-dark rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand to-accent rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-text-muted">{project.progress}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>Début: {formatDate(project.startDate)}</span>
                    <span>Fin estimée: {formatDate(project.estimatedEndDate)}</span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===== PROJECT MESSAGES COMPONENT =====
function ProjectMessages({ userId, userName }: { userId: string; userName: string }) {
  const [msg, setMsg] = useState('');
  const [convos, setConvos] = useState(messageStore.getUserConversations(userId));
  const [activeConvId, setActiveConvId] = useState<string | null>(convos[0]?.id || null);
  const [messages, setMessages] = useState<ReturnType<typeof messageStore.getMessages>>(() =>
    activeConvId ? messageStore.getMessages(activeConvId) : []
  );

  useEffect(() => {
    const unsub = messageStore.subscribe(() => {
      const nextConvos = messageStore.getUserConversations(userId);
      setConvos(nextConvos);
      if (!activeConvId && nextConvos.length > 0) {
        setActiveConvId(nextConvos[0].id);
        setMessages(messageStore.getMessages(nextConvos[0].id));
      } else if (activeConvId) {
        setMessages(messageStore.getMessages(activeConvId));
      }
    });
    return () => { unsub(); };
  }, [userId, activeConvId]);

  useEffect(() => {
    if (activeConvId) {
      setMessages(messageStore.getMessages(activeConvId));
      messageStore.markAsRead(activeConvId, userId);
    }
  }, [activeConvId, userId]);

  const handleSend = () => {
    if (!msg.trim() || !activeConvId) return;
    messageStore.sendMessage({ conversationId: activeConvId, senderId: userId, senderName: userName, content: msg.trim() });
    setMsg('');
  };

  return (
    <Card>
      <h3 className="font-semibold text-white mb-4">Messages</h3>
      <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.senderId === userId ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${m.senderId === userId ? 'bg-brand text-white' : 'bg-surface-dark border border-border-dark text-text-secondary'}`}>
              <p className="text-sm">{m.content}</p>
              <p className="text-[10px] mt-1 opacity-60">{formatDateTime(m.createdAt)}</p>
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-text-muted text-sm text-center py-4">Aucun message pour le moment.</p>}
      </div>
      <div className="flex gap-2">
        <Input placeholder="Écrivez un message…" value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSend(); }} />
        <Button variant="primary" onClick={handleSend} disabled={!msg.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

// ===== CLIENT PROJECT DETAIL =====
export function ClientProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [projects, setProjects] = useState(dashboardStore.getProjects());

  useEffect(() => {
    const updateProjects = () => setProjects(dashboardStore.getProjects());
    const unsubscribe = dashboardStore.subscribe(updateProjects);
    updateProjects();
    return unsubscribe;
  }, []);

  const project = projects.find((p) => p.id === id && p.clientId === user?.id);

  if (!project) {
    return (
      <div className="p-6 lg:p-8 text-center">
        <p className="text-text-muted">Projet non trouvé</p>
      </div>
    );
  }

  const status = getStatusConfig(project.status);
  const projectFiles = emptyClientFiles.filter((f) => f.project === project.name);

  return (
    <div className="p-6 lg:p-8">
      <Link to="/client/projets" className="inline-flex items-center gap-2 text-brand mb-6 hover:underline">
        <ArrowRight className="w-4 h-4 rotate-180" />
        Retour aux projets
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
          <p className="text-text-muted">{project.serviceType}</p>
        </div>
        <Badge variant={status.variant} className="text-sm px-4 py-2">{status.label}</Badge>
      </div>

      {/* Progress */}
      <Card className="mb-6">
        <h3 className="font-semibold text-white mb-4">Avancement du projet</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-3 bg-border-dark rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand to-accent rounded-full"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-lg font-bold text-brand">{project.progress}%</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-text-muted">Date de début</p>
            <p className="text-white font-medium">{formatDate(project.startDate)}</p>
          </div>
          <div>
            <p className="text-text-muted">Fin estimée</p>
            <p className="text-white font-medium">{formatDate(project.estimatedEndDate)}</p>
          </div>
          <div>
            <p className="text-text-muted">Révisions incluses</p>
            <p className="text-white font-medium">2</p>
          </div>
          <div>
            <p className="text-text-muted">Révisions utilisées</p>
            <p className="text-white font-medium">1</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Description */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="font-semibold text-white mb-3">Brief du projet</h3>
            <p className="text-text-muted">{project.description}</p>
          </Card>

          {/* Messages */}
          <ProjectMessages userId={user?.id || ''} userName={`${user?.firstName} ${user?.lastName}`} />
        </div>

        {/* Files */}
        <div>
          <Card>
            <h3 className="font-semibold text-white mb-4">Fichiers partagés</h3>
            {projectFiles.length > 0 ? (
              <div className="space-y-2">
                {projectFiles.map((file) => (
                  <div key={file.id} className="flex items-center gap-3 p-3 bg-surface-alt rounded-lg border border-border-dark">
                    <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
                      <File className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{file.fileName}</p>
                      <p className="text-xs text-text-muted">{(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button className="text-brand hover:text-brand-light" onClick={() => {
                      appStore.addToast({ type: 'success', title: 'Téléchargement', message: `${file.fileName} — Lancé.` });
                    }}>
                      <DownloadIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-4">Aucun fichier</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ===== CLIENT QUOTES =====
export function ClientQuotes() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState(dashboardStore.getQuotes());

  useEffect(() => {
    const updateQuotes = () => setQuotes(dashboardStore.getQuotes());
    const unsubscribe = dashboardStore.subscribe(updateQuotes);
    updateQuotes();
    return unsubscribe;
  }, []);

  const userQuotes = quotes.filter((quote) => quote.clientId === user?.id);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-white mb-2">Mes devis</h1>
      <p className="text-text-muted mb-8">Consultez et gérez tous vos devis</p>

      <div className="space-y-3">
        {userQuotes.map((quote) => {
          const status = getStatusConfig(quote.status);
          return (
            <Link key={quote.id} to={`/client/devis/${quote.id}`}>
              <Card hover>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-text-muted mb-1">{quote.quoteNumber}</p>
                    <h3 className="font-semibold text-white mb-1">{quote.title}</h3>
                    <p className="text-sm text-text-muted">Émis le {formatDate(quote.issuedAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white mb-1">{formatCurrency(quote.total, quote.currency)}</p>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ===== CLIENT QUOTE DETAIL =====
export function ClientQuoteDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [quotes, setQuotes] = useState(dashboardStore.getQuotes());
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const updateQuotes = () => setQuotes(dashboardStore.getQuotes());
    const unsubscribe = dashboardStore.subscribe(updateQuotes);
    updateQuotes();
    return unsubscribe;
  }, []);

  const quote = quotes.find((q) => q.id === id && q.clientId === user?.id);

  useEffect(() => {
    if (!quote || quote.status !== 'SENT') return;

    const viewedHistory = quote.history ? [...quote.history] : [];
    viewedHistory.push({
      id: `history-${Date.now()}`,
      createdAt: new Date().toISOString(),
      type: 'viewed',
      label: 'Devis consulté',
      details: 'Le client a ouvert le devis.',
    });

    dashboardStore.updateQuote(quote.id, {
      status: 'VIEWED',
      emailStatus: 'VIEWED',
      history: viewedHistory,
    });
  }, [quote]);

  if (!quote) {
    return (
      <div className="p-6 lg:p-8 text-center">
        <p className="text-text-muted">Devis non trouvé</p>
      </div>
    );
  }

  const status = getStatusConfig(quote.status);
  const handleAction = async (action: string) => {
    if (!quote) return;
    setActionLoading(action);
    const nextStatus = action === 'accept' ? 'ACCEPTED' : 'REFUSED';
    dashboardStore.updateQuote(quote.id, { status: nextStatus });
    await new Promise((resolve) => setTimeout(resolve, 500));
    setActionLoading(null);
    appStore.addToast({
      type: action === 'accept' ? 'success' : 'info',
      title: action === 'accept' ? 'Devis accepté !' : 'Devis refusé',
      message: action === 'accept' ? 'Le studio a été notifié.' : 'Le studio sera informé de votre décision.',
    });
  };

  return (
    <div className="p-6 lg:p-8">
      <Link to="/client/devis" className="inline-flex items-center gap-2 text-brand mb-6 hover:underline">
        <ArrowRight className="w-4 h-4 rotate-180" />
        Retour aux devis
      </Link>

      <div className="bg-white rounded-2xl p-8 md:p-12 text-gray-900 shadow-2xl">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">DEVIS</h1>
            <p className="text-gray-600">{quote.quoteNumber}</p>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-xs uppercase text-gray-500 mb-2 font-semibold">De</h3>
            <p className="font-bold text-lg">Myms Studio</p>
            <p className="text-gray-600">contact@myms-studio.com</p>
            <p className="text-gray-600">+221 77 000 00 00</p>
            <p className="text-gray-600">Dakar, Sénégal</p>
          </div>
          <div>
            <h3 className="text-xs uppercase text-gray-500 mb-2 font-semibold">Pour</h3>
            <p className="font-bold text-lg">Vous</p>
            <p className="text-gray-600">Votre entreprise</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Date d'émission</p>
            <p className="font-semibold">{formatDate(quote.issuedAt)}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Date de validité</p>
            <p className="font-semibold">{formatDate(quote.validUntil)}</p>
          </div>
        </div>

        {/* Items */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="text-left py-3 text-sm font-semibold">Désignation</th>
              <th className="text-right py-3 text-sm font-semibold">Qté</th>
              <th className="text-right py-3 text-sm font-semibold">Prix unitaire</th>
              <th className="text-right py-3 text-sm font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
                {quote.lineItems?.length ? (
              quote.lineItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-4">
                    <p className="font-medium">{item.description}</p>
                  </td>
                  <td className="text-right py-4">{item.quantity}</td>
                  <td className="text-right py-4">{formatCurrency(item.unitPrice, quote.currency)}</td>
                  <td className="text-right py-4 font-semibold">{formatCurrency(item.quantity * item.unitPrice, quote.currency)}</td>
                </tr>
              ))
            ) : (
              <tr className="border-b border-gray-200">
                <td className="py-4">
                  <p className="font-medium">{quote.title}</p>
                  <p className="text-sm text-gray-600">Service complet avec révisions incluses</p>
                </td>
                <td className="text-right py-4">1</td>
                <td className="text-right py-4">{formatCurrency(quote.total, quote.currency)}</td>
                <td className="text-right py-4 font-semibold">{formatCurrency(quote.total, quote.currency)}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Total */}
        <div className="flex justify-end">
          <div className="w-full md:w-1/3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sous-total</span>
              <span>{formatCurrency(quote.total, quote.currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">TVA (0%)</span>
              <span>{formatCurrency(0, quote.currency)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t-2 border-gray-900">
              <span>TOTAL</span>
              <span>{formatCurrency(quote.total, quote.currency)}</span>
            </div>
          </div>
        </div>

        {/* Conditions */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-600">
          <h4 className="font-semibold text-gray-900 mb-2">Conditions</h4>
          <p>{quote.notes || 'Aucune condition spécifique n’a été ajoutée pour ce devis.'}</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Acompte de 50% requis avant démarrage</li>
            <li>Solde à la livraison finale</li>
            <li>Devis valable 30 jours</li>
            <li>2 révisions incluses</li>
          </ul>
        </div>
      </div>

      {/* Actions */}
      {quote.status === 'SENT' && (
        <div className="mt-6 flex flex-wrap gap-3">
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => handleAction('accept')}
            isLoading={actionLoading === 'accept'}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Accepter le devis
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => handleAction('refuse')}
            isLoading={actionLoading === 'refuse'}
          >
            Refuser
          </Button>
          <Button variant="outline" size="lg" onClick={async () => {
            try {
              await downloadQuotePdf(quote);
              appStore.addToast({ type: 'success', title: 'PDF généré', message: 'Le téléchargement du devis va commencer.' });
            } catch {
              appStore.addToast({ type: 'error', title: 'Erreur PDF', message: 'Impossible de générer le PDF.' });
            }
          }}>
            <DownloadIcon className="w-5 h-5 mr-2" />
            Télécharger PDF
          </Button>
        </div>
      )}
    </div>
  );
}

// ===== CLIENT INVOICES =====
export function ClientInvoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState(dashboardStore.getInvoices());

  useEffect(() => {
    const updateInvoices = () => setInvoices(dashboardStore.getInvoices());
    const unsubscribe = dashboardStore.subscribe(updateInvoices);
    updateInvoices();
    return unsubscribe;
  }, []);

  const userInvoices = invoices.filter((invoice) => invoice.clientId === user?.id);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-white mb-2">Mes factures</h1>
      <p className="text-text-muted mb-8">Consultez et payez vos factures en ligne</p>

      <div className="space-y-3">
        {userInvoices.map((invoice) => {
          const status = getStatusConfig(invoice.status);
          return (
            <Link key={invoice.id} to={`/client/factures/${invoice.id}`}>
              <Card hover>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-text-muted mb-1">{invoice.invoiceNumber}</p>
                    <h3 className="font-semibold text-white mb-1">{invoice.title}</h3>
                    <p className="text-sm text-text-muted">Échéance: {formatDate(invoice.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white mb-1">{formatCurrency(invoice.total, invoice.currency)}</p>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                </div>
                {invoice.amountDue > 0 && invoice.status !== 'PAID' && (
                  <div className="mt-4 pt-4 border-t border-border-dark">
                    <p className="text-sm text-text-muted">
                      Reste à payer: <span className="font-semibold text-error-light">{formatCurrency(invoice.amountDue, invoice.currency)}</span>
                    </p>
                  </div>
                )}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ===== CLIENT INVOICE DETAIL =====
export function ClientInvoiceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [invoices, setInvoices] = useState(dashboardStore.getInvoices());

  useEffect(() => {
    const updateInvoices = () => setInvoices(dashboardStore.getInvoices());
    const unsubscribe = dashboardStore.subscribe(updateInvoices);
    updateInvoices();
    return unsubscribe;
  }, []);

  const invoice = invoices.find((i) => i.id === id && i.clientId === user?.id);

  if (!invoice) {
    return <div className="p-6 text-center text-text-muted">Facture non trouvée</div>;
  }

  const status = getStatusConfig(invoice.status);

  return (
    <div className="p-6 lg:p-8">
      <Link to="/client/factures" className="inline-flex items-center gap-2 text-brand mb-6 hover:underline">
        <ArrowRight className="w-4 h-4 rotate-180" />
        Retour aux factures
      </Link>

      <div className="bg-white rounded-2xl p-8 md:p-12 text-gray-900 shadow-2xl mb-6">
        <div className="flex flex-wrap justify-between items-start mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">FACTURE</h1>
            <p className="text-gray-600">{invoice.invoiceNumber}</p>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs uppercase text-gray-500 mb-2 font-semibold">De</h3>
            <p className="font-bold text-lg">Myms Studio</p>
            <p className="text-gray-600">contact@myms-studio.com</p>
            <p className="text-gray-600">Dakar, Sénégal</p>
          </div>
          <div className="text-right">
            <h3 className="text-xs uppercase text-gray-500 mb-2 font-semibold">Date</h3>
            <p className="font-semibold">{formatDate(invoice.issuedAt)}</p>
            <p className="text-xs uppercase text-gray-500 mt-3 mb-1 font-semibold">Échéance</p>
            <p className="font-semibold">{formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="text-left py-3 text-sm font-semibold">Désignation</th>
              <th className="text-center py-3 text-sm font-semibold">Quantité</th>
              <th className="text-right py-3 text-sm font-semibold">Prix unitaire</th>
              <th className="text-right py-3 text-sm font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {(invoice.lineItems && invoice.lineItems.length > 0) ? (
              invoice.lineItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-4 font-medium">{item.description}</td>
                  <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                  <td className="py-4 text-right text-gray-600">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                  <td className="py-4 text-right font-semibold">{formatCurrency(item.quantity * item.unitPrice, invoice.currency)}</td>
                </tr>
              ))
            ) : (
              <tr className="border-b border-gray-200">
                <td className="py-4 font-medium">{invoice.title}</td>
                <td className="py-4 text-center text-gray-600">1</td>
                <td className="py-4 text-right text-gray-600">{formatCurrency(invoice.total, invoice.currency)}</td>
                <td className="py-4 text-right font-semibold">{formatCurrency(invoice.total, invoice.currency)}</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-full md:w-1/3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total</span>
              <span>{formatCurrency(invoice.total, invoice.currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Déjà payé</span>
              <span className="text-success">-{formatCurrency(invoice.amountPaid, invoice.currency)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t-2 border-gray-900">
              <span>À PAYER</span>
              <span>{formatCurrency(invoice.amountDue, invoice.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {invoice.amountDue > 0 && (
          <Button variant="primary" size="lg" onClick={() => {
            appStore.addToast({ type: 'info', title: 'Redirection paiement…', message: 'Vous allez être redirigé vers la page de paiement.' });
            setTimeout(() => {
              appStore.addToast({ type: 'success', title: 'Paiement simulé !', message: `${formatCurrency(invoice.amountDue, invoice.currency)} — Paiement enregistré.` });
            }, 2000);
          }}>
            💳 Payer en ligne
          </Button>
        )}
        <Button variant="outline" size="lg" onClick={async () => {
          appStore.addToast({ type: 'info', title: 'PDF généré', message: 'Le téléchargement de la facture va commencer.' });
          await downloadInvoicePdf(invoice);
        }}>
          <DownloadIcon className="w-5 h-5 mr-2" />
          Télécharger PDF
        </Button>
      </div>
    </div>
  );
}

// ===== CLIENT FILES =====
export function ClientFiles() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-white mb-2">Mes fichiers</h1>
      <p className="text-text-muted mb-8">Téléchargez vos livrables et fichiers partagés</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emptyClientFiles.map((file) => (
          <Card key={file.id} hover>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
                <File className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{file.fileName}</h3>
                <p className="text-xs text-text-muted">{(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <p className="text-xs text-text-muted mb-2">{file.project}</p>
            <p className="text-xs text-text-muted mb-4">Livré le {formatDate(file.createdAt)}</p>
            <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
              e.preventDefault();
              appStore.addToast({ type: 'success', title: 'Téléchargement', message: `${file.fileName} — Téléchargement lancé.` });
            }}>
              <DownloadIcon className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ===== CLIENT PURCHASES =====
export function ClientPurchases() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-white mb-2">Mes achats</h1>
      <p className="text-text-muted mb-8">Historique de vos achats de ressources</p>

      {emptyClientPurchases.length > 0 ? (
        <div className="space-y-3">
          {emptyClientPurchases.map((purchase) => (
            <Card key={purchase.id}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-white mb-1">{purchase.resourceTitle}</h3>
                  <p className="text-sm text-text-muted">Acheté le {formatDate(purchase.purchasedAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white mb-1">{formatCurrency(purchase.amount, purchase.currency)}</p>
                  <p className="text-xs text-text-muted">{purchase.downloads} téléchargement(s)</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border-dark">
                <Button variant="outline" size="sm" onClick={() => {
                  appStore.addToast({ type: 'success', title: 'Téléchargement', message: `${purchase.resourceTitle} — Téléchargement lancé.` });
                }}>
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Télécharger à nouveau
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <ShoppingBag className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Aucun achat</h3>
          <p className="text-text-muted mb-6">Vous n'avez pas encore acheté de ressources.</p>
          <Link to="/ressources">
            <Button variant="primary">Découvrir les ressources</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

// ===== CLIENT MESSAGES =====
export function ClientMessages() {
  const { user } = useAuth();
  const uid = user?.id || '';
  const [convos, setConvos] = useState(messageStore.getUserConversations(uid));
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<ReturnType<typeof messageStore.getMessages>>([]);
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newRecipientId, setNewRecipientId] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachmentFiles, setAttachmentFiles] = useState<Array<{ id: string; file: File; name: string; type: string; size: number; url: string }>>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [messageError, setMessageError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiList = ['😀', '😄', '😍', '👍', '🎉', '💬', '✨', '🚀'];
  const attachmentAccept = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.psd,.ai';

  // Tous les destinataires possibles pour un client : les comptes staff
  const recipientOptions = KNOWN_USERS.filter(u => u.id !== uid && u.role !== 'CLIENT');

  if (!user) {
    return (
      <div className="min-h-screen p-6 bg-surface-alt text-white flex items-center justify-center">
        <p className="text-sm text-text-muted">Chargement de la messagerie...</p>
      </div>
    );
  }

  if (isLoadingMessages) {
    return (
      <div className="min-h-screen p-6 bg-surface-alt text-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 mx-auto mb-4 rounded-full border-4 border-brand/20 border-t-brand animate-spin" />
          <p className="text-sm text-text-muted">Chargement de vos conversations...</p>
        </div>
      </div>
    );
  }

  if (messageError) {
    return (
      <div className="min-h-screen p-6 bg-surface-alt text-white flex items-center justify-center">
        <div className="max-w-lg rounded-3xl border border-border-dark bg-surface p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-3">Erreur de messagerie</h2>
          <p className="text-sm text-text-muted mb-6">{messageError}</p>
          <Button variant="primary" onClick={() => {
            setIsLoadingMessages(true);
            setMessageError(null);
            const initialConvos = messageStore.getUserConversations(uid);
            setConvos(initialConvos);
            if (initialConvos.length > 0) {
              const firstConv = initialConvos[0];
              setActiveConvId(firstConv.id);
              setMsgs(messageStore.getMessages(firstConv.id));
              messageStore.markAsRead(firstConv.id, uid);
            }
            setIsLoadingMessages(false);
          }}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const loadMessages = () => {
      try {
        const initialConvos = messageStore.getUserConversations(uid);
        setConvos(initialConvos);
        if (initialConvos.length > 0 && !activeConvId) {
          const firstConv = initialConvos[0];
          setActiveConvId(firstConv.id);
          setMsgs(messageStore.getMessages(firstConv.id));
          messageStore.markAsRead(firstConv.id, uid);
        }
        setMessageError(null);
      } catch (error) {
        console.error('Erreur lors du chargement des conversations client :', error);
        setMessageError('Impossible de charger la messagerie. Veuillez réessayer.');
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [uid, activeConvId]);

  useEffect(() => {
    const unsub = messageStore.subscribe(() => {
      try {
        setConvos(messageStore.getUserConversations(uid));
        if (activeConvId) {
          setMsgs(messageStore.getMessages(activeConvId));
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour des conversations client :', error);
        setMessageError('Erreur de synchronisation des messages.');
      }
    });
    return () => { unsub(); };
  }, [uid, activeConvId]);

  useEffect(() => {
    if (!activeConvId) return;
    const node = scrollRef.current;
    if (!node) return;

    const frame = window.requestAnimationFrame(() => {
      node.scrollTo({ top: node.scrollHeight, behavior: 'auto' });
    });

    return () => { window.cancelAnimationFrame(frame); };
  }, [activeConvId, msgs.length]);

  const openConversation = (id: string) => {
    setActiveConvId(id);
    setSearchTerm('');
    setMsgs(messageStore.getMessages(id));
    messageStore.markAsRead(id, uid);
    setShowNew(false);
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
  };

  useEffect(() => {
    if (!activeConvId || !user) {
      return;
    }
    const updateTyping = () => {
      setTypingUsers(messageStore.getTypingForConversation(activeConvId));
    };
    updateTyping();
    const unsub = messageStore.subscribe(updateTyping);
    return () => { unsub(); };
  }, [activeConvId, user]);

  useEffect(() => {
    if (!activeConvId || !user) return;
    if (input.length === 0) {
      messageStore.setTyping(activeConvId, user.id, false);
      return;
    }
    messageStore.setTyping(activeConvId, user.id, true);
    const timeout = window.setTimeout(() => {
      messageStore.setTyping(activeConvId, user.id, false);
    }, 800);
    return () => { window.clearTimeout(timeout); };
  }, [input, activeConvId, user]);

  useEffect(() => {
    if (!activeConvId || !user) return;
    return () => {
      messageStore.setTyping(activeConvId, user.id, false);
    };
  }, [activeConvId, user]);

  const visibleMessages = searchTerm.trim()
    ? msgs.filter((m) =>
        m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.senderName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : msgs;

  const handleSend = () => {
    if ((!input.trim() && attachmentFiles.length === 0) || !activeConvId || !user) return;
    try {
      messageStore.sendMessage({
        conversationId: activeConvId,
        senderId: user.id,
        senderName: `${user.firstName} ${user.lastName}`,
        content: input.trim() || 'Pièce jointe',
        attachments: attachmentFiles.map(({ id, name, type, size, url }) => ({ id, name, type, size, url })),
      });
      messageStore.setTyping(activeConvId, user.id, false);
      setInput('');
      setAttachmentFiles([]);
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
    } catch (error) {
      console.error('Erreur lors de l’envoi du message :', error);
      setMessageError('Impossible d’envoyer le message.');
    }
  };

  const handleInsertEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles = await Promise.all(files.map((file) => new Promise<{ id: string; file: File; name: string; type: string; size: number; url: string }>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          file,
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          url: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    })));
    setAttachmentFiles((prev) => [...prev, ...newFiles]);
    event.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachmentFiles((prev) => prev.filter((att) => att.id !== id));
  };

  const renderMessageAttachments = (attachments?: Array<{ id: string; name: string; type: string; size: number; url: string }>) => {
    if (!attachments || attachments.length === 0) return null;
    return (
      <div className="mt-2 space-y-2">
        {attachments.map((attachment) => {
          const isImage = attachment.type.startsWith('image/');
          return (
            <a
              key={attachment.id}
              href={attachment.url}
              download={attachment.name}
              className="block rounded-2xl border border-border-dark bg-surface p-3 text-text-secondary hover:border-brand transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-dark border border-border-dark flex items-center justify-center overflow-hidden">
                  {isImage ? (
                    <img src={attachment.url} alt={attachment.name} className="w-full h-full object-cover" />
                  ) : (
                    <File className="w-5 h-5 text-text-muted" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{attachment.name}</p>
                  <p className="text-xs text-text-muted">{(attachment.size / 1024).toFixed(1)} KB</p>
                </div>
                <span className="text-xs text-text-muted">Télécharger</span>
              </div>
            </a>
          );
        })}
      </div>
    );
  };

  const handleNewConversation = () => {
    if ((!newSubject.trim() || (!input.trim() && attachmentFiles.length === 0)) || !user || !newRecipientId) return;
    const recipient = KNOWN_USERS.find(u => u.id === newRecipientId);
    if (!recipient) return;
    const conv = messageStore.createConversation({
      subject: newSubject.trim(),
      participants: [
        { id: user.id, name: `${user.firstName} ${user.lastName}`, email: user.email },
        { id: recipient.id, name: recipient.name, email: recipient.email },
      ],
      firstMessage: input.trim() || 'Pièce jointe',
      senderId: user.id,
      senderName: `${user.firstName} ${user.lastName}`,
      attachments: attachmentFiles.map(({ id, name, type, size, url }) => ({ id, name, type, size, url })),
    });
    setNewSubject('');
    setNewRecipientId('');
    setInput('');
    setShowNew(false);
    openConversation(conv.id);
    appStore.addToast({ type: 'success', title: 'Message envoyé', message: `Envoyé à ${recipient.name}.` });
  };

  const getOtherParticipants = (conv: typeof convos[0]) =>
    conv.participants.filter(p => p.id !== uid).map(p => p.name).join(', ');

  const isConversationTyping = (conv: typeof convos[0]) =>
    Object.entries(messageStore.getTypingForConversation(conv.id)).some(([id, typing]) => id !== uid && typing);

  const otherParticipantTyping = activeConvId
    ? Object.entries(typingUsers).some(([id, typing]) => id !== uid && typing)
    : false;

  // Mobile List View
  const renderMobileListView = () => (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="p-4 border-b border-border-dark bg-surface">
        <h2 className="text-lg font-semibold text-white">Messages</h2>
      </div>
      <div className="overflow-y-auto flex-1 space-y-1 px-2 py-3">
        {convos.length === 0 && <p className="text-text-muted text-sm text-center py-8">Aucune conversation</p>}
        {convos.map(conv => (
          <button
            key={conv.id}
            onClick={() => openConversation(conv.id)}
            className="w-full text-left p-3 rounded-lg bg-surface-dark border border-border-dark hover:border-[#3A3A3A] transition-all active:bg-brand/10"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white text-xs font-bold">
                  {conv.participants.filter(p => p.id !== uid)[0]?.name.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </div>
                {conv.participants.filter(p => p.id !== uid).some(p => isUserOnline(p.id)) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border border-[#0A0A0A]"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-white text-sm truncate">{conv.subject}</h3>
                  {(conv.unread[uid] || 0) > 0 && (
                    <span className="w-5 h-5 rounded-full bg-brand text-white text-xs flex items-center justify-center flex-shrink-0">{conv.unread[uid]}</span>
                  )}
                </div>
                {isConversationTyping(conv) ? (
                  <p className="text-xs text-brand truncate">En train d'écrire…</p>
                ) : (
                  <p className="text-xs text-text-muted truncate">{conv.lastMessage}</p>
                )}
                <p className="text-[10px] text-text-muted mt-0.5">{formatDateTime(conv.lastMessageAt)}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Mobile Conversation View
  const renderMobileConversationView = () => {
    const currentConv = convos.find(c => c.id === activeConvId);
    return (
      <div className="flex flex-col h-[calc(100vh-6rem)]">
        {/* Header */}
        <div className="p-4 border-b border-border-dark bg-surface space-y-3">
          <div className="flex items-center gap-3">
            <button onClick={() => { setActiveConvId(null); }} className="text-text-muted hover:text-white transition-colors">
              <ArrowRight className="w-5 h-5 transform rotate-180" />
            </button>
            <div>
              <h3 className="font-semibold text-white text-sm">{currentConv?.subject}</h3>
              <p className="text-xs text-text-muted">{currentConv ? getOtherParticipants(currentConv) : ''}</p>
            </div>
          </div>
          <Input
            placeholder="Rechercher dans la conversation…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-surface-dark"
          />
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {visibleMessages.length === 0 ? (
            <div className="py-12 text-center text-sm text-text-muted">Aucun message trouvé pour «{searchTerm}».</div>
          ) : visibleMessages.map(m => (
            <div key={m.id} className={`flex ${m.senderId === uid ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                m.senderId === uid ? 'bg-brand text-white' : 'bg-surface-dark border border-border-dark text-text-secondary'
              }`}>
                {m.senderId !== uid && <p className="text-xs font-medium mb-1 opacity-70">{m.senderName}</p>}
                <p className="text-sm whitespace-pre-line">{m.content}</p>
                {renderMessageAttachments(m.attachments)}
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <span className="text-[10px] opacity-60">{formatDateTime(m.createdAt)}</span>
                  {m.senderId === uid && <MessageStatusIcon status={m.status || 'sent'} />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {otherParticipantTyping && (
          <div className="px-4 pb-2">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 border border-border-dark">
              <div className="flex items-center gap-1">
                <span className="typing-dot bg-brand" />
                <span className="typing-dot bg-brand" />
                <span className="typing-dot bg-brand" />
              </div>
              <span className="text-xs text-text-muted">{convos.find(c => c.id === activeConvId)?.participants.find(p => p.id !== uid)?.name} écrit...</span>
            </div>
          </div>
        )}

        {/* Input */}
        {attachmentFiles.length > 0 && (
          <div className="px-4 pb-2 space-y-2">
            {attachmentFiles.map((attachment) => (
              <div key={attachment.id} className="rounded-2xl border border-border-dark bg-surface p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <File className="w-5 h-5 text-text-muted" />
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{attachment.name}</p>
                    <p className="text-xs text-text-muted">{(attachment.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button type="button" onClick={() => removeAttachment(attachment.id)} className="text-text-muted hover:text-white">Supprimer</button>
              </div>
            ))}
          </div>
        )}
        <div className="p-3 border-t border-border-dark flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <button type="button" onClick={() => setShowEmojiPicker((prev) => !prev)} className="w-10 h-10 rounded-full bg-surface border border-border-dark text-text-muted hover:text-white transition-all flex items-center justify-center flex-shrink-0">
                <Smile className="w-5 h-5" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 w-44 rounded-2xl bg-surface border border-border-dark p-2 shadow-xl z-20 grid grid-cols-4 gap-1">
                  {emojiList.map((emoji) => (
                    <button key={emoji} type="button" onClick={() => handleInsertEmoji(emoji)} className="rounded-xl p-2 text-sm hover:bg-[#1F1F1F] transition">
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="button" onClick={handleAttachClick} className="w-10 h-10 rounded-full bg-surface border border-border-dark text-text-muted hover:text-white transition-all flex items-center justify-center">
              <Paperclip className="w-5 h-5" />
            </button>
          </div>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Écrivez un message…"
            className="flex-1 min-w-0 px-4 py-2.5 bg-surface-dark border border-border-dark rounded-full text-white placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <button onClick={handleSend} disabled={!input.trim() && attachmentFiles.length === 0} className="w-10 h-10 rounded-full bg-gradient-to-r from-brand to-accent flex items-center justify-center text-white disabled:opacity-50 transition-all flex-shrink-0">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Mobile New Message View
  const renderMobileNewMessageView = () => (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="p-4 border-b border-border-dark bg-surface flex items-center gap-3">
        <button onClick={() => { setShowNew(false); setNewRecipientId(''); }} className="text-text-muted hover:text-white transition-colors">
          <ArrowRight className="w-5 h-5 transform rotate-180" />
        </button>
        <h3 className="text-lg font-semibold text-white">Nouveau message</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">Destinataire <span className="text-error-light">*</span></label>
          <div className="space-y-2">
            {recipientOptions.map(r => (
              <button key={r.id} type="button" onClick={() => setNewRecipientId(r.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${newRecipientId === r.id ? 'border-brand bg-brand/10' : 'border-border-dark bg-surface-alt active:border-[#3A3A3A]'}`}>
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white text-xs font-bold">{r.name.split(' ').map(n=>n[0]).join('')}</div>
                  {isUserOnline(r.id) && <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border border-[#0A0A0A]"></span>}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{r.name}</p>
                  <p className="text-xs text-text-muted">{r.email}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <Input label="Sujet" required placeholder="Ex: Question sur mon projet…" value={newSubject} onChange={e => setNewSubject(e.target.value)} />
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">Message <span className="text-error-light">*</span></label>
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Écrivez votre message…" rows={4} className="w-full px-4 py-3 bg-surface-dark border border-border-dark rounded-lg text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand resize-none" />
        </div>
      </div>
      <div className="p-4 border-t border-border-dark flex gap-2">
        <Button variant="outline" onClick={() => { setShowNew(false); setNewRecipientId(''); }} className="flex-1">Annuler</Button>
        <Button variant="primary" onClick={handleNewConversation} disabled={!newSubject.trim() || !input.trim() || !newRecipientId} className="flex-1">
          <Send className="w-4 h-4 mr-2" />Envoyer
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* Desktop View */}
      <div className="hidden lg:block p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Messages</h1>
            <p className="text-text-muted">Vos échanges avec Myms Studio</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => { setShowNew(true); setActiveConvId(null); }}>
            <Send className="w-4 h-4 mr-2" />
            Nouveau message
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-14rem)]">
          <div className="overflow-y-auto space-y-2 lg:border-r lg:border-border-dark lg:pr-4">
            {convos.length === 0 && <p className="text-text-muted text-sm text-center py-8">Aucune conversation</p>}
            {convos.map(conv => (
              <button
                key={conv.id}
                onClick={() => { setActiveConvId(conv.id); setMsgs(messageStore.getMessages(conv.id)); messageStore.markAsRead(conv.id, uid); setShowNew(false); }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  activeConvId === conv.id ? 'bg-brand/10 border-brand/20' : 'bg-surface-dark border-border-dark hover:border-[#3A3A3A]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white text-sm truncate pr-2">{conv.subject}</h3>
                  {(conv.unread[uid] || 0) > 0 && (
                    <span className="w-5 h-5 rounded-full bg-brand text-white text-xs flex items-center justify-center flex-shrink-0">{conv.unread[uid]}</span>
                  )}
                </div>
                <p className="text-[10px] text-brand mb-1 flex items-center gap-1">
                  {conv.participants.filter(p => p.id !== uid).map(p => isUserOnline(p.id) ? <OnlineBadge key={p.id} /> : <OfflineBadge key={p.id} />)}
                  {getOtherParticipants(conv)}
                </p>
                <p className="text-xs text-text-muted truncate">{conv.lastMessage}</p>
                <p className="text-[10px] text-text-muted mt-1">{formatDateTime(conv.lastMessageAt)}</p>
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 flex flex-col bg-surface-alt rounded-xl border border-border-dark overflow-hidden">
            {showNew ? (
              <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                <h3 className="text-lg font-semibold text-white mb-4">Nouveau message</h3>
                {/* Destinataire */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text-muted mb-2">Destinataire <span className="text-error-light">*</span></label>
                  <div className="grid grid-cols-1 gap-2">
                    {recipientOptions.map(r => (
                      <button key={r.id} type="button" onClick={() => setNewRecipientId(r.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${newRecipientId === r.id ? 'border-brand bg-brand/10' : 'border-border-dark bg-surface-alt hover:border-[#3A3A3A]'}`}>
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white text-xs font-bold">{r.name.split(' ').map(n=>n[0]).join('')}</div>
                          <span className="absolute -bottom-0.5 -right-0.5">{isUserOnline(r.id) ? <OnlineBadge /> : <OfflineBadge />}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{r.name}</p>
                          <p className="text-xs text-text-muted">{r.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <Input label="Sujet" required placeholder="Ex: Question sur mon projet…" value={newSubject} onChange={e => setNewSubject(e.target.value)} className="mb-4" />
                <label className="block text-sm font-medium text-text-muted mb-2">Message <span className="text-error-light">*</span></label>
                <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Écrivez votre message…" rows={4} className="w-full px-4 py-3 bg-surface-dark border border-border-dark rounded-lg text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand resize-none mb-4" />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => { setShowNew(false); setNewRecipientId(''); }}>Annuler</Button>
                  <Button variant="primary" onClick={handleNewConversation} disabled={!newSubject.trim() || !input.trim() || !newRecipientId}>
                    <Send className="w-4 h-4 mr-2" />Envoyer
                  </Button>
                </div>
              </div>
            ) : activeConvId ? (
              <>
                <div className="p-4 border-b border-border-dark bg-surface space-y-3">
                  <div>
                    <h3 className="font-semibold text-white">{convos.find(c => c.id === activeConvId)?.subject}</h3>
                    <p className="text-xs text-text-muted">Avec {convos.find(c => c.id === activeConvId) ? getOtherParticipants(convos.find(c => c.id === activeConvId)!) : ''}</p>
                  </div>
                  <Input
                    placeholder="Rechercher dans la conversation…"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-surface-dark"
                  />
                </div>
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                  {visibleMessages.length === 0 ? (
                    <div className="py-12 text-center text-sm text-text-muted">Aucun message trouvé pour «{searchTerm}».</div>
                  ) : visibleMessages.map(m => (
                    <div key={m.id} className={`flex ${m.senderId === uid ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        m.senderId === uid ? 'bg-brand text-white' : 'bg-surface-dark border border-border-dark text-text-secondary'
                      }`}>
                        {m.senderId !== uid && <p className="text-xs font-medium mb-1 opacity-70">{m.senderName}</p>}
                        <p className="text-sm whitespace-pre-line">{m.content}</p>
                        {renderMessageAttachments(m.attachments)}
                        <div className="flex items-center justify-end gap-1.5 mt-1">
                          <span className="text-[10px] opacity-60">{formatDateTime(m.createdAt)}</span>
                          {m.senderId === uid && <MessageStatusIcon status={m.status || 'sent'} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {attachmentFiles.length > 0 && (
                  <div className="px-4 pb-2 space-y-2">
                    {attachmentFiles.map((attachment) => (
                      <div key={attachment.id} className="rounded-2xl border border-border-dark bg-surface p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <File className="w-5 h-5 text-text-muted" />
                          <div className="min-w-0">
                            <p className="text-sm text-white truncate">{attachment.name}</p>
                            <p className="text-xs text-text-muted">{(attachment.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => removeAttachment(attachment.id)} className="text-text-muted hover:text-white">Supprimer</button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="p-3 border-t border-border-dark flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <button type="button" onClick={() => setShowEmojiPicker((prev) => !prev)} className="w-10 h-10 rounded-full bg-surface border border-border-dark text-text-muted hover:text-white transition-all flex items-center justify-center">
                        <Smile className="w-5 h-5" />
                      </button>
                      {showEmojiPicker && (
                        <div className="absolute bottom-full left-0 mb-2 w-44 rounded-2xl bg-surface border border-border-dark p-2 shadow-xl z-20 grid grid-cols-4 gap-1">
                          {emojiList.map((emoji) => (
                            <button key={emoji} type="button" onClick={() => handleInsertEmoji(emoji)} className="rounded-xl p-2 text-sm hover:bg-[#1F1F1F] transition">
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button type="button" onClick={handleAttachClick} className="w-10 h-10 rounded-full bg-surface border border-border-dark text-text-muted hover:text-white transition-all flex items-center justify-center">
                      <Paperclip className="w-5 h-5" />
                    </button>
                  </div>
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Écrivez un message…"
                    className="flex-1 px-4 py-2.5 bg-surface-dark border border-border-dark rounded-full text-white placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <button onClick={handleSend} disabled={!input.trim() && attachmentFiles.length === 0} className="w-10 h-10 rounded-full bg-gradient-to-r from-brand to-accent flex items-center justify-center text-white disabled:opacity-50 transition-all">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <MessageSquare className="w-12 h-12 text-text-muted mx-auto mb-4" />
                  <p className="text-text-muted">Sélectionnez une conversation ou créez-en une nouvelle</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        {showNew ? renderMobileNewMessageView() : activeConvId ? renderMobileConversationView() : renderMobileListView()}
      </div>

      {!showNew && !activeConvId && (
        <button
            type="button"
            aria-label="Nouveau message"
            onClick={() => { setShowNew(true); setActiveConvId(null); }}
            className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-[0_18px_32px_-20px_rgba(13,110,253,0.9)] transition hover:bg-accent"
          >
          <Send className="w-6 h-6" />
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept={attachmentAccept}
        multiple
        className="hidden"
        onChange={handleFileSelected}
      />
    </div>
  );
}

// ===== CLIENT PROFILE =====
export function ClientProfile() {
  const { user, updateProfile } = useAuth();
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const isCompany = user.accountType === 'COMPANY';

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-2">Mon profil</h1>
      <p className="text-text-muted mb-8">Gérez vos informations personnelles</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white text-3xl font-bold mb-4">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <h2 className="text-xl font-semibold text-white mb-1">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-text-muted mb-3">{user.email}</p>
          <Badge variant={isCompany ? 'primary' : 'secondary'}>
            {isCompany ? '🏢 Compte Entreprise' : '👤 Compte Particulier'}
          </Badge>
          {isCompany && user.companyName && (
            <div className="mt-4 pt-4 border-t border-border-dark">
              <p className="text-sm text-text-muted">Entreprise</p>
              <p className="font-semibold text-white">{user.companyName}</p>
              {user.position && (
                <p className="text-sm text-text-muted">{user.position}</p>
              )}
            </div>
          )}
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2 p-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); updateProfile({}); }} className="space-y-6">
            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-brand" />
                Informations personnelles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Prénom" defaultValue={user.firstName} />
                <Input label="Nom" defaultValue={user.lastName} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input label="Email" type="email" defaultValue={user.email} disabled />
                <Input label="Téléphone" type="tel" defaultValue={user.phone || ''} />
              </div>
              {isCompany && user.position && (
                <Input label="Fonction" defaultValue={user.position} className="mt-4" />
              )}
            </div>

            {/* Company Info (only for company accounts) */}
            {isCompany && (
              <div className="pt-6 border-t border-border-dark">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-brand" />
                  Informations de l'entreprise
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Nom de l'entreprise" defaultValue={user.companyName || ''} />
                    <Input label="Secteur d'activité" defaultValue={user.companySector || ''} />
                  </div>
                  <Input label="N° d'enregistrement" defaultValue={user.companyRegistration || ''} />
                  <Input label="Adresse" defaultValue={user.companyAddress || ''} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Ville" defaultValue={user.companyCity || ''} />
                    <Input label="Pays" defaultValue={user.companyCountry || ''} />
                  </div>
                </div>
              </div>
            )}

            {/* Individual - optional company */}
            {!isCompany && (
              <div className="pt-6 border-t border-border-dark">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-brand" />
                  Informations professionnelles
                </h3>
                <Input label="Entreprise (optionnel)" defaultValue={user.company || ''} placeholder="Votre entreprise" />
              </div>
            )}

            {saved && (
              <div className="flex items-center gap-2 p-3 bg-success/10 border border-[#10B981]/30 rounded-lg text-success text-sm">
                <CheckCircle className="w-4 h-4" />
                Profil sauvegardé avec succès
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" variant="primary">
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Security Section */}
      <Card className="mt-6 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          🔐 Sécurité
        </h3>
        <p className="text-text-muted mb-4">Modifiez votre mot de passe pour sécuriser votre compte.</p>
        <Button variant="outline" onClick={() => appStore.addToast({ type: 'info', title: 'Email envoyé', message: 'Un lien de réinitialisation a été envoyé à votre adresse email.' })}>Changer le mot de passe</Button>
      </Card>
    </div>
  );
}
