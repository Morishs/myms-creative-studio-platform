import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { Link, useParams, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, FileText, Receipt, FolderKanban, 
  Images, Briefcase, Package, BookOpen, MessageCircle, Star, Mail, 
  Users2, Settings, LogOut, Menu, X, Home, Plus, Edit, Trash2, 
  Eye, Send, CheckCircle, ArrowRight, TrendingUp, 
  DollarSign, Search, Smile, Paperclip
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { useAuth, ROLE_LABELS, type UserRole } from '../../contexts/AuthContext';
import { appStore } from '../../stores/appStore';
import { messageStore, KNOWN_USERS, setUserOnline, isUserOnline } from '../../stores/messageStore';
import { MessageStatusIcon, OnlineBadge, OfflineBadge } from '../../components/ui/MessageStatus';
import { NotificationBell } from '../../components/NotificationPanel';
import { 
  mockAdminClients, mockAdminQuoteRequests, 
  mockAdminProjects, mockAdminQuotes, mockAdminInvoices,
  mockNewsletterSubscribers, mockTeamMembers,
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

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [unreadTotal, setUnreadTotal] = useState(messageStore.getUnreadCount(user?.id || ''));

  // Heartbeat: mark this user as online
  useEffect(() => {
    if (!user) return;
    setUserOnline(user.id);
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

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/auth/connexion" replace />;
  }

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-[#111111] border-b border-[#2A2A2A] z-40 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-white"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link to="/" className="text-xl font-bold text-white font-['Sora']">
            Myms<span className="text-[#6C3CE1]">.</span>
          </Link>
          <span className="hidden sm:inline text-[#6B7280]">/</span>
          <span className="hidden sm:inline text-[#EF4444] text-sm font-medium">Administration</span>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell userId={user?.id || ''} />
          <div className="hidden md:flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EF4444] to-[#F59E0B] flex items-center justify-center text-white text-sm font-semibold">
              {user?.firstName?.[0]}
            </div>
            <span className="text-sm text-white">{user?.firstName} {user?.lastName}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="text-[#A0A0A0] hover:text-[#EF4444] transition-colors"
            title="Déconnexion"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-[#111111] border-r border-[#2A2A2A]
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
                    isActive ? 'bg-[#6C3CE1]/10 text-[#6C3CE1] font-medium' : 'text-[#A0A0A0] hover:text-white hover:bg-[#1A1A1A]'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.href === '/admin/messages' && unreadTotal > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#6C3CE1] text-white text-[10px] flex items-center justify-center font-bold">
                      {unreadTotal > 99 ? '99+' : unreadTotal}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-4 mt-4 border-t border-[#2A2A2A]">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#1A1A1A] transition-colors text-sm"
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
    const unsubscribe = appStore.subscribe(() => {
      setRefreshKey((value) => value + 1);
    });
    return unsubscribe;
  }, []);

  const totalRevenue = mockAdminInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = mockAdminInvoices
    .filter((invoice) => {
      const date = new Date(invoice.issuedAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, invoice) => sum + invoice.total, 0);
  const activeProjectsCount = mockAdminProjects.filter((project) => !['COMPLETED', 'CANCELLED'].includes(project.status)).length;
  const pendingQuotesCount = mockAdminQuotes.filter((quote) => quote.status === 'SENT').length;
  const unpaidInvoicesCount = mockAdminInvoices.filter((invoice) => invoice.status !== 'PAID').length;
  const totalClientsCount = mockAdminClients.length;
  const newClientsThisMonth = mockAdminClients.filter((client) => {
    const joined = new Date(client.joinedAt);
    return joined.getMonth() === currentMonth && joined.getFullYear() === currentYear;
  }).length;
  const pendingQuoteRequestsCount = mockAdminQuoteRequests.filter((request) => request.status === 'NEW').length;

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Tableau de bord</h1>
        <p className="text-[#A0A0A0]">Vue d'ensemble de votre activité</p>
      </motion.div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
              <DollarSign className="w-5 h-5" />
            </div>
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(monthlyRevenue)}</p>
          <p className="text-sm text-[#A0A0A0]">Revenus ce mois</p>
          <p className="text-xs text-[#6B7280] mt-2">CA total: {formatCurrency(totalRevenue)}</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#6C3CE1]/10 flex items-center justify-center text-[#6C3CE1]">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{activeProjectsCount}</p>
          <p className="text-sm text-[#A0A0A0]">Projets actifs</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{pendingQuotesCount}</p>
          <p className="text-sm text-[#A0A0A0]">Devis en attente</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444]">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{unpaidInvoicesCount}</p>
          <p className="text-sm text-[#A0A0A0]">Factures impayées</p>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A0A0A0]">Total clients</p>
              <p className="text-2xl font-bold text-white">{totalClientsCount}</p>
            </div>
            <Users className="w-8 h-8 text-[#6C3CE1]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A0A0A0]">Nouveaux ce mois</p>
              <p className="text-2xl font-bold text-white">{newClientsThisMonth}</p>
            </div>
            <Users className="w-8 h-8 text-[#10B981]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A0A0A0]">Demandes non traitées</p>
              <p className="text-2xl font-bold text-white">{pendingQuoteRequestsCount}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-[#F59E0B]" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Demandes de devis récentes</h2>
          <div className="space-y-3">
            {mockAdminQuoteRequests.slice(0, 3).map((req) => (
              <Link 
                key={req.id} 
                to={`/admin/demandes/${req.id}`}
                className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg hover:bg-[#1A1A1A] transition-colors"
              >
                <div>
                  <p className="font-medium text-white">{req.fullName}</p>
                  <p className="text-xs text-[#6B7280]">{req.services.join(', ')}</p>
                </div>
                <Badge variant={getStatusConfig(req.status).variant}>
                  {getStatusConfig(req.status).label}
                </Badge>
              </Link>
            ))}
          </div>
          <Link to="/admin/demandes" className="block text-center mt-4 text-sm text-[#6C3CE1] hover:underline">
            Voir toutes les demandes
          </Link>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Projets récents</h2>
          <div className="space-y-3">
            {mockAdminProjects.slice(-3).reverse().map((project) => (
              <Link 
                key={project.id} 
                to={`/admin/projets/${project.id}`}
                className="block p-3 bg-[#0A0A0A] rounded-lg hover:bg-[#1A1A1A] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white">{project.name}</p>
                  <Badge variant={getStatusConfig(project.status).variant}>
                    {getStatusConfig(project.status).label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#6C3CE1] to-[#7C4CF1]"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#6B7280]">{project.progress}%</span>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/admin/projets" className="block text-center mt-4 text-sm text-[#6C3CE1] hover:underline">
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
  
  const filteredClients = mockAdminClients.filter(c => 
    c.firstName.toLowerCase().includes(search.toLowerCase()) ||
    c.lastName.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Clients</h1>
          <p className="text-[#A0A0A0]">{mockAdminClients.length} clients au total</p>
        </div>
        <Button variant="primary" onClick={() => appStore.addToast({ type: 'info', title: 'Formulaire client', message: 'Remplissez les informations du nouveau client.' })}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau client
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
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
            <thead className="bg-[#0A0A0A] border-b border-[#2A2A2A]">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-[#A0A0A0]">Client</th>
                <th className="text-left p-4 text-sm font-medium text-[#A0A0A0]">Entreprise</th>
                <th className="text-left p-4 text-sm font-medium text-[#A0A0A0]">Projets</th>
                <th className="text-right p-4 text-sm font-medium text-[#A0A0A0]">Total dépensé</th>
                <th className="text-right p-4 text-sm font-medium text-[#A0A0A0]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C3CE1] to-[#7C4CF1] flex items-center justify-center text-white font-semibold">
                        {client.firstName[0]}{client.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-white">{client.firstName} {client.lastName}</p>
                        <p className="text-xs text-[#6B7280]">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[#A0A0A0]">{client.company || '-'}</td>
                  <td className="p-4 text-[#A0A0A0]">{client.projectsCount}</td>
                  <td className="p-4 text-right font-medium text-white">
                    {formatCurrency(client.totalSpent)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-[#6B7280] hover:text-[#6C3CE1]">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-[#6B7280] hover:text-[#6C3CE1]">
                        <Edit className="w-4 h-4" />
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
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Demandes de devis</h1>
        <p className="text-[#A0A0A0]">
          {mockAdminQuoteRequests.filter(r => r.status === 'NEW').length} nouvelles demandes
        </p>
      </div>

      <div className="space-y-3">
        {mockAdminQuoteRequests.map((req) => (
          <Link key={req.id} to={`/admin/demandes/${req.id}`}>
            <Card hover>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{req.fullName}</h3>
                  <p className="text-sm text-[#A0A0A0]">{req.email} · {req.phone}</p>
                  {req.company && <p className="text-xs text-[#6B7280]">{req.company}</p>}
                </div>
                <Badge variant={getStatusConfig(req.status).variant}>
                  {getStatusConfig(req.status).label}
                </Badge>
              </div>
              <p className="text-[#A0A0A0] mb-3 line-clamp-2">{req.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {req.services.map((service) => (
                  <Badge key={service} variant="default">{service}</Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-[#6B7280] pt-3 border-t border-[#2A2A2A]">
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
  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Devis</h1>
          <p className="text-[#A0A0A0]">{mockAdminQuotes.length} devis au total</p>
        </div>
        <Button variant="primary" onClick={() => appStore.addToast({ type: 'info', title: 'Nouveau devis', message: 'Ouverture de l\'éditeur de devis…' })}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau devis
        </Button>
      </div>

      <div className="space-y-3">
        {mockAdminQuotes.map((quote) => {
          const status = getStatusConfig(quote.status);
          return (
            <Link key={quote.id} to={`/admin/devis/${quote.id}`}>
              <Card hover>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">{quote.quoteNumber}</p>
                    <h3 className="font-semibold text-white">{quote.title}</h3>
                    <p className="text-sm text-[#A0A0A0]">Client: {quote.clientName}</p>
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
  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Factures</h1>
          <p className="text-[#A0A0A0]">{mockAdminInvoices.length} factures au total</p>
        </div>
        <Button variant="primary" onClick={() => appStore.addToast({ type: 'info', title: 'Nouvelle facture', message: 'Ouverture de l\'éditeur de facture…' })}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle facture
        </Button>
      </div>

      <div className="space-y-3">
        {mockAdminInvoices.map((invoice) => {
          const status = getStatusConfig(invoice.status);
          return (
            <Link key={invoice.id} to={`/admin/factures/${invoice.id}`}>
              <Card hover>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">{invoice.invoiceNumber}</p>
                    <h3 className="font-semibold text-white">{invoice.title}</h3>
                    <p className="text-sm text-[#A0A0A0]">Client: {invoice.clientName}</p>
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

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projets</h1>
          <p className="text-[#A0A0A0]">{mockAdminProjects.length} projets au total</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/admin/projets/nouveau')}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau projet
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockAdminProjects.map((project) => {
          const status = getStatusConfig(project.status);
          return (
            <Link key={project.id} to={`/admin/projets/${project.id}`}>
              <Card hover className="h-full">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={status.variant}>{status.label}</Badge>
                  <span className="text-xs text-[#6B7280]">{project.progress}%</span>
                </div>
                <h3 className="font-semibold text-white mb-2">{project.name}</h3>
                <p className="text-sm text-[#A0A0A0] mb-4 line-clamp-2">{project.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#6C3CE1] to-[#7C4CF1]"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-[#6B7280]">
                  <span>{project.clientName}</span>
                  <span>{project.serviceType}</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function AdminProjectCreate() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateProject = () => {
    if (!name.trim() || !clientName.trim() || !serviceType.trim()) {
      appStore.addToast({ type: 'error', title: 'Informations manquantes', message: 'Veuillez remplir tous les champs obligatoires.' });
      return;
    }

    mockAdminProjects.push({
      id: `p${Date.now()}`,
      name: name.trim(),
      clientName: clientName.trim(),
      serviceType: serviceType.trim(),
      status: 'PLANNING',
      progress: 0,
      startDate: new Date().toISOString().slice(0, 10),
      estimatedEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      description: description.trim() || 'Aucun détail supplémentaire fourni.'
    });

    appStore.addToast({ type: 'success', title: 'Projet créé', message: 'Votre projet a bien été ajouté.' });
    navigate('/admin/projets');
  };

  return (
    <div className="p-6 lg:p-8">
      <Link to="/admin/projets" className="inline-flex items-center gap-2 text-[#6C3CE1] mb-6 hover:underline">
        <ArrowRight className="w-4 h-4 rotate-180" />
        Retour aux projets
      </Link>

      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-4">Nouveau projet</h1>
        <p className="text-[#A0A0A0] mb-6">Créez un nouveau projet en définissant son titre, son client et ses objectifs.</p>
        <Card className="p-6">
          <div className="grid gap-4">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du projet" />
            <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client" />
            <Input value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="Type de service" />
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description du projet" rows={5} />
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button variant="primary" onClick={handleCreateProject}>
                Créer le projet
              </Button>
              <Link to="/admin/projets" className="inline-flex items-center justify-center px-4 py-3 border border-[#2A2A2A] text-[#A0A0A0] rounded-lg hover:border-[#6C3CE1]">
                Annuler
              </Link>
            </div>
          </div>
        </Card>
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
          <p className="text-[#A0A0A0]">{portfolioProjects.length} projets dans le portfolio</p>
        </div>
        <Button variant="primary" onClick={() => appStore.addToast({ type: 'info', title: 'Nouveau projet portfolio', message: 'Ajoutez les détails du projet.' })}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un projet
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {portfolioProjects.map((project) => (
          <Card key={project.id} hover>
            <div className="aspect-video overflow-hidden rounded-lg mb-4 -mx-6 -mt-6">
              <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-white">{project.title}</h3>
                <p className="text-sm text-[#6B7280]">{project.category}</p>
              </div>
              {project.isFeatured && <Badge variant="primary">En vedette</Badge>}
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="w-4 h-4 mr-1" />
                Modifier
              </Button>
              <button className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg">
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
          <p className="text-[#A0A0A0]">{services.length} services configurés</p>
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
                <p className="text-sm text-[#A0A0A0]">{service.shortDescription}</p>
              </div>
              <Badge variant="success">Actif</Badge>
            </div>
            <p className="text-sm text-[#6C3CE1] font-medium mb-4">{service.pricing}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="w-4 h-4 mr-1" />
                Modifier
              </Button>
              <button className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg">
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
          <p className="text-[#A0A0A0]">{resources.length} ressources au total</p>
        </div>
        <Button variant="primary" onClick={() => appStore.addToast({ type: 'info', title: 'Nouvelle ressource', message: 'Ajoutez les détails de la ressource.' })}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une ressource
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <Card key={resource.id}>
            <div className="aspect-video overflow-hidden rounded-lg mb-4 -mx-6 -mt-6">
              <img src={resource.coverImage} alt={resource.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-white">{resource.title}</h3>
                <p className="text-xs text-[#6B7280]">{resource.downloads} téléchargements</p>
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
              <button className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg">
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
          <p className="text-[#A0A0A0]">{blogPosts.length} articles publiés</p>
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
                  <p className="text-sm text-[#A0A0A0] line-clamp-1">{post.excerpt}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="primary">{post.category}</Badge>
                    <span className="text-xs text-[#6B7280]">{formatDate(post.publishedAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <button className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg">
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
          <p className="text-[#A0A0A0]">{testimonials.length} témoignages</p>
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
                    <p className="text-sm text-[#6B7280]">{t.role}, {t.company}</p>
                  </div>
                  <Badge variant="success">Approuvé</Badge>
                </div>
                <p className="text-[#A0A0A0] italic mb-3">"{t.content}"</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                  <button className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg">
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
  const unreadCount = messageStore.getUnreadCount(uid);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiList = ['😀', '😄', '😍', '👍', '🎉', '💬', '✨', '🚀'];
  const attachmentAccept = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.psd,.ai';

  // Tous les utilisateurs sauf moi
  const recipientOptions = KNOWN_USERS.filter(u => u.id !== uid);

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
      <div key={attachment.id} className="rounded-2xl border border-[#2A2A2A] bg-[#111111] p-3 flex items-center gap-3">
        {isImage ? (
          <img src={attachment.url} alt={attachment.name} className="w-16 h-16 rounded-lg object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#6B7280] text-xs text-center px-2">
            {attachment.name.split('.').pop()?.toUpperCase() || 'FILE'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{attachment.name}</p>
          <p className="text-xs text-[#6B7280]">{(attachment.size / 1024).toFixed(1)} KB • {attachment.type || 'Fichier'}</p>
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
              className="block rounded-2xl border border-[#2A2A2A] bg-[#111111] p-3 text-[#E5E7EB] hover:border-[#6C3CE1] transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#0E0E0E] border border-[#2A2A2A] flex items-center justify-center overflow-hidden">
                  {isImage ? (
                    <img src={attachment.url} alt={attachment.name} className="w-full h-full object-cover" />
                  ) : (
                    <File className="w-5 h-5 text-[#6B7280]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{attachment.name}</p>
                  <p className="text-xs text-[#6B7280]">{(attachment.size / 1024).toFixed(1)} KB</p>
                </div>
                <span className="text-xs text-[#6B7280]">Télécharger</span>
              </div>
            </a>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    const unsub = messageStore.subscribe(() => {
      setConvos(messageStore.getUserConversations(uid));
      if (activeConvId) setMsgs(messageStore.getMessages(activeConvId));
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
        {convos.length === 0 && <p className="text-[#6B7280] text-sm text-center py-8">Aucune conversation</p>}
        {convos.map((conv: typeof convos[0]) => (
          <button
            key={conv.id}
            onClick={() => openConversation(conv.id)}
            className="w-full text-left p-3 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#3A3A3A] transition-all active:bg-[#6C3CE1]/10"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C3CE1] to-[#7C4CF1] flex items-center justify-center text-white text-xs font-bold">
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
                    <span className="w-5 h-5 rounded-full bg-[#6C3CE1] text-white text-xs flex items-center justify-center flex-shrink-0">{conv.unread[uid]}</span>
                  )}
                </div>
                {isConversationTyping(conv) ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="typing-dot bg-[#6C3CE1]" />
                      <span className="typing-dot bg-[#6C3CE1]" />
                      <span className="typing-dot bg-[#6C3CE1]" />
                    </div>
                    <span className="text-xs text-[#6C3CE1] truncate">Écrit...</span>
                  </div>
                ) : (
                  <p className="text-xs text-[#A0A0A0] truncate">{conv.lastMessage}</p>
                )}
                <p className="text-[10px] text-[#6B7280] mt-0.5">{formatDateTime(conv.lastMessageAt)}</p>
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
        <div className="p-4 border-b border-[#2A2A2A] bg-[#111111] space-y-3">
          <div className="flex items-center gap-3">
            <button onClick={() => { setActiveConvId(null); }} className="text-[#A0A0A0] hover:text-white transition-colors">
              <ArrowRight className="w-5 h-5 transform rotate-180" />
            </button>
            <div>
              <h3 className="font-semibold text-white text-sm">{currentConv?.subject}</h3>
              <p className="text-xs text-[#6B7280]">{currentConv ? getOtherParticipants(currentConv) : ''}</p>
            </div>
          </div>
          <Input
            placeholder="Rechercher dans la conversation…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#131313]"
          />
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {visibleMessages.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#A0A0A0]">Aucun message trouvé pour «{searchTerm}».</div>
          ) : visibleMessages.map((m) => (
            <div key={m.id} className={`flex ${m.senderId === uid ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                m.senderId === uid ? 'bg-[#6C3CE1] text-white' : 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#E0E0E0]'
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
        <div className="p-3 border-t border-[#2A2A2A] flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <button type="button" onClick={() => setShowEmojiPicker((prev) => !prev)} className="w-10 h-10 rounded-full bg-[#111111] border border-[#2A2A2A] text-[#A0A0A0] hover:text-white transition-all flex items-center justify-center flex-shrink-0">
                <Smile className="w-5 h-5" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 w-44 rounded-2xl bg-[#111111] border border-[#2A2A2A] p-2 shadow-xl z-20 grid grid-cols-4 gap-1">
                  {emojiList.map((emoji) => (
                    <button key={emoji} type="button" onClick={() => handleInsertEmoji(emoji)} className="rounded-xl p-2 text-sm hover:bg-[#1F1F1F] transition">
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="button" onClick={handleAttachClick} className="w-10 h-10 rounded-full bg-[#111111] border border-[#2A2A2A] text-[#A0A0A0] hover:text-white transition-all flex items-center justify-center">
              <Paperclip className="w-5 h-5" />
            </button>
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Répondre…"
            className="flex-1 px-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full text-white placeholder-[#6B7280] text-sm focus:outline-none focus:ring-2 focus:ring-[#6C3CE1]"
          />
          <button onClick={handleSend} disabled={!input.trim() && attachmentFiles.length === 0} className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6C3CE1] to-[#7C4CF1] flex items-center justify-center text-white disabled:opacity-50 transition-all flex-shrink-0">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderMobileNewMessageView = () => (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="p-4 border-b border-[#2A2A2A] bg-[#111111] flex items-center gap-3">
        <button onClick={() => { setShowNew(false); setNewRecipientId(''); }} className="text-[#A0A0A0] hover:text-white transition-colors">
          <ArrowRight className="w-5 h-5 transform rotate-180" />
        </button>
        <h3 className="text-lg font-semibold text-white">Nouveau message</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Destinataire <span className="text-[#EF4444]">*</span></label>
          <div className="space-y-2">
            {recipientOptions.map((r) => (
              <button key={r.id} type="button" onClick={() => setNewRecipientId(r.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${newRecipientId === r.id ? 'border-[#6C3CE1] bg-[#6C3CE1]/10' : 'border-[#2A2A2A] bg-[#0A0A0A] active:border-[#3A3A3A]'}`}>
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C3CE1] to-[#7C4CF1] flex items-center justify-center text-white text-xs font-bold">{r.name.split(' ').map((n) => n[0]).join('')}</div>
                  {isUserOnline(r.id) && <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border border-[#0A0A0A]"></span>}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{r.name}</p>
                  <p className="text-xs text-[#6B7280]">{r.email}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <Input label="Sujet" required placeholder="Ex: Question sur mon projet…" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} />
        <div>
          <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Message <span className="text-[#EF4444]">*</span></label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Écrivez votre message…" rows={4} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#6C3CE1] resize-none" />
        </div>
      </div>
      <div className="p-4 border-t border-[#2A2A2A] flex gap-2">
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
          <p className="text-[#A0A0A0]">{unreadCount} message(s) non lu(s) · {convos.length} conversation(s)</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => { setShowNew(true); setActiveConvId(null); }} className="hidden lg:inline-flex">
          <Send className="w-4 h-4 mr-2" />
          Nouveau message
        </Button>
      </div>

      <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-14rem)]">
        {/* Conversation List */}
        <div className="overflow-y-auto space-y-2 lg:border-r lg:border-[#2A2A2A] lg:pr-4">
          {convos.length === 0 && <p className="text-[#6B7280] text-sm text-center py-8">Aucune conversation</p>}
          {convos.map((conv: typeof convos[0]) => (
            <button
              key={conv.id}
              onClick={() => openConversation(conv.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                activeConvId === conv.id ? 'bg-[#6C3CE1]/10 border-[#6C3CE1]/50' : 'bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#3A3A3A]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-white text-sm truncate pr-2">{getOtherParticipants(conv)}</h3>
                {(conv.unread[uid] || 0) > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#6C3CE1] text-white text-xs flex items-center justify-center flex-shrink-0">{conv.unread[uid]}</span>
                )}
              </div>
              <p className="text-xs text-[#6C3CE1] mb-1 flex items-center gap-1">
                {conv.participants.filter((p: {id: string}) => p.id !== uid).map((p: {id: string}) => isUserOnline(p.id) ? <OnlineBadge key={p.id} /> : <OfflineBadge key={p.id} />)}
                {conv.subject}
              </p>
              {isConversationTyping(conv) ? (
                <p className="text-xs text-[#6C3CE1] truncate flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <span className="typing-dot bg-[#6C3CE1]" />
                    <span className="typing-dot bg-[#6C3CE1]" />
                    <span className="typing-dot bg-[#6C3CE1]" />
                  </span>
                  <span>Écrit...</span>
                </p>
              ) : (
                <p className="text-xs text-[#A0A0A0] truncate">{conv.lastMessage}</p>
              )}
              <p className="text-[10px] text-[#6B7280] mt-1">{formatDateTime(conv.lastMessageAt)}</p>
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 flex flex-col bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] overflow-hidden">
          {showNew ? (
            <div className="flex-1 flex flex-col p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Nouveau message</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Destinataire <span className="text-[#EF4444]">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {recipientOptions.map(r => (
                    <button key={r.id} type="button" onClick={() => setNewRecipientId(r.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${newRecipientId === r.id ? 'border-[#6C3CE1] bg-[#6C3CE1]/10' : 'border-[#2A2A2A] bg-[#111111] hover:border-[#3A3A3A]'}`}>
                      <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C3CE1] to-[#7C4CF1] flex items-center justify-center text-white text-xs font-bold">{r.name.split(' ').map(n=>n[0]).join('')}</div>
                        <span className="absolute -bottom-0.5 -right-0.5">{isUserOnline(r.id) ? <OnlineBadge /> : <OfflineBadge />}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{r.name}</p>
                        <p className="text-[10px] text-[#6B7280] truncate">{r.role === 'CLIENT' ? 'Client' : r.role === 'SUPER_ADMIN' ? 'Super Admin' : r.role === 'PROJECT_MANAGER' ? 'Chef de projet' : r.role === 'SALES_MANAGER' ? 'Commercial' : 'Équipe'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <Input label="Sujet" required placeholder="Sujet du message…" value={newSubject} onChange={e => setNewSubject(e.target.value)} className="mb-4" />
              <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Message <span className="text-[#EF4444]">*</span></label>
              <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Écrivez votre message…" rows={4} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#6C3CE1] resize-none mb-4" />
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
              <div className="p-4 border-b border-[#2A2A2A] bg-[#111111] space-y-3">
                <div>
                  <h3 className="font-semibold text-white">{convos.find((c: typeof convos[0]) => c.id === activeConvId) ? getOtherParticipants(convos.find((c: typeof convos[0]) => c.id === activeConvId)!) : ''}</h3>
                  <p className="text-xs text-[#6B7280]">{convos.find((c: typeof convos[0]) => c.id === activeConvId)?.subject}</p>
                </div>
                <Input
                  placeholder="Rechercher dans la conversation…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#131313]"
                />
                {otherParticipantTyping && (
                  <div className="mt-3 inline-flex items-center gap-3 rounded-2xl bg-[#111111] px-4 py-3 border border-[#2A2A2A]">
                    <div className="flex items-center gap-1">
                      <span className="typing-dot bg-[#6C3CE1]" />
                      <span className="typing-dot bg-[#6C3CE1]" />
                      <span className="typing-dot bg-[#6C3CE1]" />
                    </div>
                    <span className="text-xs text-[#A0A0A0]">{convos.find(c => c.id === activeConvId)?.participants.find(p => p.id !== uid)?.name} écrit...</span>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {visibleMessages.length === 0 ? (
                  <div className="py-12 text-center text-sm text-[#A0A0A0]">Aucun message trouvé pour «{searchTerm}».</div>
                ) : visibleMessages.map(m => (
                  <div key={m.id} className={`flex ${m.senderId === uid ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      m.senderId === uid ? 'bg-[#6C3CE1] text-white' : 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#E0E0E0]'
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
              <div className="p-3 border-t border-[#2A2A2A] flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="relative">
                    <button type="button" onClick={() => setShowEmojiPicker((prev) => !prev)} className="w-10 h-10 rounded-full bg-[#111111] border border-[#2A2A2A] text-[#A0A0A0] hover:text-white transition-all flex items-center justify-center flex-shrink-0">
                      <Smile className="w-5 h-5" />
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute bottom-full left-0 mb-2 w-44 rounded-2xl bg-[#111111] border border-[#2A2A2A] p-2 shadow-xl z-20 grid grid-cols-4 gap-1">
                        {emojiList.map((emoji) => (
                          <button key={emoji} type="button" onClick={() => handleInsertEmoji(emoji)} className="rounded-xl p-2 text-sm hover:bg-[#1F1F1F] transition">
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={handleAttachClick} className="w-10 h-10 rounded-full bg-[#111111] border border-[#2A2A2A] text-[#A0A0A0] hover:text-white transition-all flex items-center justify-center flex-shrink-0">
                    <Paperclip className="w-5 h-5" />
                  </button>
                </div>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Répondre…"
                  className="flex-1 min-w-0 px-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full text-white placeholder-[#6B7280] text-sm focus:outline-none focus:ring-2 focus:ring-[#6C3CE1]"
                />
                <button onClick={handleSend} disabled={!input.trim() && attachmentFiles.length === 0} className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6C3CE1] to-[#7C4CF1] flex items-center justify-center text-white disabled:opacity-50 transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <MessageCircle className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
                <p className="text-[#A0A0A0]">Sélectionnez une conversation pour répondre</p>
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
          className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#6C3CE1] text-white shadow-[0_18px_32px_-20px_rgba(108,60,225,0.9)] transition hover:bg-[#7C4CF1]"
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
  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Newsletter</h1>
          <p className="text-[#A0A0A0]">{mockNewsletterSubscribers.length} abonnés</p>
        </div>
        <Button variant="outline" onClick={() => {
          const csv = 'Email,Prénom,Date\n' + mockNewsletterSubscribers.map(s => `${s.email},${s.firstName || ''},${s.subscribedAt}`).join('\n');
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'newsletter_abonnes.csv';
          a.click();
          URL.revokeObjectURL(url);
          appStore.addToast({ type: 'success', title: 'Export CSV', message: `${mockNewsletterSubscribers.length} abonnés exportés.` });
        }}>
          Exporter CSV
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0A0A0A] border-b border-[#2A2A2A]">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-[#A0A0A0]">Email</th>
                <th className="text-left p-4 text-sm font-medium text-[#A0A0A0]">Prénom</th>
                <th className="text-left p-4 text-sm font-medium text-[#A0A0A0]">Date d'inscription</th>
                <th className="text-left p-4 text-sm font-medium text-[#A0A0A0]">Statut</th>
              </tr>
            </thead>
            <tbody>
              {mockNewsletterSubscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-[#2A2A2A]">
                  <td className="p-4 text-white">{sub.email}</td>
                  <td className="p-4 text-[#A0A0A0]">{sub.firstName || '-'}</td>
                  <td className="p-4 text-[#A0A0A0]">{formatDate(sub.subscribedAt)}</td>
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
      <p className="text-[#A0A0A0] mb-8">Configurez votre site</p>

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
  const request = mockAdminQuoteRequests.find(r => r.id === id);

  if (!request) {
    return <div className="p-6 text-center text-[#A0A0A0]">Demande non trouvée</div>;
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <Link to="/admin/demandes" className="inline-flex items-center gap-2 text-[#6C3CE1] mb-6 hover:underline">
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
            <div><span className="text-[#6B7280]">Nom:</span> <span className="text-white">{request.fullName}</span></div>
            <div><span className="text-[#6B7280]">Email:</span> <span className="text-white">{request.email}</span></div>
            <div><span className="text-[#6B7280]">Téléphone:</span> <span className="text-white">{request.phone}</span></div>
            {request.company && <div><span className="text-[#6B7280]">Entreprise:</span> <span className="text-white">{request.company}</span></div>}
            <div><span className="text-[#6B7280]">Source:</span> <span className="text-white">{request.source}</span></div>
            <div><span className="text-[#6B7280]">Reçu le:</span> <span className="text-white">{formatDateTime(request.createdAt)}</span></div>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-white mb-4">Projet</h3>
          <div className="space-y-2 text-sm">
            <div><span className="text-[#6B7280]">Budget:</span> <span className="text-white">{request.budget}</span></div>
            <div><span className="text-[#6B7280]">Délai:</span> <span className="text-white">{request.deadline}</span></div>
            <div className="pt-2">
              <span className="text-[#6B7280] block mb-2">Services:</span>
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
        <p className="text-[#A0A0A0]">{request.description}</p>
      </Card>

      <div className="flex flex-wrap gap-3 mt-6">
        <Button variant="primary" onClick={() => appStore.addToast({ type: 'success', title: 'Email envoyé', message: `Réponse envoyée à ${request.email}` })}>
          <Send className="w-4 h-4 mr-2" />
          Répondre par email
        </Button>
        <Button variant="outline" onClick={() => appStore.addToast({ type: 'info', title: 'Devis créé', message: 'Redirection vers l\'éditeur de devis…' })}>
          <FileText className="w-4 h-4 mr-2" />
          Créer un devis
        </Button>
        <Button variant="outline" onClick={() => appStore.addToast({ type: 'success', title: 'Statut mis à jour', message: 'Demande marquée comme traitée.' })}>Marquer comme traitée</Button>
      </div>
    </div>
  );
}

export function AdminProjectDetail() {
  const { id } = useParams();
  const project = mockAdminProjects.find(p => p.id === id);

  if (!project) {
    return <div className="p-6 text-center text-[#A0A0A0]">Projet non trouvé</div>;
  }

  const status = getStatusConfig(project.status);

  return (
    <div className="p-6 lg:p-8">
      <Link to="/admin/projets" className="inline-flex items-center gap-2 text-[#6C3CE1] mb-6 hover:underline">
        <ArrowRight className="w-4 h-4 rotate-180" />
        Retour
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
          <p className="text-[#A0A0A0]">{project.clientName} · {project.serviceType}</p>
        </div>
        <Badge variant={status.variant} className="text-sm px-4 py-2">{status.label}</Badge>
      </div>

      <Card className="mb-6">
        <h3 className="font-semibold text-white mb-4">Avancement</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-3 bg-[#2A2A2A] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#6C3CE1] to-[#7C4CF1]"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-lg font-bold text-[#6C3CE1]">{project.progress}%</span>
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-white mb-4">Description</h3>
        <p className="text-[#A0A0A0]">{project.description}</p>
      </Card>
    </div>
  );
}

export function AdminQuoteDetail() {
  const { id } = useParams();
  const quote = mockAdminQuotes.find(q => q.id === id);

  if (!quote) {
    return <div className="p-6 text-center text-[#A0A0A0]">Devis non trouvé</div>;
  }

  return (
    <div className="p-6 lg:p-8">
      <Link to="/admin/devis" className="inline-flex items-center gap-2 text-[#6C3CE1] mb-6 hover:underline">
        <ArrowRight className="w-4 h-4 rotate-180" />
        Retour
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{quote.quoteNumber}</h1>
          <p className="text-[#A0A0A0]">{quote.title} · {quote.clientName}</p>
        </div>
        <Badge variant={getStatusConfig(quote.status).variant} className="text-sm px-4 py-2">
          {getStatusConfig(quote.status).label}
        </Badge>
      </div>

      <Card className="mb-6">
        <div className="text-4xl font-bold text-white mb-2">{formatCurrency(quote.total, quote.currency)}</div>
        <p className="text-[#A0A0A0]">Émis le {formatDate(quote.issuedAt)} · Valide jusqu'au {formatDate(quote.validUntil)}</p>
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
  const invoice = mockAdminInvoices.find(i => i.id === id);

  if (!invoice) {
    return <div className="p-6 text-center text-[#A0A0A0]">Facture non trouvée</div>;
  }

  return (
    <div className="p-6 lg:p-8">
      <Link to="/admin/factures" className="inline-flex items-center gap-2 text-[#6C3CE1] mb-6 hover:underline">
        <ArrowRight className="w-4 h-4 rotate-180" />
        Retour
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{invoice.invoiceNumber}</h1>
          <p className="text-[#A0A0A0]">{invoice.title} · {invoice.clientName}</p>
        </div>
        <Badge variant={getStatusConfig(invoice.status).variant} className="text-sm px-4 py-2">
          {getStatusConfig(invoice.status).label}
        </Badge>
      </div>

      <Card className="mb-6">
        <div className="text-4xl font-bold text-white mb-2">{formatCurrency(invoice.total, invoice.currency)}</div>
        <p className="text-[#A0A0A0]">Payé: {formatCurrency(invoice.amountPaid, invoice.currency)}</p>
        <p className="text-[#EF4444]">Reste dû: {formatCurrency(invoice.amountDue, invoice.currency)}</p>
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
  const [selectedMember, setSelectedMember] = useState<typeof mockTeamMembers[0] | null>(null);
  const [search, setSearch] = useState('');

  const canManageTeam = hasPermission('team.create') || hasPermission('team.edit') || hasPermission('team.delete');
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const filteredMembers = mockTeamMembers.filter(m => 
    m.firstName.toLowerCase().includes(search.toLowerCase()) ||
    m.lastName.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      SUPER_ADMIN: 'bg-gradient-to-r from-[#EF4444] to-[#F59E0B] text-white',
      ADMIN: 'bg-[#6C3CE1] text-white',
      PROJECT_MANAGER: 'bg-[#3B82F6] text-white',
      SALES_MANAGER: 'bg-[#10B981] text-white',
      CONTENT_MANAGER: 'bg-[#F59E0B] text-white',
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
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[role] || 'bg-[#2A2A2A] text-white'}`}>
        {labels[role] || role}
      </span>
    );
  };

  const handleEdit = (member: typeof mockTeamMembers[0]) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Équipe</h1>
          <p className="text-[#A0A0A0]">
            {mockTeamMembers.filter(m => m.isActive).length} membres actifs · 
            {mockTeamMembers.filter(m => !m.isActive).length} inactifs
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
            <span className="text-xs text-[#6B7280]">Accès total</span>
          </div>
          <div className="flex items-center gap-2">
            {getRoleBadge('ADMIN')}
            <span className="text-xs text-[#6B7280]">Gestion complète</span>
          </div>
          <div className="flex items-center gap-2">
            {getRoleBadge('PROJECT_MANAGER')}
            <span className="text-xs text-[#6B7280]">Projets & clients</span>
          </div>
          <div className="flex items-center gap-2">
            {getRoleBadge('SALES_MANAGER')}
            <span className="text-xs text-[#6B7280]">Devis & factures</span>
          </div>
          <div className="flex items-center gap-2">
            {getRoleBadge('CONTENT_MANAGER')}
            <span className="text-xs text-[#6B7280]">Contenu & blog</span>
          </div>
          <div className="flex items-center gap-2">
            {getRoleBadge('SUPPORT')}
            <span className="text-xs text-[#6B7280]">Messages & support</span>
          </div>
        </div>
      </Card>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
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
                  ? 'bg-gradient-to-br from-[#EF4444] to-[#F59E0B]' 
                  : 'bg-gradient-to-br from-[#6C3CE1] to-[#7C4CF1]'
              }`}>
                {member.firstName[0]}{member.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">
                  {member.firstName} {member.lastName}
                </h3>
                <p className="text-sm text-[#A0A0A0] truncate">{member.email}</p>
                <div className="mt-2">
                  {getRoleBadge(member.role)}
                </div>
              </div>
            </div>

            <p className="text-sm text-[#6B7280] mb-3">{member.description}</p>

            <div className="mb-4">
              <p className="text-xs text-[#6B7280] mb-2">Tâches assignées :</p>
              <div className="flex flex-wrap gap-1">
                {member.tasksAssigned.map((task, i) => (
                  <span key={i} className="px-2 py-0.5 bg-[#2A2A2A] rounded text-xs text-[#A0A0A0]">
                    {task}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-xs text-[#6B7280] mb-4 pt-3 border-t border-[#2A2A2A]">
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
                  <button className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {member.role === 'SUPER_ADMIN' && member.id !== user?.id && (
              <p className="text-xs text-center text-[#6B7280] italic">
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
            className="w-full max-w-lg bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] overflow-hidden"
          >
            <div className="p-6 border-b border-[#2A2A2A]">
              <h2 className="text-xl font-bold text-white">Ajouter un membre</h2>
              <p className="text-sm text-[#A0A0A0]">Inviter un nouveau membre dans l'équipe</p>
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
                <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                  Tâches assignées
                </label>
                <Input placeholder="Ex: Gestion des projets, Suivi clients..." />
                <p className="text-xs text-[#6B7280] mt-1">Séparez les tâches par des virgules</p>
              </div>
              <div className="p-4 bg-[#0A0A0A] rounded-lg border border-[#2A2A2A]">
                <h4 className="text-sm font-medium text-white mb-2">📧 Invitation par email</h4>
                <p className="text-xs text-[#6B7280]">
                  Un email sera envoyé au nouveau membre avec un lien pour définir son mot de passe 
                  et accéder à l'espace d'administration.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-[#2A2A2A] flex justify-end gap-3">
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
            className="w-full max-w-lg bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] overflow-hidden"
          >
            <div className="p-6 border-b border-[#2A2A2A]">
              <h2 className="text-xl font-bold text-white">Modifier le membre</h2>
              <p className="text-sm text-[#A0A0A0]">
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
                <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                  Tâches assignées
                </label>
                <Input defaultValue={selectedMember.tasksAssigned.join(', ')} />
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-[#0A0A0A] rounded-lg border border-[#2A2A2A]">
                <input 
                  type="checkbox" 
                  defaultChecked={selectedMember.isActive}
                  className="w-4 h-4 rounded border-[#2A2A2A] bg-[#1A1A1A] text-[#6C3CE1] focus:ring-[#6C3CE1]"
                />
                <div>
                  <p className="text-sm font-medium text-white">Compte actif</p>
                  <p className="text-xs text-[#6B7280]">
                    Désactiver le compte empêche la connexion mais conserve les données
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#2A2A2A] flex justify-between">
              <Button variant="ghost" className="text-[#EF4444]" onClick={() => appStore.addToast({ type: 'info', title: 'Email envoyé', message: 'Un lien de réinitialisation a été envoyé.' })}>
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
      <p className="text-[#A0A0A0] mb-8">Vue d'ensemble des permissions par rôle</p>

      <Card className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#0A0A0A]">
            <tr>
              <th className="text-left p-4 text-[#A0A0A0] font-medium border-b border-[#2A2A2A]">Permission</th>
              {roles.map(role => (
                <th key={role} className="text-center p-4 text-[#A0A0A0] font-medium border-b border-[#2A2A2A]">
                  {ROLE_LABELS[role as UserRole]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((cat) => (
              <>
                <tr key={cat.category} className="bg-[#1A1A1A]">
                  <td colSpan={7} className="p-3 font-semibold text-white border-b border-[#2A2A2A]">
                    {cat.category}
                  </td>
                </tr>
                {cat.perms.map(perm => (
                  <tr key={perm} className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]">
                    <td className="p-3 text-[#A0A0A0]">{perm}</td>
                    {roles.map(role => (
                      <td key={role} className="text-center p-3">
                        {/* Simplified check - in real app would use ROLE_PERMISSIONS */}
                        {role === 'SUPER_ADMIN' || (role === 'ADMIN' && !perm.includes('team.create')) ? (
                          <CheckCircle className="w-5 h-5 text-[#10B981] mx-auto" />
                        ) : perm.includes('view') ? (
                          <CheckCircle className="w-5 h-5 text-[#10B981] mx-auto" />
                        ) : (
                          <span className="text-[#6B7280]">—</span>
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
