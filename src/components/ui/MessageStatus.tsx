import type { MessageStatus as MsgStatus } from '../../stores/messageStore';

// ✓  = sent (gris)
// ✓✓ = delivered (gris)
// ✓✓ = read (bleu)
export function MessageStatusIcon({ status }: { status: MsgStatus }) {
  if (status === 'read') {
    return <span className="text-success text-[11px] font-bold tracking-tight">✓✓</span>;
  }
  if (status === 'delivered') {
    return <span className="text-text-muted text-[11px] font-bold tracking-tight">✓✓</span>;
  }
  // sent
  return <span className="text-text-muted text-[11px] font-bold tracking-tight">✓</span>;
}

// Badge vert en ligne
export function OnlineBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const s = size === 'md' ? 'w-3.5 h-3.5 border-[2.5px]' : 'w-2.5 h-2.5 border-2';
  return (
    <span className={`${s} bg-success rounded-full border-border inline-block`} />
  );
}

export function OfflineBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const s = size === 'md' ? 'w-3.5 h-3.5 border-[2.5px]' : 'w-2.5 h-2.5 border-2';
  return (
    <span className={`${s} bg-text-muted rounded-full border-border inline-block`} />
  );
}
