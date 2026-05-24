import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Accordion } from '../components/ui/Accordion';
import { faqItems } from '../data';

export function FAQ() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Get unique categories
  const categories = [...new Set(faqItems.map(item => item.category))];
  
  // Filter FAQs by category
  const filteredFaqs = activeCategory 
    ? faqItems.filter(item => item.category === activeCategory)
    : faqItems;

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
            <span className="inline-block px-4 py-2 bg-brand/10 border border-brand/20 rounded-full text-brand text-sm font-medium mb-6">
              FAQ
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Questions{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-[#F59E0B]">
                fréquentes
              </span>
            </h1>
            <p className="text-xl text-[#A0A0A0]">
              Retrouvez les réponses aux questions les plus courantes sur nos services, 
              notre processus et nos tarifs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-[#0A0A0A] border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === null
                  ? 'bg-brand text-white'
                  : 'bg-[#1A1A1A] text-[#A0A0A0] hover:text-white border border-[#2A2A2A] hover:border-brand'
              }`}
            >
              Tout
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-brand text-white'
                    : 'bg-[#1A1A1A] text-[#A0A0A0] hover:text-white border border-[#2A2A2A] hover:border-brand'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Accordion 
              items={filteredFaqs.map(faq => ({
                id: faq.id,
                title: faq.question,
                content: faq.answer
              }))}
            />
          </motion.div>
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
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand/10 flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-brand" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Vous n'avez pas trouvé votre réponse ?
            </h2>
            <p className="text-xl text-[#A0A0A0] mb-10">
              N'hésitez pas à nous contacter, nous serons ravis de vous aider.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="primary" size="lg">
                  Nous contacter
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/devis">
                <Button variant="outline" size="lg">
                  Demander un devis
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
