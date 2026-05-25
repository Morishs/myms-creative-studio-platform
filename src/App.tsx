import { useEffect, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Chatbot } from './components/Chatbot';
import { ToastContainer } from './components/ui/Toast';

// Public pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services, ServiceDetail } from './pages/Services';
import { Portfolio, PortfolioDetail } from './pages/Portfolio';
import { Resources, ResourceDetail } from './pages/Resources';
import { Blog, BlogDetail } from './pages/Blog';
import { Process } from './pages/Process';
import { Testimonials } from './pages/Testimonials';
import { FAQ } from './pages/FAQ';
import { Quote } from './pages/Quote';
import { Contact } from './pages/Contact';
import { LegalNotice, PrivacyPolicy, TermsOfSale } from './pages/Legal';

// Auth pages
import { Login, Register, ForgotPassword } from './pages/auth/Auth';

// Client pages
import { 
  ClientLayout, ClientDashboard, ClientProjects, ClientProjectDetail,
  ClientQuotes, ClientQuoteDetail, ClientInvoices, ClientInvoiceDetail,
  ClientFiles, ClientPurchases, ClientMessages, ClientProfile
} from './pages/client';

// Admin pages
import {
  AdminLayout, AdminDashboard, AdminClients, AdminQuoteRequests, AdminQuoteRequestDetail,
  AdminQuotes, AdminQuoteCreate, AdminQuoteDetail, AdminInvoices, AdminInvoiceDetail,
  AdminProjects, AdminProjectCreate, AdminProjectDetail, AdminPortfolio, AdminServices, AdminResources,
  AdminBlog, AdminTestimonials, AdminMessages, AdminNewsletter, AdminSettings,
  AdminTeam, AdminTeamPermissions
} from './pages/admin';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-text-primary">
      <Header />
      <main>{children}</main>
      <Footer />
      <Chatbot />
    </div>
  );
}

function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-surface text-text-primary">{children}</div>;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastContainer />
        <Router>
          <ScrollToTop />
          <Routes>
          {/* Auth routes (no header/footer) */}
          <Route path="/auth/connexion" element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="/auth/inscription" element={<AuthLayout><Register /></AuthLayout>} />
          <Route path="/auth/mot-de-passe-oublie" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
          
          {/* Client routes (with sidebar layout) */}
          <Route path="/client" element={<ClientLayout><ClientDashboard /></ClientLayout>} />
          <Route path="/client/dashboard" element={<ClientLayout><ClientDashboard /></ClientLayout>} />
          <Route path="/client/projets" element={<ClientLayout><ClientProjects /></ClientLayout>} />
          <Route path="/client/projets/:id" element={<ClientLayout><ClientProjectDetail /></ClientLayout>} />
          <Route path="/client/devis" element={<ClientLayout><ClientQuotes /></ClientLayout>} />
          <Route path="/client/devis/:id" element={<ClientLayout><ClientQuoteDetail /></ClientLayout>} />
          <Route path="/client/factures" element={<ClientLayout><ClientInvoices /></ClientLayout>} />
          <Route path="/client/factures/:id" element={<ClientLayout><ClientInvoiceDetail /></ClientLayout>} />
          <Route path="/client/fichiers" element={<ClientLayout><ClientFiles /></ClientLayout>} />
          <Route path="/client/achats" element={<ClientLayout><ClientPurchases /></ClientLayout>} />
          <Route path="/client/messages" element={<ClientLayout><ClientMessages /></ClientLayout>} />
          <Route path="/client/profil" element={<ClientLayout><ClientProfile /></ClientLayout>} />

          {/* Admin routes (with sidebar layout) */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/clients" element={<AdminLayout><AdminClients /></AdminLayout>} />
          <Route path="/admin/demandes" element={<AdminLayout><AdminQuoteRequests /></AdminLayout>} />
          <Route path="/admin/demandes/:id" element={<AdminLayout><AdminQuoteRequestDetail /></AdminLayout>} />
          <Route path="/admin/devis" element={<AdminLayout><AdminQuotes /></AdminLayout>} />
          <Route path="/admin/devis/nouveau" element={<AdminLayout><AdminQuoteCreate /></AdminLayout>} />
          <Route path="/admin/devis/:id" element={<AdminLayout><AdminQuoteDetail /></AdminLayout>} />
          <Route path="/admin/factures" element={<AdminLayout><AdminInvoices /></AdminLayout>} />
          <Route path="/admin/factures/:id" element={<AdminLayout><AdminInvoiceDetail /></AdminLayout>} />
          <Route path="/admin/projets" element={<AdminLayout><AdminProjects /></AdminLayout>} />
          <Route path="/admin/projets/nouveau" element={<AdminLayout><AdminProjectCreate /></AdminLayout>} />
          <Route path="/admin/projets/:id" element={<AdminLayout><AdminProjectDetail /></AdminLayout>} />
          <Route path="/admin/portfolio" element={<AdminLayout><AdminPortfolio /></AdminLayout>} />
          <Route path="/admin/services" element={<AdminLayout><AdminServices /></AdminLayout>} />
          <Route path="/admin/ressources" element={<AdminLayout><AdminResources /></AdminLayout>} />
          <Route path="/admin/blog" element={<AdminLayout><AdminBlog /></AdminLayout>} />
          <Route path="/admin/temoignages" element={<AdminLayout><AdminTestimonials /></AdminLayout>} />
          <Route path="/admin/messages" element={<AdminLayout><AdminMessages /></AdminLayout>} />
          <Route path="/admin/newsletter" element={<AdminLayout><AdminNewsletter /></AdminLayout>} />
          <Route path="/admin/equipe" element={<AdminLayout><AdminTeam /></AdminLayout>} />
          <Route path="/admin/equipe/permissions" element={<AdminLayout><AdminTeamPermissions /></AdminLayout>} />
          <Route path="/admin/parametres" element={<AdminLayout><AdminSettings /></AdminLayout>} />

          {/* Public routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/a-propos" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/services/:slug" element={<PublicLayout><ServiceDetail /></PublicLayout>} />
          <Route path="/portfolio" element={<PublicLayout><Portfolio /></PublicLayout>} />
          <Route path="/portfolio/:slug" element={<PublicLayout><PortfolioDetail /></PublicLayout>} />
          <Route path="/ressources" element={<PublicLayout><Resources /></PublicLayout>} />
          <Route path="/ressources/:slug" element={<PublicLayout><ResourceDetail /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/blog/:slug" element={<PublicLayout><BlogDetail /></PublicLayout>} />
          <Route path="/processus" element={<PublicLayout><Process /></PublicLayout>} />
          <Route path="/temoignages" element={<PublicLayout><Testimonials /></PublicLayout>} />
          <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
          <Route path="/devis" element={<PublicLayout><Quote /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/mentions-legales" element={<PublicLayout><LegalNotice /></PublicLayout>} />
          <Route path="/politique-de-confidentialite" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
          <Route path="/conditions-generales-de-vente" element={<PublicLayout><TermsOfSale /></PublicLayout>} />

          {/* 404 */}
          <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  </ThemeProvider>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-surface">
      <div className="text-center px-6">
        <h1 className="text-8xl font-bold text-brand mb-4">404</h1>
        <h2 className="text-3xl font-bold text-text-primary mb-4">Page non trouvée</h2>
        <p className="text-text-secondary mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-brand to-accent text-white font-medium rounded-lg hover:from-brand-light hover:to-accent-light transition-all"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}
