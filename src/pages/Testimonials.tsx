import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Quote } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { testimonials } from '../data';

export function Testimonials() {
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
              Témoignages
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ce que nos clients{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-[#F59E0B]">
                disent de nous
              </span>
            </h1>
            <p className="text-xl text-[#A0A0A0]">
              La satisfaction de nos clients est notre plus grande fierté. 
              Découvrez leurs retours sur notre collaboration.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full relative">
                  {/* Quote icon */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-brand flex items-center justify-center">
                    <Quote className="w-6 h-6 text-white" />
                  </div>

                  <div className="pt-4">
                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < testimonial.rating ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#2A2A2A]'}`} 
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-lg text-[#A0A0A0] mb-6 italic leading-relaxed">
                      "{testimonial.content}"
                    </p>

                    {/* Service badge */}
                    {testimonial.serviceUsed && (
                      <Badge variant="primary" className="mb-4">
                        {testimonial.serviceUsed}
                      </Badge>
                    )}

                    {/* Author */}
                    <div className="flex items-center gap-4 pt-4 border-t border-[#2A2A2A]">
                      <img 
                        src={testimonial.avatar || 'https://via.placeholder.com/48'} 
                        alt={testimonial.clientName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-brand"
                      />
                      <div>
                        <div className="font-semibold text-white text-lg">
                          {testimonial.clientName}
                        </div>
                        <div className="text-[#6B7280]">
                          {testimonial.role}
                          {testimonial.company && `, ${testimonial.company}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-brand/10 to-[#F59E0B]/10 border-y border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-[#A0A0A0]">Clients satisfaits</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">5/5</div>
              <div className="text-[#A0A0A0]">Note moyenne</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">80+</div>
              <div className="text-[#A0A0A0]">Projets réalisés</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-[#A0A0A0]">Clients récurrents</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à devenir notre prochain client satisfait ?
            </h2>
            <p className="text-xl text-[#A0A0A0] mb-10">
              Rejoignez nos clients heureux et donnez vie à vos projets créatifs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
