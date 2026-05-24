import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Mail, Phone, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { companyInfo } from '../data';
import { appStore } from '../stores/appStore';

const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  subject: z.string().min(1, 'Veuillez sélectionner un sujet'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const subjectOptions = [
  { value: 'general', label: 'Question générale' },
  { value: 'devis', label: 'Demande de devis' },
  { value: 'collaboration', label: 'Proposition de collaboration' },
  { value: 'support', label: 'Support / Aide' },
  { value: 'autre', label: 'Autre' },
];

const contactInfo = [
  {
    icon: <Mail className="w-6 h-6" />,
    label: 'Email',
    value: companyInfo.email,
    href: `mailto:${companyInfo.email}`
  },
  {
    icon: <Phone className="w-6 h-6" />,
    label: 'Téléphone / WhatsApp',
    value: companyInfo.phone,
    href: `tel:${companyInfo.phone}`
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    label: 'Localisation',
    value: companyInfo.address,
    href: null
  },
  {
    icon: <Clock className="w-6 h-6" />,
    label: 'Horaires',
    value: 'Lun - Ven : 9h - 18h',
    href: null
  }
];

export function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    appStore.addContactMessage(data);
    appStore.addToast({ type: 'success', title: 'Message envoyé !', message: 'Nous vous répondrons rapidement.' });
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-surface-alt">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md text-center px-6"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Message envoyé !
          </h1>
          <p className="text-text-muted mb-8">
            Merci pour votre message. Nous l'avons bien reçu et nous vous 
            répondrons dans les plus brefs délais.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-surface to-surface-alt">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-2 bg-brand/10 border border-brand/20 rounded-full text-brand text-sm font-medium mb-6">
              Contact
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Restons en{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-warning">
                contact
              </span>
            </h1>
            <p className="text-xl text-text-muted">
              Une question, une idée de projet ou juste envie de dire bonjour ? 
              N'hésitez pas à nous contacter.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-8">Nos coordonnées</h2>
              
              {contactInfo.map((item) => (
                <Card key={item.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center text-brand flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm text-text-muted mb-1">{item.label}</p>
                    {item.href ? (
                      <a 
                        href={item.href}
                        className="text-white hover:text-brand transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-white">{item.value}</p>
                    )}
                  </div>
                </Card>
              ))}

              {/* Social Links */}
              <div className="pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Suivez-nous</h3>
                <div className="flex gap-4">
                  <a 
                    href={companyInfo.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-lg bg-surface-dark border border-border-dark flex items-center justify-center text-xl hover:border-brand hover:text-brand transition-all"
                  >
                    📸
                  </a>
                  <a 
                    href={companyInfo.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-lg bg-surface-dark border border-border-dark flex items-center justify-center text-xl hover:border-brand hover:text-brand transition-all"
                  >
                    💼
                  </a>
                  <a 
                    href={companyInfo.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-lg bg-surface-dark border border-border-dark flex items-center justify-center text-xl hover:border-brand hover:text-brand transition-all"
                  >
                    👍
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-white mb-8">Envoyez-nous un message</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nom complet"
                      placeholder="John Doe"
                      required
                      error={errors.name?.message}
                      {...register('name')}
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="john@exemple.com"
                      required
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>

                  <Select
                    label="Sujet"
                    required
                    placeholder="Sélectionnez un sujet"
                    options={subjectOptions}
                    error={errors.subject?.message}
                    {...register('subject')}
                  />

                  <Textarea
                    label="Message"
                    placeholder="Votre message..."
                    required
                    rows={6}
                    error={errors.message?.message}
                    {...register('message')}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full md:w-auto"
                    isLoading={isSubmitting}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Envoyer le message
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
