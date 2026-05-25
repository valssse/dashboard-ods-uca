import { useState } from 'react';
import FocusGroupDashboard from './components/FocusGroupDashboard';
import CuidadoresDashboard from './components/CuidadoresDashboard';

export default function App() {
  const [view, setView] = useState('focusGroup');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>

      {/* ── NAV ── */}
      <nav className="app-nav" style={{
        backgroundColor: 'rgba(17,17,17,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: '1560px', margin: '0 auto', padding: '0 24px' }}>
          <div className="app-nav-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '58px', gap: '16px' }}>

            {/* Toggle */}
            <div className="app-toggle-nav" style={{
              display: 'flex', gap: '4px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              padding: '4px', borderRadius: '12px',
              border: '1px solid var(--border)',
            }}>
              {[
                { k: 'focusGroup', l: 'Grupo Focal — Biomaterial', icon: 'science', accent: 'var(--primary)',  fg: 'var(--primary-fg)', shadow: 'rgba(255,132,0,0.3)' },
                { k: 'cuidadores', l: 'Investigación Cuidadores',  icon: 'group',   accent: 'var(--violet)',   fg: '#111',             shadow: 'rgba(178,178,255,0.3)' },
              ].map(item => {
                const isActive = view === item.k;
                return (
                  <button
                    key={item.k}
                    className="toggle-btn"
                    onClick={() => setView(item.k)}
                    style={{
                      padding: '7px 16px', borderRadius: '8px',
                      fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font)',
                      cursor: 'pointer', border: 'none', whiteSpace: 'nowrap',
                      transition: 'all 0.22s ease',
                      flex: isActive ? 2 : 1,
                      backgroundColor: isActive ? item.accent : 'transparent',
                      color: isActive ? item.fg : 'var(--fg-muted)',
                      boxShadow: isActive ? `0 0 16px ${item.shadow}` : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: isActive ? '#000' : '#fff', fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                    <span className={!isActive ? 'hide-text-mobile' : ''} style={{ transition: 'opacity 0.2s' }}>
                      {item.l}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <main>
        {view === 'focusGroup' ? <FocusGroupDashboard /> : <CuidadoresDashboard />}
      </main>
    </div>
  );
}
