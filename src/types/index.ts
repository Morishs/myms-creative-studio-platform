// ===== MYMS TYPE DEFINITIONS =====

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  features: string[];
  pricing?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  client?: string;
  date: string;
  context: string;
  objective: string;
  solution: string;
  result?: string;
  tools: string[];
  images: string[];
  coverImage: string;
  isFeatured: boolean;
}

export interface Testimonial {
  id: string;
  clientName: string;
  company?: string;
  role?: string;
  content: string;
  rating: number;
  avatar?: string;
  serviceUsed?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  readTime: number;
  publishedAt: string;
  author: string;
}

export interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  category: string;
  type: 'TEMPLATE' | 'KIT' | 'GUIDE' | 'EBOOK' | 'MOCKUP' | 'PRESET' | 'ICON_PACK' | 'OTHER';
  isFree: boolean;
  price?: number;
  currency?: string;
  fileFormat: string;
  compatibility: string[];
  downloads: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface QuoteRequest {
  fullName: string;
  company?: string;
  email: string;
  phone: string;
  services: string[];
  description: string;
  budget?: string;
  deadline?: string;
  references?: string;
  source?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
}
