import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  LogIn, UserPlus, Mail, KeyRound, Eye, EyeOff, ArrowRight, 
  AlertCircle, CheckCircle, User, Building2, Briefcase
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { useAuth, type AccountType } from '../../contexts/AuthContext';

// ===== LOGIN =====
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});
type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, user } = useAuth();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const isAdminUser = ['SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'SALES_MANAGER', 'CONTENT_MANAGER', 'SUPPORT'].includes(user.role);
      const fromPath = (location.state as { from?: string })?.from;
      if (!isAdminUser && fromPath) {
        navigate(fromPath, { replace: true });
      } else {
        navigate(isAdminUser ? '/admin/dashboard' : '/client/dashboard', { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, user, navigate, location.state]);

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setIsSubmitting(true);
    const success = await login(data.email, data.password);
    setIsSubmitting(false);
    if (success) {
      const storedUser = JSON.parse(localStorage.getItem('myms_user') || '{}');
      const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'SALES_MANAGER', 'CONTENT_MANAGER', 'SUPPORT'];
      const fromPath = (location.state as { from?: string })?.from;
      if (!adminRoles.includes(storedUser.role) && fromPath) {
        navigate(fromPath, { replace: true });
      } else if (adminRoles.includes(storedUser.role)) {
        navigate('/admin/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-6 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-10 md:top-1/4 right-0 md:right-1/4 w-56 sm:w-72 md:w-96 h-56 sm:h-72 md:h-96 bg-[#6C3CE1]/10 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-10 md:bottom-1/4 left-0 md:left-1/4 w-56 sm:w-72 md:w-96 h-56 sm:h-72 md:h-96 bg-[#F59E0B]/5 rounded-full blur-[128px] pointer-events-none"></div>

      {/* Bouton retour */}
      <button
        onClick={handleGoBack}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#A0A0A0] hover:text-white hover:border-[#6C3CE1] transition-all"
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        <span className="text-sm">Retour</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <span className="text-3xl font-bold text-white font-['Sora']">
              Myms<span className="text-[#6C3CE1]">.</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Bon retour !</h1>
          <p className="text-[#A0A0A0]">Connectez-vous à votre espace</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg text-[#EF4444] text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="votre@email.com"
              required
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-[#6B7280] hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link to="/auth/mot-de-passe-oublie" className="text-sm text-[#6C3CE1] hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            <Button type="submit" variant="primary" className="w-full" size="lg" isLoading={isSubmitting}>
              <LogIn className="w-5 h-5 mr-2" />
              Se connecter
            </Button>
          </form>

          <div className="mt-6 text-center text-[#A0A0A0]">
            Pas encore de compte ?{' '}
            <Link to="/auth/inscription" className="text-[#6C3CE1] hover:underline font-medium">
              Créer un compte
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// ===== REGISTER =====
// Base schema for common fields
const baseRegisterSchema = {
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Téléphone invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter les CGU'
  })
};

// Individual schema
const individualSchema = z.object({
  ...baseRegisterSchema,
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  company: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

// Company schema
const companySchema = z.object({
  ...baseRegisterSchema,
  companyName: z.string().min(2, 'Le nom de l\'entreprise est requis'),
  companySector: z.string().min(1, 'Le secteur d\'activité est requis'),
  companyRegistration: z.string().optional(),
  companyAddress: z.string().optional(),
  companyCity: z.string().optional(),
  companyCountry: z.string().optional(),
  firstName: z.string().min(2, 'Le prénom est requis'),
  lastName: z.string().min(2, 'Le nom est requis'),
  position: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type IndividualFormData = z.infer<typeof individualSchema>;
type CompanyFormData = z.infer<typeof companySchema>;

const sectorOptions = [
  { value: 'tech', label: 'Technologie / IT' },
  { value: 'commerce', label: 'Commerce / Retail' },
  { value: 'services', label: 'Services' },
  { value: 'industrie', label: 'Industrie / Manufacture' },
  { value: 'sante', label: 'Santé / Médical' },
  { value: 'education', label: 'Éducation / Formation' },
  { value: 'immobilier', label: 'Immobilier' },
  { value: 'restauration', label: 'Restauration / Hôtellerie' },
  { value: 'mode', label: 'Mode / Beauté' },
  { value: 'media', label: 'Média / Communication' },
  { value: 'finance', label: 'Finance / Banque' },
  { value: 'autre', label: 'Autre' },
];

export function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerUser } = useAuth();
  const [accountType, setAccountType] = useState<AccountType>('INDIVIDUAL');

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Individual form
  const individualForm = useForm<IndividualFormData>({
    resolver: zodResolver(individualSchema),
  });

  // Company form
  const companyForm = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  const onSubmitIndividual = async (data: IndividualFormData) => {
    setError('');
    setIsLoading(true);
    const success = await registerUser({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      company: data.company,
      accountType: 'INDIVIDUAL'
    });
    setIsLoading(false);
    if (success) {
      const fromPath = (location.state as { from?: string })?.from;
      if (fromPath) {
        navigate(fromPath, { replace: true });
      } else {
        navigate('/client/dashboard');
      }
    } else {
      setError('Cet email est déjà utilisé');
    }
  };

  const onSubmitCompany = async (data: CompanyFormData) => {
    setError('');
    setIsLoading(true);
    const success = await registerUser({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      accountType: 'COMPANY',
      companyName: data.companyName,
      companySector: data.companySector,
      companyRegistration: data.companyRegistration,
      companyAddress: data.companyAddress,
      companyCity: data.companyCity,
      companyCountry: data.companyCountry,
      position: data.position
    });
    setIsLoading(false);
    if (success) {
      const fromPath = (location.state as { from?: string })?.from;
      if (fromPath) {
        navigate(fromPath, { replace: true });
      } else {
        navigate('/client/dashboard');
      }
    } else {
      setError('Cet email est déjà utilisé');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center px-6 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#6C3CE1]/10 rounded-full blur-[128px]"></div>

      {/* Bouton retour */}
      <button
        onClick={handleGoBack}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#A0A0A0] hover:text-white hover:border-[#6C3CE1] transition-all"
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        <span className="text-sm">Retour</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <span className="text-3xl font-bold text-white font-['Sora']">
              Myms<span className="text-[#6C3CE1]">.</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Créer un compte</h1>
          <p className="text-[#A0A0A0]">Rejoignez Myms et suivez vos projets</p>
        </div>

        {/* Account Type Selector */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => { setAccountType('INDIVIDUAL'); setStep(1); }}
            className={`p-6 rounded-xl border-2 transition-all ${
              accountType === 'INDIVIDUAL'
                ? 'border-[#6C3CE1] bg-[#6C3CE1]/10'
                : 'border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#3A3A3A]'
            }`}
          >
            <User className={`w-10 h-10 mx-auto mb-3 ${
              accountType === 'INDIVIDUAL' ? 'text-[#6C3CE1]' : 'text-[#6B7280]'
            }`} />
            <h3 className={`font-semibold mb-1 ${
              accountType === 'INDIVIDUAL' ? 'text-white' : 'text-[#A0A0A0]'
            }`}>Particulier</h3>
            <p className="text-xs text-[#6B7280]">Compte personnel</p>
          </button>

          <button
            type="button"
            onClick={() => { setAccountType('COMPANY'); setStep(1); }}
            className={`p-6 rounded-xl border-2 transition-all ${
              accountType === 'COMPANY'
                ? 'border-[#6C3CE1] bg-[#6C3CE1]/10'
                : 'border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#3A3A3A]'
            }`}
          >
            <Building2 className={`w-10 h-10 mx-auto mb-3 ${
              accountType === 'COMPANY' ? 'text-[#6C3CE1]' : 'text-[#6B7280]'
            }`} />
            <h3 className={`font-semibold mb-1 ${
              accountType === 'COMPANY' ? 'text-white' : 'text-[#A0A0A0]'
            }`}>Entreprise</h3>
            <p className="text-xs text-[#6B7280]">Compte professionnel</p>
          </button>
        </div>

        <Card className="p-8">
          <AnimatePresence mode="wait">
            {accountType === 'INDIVIDUAL' ? (
              <motion.div
                key="individual"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#6C3CE1]/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-[#6C3CE1]" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">Compte Particulier</h2>
                    <p className="text-xs text-[#6B7280]">Informations personnelles</p>
                  </div>
                </div>

                <form onSubmit={individualForm.handleSubmit(onSubmitIndividual)} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg text-[#EF4444] text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Prénom"
                      placeholder="Sophie"
                      required
                      error={individualForm.formState.errors.firstName?.message}
                      {...individualForm.register('firstName')}
                    />
                    <Input
                      label="Nom"
                      placeholder="Martin"
                      required
                      error={individualForm.formState.errors.lastName?.message}
                      {...individualForm.register('lastName')}
                    />
                  </div>

                  <Input
                    label="Email"
                    type="email"
                    placeholder="votre@email.com"
                    required
                    error={individualForm.formState.errors.email?.message}
                    {...individualForm.register('email')}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Téléphone"
                      type="tel"
                      placeholder="+221 77..."
                      required
                      error={individualForm.formState.errors.phone?.message}
                      {...individualForm.register('phone')}
                    />
                    <Input
                      label="Entreprise (optionnel)"
                      placeholder="Votre entreprise"
                      error={individualForm.formState.errors.company?.message}
                      {...individualForm.register('company')}
                    />
                  </div>

                  <Input
                    label="Mot de passe"
                    type="password"
                    placeholder="••••••••"
                    required
                    error={individualForm.formState.errors.password?.message}
                    {...individualForm.register('password')}
                  />

                  <Input
                    label="Confirmer le mot de passe"
                    type="password"
                    placeholder="••••••••"
                    required
                    error={individualForm.formState.errors.confirmPassword?.message}
                    {...individualForm.register('confirmPassword')}
                  />

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...individualForm.register('acceptTerms')}
                      className="mt-1 w-4 h-4 rounded border-[#2A2A2A] bg-[#1A1A1A] text-[#6C3CE1] focus:ring-[#6C3CE1]"
                    />
                    <span className="text-sm text-[#A0A0A0]">
                      J'accepte les{' '}
                      <Link to="/conditions-generales-de-vente" className="text-[#6C3CE1] hover:underline">
                        conditions générales
                      </Link>{' '}
                      et la{' '}
                      <Link to="/politique-de-confidentialite" className="text-[#6C3CE1] hover:underline">
                        politique de confidentialité
                      </Link>
                    </span>
                  </label>
                  {individualForm.formState.errors.acceptTerms && (
                    <p className="text-sm text-[#EF4444]">{individualForm.formState.errors.acceptTerms.message}</p>
                  )}

                  <Button type="submit" variant="primary" className="w-full" size="lg" isLoading={isLoading}>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Créer mon compte
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="company"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Company Registration - Step Indicator */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 1 ? 'bg-[#6C3CE1] text-white' : 'bg-[#2A2A2A] text-[#6B7280]'
                  }`}>1</div>
                  <div className={`w-16 h-1 rounded ${step >= 2 ? 'bg-[#6C3CE1]' : 'bg-[#2A2A2A]'}`} />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 2 ? 'bg-[#6C3CE1] text-white' : 'bg-[#2A2A2A] text-[#6B7280]'
                  }`}>2</div>
                </div>

                <form onSubmit={companyForm.handleSubmit(onSubmitCompany)} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg text-[#EF4444] text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#6C3CE1]/10 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-[#6C3CE1]" />
                        </div>
                        <div>
                          <h2 className="font-semibold text-white">Informations de l'entreprise</h2>
                          <p className="text-xs text-[#6B7280]">Étape 1 sur 2</p>
                        </div>
                      </div>

                      <Input
                        label="Nom de l'entreprise"
                        placeholder="Ma Société SARL"
                        required
                        error={companyForm.formState.errors.companyName?.message}
                        {...companyForm.register('companyName')}
                      />

                      <Select
                        label="Secteur d'activité"
                        required
                        placeholder="Sélectionnez un secteur"
                        options={sectorOptions}
                        error={companyForm.formState.errors.companySector?.message}
                        {...companyForm.register('companySector')}
                      />

                      <Input
                        label="N° d'enregistrement (SIRET, RCCM...)"
                        placeholder="Optionnel"
                        helperText="Numéro d'identification de l'entreprise"
                        {...companyForm.register('companyRegistration')}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Ville"
                          placeholder="Dakar"
                          {...companyForm.register('companyCity')}
                        />
                        <Input
                          label="Pays"
                          placeholder="Sénégal"
                          {...companyForm.register('companyCountry')}
                        />
                      </div>

                      <Input
                        label="Adresse"
                        placeholder="123 Rue du Commerce"
                        {...companyForm.register('companyAddress')}
                      />

                      <Button 
                        type="button" 
                        variant="primary" 
                        className="w-full" 
                        size="lg"
                        onClick={() => setStep(2)}
                      >
                        Continuer
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#6C3CE1]/10 flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-[#6C3CE1]" />
                        </div>
                        <div>
                          <h2 className="font-semibold text-white">Responsable du compte</h2>
                          <p className="text-xs text-[#6B7280]">Étape 2 sur 2</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Prénom"
                          placeholder="Jean"
                          required
                          error={companyForm.formState.errors.firstName?.message}
                          {...companyForm.register('firstName')}
                        />
                        <Input
                          label="Nom"
                          placeholder="Dupont"
                          required
                          error={companyForm.formState.errors.lastName?.message}
                          {...companyForm.register('lastName')}
                        />
                      </div>

                      <Input
                        label="Fonction dans l'entreprise"
                        placeholder="Directeur Marketing"
                        {...companyForm.register('position')}
                      />

                      <Input
                        label="Email professionnel"
                        type="email"
                        placeholder="contact@entreprise.com"
                        required
                        error={companyForm.formState.errors.email?.message}
                        {...companyForm.register('email')}
                      />

                      <Input
                        label="Téléphone"
                        type="tel"
                        placeholder="+221 77..."
                        required
                        error={companyForm.formState.errors.phone?.message}
                        {...companyForm.register('phone')}
                      />

                      <Input
                        label="Mot de passe"
                        type="password"
                        placeholder="••••••••"
                        required
                        error={companyForm.formState.errors.password?.message}
                        {...companyForm.register('password')}
                      />

                      <Input
                        label="Confirmer le mot de passe"
                        type="password"
                        placeholder="••••••••"
                        required
                        error={companyForm.formState.errors.confirmPassword?.message}
                        {...companyForm.register('confirmPassword')}
                      />

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...companyForm.register('acceptTerms')}
                          className="mt-1 w-4 h-4 rounded border-[#2A2A2A] bg-[#1A1A1A] text-[#6C3CE1] focus:ring-[#6C3CE1]"
                        />
                        <span className="text-sm text-[#A0A0A0]">
                          J'accepte les{' '}
                          <Link to="/conditions-generales-de-vente" className="text-[#6C3CE1] hover:underline">
                            conditions générales
                          </Link>{' '}
                          et la{' '}
                          <Link to="/politique-de-confidentialite" className="text-[#6C3CE1] hover:underline">
                            politique de confidentialité
                          </Link>
                        </span>
                      </label>
                      {companyForm.formState.errors.acceptTerms && (
                        <p className="text-sm text-[#EF4444]">{companyForm.formState.errors.acceptTerms.message}</p>
                      )}

                      <div className="flex gap-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="lg"
                          onClick={() => setStep(1)}
                        >
                          <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
                          Retour
                        </Button>
                        <Button type="submit" variant="primary" className="flex-1" size="lg" isLoading={isLoading}>
                          <UserPlus className="w-5 h-5 mr-2" />
                          Créer le compte
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 text-center text-[#A0A0A0]">
            Déjà un compte ?{' '}
            <Link to="/auth/connexion" className="text-[#6C3CE1] hover:underline font-medium">
              Se connecter
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// ===== FORGOT PASSWORD =====
const forgotSchema = z.object({
  email: z.string().email('Email invalide'),
});
type ForgotFormData = z.infer<typeof forgotSchema>;

export function ForgotPassword() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/auth/connexion');
    }
  };

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    console.log('Reset password for:', data.email);
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-6 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#6C3CE1]/10 rounded-full blur-[128px]"></div>

      {/* Bouton retour */}
      <button
        onClick={handleGoBack}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#A0A0A0] hover:text-white hover:border-[#6C3CE1] transition-all"
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        <span className="text-sm">Retour</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <span className="text-3xl font-bold text-white font-['Sora']">
              Myms<span className="text-[#6C3CE1]">.</span>
            </span>
          </Link>

          {isSubmitted ? (
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-[#10B981]" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Email envoyé !</h1>
              <p className="text-[#A0A0A0]">
                Si un compte existe avec cette adresse, vous recevrez un email de réinitialisation.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-white mb-2">Mot de passe oublié ?</h1>
              <p className="text-[#A0A0A0]">
                Entrez votre email et nous vous enverrons un lien de réinitialisation.
              </p>
            </>
          )}
        </div>

        {!isSubmitted && (
          <Card className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#6C3CE1]/10 flex items-center justify-center text-[#6C3CE1]">
                <Mail className="w-7 h-7" />
              </div>

              <Input
                label="Email"
                type="email"
                placeholder="votre@email.com"
                required
                error={errors.email?.message}
                {...register('email')}
              />

              <Button type="submit" variant="primary" className="w-full" size="lg" isLoading={isLoading}>
                <KeyRound className="w-5 h-5 mr-2" />
                Envoyer le lien
              </Button>
            </form>
          </Card>
        )}

        <div className="mt-6 text-center">
          <Link 
            to="/auth/connexion" 
            className="inline-flex items-center gap-2 text-[#6C3CE1] hover:underline"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Retour à la connexion
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
