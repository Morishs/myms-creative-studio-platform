import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { registerKnownUser } from '../stores/messageStore';
import { addClient, isEmailRegistered } from '../stores/clientStore';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'PROJECT_MANAGER' | 'SALES_MANAGER' | 'CONTENT_MANAGER' | 'SUPPORT' | 'CLIENT';
export type AccountType = 'INDIVIDUAL' | 'COMPANY';

// Permissions système
export type Permission = 
  | 'dashboard.view'
  | 'clients.view' | 'clients.create' | 'clients.edit' | 'clients.delete'
  | 'projects.view' | 'projects.create' | 'projects.edit' | 'projects.delete'
  | 'quotes.view' | 'quotes.create' | 'quotes.edit' | 'quotes.delete' | 'quotes.send'
  | 'invoices.view' | 'invoices.create' | 'invoices.edit' | 'invoices.delete' | 'invoices.send'
  | 'quote_requests.view' | 'quote_requests.respond' | 'quote_requests.convert'
  | 'portfolio.view' | 'portfolio.create' | 'portfolio.edit' | 'portfolio.delete'
  | 'services.view' | 'services.create' | 'services.edit' | 'services.delete'
  | 'resources.view' | 'resources.create' | 'resources.edit' | 'resources.delete'
  | 'blog.view' | 'blog.create' | 'blog.edit' | 'blog.delete'
  | 'testimonials.view' | 'testimonials.create' | 'testimonials.edit' | 'testimonials.delete'
  | 'messages.view' | 'messages.respond' | 'messages.archive'
  | 'newsletter.view' | 'newsletter.export'
  | 'team.view' | 'team.create' | 'team.edit' | 'team.delete'
  | 'settings.view' | 'settings.edit';

// Définition des rôles avec leurs permissions
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'dashboard.view',
    'clients.view', 'clients.create', 'clients.edit', 'clients.delete',
    'projects.view', 'projects.create', 'projects.edit', 'projects.delete',
    'quotes.view', 'quotes.create', 'quotes.edit', 'quotes.delete', 'quotes.send',
    'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.delete', 'invoices.send',
    'quote_requests.view', 'quote_requests.respond', 'quote_requests.convert',
    'portfolio.view', 'portfolio.create', 'portfolio.edit', 'portfolio.delete',
    'services.view', 'services.create', 'services.edit', 'services.delete',
    'resources.view', 'resources.create', 'resources.edit', 'resources.delete',
    'blog.view', 'blog.create', 'blog.edit', 'blog.delete',
    'testimonials.view', 'testimonials.create', 'testimonials.edit', 'testimonials.delete',
    'messages.view', 'messages.respond', 'messages.archive',
    'newsletter.view', 'newsletter.export',
    'team.view', 'team.create', 'team.edit', 'team.delete',
    'settings.view', 'settings.edit'
  ],
  ADMIN: [
    'dashboard.view',
    'clients.view', 'clients.create', 'clients.edit',
    'projects.view', 'projects.create', 'projects.edit', 'projects.delete',
    'quotes.view', 'quotes.create', 'quotes.edit', 'quotes.delete', 'quotes.send',
    'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.delete', 'invoices.send',
    'quote_requests.view', 'quote_requests.respond', 'quote_requests.convert',
    'portfolio.view', 'portfolio.create', 'portfolio.edit', 'portfolio.delete',
    'services.view', 'services.create', 'services.edit', 'services.delete',
    'resources.view', 'resources.create', 'resources.edit', 'resources.delete',
    'blog.view', 'blog.create', 'blog.edit', 'blog.delete',
    'testimonials.view', 'testimonials.create', 'testimonials.edit', 'testimonials.delete',
    'messages.view', 'messages.respond', 'messages.archive',
    'newsletter.view', 'newsletter.export',
    'team.view',
    'settings.view'
  ],
  PROJECT_MANAGER: [
    'dashboard.view',
    'clients.view', 'clients.create', 'clients.edit',
    'projects.view', 'projects.create', 'projects.edit',
    'quotes.view',
    'invoices.view',
    'quote_requests.view', 'quote_requests.respond',
    'messages.view', 'messages.respond'
  ],
  SALES_MANAGER: [
    'dashboard.view',
    'clients.view', 'clients.create', 'clients.edit',
    'projects.view',
    'quotes.view', 'quotes.create', 'quotes.edit', 'quotes.send',
    'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.send',
    'quote_requests.view', 'quote_requests.respond', 'quote_requests.convert',
    'messages.view', 'messages.respond'
  ],
  CONTENT_MANAGER: [
    'dashboard.view',
    'portfolio.view', 'portfolio.create', 'portfolio.edit', 'portfolio.delete',
    'services.view', 'services.edit',
    'resources.view', 'resources.create', 'resources.edit', 'resources.delete',
    'blog.view', 'blog.create', 'blog.edit', 'blog.delete',
    'testimonials.view', 'testimonials.create', 'testimonials.edit'
  ],
  SUPPORT: [
    'dashboard.view',
    'clients.view',
    'projects.view',
    'quote_requests.view', 'quote_requests.respond',
    'messages.view', 'messages.respond', 'messages.archive'
  ],
  CLIENT: []
};

// Labels des rôles
export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Administrateur',
  ADMIN: 'Administrateur',
  PROJECT_MANAGER: 'Chef de projet',
  SALES_MANAGER: 'Responsable commercial',
  CONTENT_MANAGER: 'Gestionnaire de contenu',
  SUPPORT: 'Support client',
  CLIENT: 'Client'
};

// Couleurs des badges par rôle
export const ROLE_COLORS: Record<UserRole, string> = {
  SUPER_ADMIN: 'bg-gradient-to-r from-[#EF4444] to-[#F59E0B] text-white',
  ADMIN: 'bg-[#6C3CE1] text-white',
  PROJECT_MANAGER: 'bg-[#3B82F6] text-white',
  SALES_MANAGER: 'bg-[#10B981] text-white',
  CONTENT_MANAGER: 'bg-[#F59E0B] text-white',
  SUPPORT: 'bg-[#6B7280] text-white',
  CLIENT: 'bg-[#2A2A2A] text-white'
};

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  company?: string;
  role: UserRole;
  avatar?: string;
  accountType?: AccountType;
  projectsCount?: number;
  messagesCount?: number;
  quotesCount?: number;
  notificationsCount?: number;
  invoicesCount?: number;
  devisCount?: number;
  totalSpent?: number;
  joinedAt?: string;
  isActive?: boolean;
  // Company specific fields
  companyName?: string;
  companySector?: string;
  companyRegistration?: string; // SIRET, RCCM, etc.
  companyAddress?: string;
  companyCity?: string;
  companyCountry?: string;
  position?: string; // Position in company
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  accountType: AccountType;
  // Individual specific
  company?: string; // Optional for individuals
  // Company specific
  companyName?: string;
  companySector?: string;
  companyRegistration?: string;
  companyAddress?: string;
  companyCity?: string;
  companyCountry?: string;
  position?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo accounts
const DEMO_ACCOUNTS: Record<string, { password: string; user: User }> = {
  'admin@myms.com': {
    password: 'admin123',
    user: {
      id: 'admin-1',
      email: 'admin@myms.com',
      firstName: 'Admin',
      lastName: 'Myms',
      role: 'SUPER_ADMIN',
      company: 'Myms Studio',
      phone: '+221 77 000 00 00'
    }
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('myms_user');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch (e) {
      localStorage.removeItem('myms_user');
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, _role?: UserRole): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800)); // Simulate API call
    const emailLower = email.toLowerCase().trim();
    
    // Check demo accounts — email + password must match exactly
    const demo = DEMO_ACCOUNTS[emailLower];
    if (demo) {
      if (demo.password === password) {
        setUser(demo.user);
        localStorage.setItem('myms_user', JSON.stringify(demo.user));
        // Ensure demo user is in messaging directory
        registerKnownUser({
          id: demo.user.id,
          name: `${demo.user.firstName} ${demo.user.lastName}`.trim(),
          email: demo.user.email,
          role: demo.user.role
        });
        return true;
      }
      // Demo account exists but wrong password → reject
      return false;
    }
    
    // For non-demo emails: check registered users in localStorage
    const registeredUsers: User[] = JSON.parse(localStorage.getItem('myms_registered_users') || '[]');
    const found = registeredUsers.find(u => u.email === emailLower);
    if (found) {
      // Check password from stored passwords
      const passwords: Record<string, string> = JSON.parse(localStorage.getItem('myms_user_passwords') || '{}');
      if (passwords[emailLower] === password) {
        setUser(found);
        localStorage.setItem('myms_user', JSON.stringify(found));
        // Ensure user is in messaging directory
        registerKnownUser({
          id: found.id,
          name: `${found.firstName} ${found.lastName}`.trim(),
          email: found.email,
          role: found.role
        });
        return true;
      }
      // Registered user but wrong password → reject
      return false;
    }
    
    // Email not found at all → reject
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800));
    const emailLower = data.email.toLowerCase().trim();
    
    // Check if email already taken (demo accounts or persistent storage)
    if (DEMO_ACCOUNTS[emailLower] || isEmailRegistered(emailLower)) {
      return false;
    }
    
    const newUser: User = {
      id: `client-${Date.now()}`,
      email: emailLower,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      company: data.company,
      role: 'CLIENT',
      accountType: data.accountType || 'INDIVIDUAL',
      companyName: data.companyName,
      companySector: data.companySector,
      companyRegistration: data.companyRegistration,
      companyAddress: data.companyAddress,
      companyCity: data.companyCity,
      companyCountry: data.companyCountry,
      position: data.position,
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
    
    const added = addClient(newUser, data.password);
    if (!added) {
      return false;
    }

    // Log in the new user
    setUser(newUser);
    localStorage.setItem('myms_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('myms_user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('myms_user', JSON.stringify(updated));
  };

  const isAdmin = !!user && ['SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'SALES_MANAGER', 'CONTENT_MANAGER', 'SUPPORT'].includes(user.role);

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(p => hasPermission(p));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      hasPermission,
      hasAnyPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
