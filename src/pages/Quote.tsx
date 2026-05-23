import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle, Clock, FileText, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { serviceOptions, budgetOptions, deadlineOptions, sourceOptions } from '../data';
import { appStore } from '../stores/appStore';
import { notificationStore } from '../stores/notificationStore';

const quoteSchema = z.object({
  fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  company: z.string().optional(),
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Numéro de téléphone invalide'),
  service: z.string().min(1, 'Veuillez sélectionner un service'),
  description: z.string().min(20, 'Décrivez votre projet en au moins 20 caractères'),
  budget: z.string().optional(),
  deadline: z.string().optional(),
  references: z.string().optional(),
  source: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

const benefits = [
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Réponse rapide',
    description: 'Recevez votre devis sous 24 à 48 heures'
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'Devis détaillé',
    description: 'Un devis clair avec tous les détails de la prestation'
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Sans engagement',
    description: 'Devis gratuit et sans aucun engagement'
  }
];

export function Quote() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#0A0A0A] px-6">
        <div className="max-w-xl w-full text-center">
          <div className="mb-6 rounded-3xl border border-[#2A2A2A] bg-[#111111] p-10">
            <h1 className="text-3xl font-bold text-white mb-4">Connexion requise</h1>
            <p className="text-[#A0A0A0] mb-8">
              Vous devez être connecté pour demander un devis et suivre votre demande depuis votre espace client.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button type="button" onClick={() => navigate('/auth/connexion', { state: { from: '/devis' } })}>
                Se connecter
              </Button>
              <Button variant="outline" type="button" onClick={() => navigate('/auth/inscription', { state: { from: '/devis' } })}>
                Créer un compte
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    appStore.addQuoteRequest({ fullName: data.fullName, email: data.email, phone: data.phone, service: data.service, description: data.description });
    appStore.addToast({ type: 'success', title: 'Demande envoyée !', message: 'Nous vous répondrons sous 24-48h.' });
    // Notify admin
    notificationStore.add({ userId: 'admin-1', type: 'quote', title: 'Nouvelle demande de devis', description: `${data.fullName} a soumis une demande pour : ${data.service}`, link: '/admin/demandes' });
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#0A0A0A]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md text-center px-6"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#10B981]/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[#10B981]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Demande envoyée !
          </h1>
          <p className="text-[#A0A0A0] mb-8">
            Merci pour votre demande de devis. Nous l'avons bien reçue et nous vous 
            répondrons sous 24 à 48 heures avec une proposition personnalisée.
          </p>
          <p className="text-sm text-[#6B7280]">
            Un email de confirmation vous a été envoyé.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-[#111111] to-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-2 bg-[#6C3CE1]/10 border border-[#6C3CE1]/20 rounded-full text-[#6C3CE1] text-sm font-medium mb-6">
              Demande de devis
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Parlons de votre{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C3CE1] to-[#F59E0B]">
                projet
              </span>
            </h1>
            <p className="text-xl text-[#A0A0A0]">
              Remplissez le formulaire ci-dessous pour recevoir un devis personnalisé. 
              Nous vous répondons sous 24 à 48 heures.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-[#0A0A0A] border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-[#6C3CE1]/10 flex items-center justify-center text-[#6C3CE1] flex-shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{benefit.title}</h3>
                  <p className="text-[#A0A0A0] text-sm">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto px-6">
          <Card className="p-8 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nom complet"
                  placeholder="John Doe"
                  required
                  error={errors.fullName?.message}
                  {...register('fullName')}
                />
                <Input
                  label="Entreprise"
                  placeholder="Nom de votre entreprise (optionnel)"
                  error={errors.company?.message}
                  {...register('company')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email"
                  type="email"
                  placeholder="john@exemple.com"
                  required
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="Téléphone / WhatsApp"
                  type="tel"
                  placeholder="+221 77 000 00 00"
                  required
                  error={errors.phone?.message}
                  {...register('phone')}
                />
              </div>

              {/* Project Info */}
              <Select
                label="Service souhaité"
                required
                placeholder="Sélectionnez un service"
                options={serviceOptions.map(s => ({ value: s, label: s }))}
                error={errors.service?.message}
                {...register('service')}
              />

              <Textarea
                label="Description du projet"
                placeholder="Décrivez votre projet en détail : vos besoins, vos objectifs, votre vision..."
                required
                rows={6}
                error={errors.description?.message}
                {...register('description')}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Budget estimé"
                  placeholder="Sélectionnez une fourchette"
                  options={budgetOptions.map(b => ({ value: b, label: b }))}
                  {...register('budget')}
                />
                <Select
                  label="Délai souhaité"
                  placeholder="Sélectionnez un délai"
                  options={deadlineOptions.map(d => ({ value: d, label: d }))}
                  {...register('deadline')}
                />
              </div>

              <Textarea
                label="Références / Inspirations"
                placeholder="Partagez des liens ou décrivez des exemples qui vous inspirent (optionnel)"
                rows={3}
                {...register('references')}
              />

              <Select
                label="Comment nous avez-vous connu ?"
                placeholder="Sélectionnez une option"
                options={sourceOptions.map(s => ({ value: s, label: s }))}
                {...register('source')}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
              >
                <Send className="w-5 h-5 mr-2" />
                Envoyer ma demande
              </Button>

              <p className="text-center text-sm text-[#6B7280]">
                En soumettant ce formulaire, vous acceptez nos{' '}
                <a href="/conditions-generales-de-vente" className="text-[#6C3CE1] hover:underline">
                  conditions générales
                </a>{' '}
                et notre{' '}
                <a href="/politique-de-confidentialite" className="text-[#6C3CE1] hover:underline">
                  politique de confidentialité
                </a>.
              </p>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}
