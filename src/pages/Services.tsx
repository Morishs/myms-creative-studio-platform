import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Palette, Printer, Smartphone, Users, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Badge } from '../components/ui/Badge';
import { services } from '../data';

const iconMap: Record<string, React.ReactNode> = {
  palette: <Palette className="w-8 h-8" />,
  printer: <Printer className="w-8 h-8" />,
  smartphone: <Smartphone className="w-8 h-8" />,
  users: <Users className="w-8 h-8" />,
  download: <Download className="w-8 h-8" />,
};

export function Services() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-[#111111] to-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-2 bg-[#6C3CE1]/10 border border-[#6C3CE1]/20 rounded-full text-[#6C3CE1] text-sm font-medium mb-6">
              Nos services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Des solutions créatives pour{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C3CE1] to-[#F59E0B]">
                chaque besoin
              </span>
            </h1>
            <p className="text-xl text-[#A0A0A0]">
              Du logo à la gestion complète de vos réseaux sociaux, nous proposons une gamme 
              complète de services pour développer votre présence visuelle.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-32">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-[#6C3CE1]/10 flex items-center justify-center text-[#6C3CE1]">
                      {iconMap[service.icon]}
                    </div>
                    <Badge variant="primary">{service.pricing}</Badge>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {service.title}
                  </h2>
                  
                  <p className="text-lg text-[#A0A0A0] mb-8">
                    {service.description}
                  </p>
                  
                  <div className="mb-8">
                    <h4 className="text-white font-semibold mb-4">Ce qui est inclus :</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-[#A0A0A0]">
                          <Check className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link to="/devis">
                    <Button variant="primary">
                      Demander un devis
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <Card className="aspect-square flex items-center justify-center bg-gradient-to-br from-[#6C3CE1]/10 to-[#F59E0B]/10 border-[#6C3CE1]/20">
                    <div className="text-center p-8">
                      <div className="w-24 h-24 mx-auto rounded-2xl bg-[#6C3CE1]/20 flex items-center justify-center text-[#6C3CE1] mb-6">
                        {iconMap[service.icon]}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                      <p className="text-[#A0A0A0]">{service.shortDescription}</p>
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#6C3CE1] to-[#7C4CF1]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Besoin d'un service personnalisé ?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Chaque projet est unique. Contactez-nous pour discuter de vos besoins 
              et obtenir une solution sur mesure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/devis">
                <Button variant="secondary" size="lg">
                  Demander un devis gratuit
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
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export function ServiceDetail() {
  const { slug } = useParams();
  const service = services.find(s => s.slug === slug);

  if (!service) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Service non trouvé</h1>
          <Link to="/services">
            <Button variant="primary">Retour aux services</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-[#111111] to-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <Link to="/services" className="inline-flex items-center gap-2 text-[#6C3CE1] mb-6 hover:text-[#7C4CF1] transition-colors">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Tous les services
            </Link>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-[#6C3CE1]/10 flex items-center justify-center text-[#6C3CE1]">
                {iconMap[service.icon]}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {service.title}
            </h1>
            
            <p className="text-xl text-[#A0A0A0] mb-8">
              {service.description}
            </p>
            
            <Badge variant="primary" className="text-lg px-4 py-2">
              {service.pricing}
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle 
            title="Ce qui est inclus"
            subtitle="Tous les éléments inclus dans cette prestation."
            align="left"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center text-[#10B981] flex-shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{feature}</h3>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Intéressé par ce service ?
            </h2>
            <p className="text-xl text-[#A0A0A0] mb-10">
              Demandez un devis personnalisé et recevez une réponse sous 48h.
            </p>
            <Link to="/devis">
              <Button variant="primary" size="lg">
                Demander un devis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
