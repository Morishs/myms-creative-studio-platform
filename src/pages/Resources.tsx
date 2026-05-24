import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Download, ShoppingCart, Package, CheckCircle, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { resources } from '../data';
import { appStore } from '../stores/appStore';

const filterOptions = ['Tout', 'Gratuit', 'Payant', 'Templates', 'Guides', 'Kits'];

export function Resources() {
  const [activeFilter, setActiveFilter] = useState('Tout');

  const filteredResources = resources.filter(resource => {
    if (activeFilter === 'Tout') return true;
    if (activeFilter === 'Gratuit') return resource.isFree;
    if (activeFilter === 'Payant') return !resource.isFree;
    return resource.category === activeFilter;
  });

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-surface to-surface-alt">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-2 bg-brand/10 border border-brand/20 rounded-full text-brand text-sm font-medium mb-6">
              Ressources
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Templates &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-warning">
                Ressources
              </span>
            </h1>
            <p className="text-xl text-text-muted">
              Des ressources professionnelles pour booster votre communication visuelle. 
              Templates, guides et kits prêts à l'emploi.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-surface-alt border-b border-border-dark sticky top-20 z-40 backdrop-blur-md bg-surface-alt/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-brand text-white'
                    : 'bg-surface-dark text-text-muted hover:text-white border border-border-dark hover:border-brand'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-20 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/ressources/${resource.slug}`}>
                    <Card hover className="h-full overflow-hidden group">
                      <div className="aspect-[4/3] overflow-hidden -m-6 mb-0">
                        <img 
                          src={resource.coverImage} 
                          alt={resource.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="pt-6">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant={resource.isFree ? 'success' : 'primary'}>
                            {resource.isFree ? 'Gratuit' : `${resource.price?.toLocaleString()} ${resource.currency}`}
                          </Badge>
                          <span className="text-sm text-text-muted flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {resource.downloads}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-text-muted text-sm mb-4">
                          {resource.shortDescription}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-border-dark">
                          <span className="text-xs text-text-muted">{resource.fileFormat}</span>
                          <span className="text-sm font-medium text-brand flex items-center gap-1">
                            {resource.isFree ? 'Télécharger' : 'Acheter'}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredResources.length === 0 && (
            <div className="text-center py-20">
              <p className="text-text-muted">Aucune ressource trouvée dans cette catégorie.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ===== RESOURCE DETAIL =====
export function ResourceDetail() {
  const { slug } = useParams();
  const resource = resources.find(r => r.slug === slug);

  // Download flow state
  const [downloadEmail, setDownloadEmail] = useState('');
  const [downloadStep, setDownloadStep] = useState<'idle' | 'email' | 'done'>('idle');
  const [downloading, setDownloading] = useState(false);

  // Purchase flow state
  const [purchaseStep, setPurchaseStep] = useState<'idle' | 'form' | 'processing' | 'done'>('idle');
  const [payName, setPayName] = useState('');
  const [payEmail, setPayEmail] = useState('');
  const [payMethod, setPayMethod] = useState('');

  if (!resource) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Ressource non trouvée</h1>
          <Link to="/ressources">
            <Button variant="primary">Retour aux ressources</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Handle free download
  const handleFreeDownload = () => {
    if (downloadStep === 'idle') {
      setDownloadStep('email');
      return;
    }
    if (downloadStep === 'email') {
      if (!downloadEmail || !downloadEmail.includes('@')) return;
      setDownloading(true);
      appStore.addNewsletterEmail(downloadEmail);
      setTimeout(() => {
        setDownloading(false);
        setDownloadStep('done');
        appStore.addToast({ type: 'success', title: 'Téléchargement prêt !', message: 'Votre fichier est en cours de téléchargement.' });
        // Simulate actual download
        const link = document.createElement('a');
        link.href = resource.coverImage;
        link.download = `${resource.slug}.${resource.fileFormat.toLowerCase().split(',')[0].trim()}`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 1500);
    }
  };

  // Handle paid purchase
  const handlePurchase = () => {
    if (purchaseStep === 'idle') {
      setPurchaseStep('form');
      return;
    }
    if (purchaseStep === 'form') {
      if (!payName || !payEmail || !payEmail.includes('@') || !payMethod) return;
      setPurchaseStep('processing');
      setTimeout(() => {
        setPurchaseStep('done');
        appStore.addToast({ type: 'success', title: 'Achat confirmé !', message: `${resource.title} — Le téléchargement va commencer.` });
        // Simulate download
        const link = document.createElement('a');
        link.href = resource.coverImage;
        link.download = `${resource.slug}.${resource.fileFormat.toLowerCase().split(',')[0].trim()}`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 bg-gradient-to-b from-surface to-surface-alt">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/ressources" className="inline-flex items-center gap-2 text-brand mb-6 hover:text-brand-light transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Retour aux ressources
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Image */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-surface-dark">
                <img src={resource.coverImage} alt={resource.title} className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Badge variant={resource.isFree ? 'success' : 'primary'} className="mb-4">
                {resource.isFree ? 'Gratuit' : `${resource.price?.toLocaleString()} ${resource.currency}`}
              </Badge>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{resource.title}</h1>
              <p className="text-lg text-text-muted mb-8">{resource.description}</p>

              {/* Details card */}
              <Card className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-brand" />
                  Détails du fichier
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-muted">Format</span>
                    <p className="text-white font-medium">{resource.fileFormat}</p>
                  </div>
                  <div>
                    <span className="text-text-muted">Type</span>
                    <p className="text-white font-medium">{resource.type}</p>
                  </div>
                  <div>
                    <span className="text-text-muted">Compatibilité</span>
                    <p className="text-white font-medium">{resource.compatibility.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-text-muted">Téléchargements</span>
                    <p className="text-white font-medium">{resource.downloads}+</p>
                  </div>
                </div>
              </Card>

              {/* ===== FREE DOWNLOAD FLOW ===== */}
              {resource.isFree && (
                <div>
                  {downloadStep === 'done' ? (
                    <div className="p-6 bg-success/10 border border-[#10B981]/30 rounded-xl text-center">
                      <CheckCircle className="w-10 h-10 text-success mx-auto mb-3" />
                      <p className="font-semibold text-white mb-1">Téléchargement lancé !</p>
                      <p className="text-sm text-text-muted">Le fichier va se télécharger automatiquement. Vérifiez votre dossier de téléchargements.</p>
                      <Button variant="outline" size="sm" className="mt-4" onClick={() => {
                        const link = document.createElement('a');
                        link.href = resource.coverImage;
                        link.download = resource.slug;
                        link.target = '_blank';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}>
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger à nouveau
                      </Button>
                    </div>
                  ) : downloadStep === 'email' ? (
                    <Card className="border-brand/20">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-brand" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">Entrez votre email</p>
                          <p className="text-xs text-text-muted">Pour recevoir le lien de téléchargement</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          required
                          placeholder="votre@email.com"
                          value={downloadEmail}
                          onChange={e => setDownloadEmail(e.target.value)}
                          className="flex-1"
                        />
                        <Button variant="primary" onClick={handleFreeDownload} isLoading={downloading}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-text-muted mt-2">Vous serez inscrit à notre newsletter. Désabonnement possible à tout moment.</p>
                    </Card>
                  ) : (
                    <Button variant="primary" size="lg" className="w-full" onClick={handleFreeDownload}>
                      <Download className="w-5 h-5 mr-2" />
                      Télécharger gratuitement
                    </Button>
                  )}
                </div>
              )}

              {/* ===== PAID PURCHASE FLOW ===== */}
              {!resource.isFree && (
                <div>
                  {purchaseStep === 'done' ? (
                    <div className="p-6 bg-success/10 border border-[#10B981]/30 rounded-xl text-center">
                      <CheckCircle className="w-10 h-10 text-success mx-auto mb-3" />
                      <p className="font-semibold text-white mb-1">Achat confirmé !</p>
                      <p className="text-sm text-text-muted mb-1">Votre fichier se télécharge automatiquement.</p>
                      <p className="text-xs text-text-muted">Un reçu a été envoyé à {payEmail}</p>
                      <Button variant="outline" size="sm" className="mt-4" onClick={() => {
                        const link = document.createElement('a');
                        link.href = resource.coverImage;
                        link.download = resource.slug;
                        link.target = '_blank';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}>
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger à nouveau
                      </Button>
                    </div>
                  ) : purchaseStep === 'processing' ? (
                    <div className="p-8 bg-surface-dark border border-border-dark rounded-xl text-center">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-brand border-t-transparent animate-spin" />
                      <p className="font-semibold text-white mb-1">Traitement du paiement…</p>
                      <p className="text-sm text-text-muted">Veuillez patienter quelques instants.</p>
                    </div>
                  ) : purchaseStep === 'form' ? (
                    <Card className="border-brand/20">
                      <h3 className="font-semibold text-white mb-1">Finaliser l'achat</h3>
                      <p className="text-sm text-text-muted mb-4">
                        {resource.title} — <span className="text-brand font-semibold">{resource.price?.toLocaleString()} {resource.currency}</span>
                      </p>
                      <div className="space-y-3">
                        <Input
                          label="Nom complet"
                          required
                          placeholder="Jean Dupont"
                          value={payName}
                          onChange={e => setPayName(e.target.value)}
                        />
                        <Input
                          label="Email"
                          type="email"
                          required
                          placeholder="votre@email.com"
                          value={payEmail}
                          onChange={e => setPayEmail(e.target.value)}
                        />
                        <div>
                          <label className="block text-sm font-medium text-text-muted mb-2">Moyen de paiement <span className="text-error-light">*</span></label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'mobile', label: '📱 Mobile Money', sub: 'Orange Money, Wave' },
                              { id: 'card', label: '💳 Carte bancaire', sub: 'Visa, Mastercard' },
                              { id: 'paypal', label: '🅿️ PayPal', sub: 'Compte PayPal' },
                              { id: 'transfer', label: '🏦 Virement', sub: 'Bancaire' },
                            ].map(m => (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => setPayMethod(m.id)}
                                className={`p-3 rounded-lg border text-left transition-all ${
                                  payMethod === m.id
                                    ? 'border-brand bg-brand/10'
                                    : 'border-border-dark bg-surface-alt hover:border-[#3A3A3A]'
                                }`}
                              >
                                <span className="text-sm font-medium text-white block">{m.label}</span>
                                <span className="text-xs text-text-muted">{m.sub}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="pt-3 border-t border-border-dark flex items-center justify-between">
                          <span className="text-text-muted">Total à payer</span>
                          <span className="text-xl font-bold text-white">{resource.price?.toLocaleString()} {resource.currency}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1" onClick={() => setPurchaseStep('idle')}>
                            Annuler
                          </Button>
                          <Button variant="primary" className="flex-1" onClick={handlePurchase}>
                            Payer maintenant
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Button variant="primary" size="lg" className="w-full" onClick={handlePurchase}>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Acheter — {resource.price?.toLocaleString()} {resource.currency}
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
