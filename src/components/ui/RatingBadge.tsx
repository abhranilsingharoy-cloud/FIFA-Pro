interface RatingBadgeProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function RatingBadge({ rating, size = 'md' }: RatingBadgeProps) {
  const color = rating >= 8 ? 'var(--success-green)' : rating >= 7 ? 'var(--brand-gold)' : rating >= 6 ? 'var(--warning-amber)' : '#EF4444';
  const bg = rating >= 8 ? 'rgba(34,197,94,0.15)' : rating >= 7 ? 'rgba(255,215,0,0.15)' : rating >= 6 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)';
  const sizes = { sm: { font: 12, padding: '2px 6px' }, md: { font: 14, padding: '3px 9px' }, lg: { font: 18, padding: '5px 12px' } };
  const s = sizes[size];

  return (
    <span style={{
      background: bg,
      color,
      border: `1px solid ${color}40`,
      borderRadius: 6,
      fontFamily: 'JetBrains Mono, monospace',
      fontWeight: 700,
      fontSize: s.font,
      padding: s.padding,
      display: 'inline-block',
    }}>
      {rating.toFixed(1)}
    </span>
  );
}
