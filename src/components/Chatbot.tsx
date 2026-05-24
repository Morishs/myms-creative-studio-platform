import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, User, Sparkles, 
  ChevronDown, ExternalLink, Paperclip
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { companyInfo } from '../data';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  options?: QuickOption[];
  links?: { label: string; href: string }[];
  attachments?: FileAttachment[];
}

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface QuickOption {
  label: string;
  value: string;
}

// ===== RÉPONSES CONVERSATIONNELLES =====
// Plusieurs variantes par intention pour sonner plus naturel
type BotResponse = { 
  content: string; 
  options?: QuickOption[];
  links?: { label: string; href: string }[];
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildResponse(intentKey: string): BotResponse {
  const responses = CONVERSATIONS[intentKey] || CONVERSATIONS.default;
  return typeof responses === 'function' ? responses() : pick(responses);
}

// Toutes les conversations — chaque clé peut avoir plusieurs variantes
const CONVERSATIONS: Record<string, (() => BotResponse) | BotResponse[]> = {

  greeting: [
    {
      content: "Hey, bienvenue chez Myms ! 😊 Je suis là pour répondre à vos questions sur nos services de design et de communication. Qu'est-ce qui vous amène aujourd'hui ?",
      options: [
        { label: "J'ai un projet en tête", value: 'projet' },
        { label: 'Quels sont vos services ?', value: 'services' },
        { label: 'Je veux voir vos créations', value: 'portfolio' },
        { label: 'Comment ça se passe un projet ?', value: 'processus' },
      ]
    },
    {
      content: "Bonjour et bienvenue ! 👋 Moi c'est l'assistant de Myms Studio, le studio créatif qui donne vie à vos idées visuelles. En quoi je peux vous aider ?",
      options: [
        { label: 'Je cherche un designer', value: 'services' },
        { label: "J'ai besoin d'un devis", value: 'devis' },
        { label: 'Quels sont vos tarifs ?', value: 'tarifs' },
        { label: 'Je veux juste discuter', value: 'discuter' },
      ]
    }
  ],

  projet: [
    {
      content: "Super, j'adore quand quelqu'un arrive avec un projet ! 🎉\n\nDites-moi un peu, c'est pour quel type de besoin ? Ça m'aidera à vous orienter au mieux.",
      options: [
        { label: 'Un logo ou une identité visuelle', value: 'logo' },
        { label: 'Des flyers / affiches / brochures', value: 'print' },
        { label: 'Des visuels pour les réseaux sociaux', value: 'digital' },
        { label: 'Gérer mes réseaux sociaux', value: 'communitymanagement' },
        { label: 'Autre chose', value: 'devis' },
      ]
    }
  ],

  discuter: [
    {
      content: "Avec plaisir, on est là pour ça ! 😄\n\nMyms, c'est un studio créatif basé à Dakar. On aide les entrepreneurs et les entreprises à avoir une image de marque qui claque. Logo, charte graphique, visuels réseaux sociaux, community management… on touche à tout ce qui est visuel.\n\nVous êtes entrepreneur ? Vous avez déjà une marque ?",
      options: [
        { label: "Oui j'ai déjà une marque", value: 'existant' },
        { label: 'Non je démarre de zéro', value: 'nouveau' },
        { label: 'Je suis juste curieux', value: 'curieux' },
      ]
    }
  ],

  existant: [
    {
      content: "Ah parfait ! Alors on peut vous aider à rafraîchir votre identité visuelle, créer de nouveaux supports ou même prendre en charge vos réseaux sociaux. 💪\n\nC'est quoi le truc qui vous manque le plus en ce moment côté communication visuelle ?",
      options: [
        { label: 'Mon logo a besoin d\'un coup de neuf', value: 'logo' },
        { label: 'Je manque de visuels pour les réseaux', value: 'digital' },
        { label: 'Je veux quelqu\'un pour gérer mes réseaux', value: 'communitymanagement' },
        { label: 'Je veux un devis global', value: 'devis' },
      ]
    }
  ],

  nouveau: [
    {
      content: "Félicitations pour le lancement ! 🚀 C'est le moment parfait pour partir sur de bonnes bases.\n\nEn général, pour un projet qui démarre, je conseille notre pack identité visuelle. Ça comprend le logo, les couleurs, la typo, la carte de visite… tout ce qu'il faut pour commencer à communiquer avec une image pro.\n\nVous voulez en savoir plus sur ce pack ?",
      options: [
        { label: 'Oui, dites-moi tout !', value: 'branding' },
        { label: 'D\'abord les tarifs', value: 'tarifs' },
        { label: 'Je veux juste un logo pour l\'instant', value: 'logo' },
      ]
    }
  ],

  curieux: [
    {
      content: "La curiosité, c'est une belle qualité 😉 N'hésitez pas à fouiller notre portfolio pour voir ce qu'on fait, et si un jour vous avez besoin de nous, on sera là !",
      links: [{ label: 'Voir le portfolio', href: '/portfolio' }],
      options: [
        { label: 'Quels services vous proposez ?', value: 'services' },
        { label: 'Vous avez des ressources gratuites ?', value: 'ressources' },
      ]
    }
  ],

  devis: () => ({
    content: pick([
      "Bien sûr ! Pour le devis, le plus simple c'est de remplir notre formulaire en ligne. Décrivez-nous votre projet, et on vous revient sous 24-48h avec une proposition sur mesure. Et c'est gratuit, évidemment. 😊",
      "Pas de souci pour le devis ! On a un formulaire dédié où vous pouvez nous décrire votre projet en détail. On analyse tout ça et on vous envoie une proposition personnalisée sous 48h max.\n\nLe devis est gratuit et sans engagement, on veut juste bien comprendre votre besoin.",
      "Le devis, c'est la première étape ! ✨ Remplissez notre formulaire en ligne, racontez-nous votre projet, vos envies… et on fait le reste. Réponse garantie sous 48h."
    ]),
    links: [{ label: 'Remplir le formulaire', href: '/devis' }],
    options: [
      { label: 'Ça coûte combien en général ?', value: 'tarifs' },
      { label: 'C\'est quoi les délais ?', value: 'delais' },
    ]
  }),

  services: [
    {
      content: "Chez Myms, on est polyvalents ! Voilà ce qu'on fait au quotidien :\n\n🎨 Identité visuelle — logo, charte graphique, tout le branding\n🖨️ Design print — flyers, affiches, brochures, packaging\n📱 Design digital — visuels pour Instagram, Facebook, LinkedIn…\n📣 Community management — on gère vos réseaux de A à Z\n📦 Ressources — templates et guides prêts à l'emploi\n\nQuel domaine vous intéresse le plus ?",
      links: [{ label: 'Tout voir en détail', href: '/services' }],
      options: [
        { label: 'Le branding / logo', value: 'branding' },
        { label: 'Les réseaux sociaux', value: 'digital' },
        { label: 'Le community management', value: 'communitymanagement' },
        { label: 'J\'ai besoin d\'un devis', value: 'devis' },
      ]
    }
  ],

  tarifs: () => ({
    content: pick([
      "Alors, nos tarifs dépendent vraiment du projet, mais pour vous donner une idée :\n\n🎨 Logo — à partir de 100 000 FCFA\n📋 Identité visuelle complète — à partir de 150 000 FCFA\n📄 Flyer ou affiche — à partir de 25 000 FCFA\n📱 Pack visuels réseaux — à partir de 15 000 FCFA\n📣 Community management — à partir de 100 000 FCFA/mois\n\nMais le mieux, c'est de nous décrire votre projet. On s'adapte toujours au budget du client. 😊",
      "Bonne question ! Voici nos fourchettes de prix :\n\nUn logo, ça démarre à 100 000 FCFA. Si vous voulez l'identité visuelle complète (logo + charte + papeterie), comptez à partir de 150 000 FCFA.\n\nPour du print (flyer, affiche…), c'est à partir de 25 000 FCFA. Et les visuels pour réseaux sociaux commencent à 15 000 FCFA le visuel.\n\nAprès, on discute et on s'adapte toujours à votre budget !"
    ]),
    links: [{ label: 'Demander un devis précis', href: '/devis' }],
    options: [
      { label: 'Vous avez des packs ?', value: 'packs' },
      { label: 'C\'est quoi les délais ?', value: 'delais' },
    ]
  }),

  packs: [
    {
      content: "Oui, on propose des formules ! 📦\n\nPar exemple pour le community management, on a :\n\n⭐ Pack Starter — quelques posts par mois pour maintenir une présence\n💼 Pack Business — plus de contenus + stories\n🚀 Pack Premium — gestion complète + publicités\n\nPour l'identité visuelle aussi, on a un pack complet qui va du logo jusqu'à la papeterie.\n\nDites-moi ce qui vous intéresse et je vous détaille !",
      options: [
        { label: 'Le community management', value: 'communitymanagement' },
        { label: 'L\'identité visuelle', value: 'branding' },
        { label: 'Je veux un devis personnalisé', value: 'devis' },
      ]
    }
  ],

  delais: () => ({
    content: pick([
      "Les délais, c'est toujours la grande question ! 😄 Voilà ce qu'il faut prévoir :\n\nUn logo, c'est environ 5-7 jours. Une identité visuelle complète, comptez 2-3 semaines. Pour un flyer ou une affiche, on peut faire ça en 3-5 jours.\n\nBien sûr, ça commence une fois le devis accepté et l'acompte reçu. Et si c'est urgent, on peut accélérer le rythme, il suffit de nous le dire !",
      "Ça dépend du type de projet :\n\n⚡ Logo — 5 à 7 jours\n📋 Identité visuelle complète — 2 à 3 semaines\n📄 Support print (flyer, affiche) — 3 à 5 jours\n📱 Visuels réseaux sociaux — environ 1 semaine\n\nCes délais commencent après la validation du devis. Et on est flexibles : si vous avez une deadline serrée, dites-le nous, on fera tout pour la respecter !"
    ]),
    options: [
      { label: 'Comment ça se passe concrètement ?', value: 'processus' },
      { label: 'Je veux lancer mon projet', value: 'devis' },
    ]
  }),

  processus: [
    {
      content: "On fonctionne de façon simple et transparente. Voilà comment ça se passe :\n\n1️⃣ Vous nous contactez et on discute de votre projet\n2️⃣ On fait un brief détaillé ensemble pour bien cerner vos besoins\n3️⃣ On vous envoie un devis clair, sans surprise\n4️⃣ Vous validez et on démarre (avec un acompte de 50%)\n5️⃣ On crée, on vous présente nos propositions\n6️⃣ Vous donnez vos retours, on ajuste (2-3 révisions incluses)\n7️⃣ On valide ensemble et on livre tous les fichiers\n\nEn gros, vous êtes impliqué à chaque étape. On ne fait rien sans votre avis ! 😊",
      links: [{ label: 'Voir le processus en détail', href: '/processus' }],
      options: [
        { label: 'Combien de révisions j\'ai droit ?', value: 'revision' },
        { label: 'OK, je veux me lancer !', value: 'devis' },
      ]
    }
  ],

  contact: () => ({
    content: pick([
      `Bien sûr ! Vous pouvez nous joindre facilement :\n\n📧 Par email : ${companyInfo.email}\n📱 Par téléphone/WhatsApp : ${companyInfo.phone}\n📍 On est basés à ${companyInfo.address}\n\nOn est disponibles du lundi au vendredi, de 9h à 18h. N'hésitez pas, on répond toujours rapidement ! 😉`,
      `Pour nous joindre, c'est simple :\n\nLe plus rapide, c'est WhatsApp au ${companyInfo.phone} — on répond généralement dans l'heure.\n\nSinon par email à ${companyInfo.email}, on vous revient sous 24h.\n\nOu passez par notre formulaire de contact si vous préférez !`
    ]),
    links: [
      { label: 'Formulaire de contact', href: '/contact' },
      { label: 'Demander un devis', href: '/devis' },
    ]
  }),

  faq: [
    {
      content: "Voici les questions qu'on nous pose le plus souvent :\n\n💬 \"Les devis sont gratuits ?\" — Oui, toujours !\n💬 \"Il faut payer combien d'avance ?\" — 50% d'acompte\n💬 \"Combien de modifications je peux demander ?\" — 2-3 révisions incluses\n💬 \"Vous livrez quels formats ?\" — PNG, JPG, PDF, SVG, AI, PSD…\n💬 \"Les fichiers sources sont inclus ?\" — Oui pour les packs identité visuelle\n\nVous avez une question précise ? Allez-y, je suis là !",
      links: [{ label: 'Voir toute la FAQ', href: '/faq' }],
      options: [
        { label: 'Parlons de mon projet', value: 'projet' },
        { label: 'Comment vous contacter ?', value: 'contact' },
      ]
    }
  ],

  portfolio: [
    {
      content: "Notre portfolio, c'est notre fierté ! 🎨 On y met nos meilleurs projets : logos, identités visuelles, supports print, visuels réseaux sociaux, packaging…\n\nChaque projet est présenté comme une petite histoire : le besoin du client, notre approche créative, et le résultat final.\n\nJe vous recommande vraiment d'aller y jeter un œil, ça vous donnera une bonne idée de notre style !",
      links: [{ label: 'Découvrir le portfolio', href: '/portfolio' }],
      options: [
        { label: 'Ça me plaît, je veux un devis', value: 'devis' },
        { label: 'Quels sont vos tarifs ?', value: 'tarifs' },
      ]
    }
  ],

  revision: [
    {
      content: "Les révisions, c'est hyper important pour nous. On veut que vous soyez 100% satisfait.\n\nEn général, on inclut 2 à 3 révisions dans chaque projet. Ça veut dire qu'après la première proposition, vous pouvez demander des ajustements 2 ou 3 fois.\n\nSi jamais ça ne suffit pas (ça arrive rarement 😅), les révisions supplémentaires sont facturées à part.\n\n💡 Mon conseil : prenez le temps de bien rédiger votre brief au début, ça réduit beaucoup les allers-retours !",
      options: [
        { label: 'Comment se passe le brief ?', value: 'processus' },
        { label: 'OK, je veux commencer', value: 'devis' },
      ]
    }
  ],

  paiement: [
    {
      content: "Côté paiement, on est assez flexibles :\n\n📱 Mobile Money (Orange Money, Wave…) — c'est le plus utilisé par nos clients\n🏦 Virement bancaire — pour les entreprises\n💳 Carte bancaire — via Stripe, super pratique\n💰 PayPal — pour les clients internationaux\n\nPour tout projet, on demande un acompte de 50% avant de démarrer, et le solde à la livraison finale. C'est simple et transparent !",
      options: [
        { label: 'Et si je veux payer en plusieurs fois ?', value: 'echelon' },
        { label: 'OK, je veux un devis', value: 'devis' },
      ]
    }
  ],

  echelon: [
    {
      content: "Pour les projets importants (au-dessus de 300 000 FCFA), on peut s'arranger pour un paiement en 2 ou 3 fois. C'est du cas par cas, on en discute ensemble.\n\nL'idée c'est que le budget ne soit jamais un frein. Si vous avez un projet qui vous tient à cœur, parlons-en !",
      options: [
        { label: 'Super, je veux un devis', value: 'devis' },
        { label: 'Quels sont vos tarifs ?', value: 'tarifs' },
      ]
    }
  ],

  logo: [
    {
      content: "Le logo, c'est le cœur de votre marque ! ❤️ Chez Myms, voilà comment on procède :\n\nOn vous propose 3 concepts différents, basés sur votre brief. Vous choisissez votre préféré, on l'affine ensemble avec 2 révisions incluses.\n\nÀ la livraison, vous recevez le logo dans tous les formats : PNG, JPG, SVG, PDF et même le fichier source AI.\n\n💰 Ça démarre à 100 000 FCFA et ça prend environ 5-7 jours.\n\nSi vous voulez aller plus loin avec une charte graphique complète, jetez un œil à notre pack branding !",
      links: [{ label: 'Demander un devis logo', href: '/devis' }],
      options: [
        { label: 'Parle-moi du pack branding', value: 'branding' },
        { label: 'C\'est bon, je veux un devis', value: 'devis' },
      ]
    }
  ],

  print: [
    {
      content: "Le print, c'est notre dada ! 🖨️ On crée des supports qui font bonne impression (sans mauvais jeu de mots 😄) :\n\n📄 Flyers et affiches — à partir de 25 000 FCFA\n📖 Brochures et catalogues — à partir de 50 000 FCFA\n🏷️ Packaging — à partir de 75 000 FCFA\n🎪 Roll-ups et bannières — à partir de 30 000 FCFA\n\nOn gère aussi les cartes de visite, les menus, les invitations… bref, tout ce qui s'imprime !",
      links: [{ label: 'Demander un devis print', href: '/devis' }],
      options: [
        { label: 'Voir les tarifs complets', value: 'tarifs' },
        { label: 'C\'est quoi les délais ?', value: 'delais' },
      ]
    }
  ],

  digital: [
    {
      content: "Les visuels digitaux, c'est essentiel aujourd'hui ! 📱\n\nOn crée des visuels optimisés pour chaque plateforme : Instagram, Facebook, LinkedIn, TikTok… Le tout avec un design cohérent qui renforce votre marque.\n\nOn peut faire des posts uniques ou des packs complets avec un kit de templates que vous pourrez réutiliser.\n\n💰 Ça commence à 15 000 FCFA le visuel, avec des tarifs dégressifs pour les packs.",
      links: [{ label: 'Demander un devis', href: '/devis' }],
      options: [
        { label: 'Et le community management ?', value: 'communitymanagement' },
        { label: 'Vous avez des templates tout prêts ?', value: 'ressources' },
      ]
    }
  ],

  branding: [
    {
      content: "Le pack branding, c'est notre best-seller ! 🌟\n\nIl comprend tout ce qu'il faut pour lancer votre marque avec une image pro :\n\n🎨 Logo — 3 propositions + révisions\n🎨 Palette de couleurs sur mesure\n✍️ Choix de typographies\n📄 Carte de visite recto/verso\n📄 En-tête de lettre\n📖 Charte graphique complète\n📁 Tous les fichiers sources\n\n💰 À partir de 150 000 FCFA\n⏱️ Livré en 2-3 semaines\n\nC'est l'investissement le plus important pour une marque, et on le prend très au sérieux !",
      links: [{ label: 'Lancer mon branding', href: '/devis' }],
    }
  ],

  communitymanagement: [
    {
      content: "Le community management, c'est un vrai métier ! Et on adore ça. 📣\n\nOn prend en charge vos réseaux sociaux de A à Z :\n\n📝 Stratégie de contenu adaptée à votre marque\n📅 Calendrier éditorial mensuel\n🎨 Création de tous les visuels\n📤 Publication et programmation\n💬 Modération des commentaires\n📊 Reporting mensuel avec les résultats\n\nOn a des formules à partir de 100 000 FCFA/mois. Le contrat minimum, c'est 3 mois — le temps de voir les premiers résultats.\n\nOn en parle ?",
      links: [{ label: 'Demander un devis CM', href: '/devis' }],
    }
  ],

  ressources: [
    {
      content: "On a une boutique de ressources digitales ! 📦\n\nTemplates de posts Instagram, kits pour réseaux sociaux, calendriers éditoriaux, guides PDF sur le branding…\n\nCertaines sont gratuites (oui oui, gratuitement 😄), d'autres sont payantes mais vraiment abordables.\n\nC'est parfait si vous voulez vous débrouiller seul tout en ayant un rendu pro !",
      links: [{ label: 'Voir les ressources', href: '/ressources' }],
    }
  ],

  merci: () => ({
    content: pick([
      "De rien, c'est avec plaisir ! 😊 Si jamais vous avez d'autres questions plus tard, je suis toujours là. Bonne continuation !",
      "Avec plaisir ! N'hésitez vraiment pas à revenir si quelque chose vous vient à l'esprit. On est là pour ça ! 😊",
      "Tout le plaisir est pour moi ! 🤗 Je vous souhaite une excellente journée. Et si vous vous décidez pour un projet, on sera ravis de travailler avec vous !",
    ]),
    options: [
      { label: 'Demander un devis', value: 'devis' },
      { label: 'Voir le portfolio', value: 'portfolio' },
      { label: 'Contacter l\'équipe', value: 'contact' },
    ]
  }),

  bonjour: () => ({
    content: pick([
      "Salut ! 😊 Content de vous voir ici. Qu'est-ce que je peux faire pour vous ?",
      "Hey ! Bienvenue chez Myms. Vous avez un projet en tête ou vous voulez juste en savoir plus sur ce qu'on fait ?",
      "Bonjour ! 👋 Ravi de discuter avec vous. Comment je peux vous aider aujourd'hui ?",
    ]),
    options: [
      { label: "J'ai un projet", value: 'projet' },
      { label: 'Vos services', value: 'services' },
      { label: 'Vos tarifs', value: 'tarifs' },
    ]
  }),

  aurevoir: () => ({
    content: pick([
      "À bientôt ! 👋 N'hésitez pas à revenir quand vous voulez. Bonne journée !",
      "Au revoir et bonne continuation ! On espère vous recompter parmi nos clients bientôt 😊",
    ]),
  }),

  horssujet: [
    {
      content: "Ha, c'est une question intéressante, mais je suis spécialisé dans le design et la communication visuelle ! 😅\n\nJe peux vous aider sur tout ce qui touche au branding, au design graphique, aux réseaux sociaux et au community management.\n\nQu'est-ce que je peux faire pour vous dans ces domaines ?",
      options: [
        { label: 'Parle-moi de vos services', value: 'services' },
        { label: 'Je veux un devis', value: 'devis' },
        { label: 'Comment vous contacter ?', value: 'contact' },
      ]
    }
  ],

  default: [
    {
      content: "Hmm, je ne suis pas sûr de bien comprendre votre demande. 🤔 Mais pas de panique !\n\nDites-moi plutôt ce qui vous intéresse parmi nos domaines et je vous aide :",
      options: [
        { label: "J'ai un projet", value: 'projet' },
        { label: 'Vos services', value: 'services' },
        { label: 'Vos tarifs', value: 'tarifs' },
        { label: 'Comment ça marche ?', value: 'processus' },
        { label: 'Parler à un humain', value: 'contact' },
      ]
    },
    {
      content: "Je n'ai pas bien saisi, désolé ! 😅 Je suis encore en apprentissage. Peut-être que ces suggestions vous aideront ?",
      options: [
        { label: 'Je veux un devis', value: 'devis' },
        { label: 'Voir le portfolio', value: 'portfolio' },
        { label: 'Les questions fréquentes', value: 'faq' },
        { label: 'Contacter l\'équipe', value: 'contact' },
      ]
    }
  ],
};

// ===== DÉTECTION D'INTENTION AVANCÉE =====
interface IntentRule {
  intent: string;
  keywords: string[];
  phrases?: string[];
  priority?: number;
}

const INTENT_RULES: IntentRule[] = [
  // Salutations
  { intent: 'bonjour', keywords: ['bonjour', 'salut', 'hello', 'hey', 'bonsoir', 'coucou', 'hi', 'yo', 'wesh', 'salam'], priority: 1 },
  { intent: 'aurevoir', keywords: ['au revoir', 'bye', 'à bientôt', 'bonne journée', 'ciao', 'adieu', 'à plus'], priority: 1 },
  { intent: 'merci', keywords: ['merci', 'thanks', 'super', 'parfait', 'génial', 'cool', 'top', 'nickel', 'impeccable', 'excellent', 'bien reçu'], priority: 1 },

  // Intentions précises
  { intent: 'devis', keywords: ['devis', 'estimation', 'proposition'], phrases: ['je veux commander', 'je suis intéressé', 'commencer un projet'] },
  { intent: 'logo', keywords: ['logo', 'logotype', 'emblème'], phrases: ['créer un logo', 'besoin d\'un logo', 'refaire mon logo', 'nouveau logo'] },
  { intent: 'branding', keywords: ['branding', 'charte graphique', 'identité visuelle'], phrases: ['identité de marque', 'image de marque'] },
  { intent: 'communitymanagement', keywords: ['community management', 'community manager', 'cm'], phrases: ['gérer mes réseaux', 'gestion réseaux sociaux', 'publier sur instagram', 'gérer mon facebook'] },
  { intent: 'digital', keywords: [], phrases: ['visuels réseaux', 'post instagram', 'visuel facebook', 'bannière web', 'visuels sociaux', 'design digital'] },
  { intent: 'print', keywords: ['flyer', 'affiche', 'brochure', 'catalogue', 'packaging', 'dépliant', 'roll-up', 'menu', 'kakemono', 'carte de visite'] },
  { intent: 'services', keywords: ['services', 'prestations'], phrases: ['que faites-vous', 'quoi proposez', 'vos offres', 'que proposez'] },
  { intent: 'tarifs', keywords: ['tarif', 'prix', 'coût', 'fcfa', 'franc', 'budget'], phrases: ['combien ça coûte', 'combien coûte', 'c\'est combien', 'ça coûte combien', 'quel prix', 'quel tarif'] },
  { intent: 'delais', keywords: ['délai', 'durée'], phrases: ['combien de temps', 'ça prend combien', 'c\'est long', 'rapidement', 'en urgence', 'urgent'] },
  { intent: 'processus', keywords: ['processus', 'étapes', 'déroulement', 'méthodologie'], phrases: ['comment ça marche', 'comment ça se passe', 'comment vous travaillez', 'fonctionnement'] },
  { intent: 'contact', keywords: ['contact', 'téléphone', 'whatsapp', 'email', 'adresse'], phrases: ['vous joindre', 'vous appeler', 'vous écrire', 'parler à quelqu\'un', 'parler à un humain', 'un vrai humain'] },
  { intent: 'faq', keywords: ['faq'], phrases: ['questions fréquentes', 'j\'ai une question'] },
  { intent: 'portfolio', keywords: ['portfolio', 'réalisations', 'références'], phrases: ['voir vos travaux', 'vos créations', 'exemples de projets', 'montrez-moi'] },
  { intent: 'revision', keywords: ['révision', 'modification'], phrases: ['modifier', 'changer', 'pas satisfait', 'ajuster', 'retouche'] },
  { intent: 'paiement', keywords: ['paiement', 'acompte', 'virement', 'mobile money', 'orange money', 'wave', 'paypal', 'stripe', 'carte bancaire'], phrases: ['comment payer', 'moyens de paiement'] },
  { intent: 'packs', keywords: ['pack', 'formule', 'offre', 'forfait', 'abonnement'], phrases: ['proposez des packs'] },
  { intent: 'ressources', keywords: ['template', 'modèle', 'ressource', 'guide', 'ebook', 'mockup'], phrases: ['télécharger', 'ressources gratuites'] },

  // Hors sujet (piège pour les sujets non liés)
  { intent: 'horssujet', keywords: ['météo', 'football', 'politique', 'recette', 'cuisine', 'film', 'musique', 'jeu', 'sport', 'actualité', 'news', 'blague', 'joke', 'drôle', 'amour', 'dating'], priority: -1 },
];

function detectIntent(message: string): string {
  const lower = message.toLowerCase().trim();

  // Vérifier les phrases exactes d'abord
  for (const rule of INTENT_RULES) {
    if (rule.phrases) {
      for (const phrase of rule.phrases) {
        if (lower.includes(phrase)) {
          return rule.intent;
        }
      }
    }
  }

  // Puis les mots-clés
  for (const rule of INTENT_RULES) {
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) {
        return rule.intent;
      }
    }
  }

  // Messages très courts → probablement un salut ou un merci
  if (lower.length < 5) {
    if (['ok', 'oui', 'non', 'bien'].includes(lower)) return 'merci';
    return 'bonjour';
  }

  // Questions avec point d'interrogation → tenter FAQ
  if (lower.includes('?') && lower.length > 15) {
    return 'faq';
  }

  return 'default';
}

// ===== COMPOSANT CHATBOT =====
export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage('greeting');
      }, 500);
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const addBotMessage = (intentKey: string) => {
    const response = buildResponse(intentKey);
    const msg: Message = {
      id: `bot-${Date.now()}`,
      type: 'bot',
      content: response.content,
      timestamp: new Date(),
      options: response.options,
      links: response.links
    };
    setMessages(prev => [...prev, msg]);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    const intent = detectIntent(inputValue);
    setInputValue('');
    setIsTyping(true);

    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage(intent);
    }, delay);
  };

  const handleQuickOption = (value: string) => {
    // Retrouver le label pour l'afficher comme message utilisateur
    let label = value;
    for (const msg of messages) {
      const opt = msg.options?.find(o => o.value === value);
      if (opt) { label = opt.label; break; }
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: label,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage(value);
    }, 600 + Math.random() * 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  return (
    <>
      {/* Bouton flottant */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-card transition-all ${
          isOpen
            ? 'bg-surface-alt border border-border'
            : 'bg-gradient-to-r from-brand to-accent hover:shadow-accent/30 hover:shadow-xl'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 text-text-primary" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="relative">
              <MessageCircle className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-brand" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Fenêtre de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-surface-alt rounded-3xl border border-border shadow-2xl overflow-hidden"
          >
            {/* En-tête */}
            <div className="bg-gradient-to-r from-brand to-accent p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm">Myms Assistant</h3>
                  <p className="text-xs text-white/80 flex items-center gap-1">
                    <span className="w-2 h-2 bg-success rounded-full" />
                    En ligne · Répond instantanément
                  </p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                  <ChevronDown className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Zone de messages */}
            <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-surface">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${
                      message.type === 'bot'
                        ? 'bg-gradient-to-br from-brand to-accent'
                        : 'bg-surface'
                    }`}>
                      {message.type === 'bot' ? (
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-text-muted" />
                      )}
                    </div>

                    {/* Contenu */}
                    <div>
                      <div className={`rounded-2xl px-4 py-2.5 ${
                        message.type === 'bot'
                          ? 'bg-surface-alt border border-border text-text-primary'
                          : 'bg-brand text-white'
                      }`}>
                      <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                      </div>

                      {/* Pièces jointes */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.attachments.map((file, i) => (
                            <a
                              key={i}
                              href={file.url}
                              download={file.name}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-surface border border-border hover:border-brand text-text-secondary text-xs rounded-xl transition-colors group"
                              title={file.name}
                            >
                              <Paperclip className="w-4 h-4 text-brand" />
                              <span className="truncate max-w-[150px]">{file.name}</span>
                              <span className="text-text-muted">({(file.size / 1024).toFixed(1)}KB)</span>
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Liens */}
                      {message.links && message.links.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.links.map((link, i) => (
                            <Link
                              key={i}
                              to={link.href}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand hover:bg-brand-light text-white text-xs font-medium rounded-full transition-colors"
                            >
                              {link.label}
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Options rapides */}
                      {message.options && message.options.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.options.map((option, i) => (
                            <button
                              key={i}
                              onClick={() => handleQuickOption(option.value)}
                              className="px-3 py-1.5 bg-surface border border-border hover:border-brand text-text-secondary hover:text-text-primary text-xs rounded-full transition-all"
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}

                      <p className={`text-[10px] text-text-muted mt-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                        {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Indicateur de frappe */}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-surface-alt border border-border rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <div className="p-3 bg-surface border-t border-border">
              <div className="flex gap-2 items-end">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Écrivez votre message…"
                  className="flex-1 px-4 py-2.5 bg-surface-alt border border-border rounded-full text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                />

                {/* Bouton Envoi */}
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-brand to-accent flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-brand/30 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-text-muted text-center mt-2">
                Propulsé par Myms Studio · <Link to="/contact" className="text-brand hover:underline" onClick={() => setIsOpen(false)}>Parler à un humain</Link>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
