import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Calendar, Wrench } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { portfolioProjects, portfolioCategories } from '../data';

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('Tout');

  const filteredProjects = activeCategory === 'Tout' 
    ? portfolioProjects 
    : portfolioProjects.filter(p => p.category === activeCategory);

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
              Portfolio
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Nos{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-[#F59E0B]">
                réalisations
              </span>
            </h1>
            <p className="text-xl text-[#A0A0A0]">
              Découvrez nos projets récents et voyez comment nous aidons 
              nos clients à se démarquer avec des créations uniques.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-[#0A0A0A] border-b border-[#2A2A2A] sticky top-20 z-40 backdrop-blur-md bg-[#0A0A0A]/90">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {portfolioCategories.map((category) => (
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

      {/* Projects Grid */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/portfolio/${project.slug}`}>
                    <div className="group relative overflow-hidden rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] hover:border-brand/20 transition-all">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img 
                          src={project.coverImage} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                          <span className="inline-flex items-center gap-2 text-white font-medium">
                            Voir le projet
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="primary">{project.category}</Badge>
                          <span className="text-sm text-[#6B7280]">{project.date}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-brand transition-colors">
                          {project.title}
                        </h3>
                        {project.client && (
                          <p className="text-sm text-[#6B7280] mt-1">Client: {project.client}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[#A0A0A0]">Aucun projet trouvé dans cette catégorie.</p>
            </div>
          )}
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
              Vous avez un projet similaire ?
            </h2>
            <p className="text-xl text-[#A0A0A0] mb-10">
              Parlons de votre projet et créons ensemble quelque chose d'unique.
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

export function PortfolioDetail() {
  const { slug } = useParams();
  const project = portfolioProjects.find(p => p.slug === slug);
  const currentIndex = portfolioProjects.findIndex(p => p.slug === slug);
  const prevProject = currentIndex > 0 ? portfolioProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < portfolioProjects.length - 1 ? portfolioProjects[currentIndex + 1] : null;

  if (!project) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Projet non trouvé</h1>
          <Link to="/portfolio">
            <Button variant="primary">Retour au portfolio</Button>
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
          >
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-brand mb-6 hover:text-brand-light transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Retour au portfolio
            </Link>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge variant="primary">{project.category}</Badge>
              <div className="flex items-center gap-2 text-[#6B7280]">
                <Calendar className="w-4 h-4" />
                {project.date}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {project.title}
            </h1>
            
            {project.client && (
              <p className="text-xl text-[#A0A0A0]">
                Client: <span className="text-white">{project.client}</span>
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Image */}
      <section className="bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl overflow-hidden"
          >
            <img 
              src={project.coverImage} 
              alt={project.title}
              className="w-full aspect-video object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Contexte</h2>
                <p className="text-[#A0A0A0]">{project.context}</p>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Objectif</h2>
                <p className="text-[#A0A0A0]">{project.objective}</p>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Solution</h2>
                <p className="text-[#A0A0A0]">{project.solution}</p>
              </div>
              
              {project.result && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Résultat</h2>
                  <p className="text-[#A0A0A0]">{project.result}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <Card>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-brand" />
                  Outils utilisés
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <Badge key={tool} variant="default">{tool}</Badge>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 bg-[#111111] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            {prevProject ? (
              <Link 
                to={`/portfolio/${prevProject.slug}`}
                className="flex items-center gap-3 text-[#A0A0A0] hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <div>
                  <span className="text-sm text-[#6B7280] block">Projet précédent</span>
                  <span className="font-medium">{prevProject.title}</span>
                </div>
              </Link>
            ) : <div />}
            
            {nextProject && (
              <Link 
                to={`/portfolio/${nextProject.slug}`}
                className="flex items-center gap-3 text-[#A0A0A0] hover:text-white transition-colors group text-right"
              >
                <div>
                  <span className="text-sm text-[#6B7280] block">Projet suivant</span>
                  <span className="font-medium">{nextProject.title}</span>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-brand to-accent">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Vous avez un projet similaire ?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Demandez un devis gratuit et donnons vie à votre vision.
          </p>
          <Link to="/devis">
            <Button variant="secondary" size="lg">
              Demander un devis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
