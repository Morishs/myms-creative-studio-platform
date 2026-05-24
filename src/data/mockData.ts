// Utility helpers used throughout admin and client pages.

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
    IN_PROGRESS: { label: 'En cours', variant: 'warning' },
    RESPONDED: { label: 'Répondu', variant: 'success' },
    PROCESSED: { label: 'Traitée', variant: 'success' },
    CONVERTED: { label: 'Convertie en devis', variant: 'primary' },
    ARCHIVED: { label: 'Archivé', variant: 'default' }
  };
  return configs[status] || { label: status, variant: 'default' };
};
