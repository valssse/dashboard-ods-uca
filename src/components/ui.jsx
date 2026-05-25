// ══════════════════════════════════════════════════
//  Shared UI primitives — Lunaris Dark System
// ══════════════════════════════════════════════════

/* ── Card ── */
export function Card({ children, style = {}, className = '', accent }) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: 'var(--card)',
        border: `1px solid ${accent ? `${accent}30` : 'var(--border)'}`,
        borderRadius: 'var(--r)',
        boxShadow: accent ? `0 0 28px ${accent}12` : 'var(--shadow-card)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── KPI Card ── */
export function KpiCard({ icon, value, label, accent = 'var(--primary)', delay = 0, className = '' }) {
  return (
    <div
      className={`anim-fade-up d-${delay} ${className}`}
      style={{
        backgroundColor: 'var(--card)',
        border: `1px solid ${accent}30`,
        borderRadius: 'var(--r)',
        padding: '20px 16px',
        textAlign: 'center',
        boxShadow: `0 0 24px ${accent}10`,
      }}
    >
      <div style={{ fontSize: '26px', marginBottom: '8px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>{icon}</span>
      </div>
      <p className="mono" style={{ fontSize: '30px', fontWeight: 700, color: accent, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: '11px', color: 'var(--fg-muted)', marginTop: '6px', fontWeight: 500 }}>{label}</p>
    </div>
  );
}

/* ── Section Header ── */
export function SectionHeader({ title, subtitle, accent = 'var(--primary)' }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
        <div style={{ width: '3px', height: '20px', backgroundColor: accent, borderRadius: '2px', flexShrink: 0 }} />
        <h2 style={{ fontWeight: 800, fontSize: '18px', color: 'var(--fg)', lineHeight: 1.2 }}>{title}</h2>
      </div>
      {subtitle && <p style={{ fontSize: '13px', color: 'var(--fg-muted)', marginLeft: '13px' }}>{subtitle}</p>}
    </div>
  );
}

/* ── Badge ── */
export function Badge({ children, color = '#FF8400' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      fontFamily: 'var(--font)', fontSize: '10px', fontWeight: 700,
      padding: '3px 9px', borderRadius: 'var(--r-pill)',
      backgroundColor: `${color}20`, color, border: `1px solid ${color}40`,
    }}>
      {children}
    </span>
  );
}

/* ── Tag pill ── */
export function Tag({ children, color }) {
  return (
    <span style={{
      fontFamily: 'var(--font)', fontSize: '11px', fontWeight: 600,
      padding: '4px 12px', borderRadius: 'var(--r-pill)',
      backgroundColor: `${color}18`, color,
      border: `1px solid ${color}30`,
      display: 'inline-flex', alignItems: 'center', gap: '5px',
    }}>
      {children}
    </span>
  );
}

/* ── Score Bar ── */
export function ScoreBar({ value, color, izq = '', der = '' }) {
  const pct = ((value + 3) / 6) * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
      <span style={{ fontSize: '9px', color: 'var(--fg-subtle)', width: '48px', textAlign: 'right', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {izq}
      </span>
      <div className="sbar-track" style={{ flex: 1 }}>
        <div className="sbar-center" />
        <div className="sbar-fill" style={{
          left:  value <= 0 ? `${pct}%`              : '50%',
          right: value >= 0 ? `${(1 - pct/100)*100}%` : '50%',
          backgroundColor: color,
        }} />
      </div>
      <span style={{ fontSize: '9px', color: 'var(--fg-subtle)', width: '48px', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {der}
      </span>
    </div>
  );
}

/* ── Search Input ── */
export function SearchInput({ value, onChange, placeholder = 'Buscar...', accent = 'var(--primary)' }) {
  return (
    <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
      <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'var(--fg-subtle)' }}
        fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '9px 14px 9px 36px',
          backgroundColor: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-sm)', fontSize: '13px', color: 'var(--fg)',
          fontFamily: 'var(--font)', outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => e.currentTarget.style.borderColor = accent}
        onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
      />
    </div>
  );
}

/* ── Tab Button ── */
export function TabBtn({ active, onClick, children, accent = 'var(--primary)' }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px', borderRadius: 'var(--r-sm)',
        fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font)',
        cursor: 'pointer', border: 'none', whiteSpace: 'nowrap',
        transition: 'all 0.2s ease',
        backgroundColor: active ? accent : 'var(--card)',
        color: active ? 'var(--primary-fg)' : 'var(--fg-muted)',
        boxShadow: active ? `0 0 14px ${accent}40` : 'none',
        outline: active ? 'none' : '1px solid var(--border)',
      }}
    >
      {children}
    </button>
  );
}

/* ── Dark Tooltip for Recharts ── */
export function DarkTooltip({ active, payload, label, barData }) {
  if (!active || !payload?.length) return null;
  const full = barData?.find(d => d.name === label)?.fullName;
  return (
    <div style={{
      backgroundColor: 'var(--card-2)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '12px 14px',
      fontFamily: 'var(--font)', fontSize: '12px',
      maxWidth: '240px', boxShadow: 'var(--shadow-lg)',
    }}>
      <p style={{ color: 'var(--fg)', fontWeight: 700, marginBottom: '8px', fontSize: '12px' }}>{full || label}</p>
      {payload.map(item => (
        <div key={item.dataKey} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: item.fill, flexShrink: 0 }} />
          <span style={{ color: 'var(--fg-muted)', flex: 1, fontSize: '11px' }}>{item.dataKey}</span>
          <span className="mono" style={{ fontWeight: 700, color: item.fill, fontSize: '11px' }}>
            {item.value > 0 ? '+' : ''}{item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Empty State ── */
export function EmptyState({ icon = 'search', text = 'Sin resultados' }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--fg-muted)', fontFamily: 'var(--font)' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>{icon}</span>
      </div>
      <p style={{ fontSize: '14px' }}>{text}</p>
    </div>
  );
}

/* ── Star Rating ── */
export function Stars({ rating, max = 5 }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} style={{ width: '13px', height: '13px', color: i < rating ? '#FFD700' : '#2E2E2E' }}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}
