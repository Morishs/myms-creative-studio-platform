
import { cn } from '../../utils/cn';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionTitle({ title, subtitle, badge, align = 'center', className }: SectionTitleProps) {
  return (
    <div className={cn(
      'mb-12',
      align === 'center' && 'text-center',
      className
    )}>
      {badge && (
        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-brand bg-brand/10 rounded-full border border-brand/20">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          'text-lg text-text-muted',
          align === 'center' && 'max-w-2xl mx-auto'
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
