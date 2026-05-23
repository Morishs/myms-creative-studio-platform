import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Palette, Printer, Smartphone, Users, Download, Star, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionTitle } from '../components/ui/SectionTitle';
import { services, portfolioProjects, testimonials, stats, processSteps } from '../data';
import { appStore } from '../stores/appStore';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const iconMap: Record<string, React.ReactNode> = {
  palette: <Palette className="w-8 h-8" />,
  printer: <Printer className="w-8 h-8" />,
  smartphone: <Smartphone className="w-8 h-8" />,
  users: <Users className="w-8 h-8" />,
  download: <Download className="w-8 h-8" />,
};

export function Home() {
  const featuredProjects = portfolioProjects.filter(p => p.isFeatured).slice(0, 6);
  const [nlEmail, setNlEmail] = useState('');
  const [nlDone, setNlDone] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlEmail || !nlEmail.includes('@')) return;
    appStore.addNewsletterEmail(nlEmail);
    appStore.addToast({ type: 'success', title: 'Inscription réussie !', message: 'Vous recevrez bientôt nos dernières actus.' });
    setNlEmail('');
    setNlDone(true);
  };
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi0yLTQgMi00IDItNCAyIDIgMiA0LTIgNC0yIDQtMi0yLTItNCAyLTQgMi00IDIgMiAyIDQtMiA0LTIgNHoiIHN0cm9rZT0iIzJBMkEyQSIgc3Ryb2tlLXdpZHRoPSIuNSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#6C3CE1]/20 rounded-full blur-[128px]"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#F59E0B]/10 rounded-full blur-[128px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <motion.div 
            className="max-w-4xl"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.span 
              variants={fadeInUp}
              className="inline-block px-4 py-2 bg-[#6C3CE1]/10 border border-[#6C3CE1]/20 rounded-full text-[#6C3CE1] text-sm font-medium mb-6"
            >
              ✨ Studio Créatif
            </motion.span>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6"
            >
              Créons des{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C3CE1] to-[#F59E0B]">
                identités visuelles
              </span>{' '}
              qui marquent les esprits
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-[#A0A0A0] mb-10 max-w-2xl"
            >
              Myms est un studio créatif spécialisé en design graphique, infographie et community management. 
              Nous transformons vos idées en visuels percutants qui font la différence.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/devis">
                <Button variant="primary" size="lg">
                  Demander un devis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button variant="outline" size="lg">
                  Voir nos réalisations
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-32 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle 
            badge="Nos services"
            title="Ce que nous faisons"
            subtitle="Des solutions créatives adaptées à vos besoins pour donner vie à votre marque."
          />
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {services.slice(0, 5).map((service) => (
              <motion.div key={service.id} variants={fadeInUp}>
                <Link to={`/services/${service.slug}`}>
                  <Card hover className="h-full group">
                    <div className="w-14 h-14 rounded-xl bg-[#6C3CE1]/10 flex items-center justify-center text-[#6C3CE1] mb-6 group-hover:bg-[#6C3CE1] group-hover:text-white transition-all">
                      {iconMap[service.icon]}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#6C3CE1] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-[#A0A0A0] mb-4">
                      {service.shortDescription}
                    </p>
                    <span className="inline-flex items-center text-[#6C3CE1] text-sm font-medium">
                      En savoir plus
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="outline">
                Découvrir tous nos services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 md:py-32 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle 
            badge="Portfolio"
            title="Nos dernières réalisations"
            subtitle="Découvrez nos projets récents et voyez comment nous aidons nos clients à se démarquer."
          />
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {featuredProjects.map((project) => (
              <motion.div key={project.id} variants={fadeInUp}>
                <Link to={`/portfolio/${project.slug}`}>
                  <div className="group relative overflow-hidden rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#6C3CE1]/50 transition-all">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={project.coverImage} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-medium text-[#6C3CE1] uppercase tracking-wider">
                        {project.category}
                      </span>
                      <h3 className="text-lg font-semibold text-white mt-2 group-hover:text-[#6C3CE1] transition-colors">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Link to="/portfolio">
              <Button variant="outline">
                Voir tout le portfolio
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 md:py-32 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle 
            badge="Notre méthode"
            title="Processus de travail"
            subtitle="Une approche structurée pour des résultats exceptionnels."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.slice(0, 4).map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-[#6C3CE1] to-[#7C4CF1] flex items-center justify-center text-white font-bold text-lg">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[#A0A0A0] text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(100%-20px)] w-full h-px bg-gradient-to-r from-[#6C3CE1]/50 to-transparent"></div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/processus">
              <Button variant="outline">
                Voir le processus complet
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-[#6C3CE1]/10 to-[#F59E0B]/10 border-y border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-[#A0A0A0]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle 
            badge="Témoignages"
            title="Ce que nos clients disent"
            subtitle="La satisfaction de nos clients est notre meilleure récompense."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.slice(0, 4).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < testimonial.rating ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#2A2A2A]'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-[#A0A0A0] mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.avatar || 'https://via.placeholder.com/48'} 
                      alt={testimonial.clientName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-white">{testimonial.clientName}</div>
                      <div className="text-sm text-[#6B7280]">
                        {testimonial.role}{testimonial.company && `, ${testimonial.company}`}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/temoignages">
              <Button variant="outline">
                Voir tous les témoignages
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-full text-[#F59E0B] text-sm font-medium mb-6">
              📬 Newsletter
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Restez inspirés
            </h2>
            <p className="text-[#A0A0A0] mb-8">
              Recevez nos conseils design, nos nouveautés et nos ressources gratuites directement dans votre boîte mail.
            </p>
            {nlDone ? (
              <div className="flex items-center justify-center gap-2 p-4 bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg text-[#10B981]">
                <CheckCircle className="w-5 h-5" />
                <span>Merci ! Vous êtes inscrit à notre newsletter.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  required
                  value={nlEmail}
                  onChange={e => setNlEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="flex-1 px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#6C3CE1] focus:border-transparent"
                />
                <Button type="submit" variant="primary">
                  S'inscrire
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-[#6C3CE1] to-[#7C4CF1] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi0yLTQgMi00IDItNCAyIDIgMiA0LTIgNC0yIDQtMi0yLTItNCAyLTQgMi00IDIgMiAyIDQtMiA0LTIgNHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Un projet en tête ? Parlons-en.
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Demandez votre devis gratuit et recevez une réponse sous 24 à 48h. 
              Transformons votre vision en réalité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/devis">
                <Button variant="secondary" size="lg">
                  Demander un devis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                >
                  Nous contacter
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#10B981]" />
                <span>Devis gratuit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#10B981]" />
                <span>Réponse sous 48h</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#10B981]" />
                <span>Satisfaction garantie</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
