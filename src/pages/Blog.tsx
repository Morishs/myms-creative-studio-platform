import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Calendar, Clock, User, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { blogPosts } from '../data';
import { appStore } from '../stores/appStore';

export function Blog() {
  const [blogNlEmail, setBlogNlEmail] = useState('');
  const [blogNlDone, setBlogNlDone] = useState(false);
  const handleBlogNl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogNlEmail.includes('@')) return;
    appStore.addNewsletterEmail(blogNlEmail);
    appStore.addToast({ type: 'success', title: 'Inscrit !', message: 'Vous recevrez nos prochains articles.' });
    setBlogNlEmail('');
    setBlogNlDone(true);
  };
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
              Blog
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Conseils &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-[#F59E0B]">
                Inspirations
              </span>
            </h1>
            <p className="text-xl text-[#A0A0A0]">
              Articles, conseils et tendances sur le design graphique, le branding 
              et le community management.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`}>
                  <Card hover className="h-full overflow-hidden group">
                    <div className="aspect-video overflow-hidden -m-6 mb-0">
                      <img 
                        src={post.coverImage} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="pt-6">
                      <div className="flex items-center gap-4 mb-3">
                        <Badge variant="primary">{post.category}</Badge>
                        <span className="text-sm text-[#6B7280] flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime} min
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-brand transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-[#A0A0A0] text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
                        <span className="text-sm text-[#6B7280] flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-sm font-medium text-brand flex items-center gap-1">
                          Lire
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Restez informés
            </h2>
            <p className="text-[#A0A0A0] mb-8">
              Recevez nos derniers articles et conseils directement dans votre boîte mail.
            </p>
            {blogNlDone ? (
              <div className="flex items-center justify-center gap-2 p-4 bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg text-[#10B981]">
                <CheckCircle className="w-5 h-5" />
                <span>Merci ! Vous êtes inscrit.</span>
              </div>
            ) : (
              <form onSubmit={handleBlogNl} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  required
                  value={blogNlEmail}
                  onChange={e => setBlogNlEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="flex-1 px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
                <Button type="submit" variant="primary">
                  S'inscrire
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export function BlogDetail() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Article non trouvé</h1>
          <Link to="/blog">
            <Button variant="primary">Retour au blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-[#111111] to-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link to="/blog" className="inline-flex items-center gap-2 text-brand mb-6 hover:text-brand-light transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Retour au blog
            </Link>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge variant="primary">{post.category}</Badge>
              <span className="text-[#6B7280] flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              <span className="text-[#6B7280] flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime} min de lecture
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                <User className="w-5 h-5 text-brand" />
              </div>
              <div>
                <span className="text-white font-medium">{post.author}</span>
                <span className="text-[#6B7280] text-sm block">Auteur</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="aspect-video rounded-2xl overflow-hidden"
          >
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-[#A0A0A0] leading-relaxed mb-8">
              {post.excerpt}
            </p>
            <p className="text-[#A0A0A0] leading-relaxed">
              Cet article est un aperçu. Le contenu complet sera bientôt disponible.
              Restez à l'écoute pour plus de conseils et d'informations sur le design
              et la communication visuelle.
            </p>
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-[#2A2A2A]">
            <h4 className="text-white font-semibold mb-4">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="default">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Vous avez un projet ?
          </h2>
          <p className="text-xl text-[#A0A0A0] mb-10">
            Mettons en pratique ces conseils pour votre marque.
          </p>
          <Link to="/devis">
            <Button variant="primary" size="lg">
              Demander un devis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
