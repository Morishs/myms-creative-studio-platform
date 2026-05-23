import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { companyInfo } from '../../data';

const footerLinks = {
  services: [
    { label: 'Identité visuelle', href: '/services/identite-visuelle' },
    { label: 'Design graphique', href: '/services/design-graphique' },
    { label: 'Design digital', href: '/services/design-digital' },
    { label: 'Community Management', href: '/services/community-management' },
    { label: 'Ressources', href: '/ressources' },
  ],
  company: [
    { label: 'À propos', href: '/a-propos' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Blog', href: '/blog' },
    { label: 'Processus', href: '/processus' },
    { label: 'FAQ', href: '/faq' },
  ],
  legal: [
    { label: 'Mentions légales', href: '/mentions-legales' },
    { label: 'Politique de confidentialité', href: '/politique-de-confidentialite' },
    { label: 'CGV', href: '/conditions-generales-de-vente' },
  ],
};

const socialLinks = [
  { href: companyInfo.socialLinks.instagram, label: 'Instagram', emoji: '📸' },
  { href: companyInfo.socialLinks.linkedin, label: 'LinkedIn', emoji: '💼' },
  { href: companyInfo.socialLinks.facebook, label: 'Facebook', emoji: '👍' },
];

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-bold text-white font-['Sora']">
                Myms<span className="text-[#6C3CE1]">.</span>
              </span>
            </Link>
            <p className="text-[#A0A0A0] mb-6 max-w-sm">
              Studio créatif spécialisé en design graphique, infographie et community management. 
              Nous créons des identités visuelles fortes pour les marques ambitieuses.
            </p>
            <div className="space-y-3">
              <a 
                href={`mailto:${companyInfo.email}`}
                className="flex items-center gap-3 text-[#A0A0A0] hover:text-[#6C3CE1] transition-colors"
              >
                <Mail className="w-5 h-5" />
                {companyInfo.email}
              </a>
              <a 
                href={`tel:${companyInfo.phone}`}
                className="flex items-center gap-3 text-[#A0A0A0] hover:text-[#6C3CE1] transition-colors"
              >
                <Phone className="w-5 h-5" />
                {companyInfo.phone}
              </a>
              <div className="flex items-center gap-3 text-[#A0A0A0]">
                <MapPin className="w-5 h-5" />
                {companyInfo.address}
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-[#A0A0A0] hover:text-[#6C3CE1] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Entreprise</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-[#A0A0A0] hover:text-[#6C3CE1] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Légal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-[#A0A0A0] hover:text-[#6C3CE1] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-[#2A2A2A] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[#6B7280] text-sm">
            © {new Date().getFullYear()} Myms Studio. Tous droits réservés.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#A0A0A0] hover:text-[#6C3CE1] hover:border-[#6C3CE1] transition-all text-lg"
                aria-label={social.label}
              >
                {social.emoji}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
