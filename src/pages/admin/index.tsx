import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import { Link, useParams, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, FileText, Receipt, FolderKanban, 
  Images, Briefcase, Package, BookOpen, MessageCircle, Star, Mail, 
  Users2, Settings, LogOut, Menu, X, Home, Plus, Edit, Trash2, 
  Eye, Send, CheckCircle, ArrowRight, TrendingUp, 
  DollarSign, Search, Smile, Paperclip
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/Logo';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { useAuth, ROLE_LABELS, type User, type UserRole } from '../../contexts/AuthContext';
import { appStore } from '../../stores/appStore';
import { addClient, deleteClient, getClients, isEmailRegistered, subscribe, updateClient } from '../../stores/clientStore';
import { dashboardStore } from '../../stores/dashboardStore';
import { notificationStore } from '../../stores/notificationStore';
import { messageStore, KNOWN_USERS, setUserOnline, isUserOnline } from '../../stores/messageStore';
import { MessageStatusIcon, OnlineBadge, OfflineBadge } from '../../components/ui/MessageStatus';
import { NotificationBell } from '../../components/NotificationPanel';
import {
  formatCurrency, formatDate, formatDateTime, getStatusConfig
} from '../../data/mockData';
import { services, portfolioProjects, resources, blogPosts, testimonials } from '../../data';

// ===== ADMIN LAYOUT =====
const adminNavItems = [
  { label: 'Tableau de bord', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Clients', href: '/admin/clients', icon: Users },
  { label: 'Demandes de devis', href: '/admin/demandes', icon: MessageCircle },
  { label: 'Devis', href: '/admin/devis', icon: FileText },
  { label: 'Factures', href: '/admin/factures', icon: Receipt },
  { label: 'Projets', href: '/admin/projets', icon: FolderKanban },
  { label: 'Portfolio', href: '/admin/portfolio', icon: Images },
  { label: 'Services', href: '/admin/services', icon: Briefcase },
  { label: 'Ressources', href: '/admin/ressources', icon: Package },
  { label: 'Blog', href: '/admin/blog', icon: BookOpen },
  { label: 'Témoignages', href: '/admin/temoignages', icon: Star },
  { label: 'Messages', href: '/admin/messages', icon: Mail },
  { label: 'Newsletter', href: '/admin/newsletter', icon: Users2 },
  { label: 'Équipe', href: '/admin/equipe', icon: Users2, permission: 'team.view' },
  { label: 'Paramètres', href: '/admin/parametres', icon: Settings },
];

const projectStatusOptions = [
  { value: 'PENDING', label: 'En attente' },
  { value: 'IN_PROGRESS', label: 'En cours' },
  { value: 'REVISION', label: 'En révision' },
  { value: 'DELIVERED', label: 'Livré' },
  { value: 'COMPLETED', label: 'Terminé' },
  { value: 'CANCELLED', label: 'Annulé' },
];

interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

const projectPriorityOptions = [
  { value: 'LOW', label: 'Basse' },
  { value: 'MEDIUM', label: 'Moyenne' },
  { value: 'HIGH', label: 'Haute' },
  { value: 'URGENT', label: 'Urgente' },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth();
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
    appStore.syncFromApi().catch(() => undefined);
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

  if (!isAuthenticated || !isAdmin) {
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
          <span className="hidden sm:inline text-error-light text-sm font-medium">Administration</span>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell userId={user?.id || ''} />
          <div className="hidden md:flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-error-light to-warning flex items-center justify-center text-white text-sm font-semibold">
              {user?.firstName?.[0]}
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
            {adminNavItems.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/admin/dashboard' && location.pathname.startsWith(item.href));
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
                  {item.href === '/admin/messages' && unreadTotal > 0 && (
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
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:text-white hover:bg-surface-dark transition-colors text-sm"
              >
                <Home className="w-5 h-5" />
                Retour au site
              </Link>
            </div>
          </nav>
        </aside>

        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

// ===== ADMIN DASHBOARD =====
export function AdminDashboard() {
  const [, setRefreshKey] = useState(0);

  useEffect(() => {
    const unsubscribeApp = appStore.subscribe(() => {
      setRefreshKey((value) => value + 1);
    });
    const unsubscribeClients = subscribe(() => {
      setRefreshKey((value) => value + 1);
    });
    const unsubscribeDashboard = dashboardStore.subscribe(() => {
      setRefreshKey((value) => value + 1);
    });
    return () => {
      unsubscribeApp();
      unsubscribeClients();
      unsubscribeDashboard();
    };
  }, []);

  const clients = getClients();
  const quoteRequests = appStore.getState().quoteRequests;
  const projects = dashboardStore.getProjects();
  const quotes = dashboardStore.getQuotes();
  const invoices = dashboardStore.getInvoices();
  const teamMembers = dashboardStore.getTeamMembers();

  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = invoices
    .filter((invoice) => {
      const date = new Date(invoice.issuedAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, invoice) => sum + invoice.total, 0);
  const activeProjectsCount = projects.filter((project) => !['COMPLETED', 'CANCELLED'].includes(project.status)).length;
  const pendingQuotesCount = quotes.filter((quote) => quote.status === 'SENT').length;
  const unpaidInvoicesCount = invoices.filter((invoice) => invoice.status !== 'PAID').length;
  const totalClientsCount = clients.length;
  const newClientsThisMonth = clients.filter((client) => {
    if (!client.joinedAt) return false;
    const joined = new Date(client.joinedAt);
    return joined.getMonth() === currentMonth && joined.getFullYear() === currentYear;
  }).length;
  const teamMembersCount = teamMembers.length;
  const activeTeamMembersCount = teamMembers.filter((member) => member.isActive).length;
  const pendingQuoteRequestsCount = quoteRequests.length;

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Tableau de bord</h1>
        <p className="text-text-muted">Vue d'ensemble de votre activité</p>
      </motion.div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
              <DollarSign className="w-5 h-5" />
            </div>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(monthlyRevenue)}</p>
          <p className="text-sm text-text-muted">Revenus ce mois</p>
          <p className="text-xs text-text-muted mt-2">CA total: {formatCurrency(totalRevenue)}</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{activeProjectsCount}</p>
          <p className="text-sm text-text-muted">Projets actifs</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{pendingQuotesCount}</p>
          <p className="text-sm text-text-muted">Devis en attente</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-error-light/10 flex items-center justify-center text-error-light">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{unpaidInvoicesCount}</p>
          <p className="text-sm text-text-muted">Factures impayées</p>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Total clients</p>
              <p className="text-2xl font-bold text-white">{totalClientsCount}</p>
            </div>
            <Users className="w-8 h-8 text-brand" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Nouveaux ce mois</p>
              <p className="text-2xl font-bold text-white">{newClientsThisMonth}</p>
            </div>
            <Users className="w-8 h-8 text-success" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Membres actifs</p>
              <p className="text-2xl font-bold text-white">{activeTeamMembersCount}</p>
            </div>
            <Users2 className="w-8 h-8 text-info" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Demandes non traitées</p>
              <p className="text-2xl font-bold text-white">{pendingQuoteRequestsCount}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-warning" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Demandes de devis récentes</h2>
          <div className="space-y-3">
            {quoteRequests.slice(0, 3).map((req) => (
              <Link 
                key={req.id} 
                to={`/admin/demandes/${req.id}`}
                className="flex items-center justify-between p-3 bg-surface-alt rounded-lg hover:bg-surface-dark transition-colors"
              >
                <div>
                  <p className="font-medium text-white">{req.fullName}</p>
                  <p className="text-xs text-text-muted">{req.services.join(', ')}</p>
                </div>
                <Badge variant={getStatusConfig(req.status).variant}>
                  {getStatusConfig(req.status).label}
                </Badge>
              </Link>
            ))}
          </div>
          <Link to="/admin/demandes" className="block text-center mt-4 text-sm text-brand hover:underline">
            Voir toutes les demandes
          </Link>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Projets récents</h2>
          <div className="space-y-3">
            {projects.slice(-3).reverse().map((project) => (
              <Link 
                key={project.id} 
                to={`/admin/projets/${project.id}`}
                className="block p-3 bg-surface-alt rounded-lg hover:bg-surface-dark transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white">{project.name}</p>
                  <Badge variant={getStatusConfig(project.status).variant}>
                    {getStatusConfig(project.status).label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-border-dark rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-brand to-accent"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-text-muted">{project.progress}%</span>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/admin/projets" className="block text-center mt-4 text-sm text-brand hover:underline">
            Voir tous les projets
          </Link>
        </Card>
      </div>
    </div>
  );
}

// ===== ADMIN CLIENTS =====
export function AdminClients() {
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState<User[]>([]);
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState<User | null>(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newClient, setNewClient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    password: ''
  });

  useEffect(() => {
    const updateClients = () => setClients(getClients());
    const unsub = subscribe(updateClients);
    updateClients();
    return unsub;
  }, []);


  const filteredClients = clients.filter((c) =>
    c.firstName.toLowerCase().includes(search.toLowerCase()) ||
    c.lastName.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.company?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const totalClientsCount = clients.length;
  const newClientsThisMonth = clients.filter((client) => {
    if (!client.joinedAt) return false;
    const joined = new Date(client.joinedAt);
    const now = new Date();
    return joined.getFullYear() === now.getFullYear() && joined.getMonth() === now.getMonth();
  }).length;

  const handleClientFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  const resetClientForm = () => {
    setEditingClient(null);
    setNewClient({ firstName: '', lastName: '', email: '', phone: '', company: '', password: '' });
    setFormError('');
  };

  const handleEditClient = (client: User) => {
    setEditingClient(client);
    setShowClientForm(true);
    setNewClient({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone ?? '',
      company: client.company ?? '',
      password: ''
    });
  };

  const handleDeleteClient = (clientId: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce client ? Cette action est irréversible.')) {
      return;
    }
    const deleted = deleteClient(clientId);
    if (deleted) {
      appStore.addToast({ type: 'success', title: 'Client supprimé', message: 'Le client a été retiré de la liste.' });
    } else {
      appStore.addToast({ type: 'error', title: 'Erreur', message: 'Impossible de supprimer le client.' });
    }
  };

  const handleSaveClient = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    const email = newClient.email.trim().toLowerCase();
    if (!newClient.firstName || !newClient.lastName || !email || (!editingClient && !newClient.password)) {
      setFormError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Veuillez saisir une adresse email valide.');
      return;
    }

    setIsSubmitting(true);
    const basicClientData = {
      firstName: newClient.firstName.trim(),
      lastName: newClient.lastName.trim(),
      email,
      phone: newClient.phone.trim(),
      company: newClient.company.trim(),
    };

    if (editingClient) {
      const updated = updateClient(editingClient.id, {
        ...basicClientData,
        accountType: editingClient.accountType,
        role: editingClient.role,
        projectsCount: editingClient.projectsCount ?? 0,
        messagesCount: editingClient.messagesCount ?? 0,
        quotesCount: editingClient.quotesCount ?? 0,
        notificationsCount: editingClient.notificationsCount ?? 0,
        invoicesCount: editingClient.invoicesCount ?? 0,
        devisCount: editingClient.devisCount ?? 0,
        totalSpent: editingClient.totalSpent ?? 0,
        joinedAt: editingClient.joinedAt ?? new Date().toISOString(),
        isActive: editingClient.isActive ?? true,
      }, newClient.password || undefined);
      setIsSubmitting(false);

      if (!updated) {
        setFormError('Échec de la mise à jour. Vérifiez que l’email est unique.');
        return;
      }
      appStore.addToast({ type: 'success', title: 'Client modifié', message: 'Les informations du client ont bien été mises à jour.' });
    } else {
      if (isEmailRegistered(email)) {
        setFormError('Cet email est déjà utilisé par un autre compte.');
        setIsSubmitting(false);
        return;
      }
      const client = {
        id: `client-${Date.now()}`,
        email,
        firstName: basicClientData.firstName,
        lastName: basicClientData.lastName,
        phone: basicClientData.phone,
        company: basicClientData.company,
        role: 'CLIENT' as UserRole,
        accountType: 'INDIVIDUAL' as const,
        projectsCount: 0,
        messagesCount: 0,
        quotesCount: 0,
        notificationsCount: 0,
        invoicesCount: 0,
        devisCount: 0,
        totalSpent: 0,
        joinedAt: new Date().toISOString(),
        isActive: true
      };

      const added = addClient(client, newClient.password);
      setIsSubmitting(false);

      if (!added) {
        setFormError('Échec de la création du client. Vérifiez que l’email est unique.');
        return;
      }
      appStore.addToast({ type: 'success', title: 'Client ajouté', message: 'Le client a bien été créé et apparaît dans la liste.' });
    }

    resetClientForm();
    setShowClientForm(false);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Clients</h1>
          <p className="text-text-muted">{totalClientsCount} clients au total</p>
          <p className="text-text-muted text-sm">{newClientsThisMonth} nouveaux clients ce mois-ci</p>
        </div>
        <Button variant="primary" onClick={() => {
          resetClientForm();
          setShowClientForm((open) => !open);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          {showClientForm ? 'Annuler' : 'Nouveau client'}
        </Button>
      </div>

      {showClientForm && (
        <Card className="mb-6 p-6 border border-border-dark bg-surface-alt">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">{editingClient ? 'Modifier un client' : 'Créer un nouveau client'}</h2>
            <p className="text-sm text-text-muted">{editingClient ? 'Mettez à jour les informations du client.' : 'Remplissez les informations obligatoires et confirmez pour ajouter le client.'}</p>
          </div>
          <form onSubmit={handleSaveClient} className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className="block text-sm text-text-muted mb-2">Prénom *</label>
              <Input name="firstName" value={newClient.firstName} onChange={handleClientFieldChange} placeholder="Ex: Sophie" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-2">Nom *</label>
              <Input name="lastName" value={newClient.lastName} onChange={handleClientFieldChange} placeholder="Ex: Martin" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-2">Email *</label>
              <Input name="email" value={newClient.email} onChange={handleClientFieldChange} placeholder="client@example.com" type="email" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-2">Mot de passe *</label>
              <Input name="password" value={newClient.password} onChange={handleClientFieldChange} placeholder="Mot de passe temporaire" type="password" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-2">Téléphone</label>
              <Input name="phone" value={newClient.phone} onChange={handleClientFieldChange} placeholder="+221 77 123 45 67" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-2">Entreprise</label>
              <Input name="company" value={newClient.company} onChange={handleClientFieldChange} placeholder="Ex: Café Lumière" />
            </div>
            {formError && (
              <div className="lg:col-span-2 text-sm text-[#F87171]">{formError}</div>
            )}
            <div className="lg:col-span-2 flex flex-wrap items-center gap-3">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? (editingClient ? 'Enregistrement…' : 'Création en cours…') : (editingClient ? 'Enregistrer les modifications' : 'Créer le client')}
              </Button>
              <Button type="button" variant="ghost" onClick={() => {
                resetClientForm();
                setShowClientForm(false);
              }}>
                Fermer
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <Input 
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-alt border-b border-border-dark">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-text-muted">Client</th>
                <th className="text-left p-4 text-sm font-medium text-text-muted">Entreprise</th>
                <th className="text-left p-4 text-sm font-medium text-text-muted">Projets</th>
                <th className="text-right p-4 text-sm font-medium text-text-muted">Total dépensé</th>
                <th className="text-right p-4 text-sm font-medium text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-border-dark hover:bg-surface-dark">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-semibold">
                        {client.firstName?.[0] ?? '-'}{client.lastName?.[0] ?? '-'}
                      </div>
                      <div>
                        <p className="font-medium text-white">{client.firstName} {client.lastName}</p>
                        <p className="text-xs text-text-muted">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-text-muted">{client.company || '-'}</td>
                  <td className="p-4 text-text-muted">{client.projectsCount ?? 0}</td>
                  <td className="p-4 text-right font-medium text-white">
                    {formatCurrency(client.totalSpent ?? 0)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-text-muted hover:text-brand">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-text-muted hover:text-brand" onClick={() => handleEditClient(client)}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-error-light hover:text-[#F87171]" onClick={() => handleDeleteClient(client.id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ===== ADMIN QUOTE REQUESTS =====
export function AdminQuoteRequests() {
  const [quoteRequests, setQuoteRequests] = useState(appStore.getState().quoteRequests);

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => {
      setQuoteRequests(appStore.getState().quoteRequests);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Demandes de devis</h1>
        <p className="text-text-muted">
          {quoteRequests.filter((r) => r.status === 'NEW').length} nouvelles demandes
        </p>
      </div>

      <div className="space-y-3">
        {quoteRequests.map((req) => (
          <Link key={req.id} to={`/admin/demandes/${req.id}`}>
            <Card hover>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{req.fullName}</h3>
                  <p className="text-sm text-text-muted">{req.email} · {req.phone}</p>
                  {req.company && <p className="text-xs text-text-muted">{req.company}</p>}
                </div>
                <Badge variant={getStatusConfig(req.status).variant}>
                  {getStatusConfig(req.status).label}
                </Badge>
              </div>
              <p className="text-text-muted mb-3 line-clamp-2">{req.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {req.services.map((service) => (
                  <Badge key={service} variant="default">{service}</Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-border-dark">
                <span>Budget: {req.budget}</span>
                <span>{formatDateTime(req.createdAt)}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ===== ADMIN QUOTES =====
export function AdminQuotes() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState(dashboardStore.getQuotes());

  useEffect(() => {
    const unsubscribe = dashboardStore.subscribe(() => setQuotes(dashboardStore.getQuotes()));
    return unsubscribe;
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Devis</h1>
          <p className="text-text-muted">{quotes.length} devis au total</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/admin/devis/nouveau')}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau devis
        </Button>
      </div>

      <div className="space-y-3">
        {quotes.map((quote) => {
          const status = getStatusConfig(quote.status);
          return (
            <Link key={quote.id} to={`/admin/devis/${quote.id}`}>
              <Card hover>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-text-muted mb-1">{quote.quoteNumber}</p>
                    <h3 className="font-semibold text-white">{quote.title}</h3>
                    <p className="text-sm text-text-muted">Client: {quote.clientName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{formatCurrency(quote.total, quote.currency)}</p>
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

// ===== ADMIN INVOICES =====
export function AdminInvoices() {
  const [invoices, setInvoices] = useState(dashboardStore.getInvoices());

  useEffect(() => {
    const unsubscribe = dashboardStore.subscribe(() => setInvoices(dashboardStore.getInvoices()));
    return unsubscribe;
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Factures</h1>
          <p className="text-text-muted">{invoices.length} factures au total</p>
        </div>
        <Button variant="primary" onClick={() => appStore.addToast({ type: 'info', title: 'Nouvelle facture', message: 'Ouverture de l\'éditeur de facture…' })}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle facture
        </Button>
      </div>

      <div className="space-y-3">
        {invoices.map((invoice) => {
          const status = getStatusConfig(invoice.status);
          return (
            <Link key={invoice.id} to={`/admin/factures/${invoice.id}`}>
              <Card hover>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-text-muted mb-1">{invoice.invoiceNumber}</p>
                    <h3 className="font-semibold text-white">{invoice.title}</h3>
                    <p className="text-sm text-text-muted">Client: {invoice.clientName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{formatCurrency(invoice.total, invoice.currency)}</p>
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

// ===== ADMIN PROJECTS =====
export function AdminProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(dashboardStore.getProjects());

  useEffect(() => {
    const unsubscribe = dashboardStore.subscribe(() => setProjects(dashboardStore.getProjects()));
    return unsubscribe;
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projets</h1>
          <p className="text-text-muted">{projects.length} projet(s) au total</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/admin/projets/nouveau')}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau projet
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="p-6">
          <p className="text-text-muted">Aucun projet enregistré pour le moment. Créez-en un pour démarrer la gestion.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const status = getStatusConfig(project.status);
            return (
              <Link key={project.id} to={`/admin/projets/${project.id}`}>
                <Card hover className="h-full">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <span className="text-xs text-text-muted">{project.progress}%</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">{project.name}</h3>
                  <p className="text-sm text-text-muted mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-2 bg-border-dark rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-brand to-accent"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>{project.clientName}</span>
                    <span>{project.serviceType}</span>
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

export function AdminProjectCreate() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [priority, setPriority] = useState('MEDIUM');
  const [progress, setProgress] = useState(10);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [estimatedEndDate, setEstimatedEndDate] = useState(new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const clients = getClients();
  const noClients = clients.length === 0;

  const handleCreateProject = () => {
    if (noClients) {
      appStore.addToast({ type: 'error', title: 'Aucun client', message: 'Créez d’abord un client avant de créer un projet.' });
      return;
    }
    if (!name.trim() || !serviceType.trim() || !clientId) {
      appStore.addToast({ type: 'error', title: 'Informations manquantes', message: 'Veuillez remplir tous les champs obligatoires.' });
      return;
    }

    const client = clients.find((item) => item.id === clientId);
    const clientName = client ? `${client.firstName} ${client.lastName}` : 'Client inconnu';

    dashboardStore.addProject({
      id: `p${Date.now()}`,
      clientId,
      clientName,
      name: name.trim(),
      serviceType: serviceType.trim(),
      status,
      progress,
      priority,
      startDate,
      estimatedEndDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: description.trim() || 'Aucun détail supplémentaire fourni.',
    });

    appStore.addToast({ type: 'success', title: 'Projet créé', message: 'Le projet a été ajouté au tableau de bord.' });
    navigate('/admin/projets');
  };

  return (
    <div className="p-6 lg:p-8">
      <Link to="/admin/projets" className="inline-flex items-center gap-2 text-brand mb-6 hover:underline">
        <ArrowRight className="w-4 h-4 rotate-180" />
        Retour aux projets
      </Link>

      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-4">Nouveau projet</h1>
        <p className="text-text-muted mb-6">Créez un nouveau projet et assignez-le à un client existant.</p>
        {noClients ? (
          <Card className="p-6 bg-surface-alt border border-border-dark">
            <div className="text-text-muted space-y-4">
              <p className="text-white font-semibold">Aucun client disponible</p>
              <p>Vous devez d'abord créer un client dans l'espace clients avant de pouvoir ajouter un projet.</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/admin/clients"
                  className="inline-flex items-center justify-center px-4 py-3 bg-brand text-white rounded-lg hover:bg-accent transition"
                >
                  Aller aux clients
                </Link>
                <Button variant="ghost" onClick={() => navigate('/admin/clients')}>
                  Annuler
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="grid gap-4">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du projet" />
              <Select
                label="Client"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                options={clients.map((client) => ({
                  value: client.id,
                  label: `${client.firstName} ${client.lastName}`,
                }))}
                placeholder="Sélectionner un client"
              />
              <Input value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="Type de service" />
              <div className="grid gap-4 md:grid-cols-2">
                <Select
                  label="Statut"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  options={projectStatusOptions}
                  placeholder="Choisir un statut"
                />
                <Select
                  label="Priorité"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  options={projectPriorityOptions}
                  placeholder="Choisir une priorité"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <Input type="date" value={estimatedEndDate} onChange={(e) => setEstimatedEndDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Progression (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full accent-brand"
                />
                <div className="text-sm text-text-muted">{progress}%</div>
              </div>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description du projet" rows={5} />
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button variant="primary" onClick={handleCreateProject} disabled={noClients}>
                  Créer le projet
                </Button>
                <Link to="/admin/projets" className="inline-flex items-center justify-center px-4 py-3 border border-border-dark text-text-muted rounded-lg hover:border-brand">
                  Annuler
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// ===== ADMIN PORTFOLIO =====
export function AdminPortfolio() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-text-muted">{portfolioProjects.length} projets dans le portfolio</p>
        </div>
        <Button variant="primary" onClick={() => appStore.addToast({ type: 'info', title: 'Nouveau projet portfolio', message: 'Ajoutez les détails du projet.' })}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un projet
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {portfolioProjects.map((project) => (
          <Card key={project.id} hover>
            <div className="aspect-video overflow-hidden rounded-lg mb-4 mx-0 mt-0 md:-mx-6 md:-mt-6">
              <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-white">{project.title}</h3>
                <p className="text-sm text-text-muted">{project.category}</p>
              </div>
              {project.isFeatured && <Badge variant="primary">En vedette</Badge>}
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="w-4 h-4 mr-1" />
                Modifier
              </Button>
              <button className="p-2 text-error-light hover:bg-error-light/10 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ===== ADMIN SERVICES =====
export function AdminServices() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Services</h1>
          <p className="text-text-muted">{services.length} services configurés</p>
        </div>
        <Button variant="primary" onClick={() => appStore.addToast({ type: 'info', title: 'Nouveau service', message: 'Configuration du nouveau service…' })}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{service.title}</h3>
                <p className="text-sm text-text-muted">{service.shortDescription}</p>
              </div>
              <Badge variant="success">Actif</Badge>
            </div>
            <p className="text-sm text-brand font-medium mb-4">{service.pricing}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="w-4 h-4 mr-1" />
                Modifier
              </Button>
              <button className="p-2 text-error-light hover:bg-error-light/10 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ===== ADMIN RESOURCES =====
export function AdminResources() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Ressources</h1>
          <p className="text-text-muted">{resources.length} ressources au total</p>
        </div>
        <Button variant="primary" onClick={() => appStore.addToast({ type: 'info', title: 'Nouvelle ressource', message: 'Ajoutez les détails de la ressource.' })}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une ressource
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <Card key={resource.id}>
            <div className="aspect-video overflow-hidden rounded-lg mb-4 mx-0 mt-0 md:-mx-6 md:-mt-6">
              <img src={resource.coverImage} alt={resource.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-white">{resource.title}</h3>
                <p className="text-xs text-text-muted">{resource.downloads} téléchargements</p>
              </div>
              <Badge variant={resource.isFree ? 'success' : 'primary'}>
                {resource.isFree ? 'Gratuit' : formatCurrency(resource.price || 0, resource.currency)}
              </Badge>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="w-4 h-4 mr-1" />
                Modifier
              </Button>
              <button className="p-2 text-error-light hover:bg-error-light/10 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ===== ADMIN BLOG =====
export function AdminBlog() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Blog</h1>
          <p className="text-text-muted">{blogPosts.length} articles publiés</p>
        </div>
        <Button variant="primary" onClick={() => appStore.addToast({ type: 'info', title: 'Nouvel article', message: 'Ouverture de l\'éditeur d\'article…' })}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvel article
        </Button>
      </div>

      <div className="space-y-3">
        {blogPosts.map((post) => (
          <Card key={post.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <img src={post.coverImage} alt={post.title} className="w-20 h-20 rounded-lg object-cover" />
                <div>
                  <h3 className="font-semibold text-white mb-1">{post.title}</h3>
                  <p className="text-sm text-text-muted line-clamp-1">{post.excerpt}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="primary">{post.category}</Badge>
                    <span className="text-xs text-text-muted">{formatDate(post.publishedAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <button className="p-2 text-error-light hover:bg-error-light/10 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ===== ADMIN TESTIMONIALS =====
export function AdminTestimonials() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Témoignages</h1>
          <p className="text-text-muted">{testimonials.length} témoignages</p>
        </div>
        <Button variant="primary" onClick={() => appStore.addToast({ type: 'info', title: 'Nouveau témoignage', message: 'Ajoutez un nouveau témoignage client.' })}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>

      <div className="space-y-3">
        {testimonials.map((t) => (
          <Card key={t.id}>
            <div className="flex items-start gap-4">
              <img src={t.avatar} alt={t.clientName} className="w-16 h-16 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white">{t.clientName}</h3>
                    <p className="text-sm text-text-muted">{t.role}, {t.company}</p>
                  </div>
                  <Badge variant="success">Approuvé</Badge>
                </div>
                <p className="text-text-muted italic mb-3">"{t.content}"</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                  <button className="p-2 text-error-light hover:bg-error-light/10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ===== ADMIN MESSAGES =====
export function AdminMessages() {
  const { user } = useAuth();
  const uid = user?.id || '';
  const [convos, setConvos] = useState(messageStore.getUserConversations(uid));
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<ReturnType<typeof messageStore.getMessages>>([]);
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newRecipientId, setNewRecipientId] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachmentFiles, setAttachmentFiles] = useState<Array<{ id: string; file: File; name: string; type: string; size: number; url: string }>>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [messageError, setMessageError] = useState<string | null>(null);
  const unreadCount = messageStore.getUnreadCount(uid);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiList = ['😀', '😄', '😍', '👍', '🎉', '💬', '✨', '🚀'];
  const attachmentAccept = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.psd,.ai';

  // Tous les utilisateurs sauf moi
  const recipientOptions = KNOWN_USERS.filter(u => u.id !== uid);

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
        if (!activeConvId && initialConvos.length > 0) {
          const firstConv = initialConvos[0];
          setActiveConvId(firstConv.id);
          setMsgs(messageStore.getMessages(firstConv.id));
          messageStore.markAsRead(firstConv.id, uid);
        }
        setMessageError(null);
      } catch (error) {
        console.error('Erreur lors du chargement des conversations admin :', error);
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
        console.error('Erreur lors de la mise à jour des conversations admin :', error);
        setMessageError('Erreur de synchronisation des messages.');
      }
    });
    return () => { unsub(); };
  }, [uid, activeConvId]);

  useEffect(() => {
    if (!activeConvId || !user) {
      setIsTyping(false);
      return;
    }

    if (input.length === 0) {
      setIsTyping(false);
      messageStore.setTyping(activeConvId, user.id, false);
      return;
    }

    setIsTyping(true);
    messageStore.setTyping(activeConvId, user.id, true);
    const timeout = window.setTimeout(() => {
      setIsTyping(false);
      messageStore.setTyping(activeConvId, user.id, false);
    }, 800);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [input, activeConvId, user]);

  useEffect(() => {
    if (!activeConvId || !user) {
      return;
    }
    return () => {
      messageStore.setTyping(activeConvId, user.id, false);
    };
  }, [activeConvId, user]);

  useEffect(() => {
    const updateTyping = () => {
      if (!activeConvId) {
        setTypingUsers({});
        return;
      }
      setTypingUsers(messageStore.getTypingForConversation(activeConvId));
    };

    updateTyping();
    const unsub = messageStore.subscribe(updateTyping);
    return () => { unsub(); };
  }, [activeConvId]);

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

  const buildAttachments = () =>
    attachmentFiles.map((att) => ({
      id: att.id,
      name: att.name,
      type: att.type,
      size: att.size,
      url: att.url,
    }));

  const renderAttachmentPreview = (attachment: { id: string; name: string; type: string; size: number; url: string }) => {
    const isImage = attachment.type.startsWith('image/');
    return (
      <div key={attachment.id} className="rounded-2xl border border-border-dark bg-surface p-3 flex items-center gap-3">
        {isImage ? (
          <img src={attachment.url} alt={attachment.name} className="w-16 h-16 rounded-lg object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-surface-dark border border-border-dark flex items-center justify-center text-text-muted text-xs text-center px-2">
            {attachment.name.split('.').pop()?.toUpperCase() || 'FILE'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{attachment.name}</p>
          <p className="text-xs text-text-muted">{(attachment.size / 1024).toFixed(1)} KB • {attachment.type || 'Fichier'}</p>
        </div>
      </div>
    );
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

  useEffect(() => {
    const unsub = messageStore.subscribe(() => {
      const nextConvos = messageStore.getUserConversations(uid);
      setConvos(nextConvos);
      if (!activeConvId && nextConvos.length > 0) {
        setActiveConvId(nextConvos[0].id);
        setMsgs(messageStore.getMessages(nextConvos[0].id));
      } else if (activeConvId) {
        setMsgs(messageStore.getMessages(activeConvId));
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
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
  };

  const handleSend = () => {
    if ((!input.trim() && attachmentFiles.length === 0) || !activeConvId || !user) return;
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
  };

  const handleNewConversation = () => {
    if (!newSubject.trim() || (!input.trim() && attachmentFiles.length === 0) || !user || !newRecipientId) return;
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
    setAttachmentFiles([]);
    messageStore.setTyping(conv.id, user.id, false);
    setShowNew(false);
    openConversation(conv.id);
    appStore.addToast({ type: 'success', title: 'Message envoyé', message: `Envoyé à ${recipient.name}.` });
  };

  const getOtherParticipants = (conv: typeof convos[0]) =>
    conv.participants.filter((p: { id: string; name: string }) => p.id !== uid).map((p: { name: string }) => p.name).join(', ');

  const isConversationTyping = (conv: typeof convos[0]) =>
    Object.entries(messageStore.getTypingForConversation(conv.id)).some(([id, typing]) => id !== uid && typing);

  const otherParticipantTyping = activeConvId
    ? Object.entries(typingUsers).some(([id, typing]) => id !== uid && typing)
    : false;

  const renderMobileListView = () => (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="overflow-y-auto flex-1 space-y-1 px-2 py-3">
        {convos.length === 0 && <p className="text-text-muted text-sm text-center py-8">Aucune conversation</p>}
        {convos.map((conv: typeof convos[0]) => (
          <button
            key={conv.id}
            onClick={() => openConversation(conv.id)}
            className="w-full text-left p-3 rounded-lg bg-surface-dark border border-border-dark hover:border-[#3A3A3A] transition-all active:bg-brand/10"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white text-xs font-bold">
                  {conv.participants.filter((p: { id: string }) => p.id !== uid)[0]?.name.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </div>
                {conv.participants.filter((p: { id: string }) => p.id !== uid).some((p: { id: string }) => isUserOnline(p.id)) && (
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
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="typing-dot bg-brand" />
                      <span className="typing-dot bg-brand" />
                      <span className="typing-dot bg-brand" />
                    </div>
                    <span className="text-xs text-brand truncate">Écrit...</span>
                  </div>
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

  const renderMobileConversationView = () => {
    const currentConv = convos.find((c: typeof convos[0]) => c.id === activeConvId);
    return (
      <div className="flex flex-col h-[calc(100vh-6rem)]">
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

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {visibleMessages.length === 0 ? (
            <div className="py-12 text-center text-sm text-text-muted">Aucun message trouvé pour «{searchTerm}».</div>
          ) : visibleMessages.map((m) => (
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

        {attachmentFiles.length > 0 && (
          <div className="px-4 pb-2 space-y-2">
            {attachmentFiles.map(renderAttachmentPreview)}
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
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Répondre…"
            className="flex-1 px-4 py-2.5 bg-surface-dark border border-border-dark rounded-full text-white placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <button onClick={handleSend} disabled={!input.trim() && attachmentFiles.length === 0} className="w-10 h-10 rounded-full bg-gradient-to-r from-brand to-accent flex items-center justify-center text-white disabled:opacity-50 transition-all flex-shrink-0">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

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
            {recipientOptions.map((r) => (
              <button key={r.id} type="button" onClick={() => setNewRecipientId(r.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${newRecipientId === r.id ? 'border-brand bg-brand/10' : 'border-border-dark bg-surface-alt active:border-[#3A3A3A]'}`}>
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white text-xs font-bold">{r.name.split(' ').map((n) => n[0]).join('')}</div>
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
        <Input label="Sujet" required placeholder="Ex: Question sur mon projet…" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} />
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">Message <span className="text-error-light">*</span></label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Écrivez votre message…" rows={4} className="w-full px-4 py-3 bg-surface-dark border border-border-dark rounded-lg text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand resize-none" />
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
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Messages</h1>
          <p className="text-text-muted">{unreadCount} message(s) non lu(s) · {convos.length} conversation(s)</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => { setShowNew(true); setActiveConvId(null); }} className="hidden lg:inline-flex">
          <Send className="w-4 h-4 mr-2" />
          Nouveau message
        </Button>
      </div>

      <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-14rem)]">
        {/* Conversation List */}
        <div className="overflow-y-auto space-y-2 lg:border-r lg:border-border-dark lg:pr-4">
          {convos.length === 0 && <p className="text-text-muted text-sm text-center py-8">Aucune conversation</p>}
          {convos.map((conv: typeof convos[0]) => (
            <button
              key={conv.id}
              onClick={() => openConversation(conv.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                activeConvId === conv.id ? 'bg-brand/10 border-brand/20' : 'bg-surface-dark border-border-dark hover:border-[#3A3A3A]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-white text-sm truncate pr-2">{getOtherParticipants(conv)}</h3>
                {(conv.unread[uid] || 0) > 0 && (
                  <span className="w-5 h-5 rounded-full bg-brand text-white text-xs flex items-center justify-center flex-shrink-0">{conv.unread[uid]}</span>
                )}
              </div>
              <p className="text-xs text-brand mb-1 flex items-center gap-1">
                {conv.participants.filter((p: {id: string}) => p.id !== uid).map((p: {id: string}) => isUserOnline(p.id) ? <OnlineBadge key={p.id} /> : <OfflineBadge key={p.id} />)}
                {conv.subject}
              </p>
              {isConversationTyping(conv) ? (
                <p className="text-xs text-brand truncate flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <span className="typing-dot bg-brand" />
                    <span className="typing-dot bg-brand" />
                    <span className="typing-dot bg-brand" />
                  </span>
                  <span>Écrit...</span>
                </p>
              ) : (
                <p className="text-xs text-text-muted truncate">{conv.lastMessage}</p>
              )}
              <p className="text-[10px] text-text-muted mt-1">{formatDateTime(conv.lastMessageAt)}</p>
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 flex flex-col bg-surface-alt rounded-xl border border-border-dark overflow-hidden">
          {showNew ? (
            <div className="flex-1 flex flex-col p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Nouveau message</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-muted mb-2">Destinataire <span className="text-error-light">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {recipientOptions.map(r => (
                    <button key={r.id} type="button" onClick={() => setNewRecipientId(r.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${newRecipientId === r.id ? 'border-brand bg-brand/10' : 'border-border-dark bg-surface hover:border-[#3A3A3A]'}`}>
                      <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white text-xs font-bold">{r.name.split(' ').map(n=>n[0]).join('')}</div>
                        <span className="absolute -bottom-0.5 -right-0.5">{isUserOnline(r.id) ? <OnlineBadge /> : <OfflineBadge />}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{r.name}</p>
                        <p className="text-[10px] text-text-muted truncate">{r.role === 'CLIENT' ? 'Client' : r.role === 'SUPER_ADMIN' ? 'Super Admin' : r.role === 'PROJECT_MANAGER' ? 'Chef de projet' : r.role === 'SALES_MANAGER' ? 'Commercial' : 'Équipe'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <Input label="Sujet" required placeholder="Sujet du message…" value={newSubject} onChange={e => setNewSubject(e.target.value)} className="mb-4" />
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
              {/* Header */}
              <div className="p-4 border-b border-border-dark bg-surface space-y-3">
                <div>
                  <h3 className="font-semibold text-white">{convos.find((c: typeof convos[0]) => c.id === activeConvId) ? getOtherParticipants(convos.find((c: typeof convos[0]) => c.id === activeConvId)!) : ''}</h3>
                  <p className="text-xs text-text-muted">{convos.find((c: typeof convos[0]) => c.id === activeConvId)?.subject}</p>
                </div>
                <Input
                  placeholder="Rechercher dans la conversation…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-surface-dark"
                />
                {otherParticipantTyping && (
                  <div className="mt-3 inline-flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 border border-border-dark">
                    <div className="flex items-center gap-1">
                      <span className="typing-dot bg-brand" />
                      <span className="typing-dot bg-brand" />
                      <span className="typing-dot bg-brand" />
                    </div>
                    <span className="text-xs text-text-muted">{convos.find(c => c.id === activeConvId)?.participants.find(p => p.id !== uid)?.name} écrit...</span>
                  </div>
                )}
              </div>

              {/* Messages */}
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

              {/* Input */}
              {attachmentFiles.length > 0 && (
                <div className="px-4 pb-2 space-y-2">
                  {attachmentFiles.map(renderAttachmentPreview)}
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
                  <button type="button" onClick={handleAttachClick} className="w-10 h-10 rounded-full bg-surface border border-border-dark text-text-muted hover:text-white transition-all flex items-center justify-center flex-shrink-0">
                    <Paperclip className="w-5 h-5" />
                  </button>
                </div>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Répondre…"
                  className="flex-1 min-w-0 px-4 py-2.5 bg-surface-dark border border-border-dark rounded-full text-white placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <button onClick={handleSend} disabled={!input.trim() && attachmentFiles.length === 0} className="w-10 h-10 rounded-full bg-gradient-to-r from-brand to-accent flex items-center justify-center text-white disabled:opacity-50 transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <MessageCircle className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-muted">Sélectionnez une conversation pour répondre</p>
              </div>
            </div>
          )}
        </div>
      </div>

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
          <Plus className="w-6 h-6" />
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

// ===== ADMIN NEWSLETTER =====
export function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState(dashboardStore.getNewsletterSubscribers());

  useEffect(() => {
    const unsubscribe = dashboardStore.subscribe(() => setSubscribers(dashboardStore.getNewsletterSubscribers()));
    return unsubscribe;
  }, []);

  const downloadCsv = () => {
    const csv = 'Email,Prénom,Date\n' + subscribers.map((s) => `${s.email},${s.firstName || ''},${s.subscribedAt}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter_abonnes.csv';
    a.click();
    URL.revokeObjectURL(url);
    appStore.addToast({ type: 'success', title: 'Export CSV', message: `${subscribers.length} abonnés exportés.` });
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Newsletter</h1>
          <p className="text-text-muted">{subscribers.length} abonnés</p>
        </div>
        <Button variant="outline" onClick={downloadCsv}>
          Exporter CSV
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-alt border-b border-border-dark">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-text-muted">Email</th>
                <th className="text-left p-4 text-sm font-medium text-text-muted">Prénom</th>
                <th className="text-left p-4 text-sm font-medium text-text-muted">Date d'inscription</th>
                <th className="text-left p-4 text-sm font-medium text-text-muted">Statut</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-border-dark">
                  <td className="p-4 text-white">{sub.email}</td>
                  <td className="p-4 text-text-muted">{sub.firstName || '-'}</td>
                  <td className="p-4 text-text-muted">{formatDate(sub.subscribedAt)}</td>
                  <td className="p-4"><Badge variant="success">Actif</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ===== ADMIN SETTINGS =====
export function AdminSettings() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-2">Paramètres</h1>
      <p className="text-text-muted mb-8">Configurez votre site</p>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Informations entreprise</h2>
        <div className="space-y-4">
          <Input label="Nom de l'entreprise" defaultValue="Myms Studio" />
          <Input label="Email" type="email" defaultValue="contact@myms-studio.com" />
          <Input label="Téléphone" defaultValue="+221 77 000 00 00" />
          <Input label="Adresse" defaultValue="Dakar, Sénégal" />
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Facturation</h2>
        <div className="space-y-4">
          <Input label="Préfixe devis" defaultValue="MYMS-DEV" />
          <Input label="Préfixe factures" defaultValue="MYMS-FAC" />
          <Input label="Devise par défaut" defaultValue="USD" />
          <Input label="Taux de TVA (%)" type="number" defaultValue="0" />
          <Input label="Pourcentage acompte (%)" type="number" defaultValue="50" />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Réseaux sociaux</h2>
        <div className="space-y-4">
          <Input label="Instagram" defaultValue="https://instagram.com/myms.studio" />
          <Input label="LinkedIn" defaultValue="https://linkedin.com/company/myms" />
          <Input label="Facebook" defaultValue="https://facebook.com/myms.studio" />
          <Input label="Behance" defaultValue="https://behance.net/myms" />
        </div>
      </Card>

      <div className="mt-6">
        <Button variant="primary" onClick={() => appStore.addToast({ type: 'success', title: 'Paramètres sauvegardés', message: 'Vos modifications ont été enregistrées.' })}>Enregistrer les modifications</Button>
      </div>
    </div>
  );
}

// ===== DETAIL PAGES =====
export function AdminQuoteRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quoteRequests, setQuoteRequests] = useState(appStore.getState().quoteRequests);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => setQuoteRequests(appStore.getState().quoteRequests));
    return unsubscribe;
  }, []);

  const request = quoteRequests.find((r) => r.id === id);
  const clients = getClients();
  const matchedClient = request
    ? clients.find((client) => client.email.toLowerCase() === request.email.toLowerCase())
    : undefined;

  useEffect(() => {
    if (!request) return;
    setEmailSubject(`Réponse à votre demande de devis #${request.id}`);
    setEmailBody(`Bonjour ${request.fullName},\n\nMerci pour votre demande de devis. Voici les informations que nous avons reçues :\n\n- Service : ${request.services.join(', ')}\n- Budget : ${request.budget || 'Non précisé'}\n- Délai : ${request.deadline || 'Non précisé'}\n- Description : ${request.description}\n\nJe reviens vers vous rapidement avec une proposition détaillée.\n\nCordialement,\n${user?.firstName || "L'équipe Myms"}`);
  }, [request, user]);

  const getConversation = () => {
    if (!request || !user) return null;
    const adminId = user.id;
    const clientId = matchedClient?.id || request.clientId || `client-${request.email}`;
    return messageStore.getState().conversations.find((conv) => {
      const participants = new Set(conv.participantIds);
      return participants.has(adminId) && participants.has(clientId);
    });
  };

  const handleSendEmail = async () => {
    if (!request || !user) {
      setEmailError('Impossible d’envoyer le message.');
      return;
    }

    if (!emailSubject.trim() || !emailBody.trim()) {
      setEmailError('Le sujet et le message sont requis.');
      return;
    }

    setIsSendingEmail(true);
    setEmailError(null);

    try {
      const adminId = user.id;
      const clientId = matchedClient?.id || request.clientId || `client-${request.email}`;
      const adminParticipant = { id: adminId, name: `${user.firstName} ${user.lastName}`.trim() || 'Admin Myms', email: user.email };
      const clientParticipant = matchedClient
        ? { id: matchedClient.id, name: `${matchedClient.firstName} ${matchedClient.lastName}`.trim(), email: matchedClient.email }
        : { id: clientId, name: request.fullName, email: request.email };

      const existingConversation = getConversation();
      let conversationId = existingConversation?.id;

      if (!conversationId) {
        const conversation = messageStore.createConversation({
          subject: `Réponse devis #${request.id}`,
          participants: [adminParticipant, clientParticipant],
          firstMessage: emailBody,
          senderId: adminId,
          senderName: adminParticipant.name,
        });
        conversationId = conversation.id;
      } else {
        messageStore.sendMessage({
          conversationId,
          senderId: adminId,
          senderName: adminParticipant.name,
          content: emailBody,
        });
      }

      appStore.updateQuoteRequest(request.id, { status: 'RESPONDED' });
      if (matchedClient?.id || request.clientId || request.email) {
        notificationStore.add({
          userId: matchedClient?.id || request.clientId || request.email || 'client-unknown',
          type: 'message',
          title: 'Réponse à votre demande',
          description: `Votre demande de devis #${request.id} a reçu une réponse.`,
          link: '/client/messages',
        });
      }
      appStore.addToast({
        type: 'success',
        title: 'Message envoyé',
        message: 'Votre réponse a bien été enregistrée dans la messagerie interne.',
      });
      setIsEmailModalOpen(false);
    } catch (error) {
      setEmailError('Une erreur est survenue lors de l’envoi.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleOpenCreateQuotePage = () => {
    if (!request) return;
    appStore.updateQuoteRequest(request.id, { status: 'IN_PROGRESS' });
    navigate(`/admin/devis/nouveau?requestId=${encodeURIComponent(request.id)}`);
  };

  const handleMarkAsProcessed = () => {
    if (!request) return;
    appStore.updateQuoteRequest(request.id, { status: 'PROCESSED' });
    appStore.addToast({
      type: 'success',
      title: 'Demandé traitée',
      message: 'Le statut de la demande est passé à traitée.',
    });
  };

  if (!request) {
    return <div className="p-6 text-center text-text-muted">Demande non trouvée</div>;
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <Link to="/admin/demandes" className="inline-flex items-center gap-2 text-brand mb-6 hover:underline">
        <ArrowRight className="w-4 h-4 rotate-180" />
        Retour
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white">Demande de {request.fullName}</h1>
        <Badge variant={getStatusConfig(request.status).variant}>{getStatusConfig(request.status).label}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-white mb-4">Informations client</h3>
          <div className="space-y-2 text-sm">
            <div><span className="text-text-muted">Nom:</span> <span className="text-white">{request.fullName}</span></div>
            <div><span className="text-text-muted">Email:</span> <span className="text-white">{request.email}</span></div>
            <div><span className="text-text-muted">Téléphone:</span> <span className="text-white">{request.phone}</span></div>
            {request.company && <div><span className="text-text-muted">Entreprise:</span> <span className="text-white">{request.company}</span></div>}
            <div><span className="text-text-muted">Source:</span> <span className="text-white">{request.source}</span></div>
            <div><span className="text-text-muted">Reçu le:</span> <span className="text-white">{formatDateTime(request.createdAt)}</span></div>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-white mb-4">Projet</h3>
          <div className="space-y-2 text-sm">
            <div><span className="text-text-muted">Budget:</span> <span className="text-white">{request.budget}</span></div>
            <div><span className="text-text-muted">Délai:</span> <span className="text-white">{request.deadline}</span></div>
            <div className="pt-2">
              <span className="text-text-muted block mb-2">Services:</span>
              <div className="flex flex-wrap gap-2">
                {request.services.map((s) => (
                  <Badge key={s} variant="default">{s}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="font-semibold text-white mb-4">Description du projet</h3>
        <p className="text-text-muted">{request.description}</p>
      </Card>

      <div className="flex flex-wrap gap-3 mt-6">
        <Button variant="primary" onClick={() => setIsEmailModalOpen(true)}>
          <Send className="w-4 h-4 mr-2" />
          Répondre par email
        </Button>
        <Button variant="outline" onClick={handleOpenCreateQuotePage}>
          <FileText className="w-4 h-4 mr-2" />
          Créer un devis
        </Button>
        <Button variant="outline" onClick={handleMarkAsProcessed}>
          <CheckCircle className="w-4 h-4 mr-2" />
          Marquer comme traitée
        </Button>
      </div>

      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl rounded-3xl border border-border-dark bg-surface shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-dark">
              <div>
                <h2 className="text-xl font-semibold text-white">Répondre par email</h2>
                <p className="text-sm text-text-muted">Préparez un message avec les informations de la demande.</p>
              </div>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-text-muted hover:text-white">Fermer</button>
            </div>
            <div className="space-y-4 p-6">
              <Input label="À" value={request.email} readOnly />
              <Input label="Objet" value={emailSubject} onChange={(event) => setEmailSubject(event.target.value)} />
              <Textarea
                label="Message"
                value={emailBody}
                onChange={(event) => setEmailBody(event.target.value)}
                rows={8}
              />
              {emailError && <p className="text-sm text-error-light">{emailError}</p>}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3 px-6 py-4 border-t border-border-dark">
              <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>Annuler</Button>
              <Button variant="primary" onClick={handleSendEmail} disabled={isSendingEmail}>
                {isSendingEmail ? 'Préparation...' : 'Envoyer par email'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export function AdminQuoteCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('requestId');
  const [quoteRequests, setQuoteRequests] = useState(appStore.getState().quoteRequests);
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>(() => [{ id: `item-${Date.now()}`, description: '', quantity: 1, unitPrice: 0 }]);
  const [taxRate, setTaxRate] = useState(20);
  const [quoteTitle, setQuoteTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [requestReference, setRequestReference] = useState('');
  const [serviceDetail, setServiceDetail] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [validUntil, setValidUntil] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [status, setStatus] = useState('SENT');
  const [notes, setNotes] = useState('');
  const [conditions, setConditions] = useState('Paiement à réception de facture. Validité du devis 7 jours.');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => setQuoteRequests(appStore.getState().quoteRequests));
    return unsubscribe;
  }, []);

  const request = requestId ? quoteRequests.find((req) => req.id === requestId) : undefined;
  const clients = getClients();
  const matchedClient = request
    ? clients.find((client) => client.email.toLowerCase() === request.email.toLowerCase())
    : undefined;

  useEffect(() => {
    if (!request) return;
    setClientName(request.fullName);
    setClientEmail(request.email);
    setRequestReference(request.id);
    setServiceDetail(request.services.join(', '));
    setBudget(request.budget || '');
    setDeadline(request.deadline || '');
    setQuoteTitle(`Devis ${request.services.join(', ')}`);
    setNotes(`Demande enregistrée : ${request.description}`);
  }, [request]);

  const totalWithoutTax = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalWithTax = totalWithoutTax * (1 + taxRate / 100);

  const handleLineItemChange = (id: string, field: keyof QuoteLineItem, value: string | number) => {
    setLineItems((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleAddLine = () => {
    setLineItems((current) => [...current, { id: `item-${Date.now()}`, description: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveLine = (id: string) => {
    setLineItems((current) => current.filter((item) => item.id !== id));
  };

  const handleSubmit = () => {
    if (!clientName.trim() || !clientEmail.trim()) {
      setErrorMessage('Le nom et l’email du client sont requis.');
      return;
    }
    if (!quoteTitle.trim()) {
      setErrorMessage('Le titre du devis est requis.');
      return;
    }
    if (lineItems.some((item) => !item.description.trim() || item.quantity < 1 || item.unitPrice < 0)) {
      setErrorMessage('Chaque ligne doit contenir une description, une quantité et un prix unitaire valides.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const clientId = matchedClient?.id || (request?.clientId && request.clientId !== 'guest' ? request.clientId : `client-${Date.now()}`);
    const quoteNumber = `Q-${Date.now().toString().slice(-6)}`;
    const newQuote = {
      id: `quote-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      clientId,
      clientName,
      quoteNumber,
      title: quoteTitle,
      total: Math.round(totalWithTax),
      currency: 'EUR',
      status,
      issuedAt: new Date().toISOString(),
      validUntil: new Date(validUntil).toISOString(),
      notes: `${notes}\n\nConditions : ${conditions}`,
      lineItems,
    };

    dashboardStore.addQuote(newQuote);
    if (request) {
      appStore.updateQuoteRequest(request.id, { status: 'CONVERTED' });
    }
    const notificationUserId = matchedClient?.id || request?.clientId || request?.email || `client-${Date.now()}`;
    if (notificationUserId) {
      notificationStore.add({
        userId: notificationUserId,
        type: 'quote',
        title: 'Nouveau devis disponible',
        description: `Un devis a été créé pour votre demande ${request?.id || requestReference}.`,
        link: '/client/devis',
      });
    }
    appStore.addToast({
      type: 'success',
      title: 'Devis enregistré',
      message: 'Le devis est créé et synchronisé avec le tableau de bord client et admin.',
    });
    setIsSaving(false);
    navigate('/admin/devis');
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Créer un devis</h1>
          <p className="text-text-muted">Générez un devis professionnel à partir de la demande de devis sélectionnée.</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin/devis')}>Retour à la liste des devis</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Informations client</h2>
            <p className="text-text-muted">Prérempli depuis la demande de devis.</p>
          </div>
          <Input label="Nom du client" value={clientName} onChange={(event) => setClientName(event.target.value)} />
          <Input label="Email du client" value={clientEmail} onChange={(event) => setClientEmail(event.target.value)} />
          <Input label="Référence demande" value={requestReference} readOnly />
          <Input label="Service demandé" value={serviceDetail} onChange={(event) => setServiceDetail(event.target.value)} />
          <Input label="Budget estimé" value={budget} onChange={(event) => setBudget(event.target.value)} />
          <Input label="Délai demandé" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
        </Card>

        <Card className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Résumé du devis</h2>
            <p className="text-text-muted">Lignes, taxes et conditions.</p>
          </div>
          <Input label="Titre du devis" value={quoteTitle} onChange={(event) => setQuoteTitle(event.target.value)} />
          <Select
            label="Statut"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            options={[
              { value: 'DRAFT', label: 'Brouillon' },
              { value: 'SENT', label: 'Envoyé' },
              { value: 'VIEWED', label: 'Consulté' },
              { value: 'ACCEPTED', label: 'Accepté' },
              { value: 'REFUSED', label: 'Refusé' },
            ]}
          />
          <Input label="Valide jusqu'au" type="date" value={validUntil} onChange={(event) => setValidUntil(event.target.value)} />
          <div>
            <label className="block text-sm font-medium text-text-muted">Lignes de devis</label>
            <div className="space-y-3">
              {lineItems.map((item) => (
                <div key={item.id} className="rounded-2xl border border-border-dark bg-surface-alt p-4">
                  <div className="flex flex-wrap gap-3">
                    <Input
                      label="Description"
                      value={item.description}
                      onChange={(event) => handleLineItemChange(item.id, 'description', event.target.value)}
                    />
                    <Input
                      label="Quantité"
                      type="number"
                      value={item.quantity}
                      onChange={(event) => handleLineItemChange(item.id, 'quantity', Number(event.target.value))}
                    />
                    <Input
                      label="Prix unitaire"
                      type="number"
                      value={item.unitPrice}
                      onChange={(event) => handleLineItemChange(item.id, 'unitPrice', Number(event.target.value))}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-text-muted">
                    <span>Sous-total : {formatCurrency(item.quantity * item.unitPrice)}</span>
                    <Button variant="ghost" onClick={() => handleRemoveLine(item.id)}>
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={handleAddLine}>Ajouter une ligne</Button>
            </div>
          </div>
          <Input label="Taux de taxe (%)" type="number" value={taxRate} onChange={(event) => setTaxRate(Number(event.target.value))} />
          <div className="rounded-2xl border border-border-dark bg-surface-alt p-4 text-sm text-text-muted">
            <p>Sous-total : {formatCurrency(totalWithoutTax)}</p>
            <p>Taxes ({taxRate}%): {formatCurrency(totalWithoutTax * (taxRate / 100))}</p>
            <p className="mt-2 font-semibold text-white">Total TTC : {formatCurrency(totalWithTax)}</p>
          </div>
        </Card>
      </div>

      <Card className="mt-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Notes et conditions</h2>
          <p className="text-text-muted">Ajoutez des détails contractuels.</p>
        </div>
        <Textarea label="Notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={5} />
        <Textarea label="Conditions" value={conditions} onChange={(event) => setConditions(event.target.value)} rows={5} />
      </Card>

      {errorMessage && <p className="mt-4 text-sm text-error-light">{errorMessage}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={() => navigate('/admin/devis')}>Annuler</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? 'Enregistrement en cours...' : 'Enregistrer le devis'}
        </Button>
      </div>
    </div>
  );
}

export function AdminProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState(dashboardStore.getProjects());
  const [isSaving, setIsSaving] = useState(false);
  const clients = getClients();

  useEffect(() => {
    const unsubscribe = dashboardStore.subscribe(() => setProjects(dashboardStore.getProjects()));
    return unsubscribe;
  }, []);

  const project = projects.find((p) => p.id === id);

  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [priority, setPriority] = useState('MEDIUM');
  const [progress, setProgress] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [estimatedEndDate, setEstimatedEndDate] = useState('');

  useEffect(() => {
    if (!project) return;
    setName(project.name);
    setClientId(project.clientId);
    setServiceType(project.serviceType);
    setDescription(project.description);
    setStatus(project.status);
    setPriority(project.priority ?? 'MEDIUM');
    setProgress(project.progress);
    setStartDate(project.startDate);
    setEstimatedEndDate(project.estimatedEndDate);
  }, [project]);

  if (!project) {
    return <div className="p-6 text-center text-text-muted">Projet non trouvé</div>;
  }

  const statusConfig = getStatusConfig(status);
  const assignedClient = clients.find((client) => client.id === clientId);

  const handleSave = () => {
    if (!name.trim() || !serviceType.trim() || !clientId) {
      appStore.addToast({ type: 'error', title: 'Informations manquantes', message: 'Veuillez remplir tous les champs obligatoires.' });
      return;
    }
    setIsSaving(true);
    const clientName = assignedClient ? `${assignedClient.firstName} ${assignedClient.lastName}` : project.clientName;
    dashboardStore.updateProject(project.id, {
      name: name.trim(),
      clientId,
      clientName,
      serviceType: serviceType.trim(),
      description: description.trim(),
      status,
      priority,
      progress,
      startDate,
      estimatedEndDate,
      updatedAt: new Date().toISOString(),
    });
    setIsSaving(false);
    appStore.addToast({ type: 'success', title: 'Projet mis à jour', message: 'Les modifications ont bien été enregistrées.' });
  };

  const handleDelete = () => {
    if (!window.confirm('Supprimer ce projet ? Cette action est irréversible.')) return;
    dashboardStore.deleteProject(project.id);
    appStore.addToast({ type: 'success', title: 'Projet supprimé', message: 'Le projet a été supprimé du tableau de bord.' });
    navigate('/admin/projets');
  };

  return (
    <div className="p-6 lg:p-8">
      <Link to="/admin/projets" className="inline-flex items-center gap-2 text-brand mb-6 hover:underline">
        <ArrowRight className="w-4 h-4 rotate-180" />
        Retour
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
          <p className="text-text-muted">{assignedClient ? `${assignedClient.firstName} ${assignedClient.lastName}` : project.clientName} · {project.serviceType}</p>
        </div>
        <Badge variant={statusConfig.variant} className="text-sm px-4 py-2">{statusConfig.label}</Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-5">Modifier le projet</h2>
            <div className="grid gap-4">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du projet" />
              <Select
                label="Client associé"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                options={clients.map((client) => ({
                  value: client.id,
                  label: `${client.firstName} ${client.lastName}`,
                }))}
                placeholder="Sélectionner un client"
              />
              <Input value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="Type de service" />
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description du projet" rows={5} />
              <div className="grid gap-4 md:grid-cols-2">
                <Select
                  label="Statut"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  options={projectStatusOptions}
                  placeholder="Choisir un statut"
                />
                <Select
                  label="Priorité"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  options={projectPriorityOptions}
                  placeholder="Choisir une priorité"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <Input type="date" value={estimatedEndDate} onChange={(e) => setEstimatedEndDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Progression</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full accent-brand"
                />
                <div className="text-sm text-text-muted">{progress}%</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                Enregistrer les modifications
              </Button>
              <Button variant="outline" onClick={handleDelete} className="text-error-light">
                Supprimer le projet
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Résumé du projet</h3>
            <div className="space-y-3 text-sm text-text-muted">
              <div className="flex justify-between">
                <span>Client</span>
                <span>{assignedClient ? `${assignedClient.firstName} ${assignedClient.lastName}` : project.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span>Statut</span>
                <span>{statusConfig.label}</span>
              </div>
              <div className="flex justify-between">
                <span>Priorité</span>
                <span>{priority}</span>
              </div>
              <div className="flex justify-between">
                <span>Progression</span>
                <span>{progress}%</span>
              </div>
              <div className="flex justify-between">
                <span>Début</span>
                <span>{formatDate(startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fin estimée</span>
                <span>{formatDate(estimatedEndDate)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function AdminQuoteDetail() {
  const { id } = useParams();
  const [quotes, setQuotes] = useState(dashboardStore.getQuotes());

  useEffect(() => {
    const unsubscribe = dashboardStore.subscribe(() => setQuotes(dashboardStore.getQuotes()));
    return unsubscribe;
  }, []);

  const quote = quotes.find((q) => q.id === id);

  if (!quote) {
    return <div className="p-6 text-center text-text-muted">Devis non trouvé</div>;
  }

  return (
    <div className="p-6 lg:p-8">
      <Link to="/admin/devis" className="inline-flex items-center gap-2 text-brand mb-6 hover:underline">
        <ArrowRight className="w-4 h-4 rotate-180" />
        Retour
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{quote.quoteNumber}</h1>
          <p className="text-text-muted">{quote.title} · {quote.clientName}</p>
        </div>
        <Badge variant={getStatusConfig(quote.status).variant} className="text-sm px-4 py-2">
          {getStatusConfig(quote.status).label}
        </Badge>
      </div>

      <Card className="mb-6">
        <div className="text-4xl font-bold text-white mb-2">{formatCurrency(quote.total, quote.currency)}</div>
        <p className="text-text-muted">Émis le {formatDate(quote.issuedAt)} · Valide jusqu'au {formatDate(quote.validUntil)}</p>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button variant="primary" onClick={() => appStore.addToast({ type: 'success', title: 'Devis envoyé', message: 'Le client a été notifié par email.' })}>
          <Send className="w-4 h-4 mr-2" />
          Envoyer au client
        </Button>
        <Button variant="outline" onClick={() => { appStore.addToast({ type: 'info', title: 'PDF généré', message: 'Téléchargement du devis.' }); window.print(); }}>
          <FileText className="w-4 h-4 mr-2" />
          Générer PDF
        </Button>
        <Button variant="outline" onClick={() => appStore.addToast({ type: 'info', title: 'Mode édition', message: 'Vous pouvez modifier le devis.' })}>
          <Edit className="w-4 h-4 mr-2" />
          Modifier
        </Button>
      </div>
    </div>
  );
}

export function AdminInvoiceDetail() {
  const { id } = useParams();
  const [invoices, setInvoices] = useState(dashboardStore.getInvoices());

  useEffect(() => {
    const unsubscribe = dashboardStore.subscribe(() => setInvoices(dashboardStore.getInvoices()));
    return unsubscribe;
  }, []);

  const invoice = invoices.find((i) => i.id === id);

  if (!invoice) {
    return <div className="p-6 text-center text-text-muted">Facture non trouvée</div>;
  }

  return (
    <div className="p-6 lg:p-8">
      <Link to="/admin/factures" className="inline-flex items-center gap-2 text-brand mb-6 hover:underline">
        <ArrowRight className="w-4 h-4 rotate-180" />
        Retour
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{invoice.invoiceNumber}</h1>
          <p className="text-text-muted">{invoice.title} · {invoice.clientName}</p>
        </div>
        <Badge variant={getStatusConfig(invoice.status).variant} className="text-sm px-4 py-2">
          {getStatusConfig(invoice.status).label}
        </Badge>
      </div>

      <Card className="mb-6">
        <div className="text-4xl font-bold text-white mb-2">{formatCurrency(invoice.total, invoice.currency)}</div>
        <p className="text-text-muted">Payé: {formatCurrency(invoice.amountPaid, invoice.currency)}</p>
        <p className="text-error-light">Reste dû: {formatCurrency(invoice.amountDue, invoice.currency)}</p>
      </Card>

      <div className="flex flex-wrap gap-3">
        {invoice.amountDue > 0 && (
          <Button variant="primary" onClick={() => appStore.addToast({ type: 'success', title: 'Facture payée', message: 'La facture a été marquée comme payée.' })}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Marquer comme payée
          </Button>
        )}
        <Button variant="outline" onClick={() => appStore.addToast({ type: 'success', title: 'Facture envoyée', message: 'Le client a été notifié par email.' })}>
          <Send className="w-4 h-4 mr-2" />
          Envoyer au client
        </Button>
        <Button variant="outline" onClick={() => { appStore.addToast({ type: 'info', title: 'PDF généré', message: 'Téléchargement de la facture.' }); window.print(); }}>
          <FileText className="w-4 h-4 mr-2" />
          Générer PDF
        </Button>
      </div>
    </div>
  );
}

// ===== ADMIN TEAM =====

const roleOptions = [
  { value: 'ADMIN', label: 'Administrateur' },
  { value: 'PROJECT_MANAGER', label: 'Chef de projet' },
  { value: 'SALES_MANAGER', label: 'Responsable commercial' },
  { value: 'CONTENT_MANAGER', label: 'Gestionnaire de contenu' },
  { value: 'SUPPORT', label: 'Support client' },
];

export function AdminTeam() {
  const { user, hasPermission } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<DashboardTeamMember | null>(null);
  const [search, setSearch] = useState('');
  const [teamMembers, setTeamMembers] = useState(dashboardStore.getTeamMembers());

  useEffect(() => {
    const unsubscribe = dashboardStore.subscribe(() => setTeamMembers(dashboardStore.getTeamMembers()));
    return unsubscribe;
  }, []);

  const canManageTeam = hasPermission('team.create') || hasPermission('team.edit') || hasPermission('team.delete');
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const filteredMembers = teamMembers.filter((m) =>
    m.firstName.toLowerCase().includes(search.toLowerCase()) ||
    m.lastName.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      SUPER_ADMIN: 'bg-gradient-to-r from-error-light to-warning text-white',
      ADMIN: 'bg-brand text-white',
      PROJECT_MANAGER: 'bg-[#3B82F6] text-white',
      SALES_MANAGER: 'bg-[#10B981] text-white',
      CONTENT_MANAGER: 'bg-warning text-white',
      SUPPORT: 'bg-[#6B7280] text-white',
    };
    const labels: Record<string, string> = {
      SUPER_ADMIN: 'Super Admin',
      ADMIN: 'Admin',
      PROJECT_MANAGER: 'Chef de projet',
      SALES_MANAGER: 'Commercial',
      CONTENT_MANAGER: 'Contenu',
      SUPPORT: 'Support',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[role] || 'bg-border-dark text-white'}`}>
        {labels[role] || role}
      </span>
    );
  };

  const handleEdit = (member: DashboardTeamMember) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Équipe</h1>
          <p className="text-text-muted">
            {teamMembers.filter((m) => m.isActive).length} membres actifs · 
            {teamMembers.filter((m) => !m.isActive).length} inactifs
          </p>
        </div>
        {isSuperAdmin && (
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un membre
          </Button>
        )}
      </div>

      {/* Role Legend */}
      <Card className="mb-6 p-4">
        <h3 className="text-sm font-medium text-white mb-3">Légende des rôles</h3>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {getRoleBadge('SUPER_ADMIN')}
            <span className="text-xs text-text-muted">Accès total</span>
          </div>
          <div className="flex items-center gap-2">
            {getRoleBadge('ADMIN')}
            <span className="text-xs text-text-muted">Gestion complète</span>
          </div>
          <div className="flex items-center gap-2">
            {getRoleBadge('PROJECT_MANAGER')}
            <span className="text-xs text-text-muted">Projets & clients</span>
          </div>
          <div className="flex items-center gap-2">
            {getRoleBadge('SALES_MANAGER')}
            <span className="text-xs text-text-muted">Devis & factures</span>
          </div>
          <div className="flex items-center gap-2">
            {getRoleBadge('CONTENT_MANAGER')}
            <span className="text-xs text-text-muted">Contenu & blog</span>
          </div>
          <div className="flex items-center gap-2">
            {getRoleBadge('SUPPORT')}
            <span className="text-xs text-text-muted">Messages & support</span>
          </div>
        </div>
      </Card>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <Input 
            placeholder="Rechercher un membre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className={`relative ${!member.isActive ? 'opacity-60' : ''}`}>
            {!member.isActive && (
              <div className="absolute top-4 right-4">
                <Badge variant="default">Inactif</Badge>
              </div>
            )}
            
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold ${
                member.role === 'SUPER_ADMIN' 
                  ? 'bg-gradient-to-br from-error-light to-warning' 
                  : 'bg-gradient-to-br from-brand to-accent'
              }`}>
                {member.firstName[0]}{member.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">
                  {member.firstName} {member.lastName}
                </h3>
                <p className="text-sm text-text-muted truncate">{member.email}</p>
                <div className="mt-2">
                  {getRoleBadge(member.role)}
                </div>
              </div>
            </div>

            <p className="text-sm text-text-muted mb-3">{member.description}</p>

            <div className="mb-4">
              <p className="text-xs text-text-muted mb-2">Tâches assignées :</p>
              <div className="flex flex-wrap gap-1">
                {member.tasksAssigned.map((task, i) => (
                  <span key={i} className="px-2 py-0.5 bg-border-dark rounded text-xs text-text-muted">
                    {task}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-xs text-text-muted mb-4 pt-3 border-t border-border-dark">
              <p>📞 {member.phone}</p>
              <p>🕐 Dernière connexion : {formatDateTime(member.lastLogin)}</p>
              <p>📅 Membre depuis : {formatDate(member.createdAt)}</p>
            </div>

            {canManageTeam && member.role !== 'SUPER_ADMIN' && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(member)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Modifier
                </Button>
                {isSuperAdmin && (
                  <button className="p-2 text-error-light hover:bg-error-light/10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {member.role === 'SUPER_ADMIN' && member.id !== user?.id && (
              <p className="text-xs text-center text-text-muted italic">
                Super Admin - Non modifiable
              </p>
            )}
          </Card>
        ))}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-surface-dark rounded-2xl border border-border-dark overflow-hidden"
          >
            <div className="p-6 border-b border-border-dark">
              <h2 className="text-xl font-bold text-white">Ajouter un membre</h2>
              <p className="text-sm text-text-muted">Inviter un nouveau membre dans l'équipe</p>
            </div>
            
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Prénom" placeholder="Jean" required />
                <Input label="Nom" placeholder="Dupont" required />
              </div>
              <Input label="Email" type="email" placeholder="jean@myms.com" required />
              <Input label="Téléphone" type="tel" placeholder="+221 77..." />
              <Select 
                label="Rôle" 
                required
                placeholder="Sélectionner un rôle"
                options={roleOptions}
              />
              <Textarea 
                label="Description" 
                placeholder="Description du rôle et des responsabilités..."
                rows={3}
              />
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">
                  Tâches assignées
                </label>
                <Input placeholder="Ex: Gestion des projets, Suivi clients..." />
                <p className="text-xs text-text-muted mt-1">Séparez les tâches par des virgules</p>
              </div>
              <div className="p-4 bg-surface-alt rounded-lg border border-border-dark">
                <h4 className="text-sm font-medium text-white mb-2">📧 Invitation par email</h4>
                <p className="text-xs text-text-muted">
                  Un email sera envoyé au nouveau membre avec un lien pour définir son mot de passe 
                  et accéder à l'espace d'administration.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-border-dark flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Annuler
              </Button>
              <Button variant="primary" onClick={() => { setShowAddModal(false); appStore.addToast({ type: 'success', title: 'Membre ajouté !', message: 'Un email d\'invitation a été envoyé.' }); }}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter le membre
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-surface-dark rounded-2xl border border-border-dark overflow-hidden"
          >
            <div className="p-6 border-b border-border-dark">
              <h2 className="text-xl font-bold text-white">Modifier le membre</h2>
              <p className="text-sm text-text-muted">
                {selectedMember.firstName} {selectedMember.lastName}
              </p>
            </div>
            
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Prénom" defaultValue={selectedMember.firstName} required />
                <Input label="Nom" defaultValue={selectedMember.lastName} required />
              </div>
              <Input label="Email" type="email" defaultValue={selectedMember.email} required />
              <Input label="Téléphone" type="tel" defaultValue={selectedMember.phone} />
              <Select 
                label="Rôle" 
                required
                defaultValue={selectedMember.role}
                options={roleOptions}
              />
              <Textarea 
                label="Description" 
                defaultValue={selectedMember.description}
                rows={3}
              />
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">
                  Tâches assignées
                </label>
                <Input defaultValue={selectedMember.tasksAssigned.join(', ')} />
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-surface-alt rounded-lg border border-border-dark">
                <input 
                  type="checkbox" 
                  defaultChecked={selectedMember.isActive}
                  className="w-4 h-4 rounded border-border-dark bg-surface-dark text-brand focus:ring-brand"
                />
                <div>
                  <p className="text-sm font-medium text-white">Compte actif</p>
                  <p className="text-xs text-text-muted">
                    Désactiver le compte empêche la connexion mais conserve les données
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border-dark flex justify-between">
              <Button variant="ghost" className="text-error-light" onClick={() => appStore.addToast({ type: 'info', title: 'Email envoyé', message: 'Un lien de réinitialisation a été envoyé.' })}>
                Réinitialiser mot de passe
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Annuler
                </Button>
                <Button variant="primary" onClick={() => { setShowEditModal(false); appStore.addToast({ type: 'success', title: 'Enregistré', message: 'Les modifications ont été sauvegardées.' }); }}>
                  Enregistrer
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ===== ADMIN TEAM PERMISSIONS VIEW =====
export function AdminTeamPermissions() {
  const permissions = [
    { category: 'Tableau de bord', perms: ['dashboard.view'] },
    { category: 'Clients', perms: ['clients.view', 'clients.create', 'clients.edit', 'clients.delete'] },
    { category: 'Projets', perms: ['projects.view', 'projects.create', 'projects.edit', 'projects.delete'] },
    { category: 'Devis', perms: ['quotes.view', 'quotes.create', 'quotes.edit', 'quotes.delete', 'quotes.send'] },
    { category: 'Factures', perms: ['invoices.view', 'invoices.create', 'invoices.edit', 'invoices.delete', 'invoices.send'] },
    { category: 'Portfolio', perms: ['portfolio.view', 'portfolio.create', 'portfolio.edit', 'portfolio.delete'] },
    { category: 'Blog', perms: ['blog.view', 'blog.create', 'blog.edit', 'blog.delete'] },
    { category: 'Équipe', perms: ['team.view', 'team.create', 'team.edit', 'team.delete'] },
    { category: 'Paramètres', perms: ['settings.view', 'settings.edit'] },
  ];

  const roles = ['SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'SALES_MANAGER', 'CONTENT_MANAGER', 'SUPPORT'];

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-white mb-2">Permissions des rôles</h1>
      <p className="text-text-muted mb-8">Vue d'ensemble des permissions par rôle</p>

      <Card className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-alt">
            <tr>
              <th className="text-left p-4 text-text-muted font-medium border-b border-border-dark">Permission</th>
              {roles.map(role => (
                <th key={role} className="text-center p-4 text-text-muted font-medium border-b border-border-dark">
                  {ROLE_LABELS[role as UserRole]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((cat) => (
              <>
                <tr key={cat.category} className="bg-surface-dark">
                  <td colSpan={7} className="p-3 font-semibold text-white border-b border-border-dark">
                    {cat.category}
                  </td>
                </tr>
                {cat.perms.map(perm => (
                  <tr key={perm} className="border-b border-border-dark hover:bg-surface-dark">
                    <td className="p-3 text-text-muted">{perm}</td>
                    {roles.map(role => (
                      <td key={role} className="text-center p-3">
                        {/* Simplified check - in real app would use ROLE_PERMISSIONS */}
                        {role === 'SUPER_ADMIN' || (role === 'ADMIN' && !perm.includes('team.create')) ? (
                          <CheckCircle className="w-5 h-5 text-success mx-auto" />
                        ) : perm.includes('view') ? (
                          <CheckCircle className="w-5 h-5 text-success mx-auto" />
                        ) : (
                          <span className="text-text-muted">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
