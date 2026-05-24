import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Users, FileText, CheckCircle, PenTool, Presentation, RefreshCw, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { processSteps } from '../data';

const iconMap: Record<string, React.ReactNode> = {
  messageCircle: <MessageCircle className="w-6 h-6" />,
  users: <Users className="w-6 h-6" />,
  fileText: <FileText className="w-6 h-6" />,
  checkCircle: <CheckCircle className="w-6 h-6" />,
  penTool: <PenTool className="w-6 h-6" />,
  presentation: <Presentation className="w-6 h-6" />,
  refreshCw: <RefreshCw className="w-6 h-6" />,
  download: <Download className="w-6 h-6" />,
};

export function Process() {
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
            <span className="inline-block px-4 py-2 bg-brand/10 border border-brand/20 rounded-full text-brand text-sm font-medium mb-6">
              Notre méthode
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Processus de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-[#F59E0B]">
                travail
              </span>
            </h1>
            <p className="text-xl text-[#A0A0A0]">
              Découvrez comment nous travaillons ensemble pour donner vie à vos projets, 
              du premier contact jusqu'à la livraison finale.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand via-[#6C3CE1]/50 to-[#6C3CE1]/10"></div>

            {/* Steps */}
            <div className="space-y-16">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Number circle */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-brand to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#6C3CE1]/30 z-10">
                    {step.number}
                  </div>

                  {/* Content */}
                  <div className={`ml-24 md:ml-0 md:w-[calc(50%-4rem)] ${
                    index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'
                  }`}>
                    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 hover:border-brand/20 transition-colors">
                      <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center text-brand mb-4">
                        {iconMap[step.icon] || <CheckCircle className="w-6 h-6" />}
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-[#A0A0A0]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-brand to-accent">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à commencer ?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              La première étape est simple : parlez-nous de votre projet.
            </p>
            <Link to="/devis">
              <Button variant="secondary" size="lg">
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
