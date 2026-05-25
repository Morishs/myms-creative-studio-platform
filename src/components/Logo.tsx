import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';
import { useTheme } from '../contexts/ThemeContext';

type LogoProps = {
  logoClassName?: string;
  containerClassName?: string;
  to?: string;
  alt?: string;
};

export function Logo({
  logoClassName,
  containerClassName,
  to = '/',
  alt = 'Logo Myms',
}: LogoProps) {
  const { theme } = useTheme();
  const logoSrc = theme === 'light' ? '/Logo_pdf.svg' : '/Logos_myms.svg';

  return (
    <Link to={to} className={cn('inline-flex items-center', containerClassName)}>
      <img
        src={logoSrc}
        alt={alt}
        className={cn('h-10 w-auto', logoClassName)}
      />
    </Link>
  );
}
