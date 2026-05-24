import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Logo } from '../Logo';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Ressources', href: '/ressources' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardLink = isAdmin ? '/admin/dashboard' : '/client/dashboard';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 backdrop-blur-md',
        isScrolled
          ? 'bg-surface/95 border-b border-border'
          : 'bg-surface/90'
      )}
    >
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo containerClassName="flex items-center" logoClassName="h-10 w-auto sm:h-12" />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'text-sm font-medium transition-colors duration-200',
                  location.pathname === link.href
                    ? 'text-brand'
                    : 'text-text-secondary hover:text-brand'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-alt transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white text-sm font-semibold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <span className="text-sm text-text-primary">{user?.firstName}</span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-surface-alt border border-border rounded-3xl shadow-card overflow-hidden"
                    >
                      <div className="p-3 border-b border-border">
                        <p className="text-sm font-medium text-text-primary">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-text-muted">{user?.email}</p>
                      </div>
                      <Link
                        to={dashboardLink}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Mon espace
                      </Link>
                      <Link
                        to={isAdmin ? '/admin/parametres' : '/client/profil'}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
                      >
                        <User className="w-4 h-4" />
                        {isAdmin ? 'Paramètres' : 'Mon profil'}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-error hover:bg-surface transition-colors border-t border-border"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/auth/connexion" className="text-sm text-text-secondary hover:text-brand transition-colors">
                  Connexion
                </Link>
                <Link to="/devis">
                  <Button variant="primary" size="sm">
                    Demander un devis
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-surface-alt border-t border-border overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'block py-2 text-lg font-medium transition-colors',
                    location.pathname === link.href
                      ? 'text-brand'
                      : 'text-text-secondary hover:text-brand'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link to={dashboardLink} className="block py-2 text-lg font-medium text-text-secondary hover:text-brand">
                      Mon espace
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-2 text-lg font-medium text-error hover:text-error/80"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth/connexion" className="block py-2 text-lg font-medium text-text-secondary hover:text-brand">
                      Connexion
                    </Link>
                    <Link to="/devis" className="block">
                      <Button variant="primary" className="w-full">
                        Demander un devis
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
