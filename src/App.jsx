import { useState } from 'react';
import FocusGroupDashboard from './components/FocusGroupDashboard';
import CuidadoresDashboard from './components/CuidadoresDashboard';

export default function App() {
  const [view, setView] = useState('cuidadores');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'https://www.figma.com/board/phIpM8LxuZHGEDMLmZwnir/Equipo-20-MDD-2026?node-id=0-1&t=JTeIqf9LJUiGplGs-1') {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

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
        {view === 'focusGroup' ? (
          isAuthenticated ? (
            <FocusGroupDashboard />
          ) : (
            <div style={{ minHeight: 'calc(100vh - 58px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
              <div className="glass anim-fade-up" style={{ backgroundColor: 'var(--card)', padding: '48px 32px', borderRadius: '24px', border: '1px solid var(--border)', maxWidth: '440px', width: '100%', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--primary-dim)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid var(--primary-glow)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px', fontVariationSettings: "'FILL' 1" }}>lock</span>
                </div>
                <h1 style={{ fontSize: '24px', margin: '0 0 8px 0', fontFamily: 'var(--font)', fontWeight: 700 }}>Investigación Cuidadores</h1>
                <h2 style={{ fontSize: '15px', margin: '0 0 32px 0', color: 'var(--fg-muted)', fontWeight: 400 }}>Grupo Focal — Biomaterial</h2>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(false); }}
                      placeholder="••••••••••••"
                      style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: error ? '1px solid var(--error)' : '1px solid var(--border)', backgroundColor: 'var(--bg-2)', color: 'var(--fg)', boxSizing: 'border-box', outline: 'none', transition: 'border 0.2s', fontFamily: 'var(--mono)', fontSize: '14px' }}
                    />
                    <p style={{ margin: '4px 0 0 8px', fontSize: '12px', color: 'var(--fg-muted)' }}>contraseña ingresar link de figjam</p>
                  </div>
                  <button type="submit" style={{ padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--primary)', color: 'var(--primary-fg)', fontWeight: 600, cursor: 'pointer', marginTop: '8px', fontSize: '15px', transition: 'all 0.2s', boxShadow: '0 0 20px var(--primary-glow)' }}>Ingresar</button>
                </form>
              </div>
            </div>
          )
        ) : (
          <CuidadoresDashboard />
        )}
      </main>
    </div>
  );
}
