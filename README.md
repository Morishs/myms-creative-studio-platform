# Myms — Studio Créatif

Site web professionnel pour Myms, studio créatif spécialisé en design graphique, infographie et community management.

## 🎨 Fonctionnalités

### Pages Publiques
- **Accueil** — Présentation complète des services, portfolio, témoignages
- **À propos** — Histoire, mission, valeurs et compétences du studio
- **Services** — 5 services détaillés (Identité visuelle, Design graphique, Design digital, Community Management, Ressources)
- **Portfolio** — Galerie filtrable de projets avec études de cas détaillées
- **Ressources** — Boutique de templates et guides (gratuits et payants)
- **Blog** — Articles et conseils sur le design
- **Processus** — Timeline du processus de travail
- **Témoignages** — Avis clients
- **FAQ** — Questions fréquentes filtrables
- **Devis** — Formulaire de demande de devis complet
- **Contact** — Formulaire de contact et informations
- **Pages légales** — Mentions légales, CGV, Politique de confidentialité

### Espace Client (Protégé)
- **Tableau de bord** — Vue d'ensemble des projets, devis et factures
- **Mes projets** — Suivi d'avancement avec progression en temps réel
- **Mes devis** — Consultation et acceptation/refus de devis
- **Mes factures** — Consultation et paiement en ligne
- **Mes fichiers** — Téléchargement des livrables
- **Mes achats** — Historique des achats de ressources
- **Messages** — Messagerie avec le studio
- **Mon profil** — Gestion des informations personnelles

### Espace Admin (Protégé)
- **Tableau de bord** — Statistiques complètes (revenus, clients, projets)
- **Clients** — Gestion complète des clients
- **Demandes de devis** — Traitement des demandes entrantes
- **Devis** — Création et gestion des devis
- **Factures** — Création et suivi des factures
- **Projets** — Gestion et suivi des projets
- **Portfolio** — Gestion des projets portfolio
- **Services** — Configuration des services
- **Ressources** — Gestion de la boutique
- **Blog** — Gestion des articles
- **Témoignages** — Modération des avis
- **Messages** — Gestion des messages de contact
- **Newsletter** — Gestion des abonnés
- **Paramètres** — Configuration du site

## 🔐 Comptes de Démonstration

### Admin
- **Email:** admin@myms.com
- **Mot de passe:** admin123
- *Accès: /admin/dashboard*

### Client
- **Email:** client@demo.com
- **Mot de passe:** client123
- *Accès: /client/dashboard*

## 🚀 Technologies Utilisées

- **React 19** — Framework UI
- **TypeScript** — Typage statique
- **Vite** — Build tool ultra-rapide
- **Tailwind CSS 4** — Styling utilitaire
- **React Router** — Routage
- **Framer Motion** — Animations fluides
- **React Hook Form + Zod** — Formulaires et validation
- **Lucide React** — Icônes modernes

## 🎨 Design System

### Couleurs
- **Fond principal:** #0A0A0A (noir profond)
- **Fond secondaire:** #111111
- **Cartes:** #1A1A1A
- **Accent primaire:** #6C3CE1 (violet)
- **Accent secondaire:** #F59E0B (ambre)
- **Succès:** #10B981
- **Erreur:** #EF4444

### Typographie
- **Titres:** Sora (Google Fonts)
- **Corps:** Inter (Google Fonts)

### Composants UI
- Boutons avec variantes (primary, secondary, outline, ghost)
- Inputs, Textareas, Selects avec validation
- Cards avec effets hover
- Badges colorés selon statut
- Accordéons animés
- Navigation responsive avec menu mobile

## 📱 Responsive Design

Le site est entièrement responsive avec:
- **Mobile:** Menu hamburger, grilles adaptatives
- **Tablet:** Layouts optimisés
- **Desktop:** Navigation complète avec dropdowns
- **Large Desktop:** Utilisation optimale de l'espace

## 🛠️ Installation et Développement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

## 📂 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants UI de base
│   └── layout/         # Header, Footer, Sidebars
├── pages/              # Pages de l'application
│   ├── auth/           # Pages d'authentification
│   ├── client/         # Espace client
│   └── admin/          # Espace admin
├── contexts/           # React Context (Auth)
├── data/               # Données mock et configurations
├── types/              # Types TypeScript
└── utils/              # Utilitaires
```

## 🎯 Fonctionnalités Clés

### Authentification
- Connexion/Inscription avec validation
- Gestion des rôles (ADMIN, CLIENT)
- Protection des routes par rôle
- Persistance de session avec localStorage
- Récupération de mot de passe

### Gestion de Projets
- Suivi d'avancement avec barre de progression
- 10 statuts de projet différents
- Messages et fichiers par projet
- Historique des révisions

### Facturation
- Devis avec acceptation/refus en ligne
- Factures avec paiement en ligne (simulé)
- Génération PDF (interface prête)
- Suivi des paiements

### Portfolio
- Filtrage par catégorie
- Études de cas détaillées
- Galerie d'images
- Navigation entre projets

## 🌟 Points Forts

✅ **Design moderne** — Interface sombre élégante avec accents violets  
✅ **Expérience utilisateur** — Animations fluides, feedback visuel  
✅ **Responsive** — Optimisé pour tous les écrans  
✅ **Accessible** — Navigation clavier, contraste WCAG AA  
✅ **TypeScript** — Code type-safe et maintenable  
✅ **Performance** — Build optimisé avec Vite  
✅ **SEO** — Structure sémantique, meta tags  
✅ **Sécurité** — Routes protégées, validation des données  

## 📝 Notes de Développement

- Le système d'authentification utilise localStorage (pas de backend)
- Les données sont mockées pour la démonstration
- Les paiements sont simulés
- La génération PDF est préparée mais non implémentée
- L'envoi d'emails est simulé

## 🔮 Améliorations Futures

- Intégration backend (Node.js/Express + PostgreSQL)
- Upload de fichiers réel (AWS S3, Cloudinary)
- Paiements réels (Stripe, PayPal)
- Emails transactionnels (Resend, SendGrid)
- Génération PDF réelle (React-PDF)
- Système de notifications en temps réel
- Chat en direct
- Analytics avancés

---

**Développé avec ❤️ pour Myms Studio**
