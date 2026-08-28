/**
 * SkeletonLoader.js — Animated skeleton for loading states.
 */

export function SkeletonCard() {
  return (
    <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div className="skeleton" style={{ height: 16, width: '60%' }} />
      <div className="skeleton" style={{ height: 12, width: '90%' }} />
      <div className="skeleton" style={{ height: 12, width: '75%' }} />
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
        <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 99 }} />
        <div className="skeleton" style={{ height: 22, width: 55, borderRadius: 99 }} />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border-glass)' }}>
      <div className="skeleton" style={{ height: 14, flex: 2 }} />
      <div className="skeleton" style={{ height: 14, flex: 1 }} />
      <div className="skeleton" style={{ height: 22, width: 80, borderRadius: 99 }} />
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 14, width: i === lines - 1 ? '60%' : '100%' }} />
      ))}
    </div>
  );
}
