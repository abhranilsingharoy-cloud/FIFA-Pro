import { useEffect, useRef } from 'react';

interface StatBarProps {
  label: string;
  valueA: number;
  valueB: number;
  maxValue?: number;
  colorA?: string;
  colorB?: string;
  unit?: string;
}

export default function StatBar({ label, valueA, valueB, maxValue, colorA = 'var(--brand-red)', colorB = 'var(--info-blue)', unit = '' }: StatBarProps) {
  const max = maxValue || Math.max(valueA, valueB, 1);
  const pctA = (valueA / max) * 100;
  const pctB = (valueB / max) * 100;

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, alignItems: 'center' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'white', fontWeight: 600 }}>
          {valueA}{unit}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
          {label}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'white', fontWeight: 600 }}>
          {valueB}{unit}
        </span>
      </div>
      <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', background: 'var(--surface-elevated)' }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{
            width: `${pctA}%`,
            background: colorA,
            borderRadius: '3px 0 0 3px',
            transition: 'width 0.6s ease-out',
          }} />
        </div>
        <div style={{ width: 2, background: 'var(--surface-card)', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{
            width: `${pctB}%`,
            background: colorB,
            borderRadius: '0 3px 3px 0',
            transition: 'width 0.6s ease-out',
            height: '100%',
          }} />
        </div>
      </div>
    </div>
  );
}
