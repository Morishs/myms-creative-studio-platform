import type { Service, PortfolioProject, Testimonial, FAQItem, ProcessStep, Resource, BlogPost, Stat } from '../types';

// ===== SERVICES =====
export const services: Service[] = [
  {
    id: '1',
    title: 'Identité Visuelle & Branding',
    slug: 'identite-visuelle',
    shortDescription: 'Création de logos uniques et chartes graphiques complètes pour une identité de marque forte et mémorable.',
    description: 'Nous créons des identités visuelles fortes et cohérentes qui reflètent l\'essence de votre marque. Du logo à la charte graphique complète, nous construisons les fondations visuelles de votre communication.',
    icon: 'palette',
    features: [
      'Création de logo professionnel',
      'Charte graphique complète',
      'Palette de couleurs',
      'Typographies sur mesure',
      'Papeterie (carte de visite, en-tête)',
      'Brand board',
      'Guide de marque complet'
    ],
    pricing: 'À partir de 150 000 FCFA'
  },
  {
    id: '2',
    title: 'Design Graphique & Print',
    slug: 'design-graphique',
    shortDescription: 'Conception de supports imprimés percutants : flyers, affiches, brochures et packaging créatifs.',
    description: 'Des supports de communication imprimés qui captent l\'attention et transmettent votre message avec impact. Qualité professionnelle et créativité au service de votre image.',
    icon: 'printer',
    features: [
      'Flyers & Affiches',
      'Brochures & Dépliants',
      'Catalogues & Menus',
      'Packaging & Étiquettes',
      'Roll-up & Bannières',
      'Cartes d\'invitation',
      'Kakemono & PLV'
    ],
    pricing: 'À partir de 25 000 FCFA'
  },
  {
    id: '3',
    title: 'Design Digital & Réseaux Sociaux',
    slug: 'design-digital',
    shortDescription: 'Création de visuels percutants pour vos réseaux sociaux, bannières web et présentations.',
    description: 'Des visuels optimisés pour le digital qui maximisent votre engagement sur les réseaux sociaux et renforcent votre présence en ligne.',
    icon: 'smartphone',
    features: [
      'Visuels réseaux sociaux',
      'Bannières publicitaires',
      'Stories & Reels templates',
      'Couvertures de profils',
      'Infographies',
      'Présentations PowerPoint',
      'Newsletter design'
    ],
    pricing: 'À partir de 15 000 FCFA'
  },
  {
    id: '4',
    title: 'Community Management',
    slug: 'community-management',
    shortDescription: 'Gestion professionnelle de vos réseaux sociaux : stratégie, création de contenu et engagement.',
    description: 'Nous gérons votre présence sur les réseaux sociaux de A à Z : stratégie éditoriale, création de contenu, publication, modération et reporting.',
    icon: 'users',
    features: [
      'Audit de présence digitale',
      'Stratégie de contenu',
      'Calendrier éditorial',
      'Création de contenus',
      'Publication & Planification',
      'Modération & Engagement',
      'Reporting mensuel'
    ],
    pricing: 'À partir de 100 000 FCFA/mois'
  },
  {
    id: '5',
    title: 'Ressources & Templates',
    slug: 'ressources',
    shortDescription: 'Templates Canva, kits réseaux sociaux, guides et ressources prêtes à l\'emploi.',
    description: 'Des ressources digitales professionnelles pour booster votre communication : templates, guides, mockups et bien plus.',
    icon: 'download',
    features: [
      'Templates Canva',
      'Kits réseaux sociaux',
      'Calendriers éditoriaux',
      'Mockups',
      'Guides PDF',
      'E-books',
      'Packs d\'icônes'
    ],
    pricing: 'Gratuit & Payant'
  }
];

// ===== PORTFOLIO =====
export const portfolioProjects: PortfolioProject[] = [
  {
    id: '1',
    title: 'Branding Café Lumière',
    slug: 'branding-cafe-lumiere',
    category: 'Identité visuelle',
    client: 'Café Lumière',
    date: '2024',
    context: 'Café Lumière souhaitait une identité visuelle moderne reflétant leur approche artisanale du café.',
    objective: 'Créer une marque mémorable qui évoque la chaleur et l\'authenticité.',
    solution: 'Nous avons développé un logo épuré avec des tons chauds, accompagné d\'une charte graphique complète.',
    result: 'Une identité distinctive qui a permis au café de se démarquer dans un marché concurrentiel.',
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma'],
    images: ['https://images.pexels.com/photos/683039/pexels-photo-683039.jpeg?auto=compress&cs=tinysrgb&w=800'],
    coverImage: 'https://images.pexels.com/photos/683039/pexels-photo-683039.jpeg?auto=compress&cs=tinysrgb&w=800',
    isFeatured: true
  },
  {
    id: '2',
    title: 'Campagne Social Media EcoVert',
    slug: 'campagne-ecovert',
    category: 'Réseaux sociaux',
    client: 'EcoVert',
    date: '2024',
    context: 'EcoVert avait besoin d\'une présence forte sur les réseaux sociaux pour promouvoir leurs produits écologiques.',
    objective: 'Augmenter la visibilité et l\'engagement sur Instagram et Facebook.',
    solution: 'Création d\'un kit de templates cohérents avec un calendrier éditorial sur 3 mois.',
    result: '+150% d\'engagement et +2000 nouveaux abonnés en 3 mois.',
    tools: ['Canva', 'Adobe Photoshop', 'Hootsuite'],
    images: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    isFeatured: true
  },
  {
    id: '3',
    title: 'Logo Fitness Pro',
    slug: 'logo-fitness-pro',
    category: 'Logo',
    client: 'Fitness Pro',
    date: '2024',
    context: 'Une salle de sport premium cherchait un logo moderne et dynamique.',
    objective: 'Créer une identité qui inspire la performance et le dépassement de soi.',
    solution: 'Logo minimaliste avec une typographie bold et un symbole abstrait représentant le mouvement.',
    tools: ['Adobe Illustrator', 'Adobe InDesign'],
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    isFeatured: true
  },
  {
    id: '4',
    title: 'Packaging Bio Délices',
    slug: 'packaging-bio-delices',
    category: 'Packaging',
    client: 'Bio Délices',
    date: '2023',
    context: 'Marque de produits bio nécessitant un packaging éco-responsable et attractif.',
    objective: 'Créer un packaging qui communique les valeurs naturelles et la qualité premium.',
    solution: 'Design épuré utilisant des couleurs terreuses et des illustrations botaniques.',
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    images: ['https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=800',
    isFeatured: false
  },
  {
    id: '5',
    title: 'Brochure Immobilière LuxHabitat',
    slug: 'brochure-luxhabitat',
    category: 'Print',
    client: 'LuxHabitat',
    date: '2023',
    context: 'Agence immobilière haut de gamme cherchant une brochure de présentation élégante.',
    objective: 'Mettre en valeur les propriétés de luxe avec un support print de qualité.',
    solution: 'Brochure 16 pages avec mise en page sophistiquée et finitions premium.',
    tools: ['Adobe InDesign', 'Adobe Photoshop', 'Lightroom'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    isFeatured: true
  },
  {
    id: '6',
    title: 'Community Management RestoBon',
    slug: 'cm-restobon',
    category: 'Community Management',
    client: 'RestoBon',
    date: '2024',
    context: 'Restaurant local souhaitant développer sa communauté en ligne.',
    objective: 'Créer une stratégie de contenu engageante pour attirer de nouveaux clients.',
    solution: 'Gestion complète des réseaux sociaux avec shooting photo mensuel.',
    result: '+300% de réservations via les réseaux sociaux.',
    tools: ['Canva', 'Meta Business Suite', 'Later'],
    images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    isFeatured: false
  }
];

// ===== TESTIMONIALS =====
export const testimonials: Testimonial[] = [
  {
    id: '1',
    clientName: 'Sarah M.',
    company: 'Café Lumière',
    role: 'Fondatrice',
    content: 'Myms a parfaitement capturé l\'essence de notre marque. Notre nouvelle identité visuelle nous a permis de nous démarquer et d\'attirer une nouvelle clientèle. Un travail exceptionnel !',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    serviceUsed: 'Identité visuelle'
  },
  {
    id: '2',
    clientName: 'Marc D.',
    company: 'EcoVert',
    role: 'Directeur Marketing',
    content: 'La gestion de nos réseaux sociaux par Myms a complètement transformé notre présence en ligne. Les résultats parlent d\'eux-mêmes : +150% d\'engagement en 3 mois !',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    serviceUsed: 'Community Management'
  },
  {
    id: '3',
    clientName: 'Aminata K.',
    company: 'Bio Délices',
    role: 'CEO',
    content: 'Le packaging créé par Myms a vraiment fait la différence. Nos produits se démarquent maintenant en rayon. Créatif, professionnel et à l\'écoute.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    serviceUsed: 'Packaging'
  },
  {
    id: '4',
    clientName: 'Thomas L.',
    company: 'Fitness Pro',
    role: 'Fondateur',
    content: 'Un logo moderne qui reflète parfaitement les valeurs de notre salle de sport. Le processus était fluide et les révisions rapides. Je recommande !',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    serviceUsed: 'Logo'
  }
];

// ===== PROCESS STEPS =====
export const processSteps: ProcessStep[] = [
  {
    number: 1,
    title: 'Prise de contact',
    description: 'Vous remplissez notre formulaire de devis ou nous contactez directement pour nous parler de votre projet.',
    icon: 'messageCircle'
  },
  {
    number: 2,
    title: 'Échange & Brief',
    description: 'Nous discutons ensemble de vos besoins, objectifs et attentes lors d\'un appel ou d\'une réunion.',
    icon: 'users'
  },
  {
    number: 3,
    title: 'Proposition & Devis',
    description: 'Nous vous envoyons un devis détaillé avec les prestations, délais et conditions.',
    icon: 'fileText'
  },
  {
    number: 4,
    title: 'Validation & Acompte',
    description: 'Vous acceptez le devis et versez l\'acompte de 50% pour démarrer le projet.',
    icon: 'checkCircle'
  },
  {
    number: 5,
    title: 'Création & Production',
    description: 'Notre équipe se met au travail pour donner vie à votre vision créative.',
    icon: 'penTool'
  },
  {
    number: 6,
    title: 'Présentation',
    description: 'Nous vous présentons les premières propositions et recueillons vos retours.',
    icon: 'presentation'
  },
  {
    number: 7,
    title: 'Révisions',
    description: 'Nous ajustons les créations selon vos retours (2-3 révisions incluses).',
    icon: 'refreshCw'
  },
  {
    number: 8,
    title: 'Livraison finale',
    description: 'Une fois validé, nous livrons tous les fichiers dans les formats requis.',
    icon: 'download'
  }
];

// ===== FAQ =====
export const faqItems: FAQItem[] = [
  // Général
  {
    id: '1',
    question: 'Quels services proposez-vous ?',
    answer: 'Nous proposons des services de création de logo, identité visuelle, design graphique (print et digital), community management, et vente de ressources digitales (templates, guides, etc.).',
    category: 'Général'
  },
  {
    id: '2',
    question: 'Travaillez-vous avec des clients internationaux ?',
    answer: 'Oui ! Nous travaillons avec des clients du monde entier grâce aux outils de communication modernes. Les échanges se font par email, visioconférence et messagerie.',
    category: 'Général'
  },
  {
    id: '3',
    question: 'Quel est votre délai de réponse ?',
    answer: 'Nous répondons généralement sous 24 à 48 heures ouvrables. Pour les demandes de devis, vous recevez une proposition complète sous 48 heures.',
    category: 'Général'
  },
  // Devis & Prix
  {
    id: '4',
    question: 'Comment obtenir un devis ?',
    answer: 'Remplissez notre formulaire de demande de devis en ligne avec le maximum de détails sur votre projet. Nous vous répondons avec une proposition personnalisée sous 48h.',
    category: 'Devis & Prix'
  },
  {
    id: '5',
    question: 'Les devis sont-ils gratuits ?',
    answer: 'Oui, tous nos devis sont gratuits et sans engagement. Nous prenons le temps d\'analyser votre besoin pour vous proposer la meilleure solution.',
    category: 'Devis & Prix'
  },
  {
    id: '6',
    question: 'Quels sont vos tarifs ?',
    answer: 'Nos tarifs varient selon la complexité du projet. Logo à partir de 100 000 FCFA, identité visuelle à partir de 150 000 FCFA, community management à partir de 100 000 FCFA/mois.',
    category: 'Devis & Prix'
  },
  // Projet
  {
    id: '7',
    question: 'Comment se déroule un projet ?',
    answer: 'Chaque projet suit 8 étapes : prise de contact, brief, devis, validation, création, présentation, révisions et livraison. Vous êtes impliqué à chaque étape.',
    category: 'Projet'
  },
  {
    id: '8',
    question: 'Combien de révisions sont incluses ?',
    answer: 'Nous incluons généralement 2 à 3 révisions dans nos prestations. Des révisions supplémentaires peuvent être facturées selon le projet.',
    category: 'Projet'
  },
  {
    id: '9',
    question: 'Combien de temps dure un projet ?',
    answer: 'La durée dépend du projet : 5-7 jours pour un logo, 2-3 semaines pour une identité visuelle complète, 1 semaine pour un flyer. Les délais sont précisés dans le devis.',
    category: 'Projet'
  },
  // Paiement
  {
    id: '10',
    question: 'Quels sont les moyens de paiement acceptés ?',
    answer: 'Nous acceptons les virements bancaires, Mobile Money (Orange Money, Wave), PayPal et les cartes bancaires via Stripe.',
    category: 'Paiement'
  },
  {
    id: '11',
    question: 'Faut-il payer un acompte ?',
    answer: 'Oui, nous demandons un acompte de 50% pour démarrer tout projet. Le solde est payé à la livraison finale.',
    category: 'Paiement'
  },
  // Livraison
  {
    id: '12',
    question: 'Dans quels formats sont les livrables ?',
    answer: 'Nous livrons dans tous les formats nécessaires : PNG, JPG, SVG, PDF, AI, PSD, etc. Les formats sont précisés dans le devis.',
    category: 'Livraison'
  },
  {
    id: '13',
    question: 'Les fichiers sources sont-ils inclus ?',
    answer: 'Les fichiers sources (AI, PSD, INDD) sont généralement inclus pour les projets d\'identité visuelle. Pour les autres projets, cela peut être en option.',
    category: 'Livraison'
  }
];

// ===== RESOURCES =====
export const resources: Resource[] = [
  {
    id: '1',
    title: 'Pack Instagram Stories - Minimaliste',
    slug: 'pack-instagram-stories-minimaliste',
    shortDescription: '20 templates de stories Instagram au design minimaliste et moderne.',
    description: 'Ce pack contient 20 templates de stories Instagram prêts à l\'emploi. Design minimaliste et moderne, parfait pour les marques lifestyle, mode et beauté.',
    coverImage: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800',
    category: 'Templates',
    type: 'TEMPLATE',
    isFree: false,
    price: 15000,
    currency: 'FCFA',
    fileFormat: 'Canva',
    compatibility: ['Canva', 'Canva Pro'],
    downloads: 234
  },
  {
    id: '2',
    title: 'Calendrier Éditorial 2024',
    slug: 'calendrier-editorial-2024',
    shortDescription: 'Template de calendrier éditorial pour planifier vos publications sur 12 mois.',
    description: 'Organisez votre stratégie de contenu avec ce calendrier éditorial complet. Inclut des idées de contenus, dates importantes et suivi des performances.',
    coverImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800',
    category: 'Guides',
    type: 'GUIDE',
    isFree: true,
    fileFormat: 'Google Sheets / Excel',
    compatibility: ['Google Sheets', 'Microsoft Excel'],
    downloads: 892
  },
  {
    id: '3',
    title: 'Kit Branding Complet',
    slug: 'kit-branding-complet',
    shortDescription: 'Tous les templates nécessaires pour créer votre identité visuelle.',
    description: 'Ce kit complet contient : logo mockups, templates de charte graphique, modèles de carte de visite, papeterie et plus encore.',
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    category: 'Kits',
    type: 'KIT',
    isFree: false,
    price: 35000,
    currency: 'FCFA',
    fileFormat: 'PSD, AI, Canva',
    compatibility: ['Adobe Photoshop', 'Adobe Illustrator', 'Canva'],
    downloads: 156
  },
  {
    id: '4',
    title: 'Guide : Créer son Logo',
    slug: 'guide-creer-son-logo',
    shortDescription: 'Guide PDF complet pour créer un logo professionnel.',
    description: 'Apprenez les bases de la création de logo : principes de design, choix des couleurs, typographie et conseils pratiques.',
    coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
    category: 'Guides',
    type: 'GUIDE',
    isFree: true,
    fileFormat: 'PDF',
    compatibility: ['Tous'],
    downloads: 1245
  }
];

// ===== BLOG POSTS =====
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: '10 tendances design graphique à suivre en 2024',
    slug: 'tendances-design-2024',
    excerpt: 'Découvrez les tendances design qui façonneront l\'année 2024 : minimalisme audacieux, couleurs vibrantes et typographies expressives.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800',
    category: 'Tendances',
    tags: ['design', 'tendances', '2024'],
    readTime: 5,
    publishedAt: '2024-01-15',
    author: 'Myms'
  },
  {
    id: '2',
    title: 'Comment créer une identité visuelle cohérente',
    slug: 'creer-identite-visuelle-coherente',
    excerpt: 'Les clés pour développer une identité de marque forte et reconnaissable : logo, couleurs, typographies et applications.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    category: 'Branding',
    tags: ['branding', 'identité visuelle', 'conseils'],
    readTime: 7,
    publishedAt: '2024-01-10',
    author: 'Myms'
  },
  {
    id: '3',
    title: 'Guide complet du Community Management',
    slug: 'guide-community-management',
    excerpt: 'Tout ce que vous devez savoir pour gérer efficacement vos réseaux sociaux : stratégie, contenu, engagement et analyse.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    category: 'Community Management',
    tags: ['réseaux sociaux', 'community management', 'stratégie'],
    readTime: 10,
    publishedAt: '2024-01-05',
    author: 'Myms'
  }
];

// ===== STATS =====
export const stats: Stat[] = [
  { label: 'Projets réalisés', value: 150, suffix: '+' },
  { label: 'Clients satisfaits', value: 80, suffix: '+' },
  { label: 'Années d\'expérience', value: 5, suffix: '' },
  { label: 'Ressources disponibles', value: 25, suffix: '+' }
];

// ===== SERVICE OPTIONS FOR QUOTE FORM =====
export const serviceOptions = [
  'Logo',
  'Identité visuelle complète',
  'Charte graphique',
  'Carte de visite',
  'Flyer / Affiche',
  'Brochure / Catalogue',
  'Visuels réseaux sociaux',
  'Community Management',
  'Design de présentation',
  'Packaging',
  'Autre'
];

export const budgetOptions = [
  'Moins de 50 000 FCFA',
  '50 000 — 150 000 FCFA',
  '150 000 — 300 000 FCFA',
  '300 000 — 500 000 FCFA',
  'Plus de 500 000 FCFA',
  'Je ne sais pas encore'
];

export const deadlineOptions = [
  'Urgent (moins de 3 jours)',
  '1 semaine',
  '2 semaines',
  '1 mois',
  'Pas de deadline précise'
];

export const sourceOptions = [
  'Réseaux sociaux',
  'Recherche Google',
  'Recommandation',
  'Portfolio en ligne',
  'Autre'
];

// ===== COMPANY INFO =====
export const companyInfo = {
  name: 'Myms',
  tagline: 'Studio Créatif',
  email: 'contact@myms-studio.com',
  phone: '+221 77 000 00 00',
  whatsapp: '+221 77 000 00 00',
  address: 'Dakar, Sénégal',
  socialLinks: {
    instagram: 'https://instagram.com/myms.studio',
    behance: 'https://behance.net/myms',
    linkedin: 'https://linkedin.com/company/myms-studio',
    facebook: 'https://facebook.com/myms.studio',
    twitter: 'https://twitter.com/myms_studio'
  }
};

// ===== PORTFOLIO CATEGORIES =====
export const portfolioCategories = [
  'Tout',
  'Identité visuelle',
  'Logo',
  'Print',
  'Réseaux sociaux',
  'Packaging',
  'Community Management'
];
