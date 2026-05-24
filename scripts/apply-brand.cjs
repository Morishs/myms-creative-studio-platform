const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');

const replacements = [
  [/text-\[?#6C3CE1\]?/gi, 'text-brand'],
  [/text-\[?#A0A0A0\]?/gi, 'text-text-muted'],
  [/text-\[?#6B7280\]?/gi, 'text-text-muted'],
  [/text-\[?#E5E7EB\]?/gi, 'text-text-secondary'],
  [/text-\[?#A0A0A0\]?/gi, 'text-text-muted'],
  [/placeholder-\[?#6B7280\]/gi, 'placeholder:text-text-muted'],

  [/bg-\[?#6C3CE1\]\/\d+/gi, 'bg-brand/10'],
  [/bg-\[?#0A0A0A\]\/\d+/gi, 'bg-surface-alt/10'],
  [/bg-\[?#1A1A1A\]\/\d+/gi, 'bg-surface-dark/10'],
  [/bg-\[?#2A2A2A\]\/\d+/gi, 'bg-border-dark/10'],
  [/bg-\[?#6C3CE1\]/gi, 'bg-brand'],
  [/bg-\[?#0A0A0A\]/gi, 'bg-surface-alt'],
  [/bg-\[?#1A1A1A\]/gi, 'bg-surface-dark'],
  [/bg-\[?#111111\]/gi, 'bg-surface'],
  [/bg-\[?#2A2A2A\]/gi, 'bg-border-dark'],
  [/bg-\[?#0F0F0F\]/gi, 'bg-surface-alt'],
  [/bg-\[?#0E0E0E\]/gi, 'bg-surface-dark'],
  [/bg-\[?#131313\]/gi, 'bg-surface-dark'],

  [/border-\[?#6C3CE1\]\/\d+/gi, 'border-brand/20'],
  [/border-\[?#2A2A2A\]/gi, 'border-border-dark'],
  [/border-\[?#2A2A2A\]\/\d+/gi, 'border-border-dark/20'],
  [/border-\[?#6C3CE1\]/gi, 'border-brand'],

  [/from-\[?#6C3CE1\]/gi, 'from-brand'],
  [/from-\[?#111111\]/gi, 'from-surface'],
  [/from-\[?#EF4444\]/gi, 'from-error-light'],
  [/to-\[?#7C4CF1\]/gi, 'to-accent'],
  [/to-\[?#F59E0B\]/gi, 'to-warning'],
  [/to-\[?#0A0A0A\]/gi, 'to-surface-alt'],
  [/from-\[?#0A0A0A\]/gi, 'from-surface-alt'],

  [/hover:text-\[?#7C4CF1\]/gi, 'hover:text-brand-light'],
  [/text-\[?#F59E0B\]/gi, 'text-warning'],
  [/bg-\[?#F59E0B\]\/\d+/gi, 'bg-warning/10'],
  [/bg-\[?#F59E0B\]/gi, 'bg-warning'],
  [/border-\[?#F59E0B\]\/\d+/gi, 'border-warning/20'],

  [/text-\[?#10B981\]/gi, 'text-success'],
  [/bg-\[?#10B981\]\/\d+/gi, 'bg-success/10'],
  [/fill-\[?#10B981\]/gi, 'fill-success'],
  [/text-\[?#EF4444\]/gi, 'text-error-light'],
  [/bg-\[?#EF4444\]\/\d+/gi, 'bg-error-light/10'],
  [/fill-\[?#EF4444\]/gi, 'fill-error-light'],

  [/hover:text-\[?#A0A0A0\]/gi, 'hover:text-text-muted'],
  [/group-hover:text-\[?#6C3CE1\]/gi, 'group-hover:text-brand'],
  [/focus:ring-\[?#6C3CE1\]/gi, 'focus:ring-brand'],
  [/hover:border-\[?#6C3CE1\]/gi, 'hover:border-brand'],
  [/hover:border-\[?#2A2A2A\]/gi, 'hover:border-border-dark'],
  [/accent-\[?#6C3CE1\]/gi, 'accent-brand'],
  [/text-\[?#7C4CF1\]/gi, 'text-brand-light'],
  [/from-\[?#6C3CE1\] to-\[?#7C4CF1\]/gi, 'from-brand to-accent'],
  [/bg-gradient-to-(?:r|br) from-\[?#6C3CE1\] to-\[?#7C4CF1\]/gi, 'bg-gradient-to-br from-brand to-accent'],
  [/rgba\(108,60,225/gi, 'rgba(13,110,253'],
  [/fill-\[?#2A2A2A\]/gi, 'fill-border-dark'],
  [/text-\[?#E0E0E0\]/gi, 'text-text-secondary'],
];

function walk(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const p = path.join(dir, it.name);
    if (it.isDirectory()) {
      if (it.name === 'node_modules' || it.name === '.git') continue;
      walk(p);
    } else if (/\.(ts|tsx|css|jsx|html)$/.test(it.name)) {
      let content = fs.readFileSync(p, 'utf8');
      let original = content;
      for (const [search, repl] of replacements) {
        content = content.replace(search, repl);
      }
      if (content !== original) {
        fs.writeFileSync(p, content, 'utf8');
        console.log('Patched', path.relative(root, p));
      }
    }
  }
}

walk(src);
console.log('Done');
