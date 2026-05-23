// Mock data for client & admin dashboards

export const mockClientProjects = [
  {
    id: 'p1',
    name: 'Création de logo - Café Lumière',
    serviceType: 'Identité visuelle',
    status: 'IN_PROGRESS',
    progress: 65,
    startDate: '2024-01-15',
    estimatedEndDate: '2024-02-15',
    description: 'Création d\'une identité visuelle complète pour un café artisanal.'
  },
  {
    id: 'p2',
    name: 'Visuels réseaux sociaux - Q1',
    serviceType: 'Design digital',
    status: 'DELIVERED',
    progress: 100,
    startDate: '2024-01-01',
    estimatedEndDate: '2024-01-31',
    description: 'Pack de 20 visuels pour réseaux sociaux pour le premier trimestre.'
  },
  {
    id: 'p3',
    name: 'Brochure catalogue produits',
    serviceType: 'Design graphique',
    status: 'AWAITING_APPROVAL',
    progress: 90,
    startDate: '2024-02-01',
    estimatedEndDate: '2024-02-28',
    description: 'Création d\'une brochure catalogue 16 pages pour les produits.'
  }
];

export const mockClientQuotes = [
  {
    id: 'q1',
    quoteNumber: 'MYMS-DEV-2024-001',
    title: 'Identité visuelle Café Lumière',
    total: 250000,
    currency: 'USD',
    status: 'ACCEPTED',
    issuedAt: '2024-01-10',
    validUntil: '2024-02-10'
  },
  {
    id: 'q2',
    quoteNumber: 'MYMS-DEV-2024-005',
    title: 'Pack visuels réseaux sociaux - Q2',
    total: 180000,
    currency: 'USD',
    status: 'SENT',
    issuedAt: '2024-03-15',
    validUntil: '2024-04-15'
  },
  {
    id: 'q3',
    quoteNumber: 'MYMS-DEV-2024-008',
    title: 'Refonte site web',
    total: 450000,
    currency: 'USD',
    status: 'DRAFT',
    issuedAt: '2024-03-20',
    validUntil: '2024-04-20'
  }
];

export const mockClientInvoices = [
  {
    id: 'i1',
    invoiceNumber: 'MYMS-FAC-2024-001',
    title: 'Acompte - Identité visuelle',
    total: 125000,
    amountPaid: 125000,
    amountDue: 0,
    currency: 'USD',
    status: 'PAID',
    issuedAt: '2024-01-12',
    dueDate: '2024-01-25'
  },
  {
    id: 'i2',
    invoiceNumber: 'MYMS-FAC-2024-004',
    title: 'Solde - Visuels réseaux sociaux',
    total: 90000,
    amountPaid: 0,
    amountDue: 90000,
    currency: 'USD',
    status: 'SENT',
    issuedAt: '2024-02-01',
    dueDate: '2024-02-15'
  },
  {
    id: 'i3',
    invoiceNumber: 'MYMS-FAC-2024-007',
    title: 'Brochure catalogue - Acompte',
    total: 100000,
    amountPaid: 0,
    amountDue: 100000,
    currency: 'USD',
    status: 'PARTIALLY_PAID',
    issuedAt: '2024-02-10',
    dueDate: '2024-02-20'
  }
];

export const mockClientFiles = [
  {
    id: 'f1',
    fileName: 'Logo_Final.png',
    fileType: 'image/png',
    fileSize: 2450000,
    category: 'FINAL_DELIVERY',
    createdAt: '2024-02-15',
    project: 'Création de logo - Café Lumière'
  },
  {
    id: 'f2',
    fileName: 'Logo_Final.svg',
    fileType: 'image/svg+xml',
    fileSize: 45000,
    category: 'FINAL_DELIVERY',
    createdAt: '2024-02-15',
    project: 'Création de logo - Café Lumière'
  },
  {
    id: 'f3',
    fileName: 'Charte_Graphique.pdf',
    fileType: 'application/pdf',
    fileSize: 8500000,
    category: 'FINAL_DELIVERY',
    createdAt: '2024-02-18',
    project: 'Création de logo - Café Lumière'
  },
  {
    id: 'f4',
    fileName: 'Visuels_Instagram_Pack.zip',
    fileType: 'application/zip',
    fileSize: 15000000,
    category: 'FINAL_DELIVERY',
    createdAt: '2024-01-30',
    project: 'Visuels réseaux sociaux - Q1'
  }
];

export const mockClientMessages = [
  {
    id: 'm1',
    subject: 'Validation de la première proposition',
    content: 'Bonjour Sophie, j\'espère que vous allez bien. J\'ai bien reçu votre première proposition et je suis ravi du résultat. J\'aimerais juste ajuster quelques détails concernant la palette de couleurs.',
    sender: 'Myms Studio',
    isRead: true,
    createdAt: '2024-03-18T10:30:00',
    project: 'Création de logo - Café Lumière'
  },
  {
    id: 'm2',
    subject: 'Ré: Validation de la première proposition',
    content: 'Bien sûr ! Pouvez-vous me préciser quelles couleurs vous aimeriez modifier ? Je vous envoie une version révisée d\'ici demain.',
    sender: 'Myms Studio',
    isRead: true,
    createdAt: '2024-03-18T11:15:00',
    project: 'Création de logo - Café Lumière'
  },
  {
    id: 'm3',
    subject: 'Livraison des fichiers finaux',
    content: 'Les fichiers finaux sont prêts ! Vous pouvez les télécharger depuis votre espace client. N\'hésitez pas si vous avez la moindre question.',
    sender: 'Myms Studio',
    isRead: false,
    createdAt: '2024-03-20T14:45:00',
    project: 'Création de logo - Café Lumière'
  }
];

export const mockClientPurchases = [
  {
    id: 'pur1',
    resourceTitle: 'Pack Instagram Stories - Minimaliste',
    amount: 15000,
    currency: 'USD',
    purchasedAt: '2024-02-20',
    downloads: 3
  },
  {
    id: 'pur2',
    resourceTitle: 'Kit Branding Complet',
    amount: 35000,
    currency: 'USD',
    purchasedAt: '2024-01-15',
    downloads: 5
  }
];

// ===== ADMIN MOCK DATA =====
export const mockAdminStats = {
  totalRevenue: 4850000,
  monthlyRevenue: 1250000,
  activeProjects: 8,
  pendingQuotes: 5,
  unpaidInvoices: 3,
  totalClients: 42,
  newClientsThisMonth: 6,
  pendingQuoteRequests: 4,
  totalResources: 24,
  newsletterSubscribers: 1240
};

export const mockAdminClients = [
  {
    id: 'c1',
    firstName: 'Sophie',
    lastName: 'Martin',
    email: 'client@demo.com',
    company: 'Café Lumière',
    phone: '+221 77 123 45 67',
    projectsCount: 3,
    totalSpent: 430000,
    joinedAt: '2023-06-15',
    isActive: true
  },
  {
    id: 'c2',
    firstName: 'Marc',
    lastName: 'Dubois',
    email: 'marc@ecovert.com',
    company: 'EcoVert',
    phone: '+221 77 234 56 78',
    projectsCount: 2,
    totalSpent: 280000,
    joinedAt: '2023-09-22',
    isActive: true
  },
  {
    id: 'c3',
    firstName: 'Aminata',
    lastName: 'Koné',
    email: 'aminata@biodelices.sn',
    company: 'Bio Délices',
    phone: '+221 77 345 67 89',
    projectsCount: 1,
    totalSpent: 180000,
    joinedAt: '2024-01-10',
    isActive: true
  },
  {
    id: 'c4',
    firstName: 'Thomas',
    lastName: 'Leroy',
    email: 'thomas@fitnesspro.com',
    company: 'Fitness Pro',
    phone: '+221 77 456 78 90',
    projectsCount: 1,
    totalSpent: 150000,
    joinedAt: '2024-02-05',
    isActive: true
  }
];

export const mockAdminQuoteRequests = [
  {
    id: 'qr1',
    fullName: 'Julie Bernard',
    email: 'julie@startup.com',
    phone: '+221 77 567 89 01',
    company: 'TechStartup',
    services: ['Logo', 'Identité visuelle complète'],
    description: 'Nous lançons une startup tech et avons besoin d\'une identité visuelle complète. Notre marque cible les jeunes entrepreneurs africains.',
    budget: '150 000 — 300 000 FCFA',
    deadline: '1 mois',
    source: 'Recherche Google',
    status: 'NEW',
    createdAt: '2024-03-19T09:30:00'
  },
  {
    id: 'qr2',
    fullName: 'Karim Diallo',
    email: 'karim@restaurant.sn',
    phone: '+221 77 678 90 12',
    company: 'Restaurant Le Dakar',
    services: ['Menu', 'Flyer / Affiche', 'Visuels réseaux sociaux'],
    description: 'Restaurant traditionnel ouvrant prochainement. Besoin de menu, flyers et visuels pour l\'ouverture.',
    budget: '50 000 — 150 000 FCFA',
    deadline: '2 semaines',
    source: 'Recommandation',
    status: 'NEW',
    createdAt: '2024-03-18T16:45:00'
  },
  {
    id: 'qr3',
    fullName: 'Marie Ndiaye',
    email: 'marie@boutique.com',
    phone: '+221 77 789 01 23',
    company: 'Boutique Marie',
    services: ['Community Management'],
    description: 'Boutique de mode en ligne. Recherche community manager pour Instagram et Facebook.',
    budget: '150 000 — 300 000 FCFA',
    deadline: 'Pas de deadline précise',
    source: 'Réseaux sociaux',
    status: 'READ',
    createdAt: '2024-03-17T11:20:00'
  }
];

export const mockAdminProjects = [
  ...mockClientProjects.map(p => ({
    ...p,
    clientName: 'Sophie Martin',
    clientEmail: 'client@demo.com'
  })),
  {
    id: 'p4',
    name: 'Logo EcoVert',
    serviceType: 'Logo',
    status: 'BRIEFING',
    progress: 15,
    startDate: '2024-03-15',
    estimatedEndDate: '2024-04-05',
    description: 'Création de logo pour marque éco-responsable.',
    clientName: 'Marc Dubois',
    clientEmail: 'marc@ecovert.com'
  },
  {
    id: 'p5',
    name: 'Packaging Bio Délices',
    serviceType: 'Packaging',
    status: 'REVISION',
    progress: 75,
    startDate: '2024-02-20',
    estimatedEndDate: '2024-03-30',
    description: 'Design de packaging pour gamme de produits bio.',
    clientName: 'Aminata Koné',
    clientEmail: 'aminata@biodelices.sn'
  }
];

export const mockAdminQuotes = [
  ...mockClientQuotes.map(q => ({ ...q, clientName: 'Sophie Martin' })),
  {
    id: 'q4',
    quoteNumber: 'MYMS-DEV-2024-006',
    title: 'Logo EcoVert',
    total: 180000,
    currency: 'USD',
    status: 'SENT',
    issuedAt: '2024-03-16',
    validUntil: '2024-04-16',
    clientName: 'Marc Dubois'
  },
  {
    id: 'q5',
    quoteNumber: 'MYMS-DEV-2024-007',
    title: 'Packaging produits bio',
    total: 320000,
    currency: 'USD',
    status: 'ACCEPTED',
    issuedAt: '2024-02-15',
    validUntil: '2024-03-15',
    clientName: 'Aminata Koné'
  }
];

export const mockAdminInvoices = [
  ...mockClientInvoices.map(i => ({ ...i, clientName: 'Sophie Martin' })),
  {
    id: 'i4',
    invoiceNumber: 'MYMS-FAC-2024-005',
    title: 'Acompte - Packaging Bio',
    total: 160000,
    amountPaid: 160000,
    amountDue: 0,
    currency: 'USD',
    status: 'PAID',
    issuedAt: '2024-02-16',
    dueDate: '2024-03-01',
    clientName: 'Aminata Koné'
  }
];

export const mockAdminContactMessages = [
  {
    id: 'cm1',
    name: 'Pierre Laurent',
    email: 'pierre@example.com',
    subject: 'Question sur vos services',
    message: 'Bonjour, je souhaiterais en savoir plus sur vos services de community management. Pouvez-vous me donner plus de détails ?',
    isRead: false,
    createdAt: '2024-03-19T08:15:00'
  },
  {
    id: 'cm2',
    name: 'Fatou Sow',
    email: 'fatou@example.com',
    subject: 'Collaboration',
    message: 'Je suis photographe et je souhaiterais proposer une collaboration. Seriez-vous intéressés ?',
    isRead: true,
    createdAt: '2024-03-18T14:30:00'
  }
];

export const mockNewsletterSubscribers = [
  { id: 'ns1', email: 'subscriber1@example.com', firstName: 'Paul', subscribedAt: '2024-01-15' },
  { id: 'ns2', email: 'subscriber2@example.com', firstName: 'Emma', subscribedAt: '2024-02-01' },
  { id: 'ns3', email: 'subscriber3@example.com', firstName: 'Jean', subscribedAt: '2024-02-20' },
  { id: 'ns4', email: 'subscriber4@example.com', firstName: 'Aïcha', subscribedAt: '2024-03-05' }
];

// ===== TEAM MEMBERS =====
export const mockTeamMembers = [
  {
    id: 'tm1',
    firstName: 'Admin',
    lastName: 'Myms',
    email: 'admin@myms.com',
    phone: '+221 77 000 00 00',
    role: 'SUPER_ADMIN',
    avatar: null,
    isActive: true,
    createdAt: '2023-01-01',
    lastLogin: '2024-03-20T08:30:00',
    tasksAssigned: ['Supervision générale', 'Gestion des accès', 'Facturation'],
    description: 'Propriétaire et administrateur principal du studio.'
  },
  {
    id: 'tm2',
    firstName: 'Marie',
    lastName: 'Diallo',
    email: 'manager@myms.com',
    phone: '+221 77 111 11 11',
    role: 'PROJECT_MANAGER',
    avatar: null,
    isActive: true,
    createdAt: '2023-06-15',
    lastLogin: '2024-03-20T09:15:00',
    tasksAssigned: ['Gestion des projets', 'Suivi clients', 'Coordination équipe'],
    description: 'Responsable de la coordination des projets et du suivi client.'
  },
  {
    id: 'tm3',
    firstName: 'Amadou',
    lastName: 'Ba',
    email: 'sales@myms.com',
    phone: '+221 77 222 22 22',
    role: 'SALES_MANAGER',
    avatar: null,
    isActive: true,
    createdAt: '2023-09-01',
    lastLogin: '2024-03-19T16:45:00',
    tasksAssigned: ['Devis et facturation', 'Prospection', 'Négociation'],
    description: 'Responsable commercial en charge des devis et de la facturation.'
  },
  {
    id: 'tm4',
    firstName: 'Fatou',
    lastName: 'Seck',
    email: 'content@myms.com',
    phone: '+221 77 333 33 33',
    role: 'CONTENT_MANAGER',
    avatar: null,
    isActive: true,
    createdAt: '2024-01-10',
    lastLogin: '2024-03-20T10:00:00',
    tasksAssigned: ['Gestion du blog', 'Portfolio', 'Ressources digitales'],
    description: 'Gestionnaire de contenu pour le blog, portfolio et ressources.'
  },
  {
    id: 'tm5',
    firstName: 'Ibrahima',
    lastName: 'Ndiaye',
    email: 'support@myms.com',
    phone: '+221 77 444 44 44',
    role: 'SUPPORT',
    avatar: null,
    isActive: true,
    createdAt: '2024-02-01',
    lastLogin: '2024-03-20T07:45:00',
    tasksAssigned: ['Réponse aux messages', 'Support client', 'Suivi demandes'],
    description: 'Support client et gestion des demandes entrantes.'
  },
  {
    id: 'tm6',
    firstName: 'Oumar',
    lastName: 'Gueye',
    email: 'oumar@myms.com',
    phone: '+221 77 555 55 55',
    role: 'ADMIN',
    avatar: null,
    isActive: false,
    createdAt: '2023-03-01',
    lastLogin: '2024-01-15T14:30:00',
    tasksAssigned: ['Administration', 'Backup'],
    description: 'Administrateur secondaire (actuellement inactif).'
  }
];

// Helper functions
export const formatCurrency = (amount: number, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount);
  } catch {
    return `${amount.toLocaleString('en-US')} ${currency}`;
  }
};

export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const formatDateTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusConfig = (status: string): { label: string; variant: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' } => {
  const configs: Record<string, { label: string; variant: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' }> = {
    // Quotes
    DRAFT: { label: 'Brouillon', variant: 'default' },
    SENT: { label: 'Envoyé', variant: 'primary' },
    VIEWED: { label: 'Consulté', variant: 'secondary' },
    ACCEPTED: { label: 'Accepté', variant: 'success' },
    REFUSED: { label: 'Refusé', variant: 'error' },
    EXPIRED: { label: 'Expiré', variant: 'default' },
    CONVERTED: { label: 'Converti', variant: 'primary' },
    // Invoices
    PAID: { label: 'Payée', variant: 'success' },
    PARTIALLY_PAID: { label: 'Partiellement payée', variant: 'warning' },
    OVERDUE: { label: 'En retard', variant: 'error' },
    CANCELLED: { label: 'Annulée', variant: 'default' },
    // Projects
    PENDING: { label: 'En attente', variant: 'default' },
    BRIEFING: { label: 'Brief en cours', variant: 'primary' },
    IN_PROGRESS: { label: 'En production', variant: 'primary' },
    REVISION: { label: 'En révision', variant: 'warning' },
    AWAITING_APPROVAL: { label: 'En attente validation', variant: 'secondary' },
    APPROVED: { label: 'Validé', variant: 'success' },
    DELIVERED: { label: 'Livré', variant: 'success' },
    COMPLETED: { label: 'Terminé', variant: 'success' },
    PAUSED: { label: 'En pause', variant: 'default' },
    // Quote requests
    NEW: { label: 'Nouvelle', variant: 'primary' },
    READ: { label: 'Lue', variant: 'secondary' },
    RESPONDED: { label: 'Répondu', variant: 'success' },
    ARCHIVED: { label: 'Archivé', variant: 'default' }
  };
  return configs[status] || { label: status, variant: 'default' };
};
