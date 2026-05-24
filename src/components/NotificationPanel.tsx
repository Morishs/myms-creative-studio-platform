import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MessageSquare, FileText, Receipt, FolderKanban, Download, Settings, Check, CheckCheck, X } from 'lucide-react';
import { notificationStore, type Notification } from '../stores/notificationStore';

const typeIcons: Record<Notification['type'], React.ReactNode> = {
  message: <MessageSquare className="w-4 h-4" />,
  quote: <FileText className="w-4 h-4" />,
  invoice: <Receipt className="w-4 h-4" />,
  project: <FolderKanban className="w-4 h-4" />,
  delivery: <Download className="w-4 h-4" />,
  system: <Settings className="w-4 h-4" />,
};

const typeColors: Record<Notification['type'], string> = {
  message: 'bg-brand/10 text-brand',
  quote: 'bg-warning/10 text-warning',
  invoice: 'bg-info/10 text-info',
  project: 'bg-success/10 text-success',
  delivery: 'bg-success/10 text-success',
  system: 'bg-text-muted/10 text-text-muted',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'à l\'instant';
  if (mins < 60) return `il y a ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}

export function NotificationBell({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(notificationStore.getUserNotifications(userId));
  const [unreadCount, setUnreadCount] = useState(notificationStore.getUnreadCount(userId));
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = notificationStore.subscribe(() => {
      setNotifications(notificationStore.getUserNotifications(userId));
      setUnreadCount(notificationStore.getUnreadCount(userId));
    });
    return () => { unsub(); };
  }, [userId]);

  // Fermer quand on clique en dehors
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const handleClickNotif = (n: typeof notifications[0]) => {
    notificationStore.markAsRead(n.id);
    setIsOpen(false);
    if (n.link) navigate(n.link);
  };

  const handleMarkAllRead = () => {
    notificationStore.markAllAsRead(userId);
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bouton cloche */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-secondary hover:text-brand transition-colors rounded-lg hover:bg-surface-alt"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panneau */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-surface-alt border border-border rounded-3xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-text-primary text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-text-secondary">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-brand hover:text-brand-light transition-colors flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Tout marquer lu
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-text-primary p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Liste */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-text-muted mx-auto mb-3" />
                  <p className="text-sm text-text-muted">Aucune notification</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleClickNotif(n)}
                    className={`w-full text-left p-4 border-b border-border last:border-b-0 hover:bg-surface transition-colors flex items-start gap-3 ${
                      !n.isRead ? 'bg-brand/10' : ''
                    }`}
                  >
                    {/* Icône */}
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${typeColors[n.type]}`}>
                      {typeIcons[n.type]}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-brand flex-shrink-0" />}
                        <p className={`text-sm truncate ${!n.isRead ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>
                          {n.title}
                        </p>
                      </div>
                      <p className="text-xs text-text-muted line-clamp-2">{n.description}</p>
                      <p className="text-[10px] text-text-muted mt-1">{timeAgo(n.createdAt)}</p>
                    </div>

                    {/* Bouton lu */}
                    {!n.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          notificationStore.markAsRead(n.id);
                        }}
                        className="flex-shrink-0 p-1 text-text-muted hover:text-brand"
                        title="Marquer comme lu"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
