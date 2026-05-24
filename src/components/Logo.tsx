import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

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
  return (
    <Link to={to} className={cn('inline-flex items-center', containerClassName)}>
      <img
        src="/logo.svg"
        alt={alt}
        className={cn('h-10 w-auto', logoClassName)}
      />
    </Link>
  );
}
