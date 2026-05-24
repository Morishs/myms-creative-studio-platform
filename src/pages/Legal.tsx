import { motion } from 'framer-motion';
import { companyInfo } from '../data';

export function LegalNotice() {
  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 bg-gradient-to-b from-surface to-surface-alt">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Mentions légales
            </h1>
            
            <div className="prose prose-invert prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-white">1. Informations légales</h2>
                <p className="text-text-muted">
                  <strong>Nom de l'entreprise :</strong> {companyInfo.name}<br />
                  <strong>Statut :</strong> Studio créatif indépendant<br />
                  <strong>Adresse :</strong> {companyInfo.address}<br />
                  <strong>Email :</strong> {companyInfo.email}<br />
                  <strong>Téléphone :</strong> {companyInfo.phone}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">2. Directeur de publication</h2>
                <p className="text-text-muted">
                  Le directeur de publication du site est le gérant de {companyInfo.name}.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">3. Hébergement</h2>
                <p className="text-text-muted">
                  Ce site est hébergé par Vercel Inc., situé à San Francisco, CA, USA.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">4. Propriété intellectuelle</h2>
                <p className="text-text-muted">
                  L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, etc.) 
                  est la propriété exclusive de {companyInfo.name}, à l'exception des éléments 
                  provenant de tiers. Toute reproduction, distribution, modification ou utilisation 
                  de ces contenus sans autorisation préalable est strictement interdite.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">5. Limitation de responsabilité</h2>
                <p className="text-text-muted">
                  {companyInfo.name} s'efforce d'assurer l'exactitude et la mise à jour des 
                  informations diffusées sur ce site. Toutefois, nous ne pouvons garantir 
                  l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 bg-gradient-to-b from-surface to-surface-alt">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Politique de confidentialité
            </h1>
            
            <div className="prose prose-invert prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-white">1. Collecte des données</h2>
                <p className="text-text-muted">
                  Nous collectons les informations que vous nous fournissez directement, notamment :
                </p>
                <ul className="text-text-muted list-disc pl-6 space-y-2">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone</li>
                  <li>Nom de l'entreprise (optionnel)</li>
                  <li>Détails de votre projet</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">2. Utilisation des données</h2>
                <p className="text-text-muted">
                  Vos données sont utilisées pour :
                </p>
                <ul className="text-text-muted list-disc pl-6 space-y-2">
                  <li>Répondre à vos demandes de devis</li>
                  <li>Assurer le suivi de vos projets</li>
                  <li>Vous envoyer des informations sur nos services (avec votre consentement)</li>
                  <li>Améliorer notre site et nos services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">3. Cookies</h2>
                <p className="text-text-muted">
                  Ce site utilise des cookies pour améliorer votre expérience de navigation. 
                  Vous pouvez configurer votre navigateur pour refuser les cookies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">4. Vos droits</h2>
                <p className="text-text-muted">
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="text-text-muted list-disc pl-6 space-y-2">
                  <li>Droit d'accès à vos données</li>
                  <li>Droit de rectification</li>
                  <li>Droit à l'effacement</li>
                  <li>Droit à la portabilité</li>
                  <li>Droit d'opposition</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">5. Contact</h2>
                <p className="text-text-muted">
                  Pour toute question concernant cette politique ou pour exercer vos droits, 
                  contactez-nous à : {companyInfo.email}
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export function TermsOfSale() {
  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 bg-gradient-to-b from-surface to-surface-alt">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Conditions Générales de Vente
            </h1>
            
            <div className="prose prose-invert prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-white">1. Objet</h2>
                <p className="text-text-muted">
                  Les présentes Conditions Générales de Vente régissent les relations contractuelles 
                  entre {companyInfo.name} et ses clients pour tous les services de design graphique, 
                  infographie et community management.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">2. Devis et commande</h2>
                <p className="text-text-muted">
                  Tout projet fait l'objet d'un devis détaillé gratuit. Le devis est valable 30 jours. 
                  L'acceptation du devis vaut commande et engagement ferme du client.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">3. Prix et paiement</h2>
                <p className="text-text-muted">
                  Les prix sont indiqués en FCFA. Un acompte de 50% est requis pour démarrer tout projet. 
                  Le solde est payable à la livraison finale. Les moyens de paiement acceptés sont : 
                  virement bancaire, Mobile Money, PayPal et Stripe.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">4. Délais</h2>
                <p className="text-text-muted">
                  Les délais de réalisation sont indiqués dans le devis. Ils commencent à courir 
                  à réception de l'acompte et des éléments nécessaires (brief, contenus, etc.).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">5. Révisions</h2>
                <p className="text-text-muted">
                  Chaque projet inclut un nombre de révisions défini dans le devis (généralement 2-3). 
                  Les révisions supplémentaires seront facturées selon le tarif en vigueur.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">6. Livraison</h2>
                <p className="text-text-muted">
                  Les fichiers sont livrés via l'espace client sécurisé dans les formats convenus. 
                  La livraison définitive intervient après paiement complet.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">7. Propriété intellectuelle</h2>
                <p className="text-text-muted">
                  Les droits de propriété sur les créations sont transférés au client après paiement 
                  complet. {companyInfo.name} se réserve le droit d'utiliser les créations à des fins 
                  de portfolio et promotion.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">8. Annulation</h2>
                <p className="text-text-muted">
                  En cas d'annulation par le client après validation du devis, l'acompte reste acquis. 
                  Les travaux déjà réalisés seront facturés au prorata.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">9. Litiges</h2>
                <p className="text-text-muted">
                  En cas de litige, les parties s'engagent à rechercher une solution amiable. 
                  À défaut, les tribunaux compétents seront ceux du lieu de résidence du prestataire.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
