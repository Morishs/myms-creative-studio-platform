import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AccordionItem({ title, children, isOpen = false, onToggle }: AccordionItemProps) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-lg font-medium text-text-primary group-hover:text-brand transition-colors">
          {title}
        </span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-text-muted transition-transform duration-200',
            isOpen && 'rotate-180 text-brand'
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-text-muted">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AccordionProps {
  items: { id: string; title: string; content: string }[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={cn('bg-surface-alt rounded-xl border border-border px-6', className)}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          title={item.title}
          isOpen={openId === item.id}
          onToggle={() => setOpenId(openId === item.id ? null : item.id)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
}
