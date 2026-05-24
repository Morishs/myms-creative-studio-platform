const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');

const replacements = [
  [/text-\[?#6C3CE1\]?/gi, 'text-brand'],
  [/bg-\[?#6C3CE1\]\/\d+/gi, 'bg-brand/10'],
  [/bg-\[?#6C3CE1\]/gi, 'bg-brand'],
  [/border-\[?#6C3CE1\]\/\d+/gi, 'border-brand/20'],
  [/border-\[?#6C3CE1\]/gi, 'border-brand'],
  [/from-\[?#6C3CE1\]/gi, 'from-brand'],
  [/to-\[?#7C4CF1\]/gi, 'to-accent'],
  [/hover:text-\[?#7C4CF1\]/gi, 'hover:text-brand-light'],
  [/group-hover:text-\[?#6C3CE1\]/gi, 'group-hover:text-brand'],
  [/focus:ring-\[?#6C3CE1\]/gi, 'focus:ring-brand'],
  [/hover:border-\[?#6C3CE1\]/gi, 'hover:border-brand'],
  [/accent-\[?#6C3CE1\]/gi, 'accent-brand'],
  [/text-\[?#7C4CF1\]/gi, 'text-brand-light'],
  [/from-\[?#6C3CE1\] to-\[?#7C4CF1\]/gi, 'from-brand to-accent'],
  [/bg-gradient-to-(?:r|br) from-\[?#6C3CE1\] to-\[?#7C4CF1\]/gi, 'bg-gradient-to-br from-brand to-accent'],
  [/rgba\(108,60,225/gi, 'rgba(13,110,253'],
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
