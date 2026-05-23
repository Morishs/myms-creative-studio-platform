import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Lightbulb, Target, Heart, Award, Zap, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionTitle } from '../components/ui/SectionTitle';

const values = [
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: 'Créativité',
    description: 'Chaque projet est une nouvelle opportunité d\'innover et de créer quelque chose d\'unique.'
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Professionnalisme',
    description: 'Nous respectons nos engagements : délais, qualité et communication transparente.'
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Écoute client',
    description: 'Votre vision est notre priorité. Nous prenons le temps de comprendre vos besoins.'
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Qualité',
    description: 'Des livrables irréprochables qui reflètent l\'excellence de votre marque.'
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Résultat',
    description: 'Au-delà du beau, nous créons des designs qui génèrent des résultats concrets.'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Accessibilité',
    description: 'Des services de qualité professionnelle accessibles à tous les budgets.'
  }
];

const skills = [
  { name: 'Adobe Photoshop', level: 95 },
  { name: 'Adobe Illustrator', level: 90 },
  { name: 'Adobe InDesign', level: 85 },
  { name: 'Figma', level: 88 },
  { name: 'Canva', level: 95 },
  { name: 'Community Management', level: 90 },
  { name: 'Stratégie de contenu', level: 85 },
  { name: 'Branding', level: 92 }
];

export function About() {
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
            <span className="inline-block px-4 py-2 bg-[#6C3CE1]/10 border border-[#6C3CE1]/20 rounded-full text-[#6C3CE1] text-sm font-medium mb-6">
              À propos
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Le studio créatif qui donne vie à vos{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C3CE1] to-[#F59E0B]">
                ambitions
              </span>
            </h1>
            <p className="text-xl text-[#A0A0A0]">
              Myms est un studio créatif passionné par le design et la communication visuelle. 
              Nous aidons les marques et entrepreneurs à se démarquer grâce à des créations 
              uniques et percutantes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-full text-[#F59E0B] text-sm font-medium mb-6">
                Notre histoire
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Une passion transformée en expertise
              </h2>
              <div className="space-y-4 text-[#A0A0A0]">
                <p>
                  Myms est né d'une passion profonde pour le design graphique et la communication visuelle. 
                  Fort de plusieurs années d'expérience dans le domaine créatif, le studio s'est donné 
                  pour mission d'accompagner les entrepreneurs et les marques dans leur développement visuel.
                </p>
                <p>
                  Aujourd'hui, Myms accompagne des dizaines de clients dans la création de leur identité 
                  visuelle, la gestion de leurs réseaux sociaux et la production de supports de 
                  communication percutants.
                </p>
                <p>
                  Notre approche combine créativité, stratégie et professionnalisme pour délivrer des 
                  résultats qui dépassent les attentes.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#6C3CE1]/20 to-[#F59E0B]/20 p-8 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-8xl">🎨</span>
                  <p className="mt-6 text-2xl font-bold text-white">Myms Studio</p>
                  <p className="text-[#A0A0A0]">Design & Communication</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#6C3CE1] rounded-2xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-[#6C3CE1]/30">
                <div className="w-14 h-14 rounded-xl bg-[#6C3CE1]/10 flex items-center justify-center text-[#6C3CE1] mb-6">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Notre mission</h3>
                <p className="text-[#A0A0A0]">
                  Aider les marques et entrepreneurs à se démarquer grâce à une communication 
                  visuelle forte et cohérente. Nous croyons que chaque marque mérite une 
                  identité visuelle qui reflète sa valeur unique.
                </p>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full border-[#F59E0B]/30">
                <div className="w-14 h-14 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] mb-6">
                  <Lightbulb className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Notre vision</h3>
                <p className="text-[#A0A0A0]">
                  Devenir le studio créatif de référence pour les marques ambitieuses en Afrique 
                  et au-delà. Nous aspirons à élever les standards du design graphique et de la 
                  communication visuelle.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle 
            badge="Nos valeurs"
            title="Ce qui nous guide"
            subtitle="Des principes forts qui façonnent notre façon de travailler et de créer."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <div className="w-12 h-12 rounded-lg bg-[#6C3CE1]/10 flex items-center justify-center text-[#6C3CE1] mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-[#A0A0A0] text-sm">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle 
            badge="Compétences"
            title="Notre expertise"
            subtitle="Des compétences techniques solides au service de votre créativité."
          />
          
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex justify-between mb-2">
                  <span className="text-white font-medium">{skill.name}</span>
                  <span className="text-[#6C3CE1]">{skill.level}%</span>
                </div>
                <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#6C3CE1] to-[#7C4CF1] rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.05 }}
                  />
                </div>
              </motion.div>
            ))}
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
              Prêt à travailler ensemble ?
            </h2>
            <p className="text-xl text-[#A0A0A0] mb-10">
              Découvrez nos services et donnez vie à vos projets créatifs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/services">
                <Button variant="primary" size="lg">
                  Découvrir nos services
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
