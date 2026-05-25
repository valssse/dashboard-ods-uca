import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import researchData from '../data/Research_ansianos.json';
import { Card, KpiCard, SearchInput, TabBtn, EmptyState } from './ui';

const TT_STYLE = { backgroundColor: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '12px', fontFamily: 'var(--font)', fontSize: '12px' };
const TICK_STYLE = { fontSize: 10, fill: 'var(--fg-muted)', fontFamily: 'var(--font)' };

const ROLES = {
  doctors_and_specialists: { label: 'Doctores y Especialistas', color: 'var(--primary)', icon: 'medical_services' },
  caregivers_and_professionals: { label: 'Cuidadores y Profesionales', color: 'var(--violet)', icon: 'clinical_notes' },
  family_members: { label: 'Familiares', color: 'var(--success)', icon: 'family_home' },
};

const LINK_CATEGORIES = {
  forums_and_communities: { label: 'Foros y Comunidades', color: 'var(--primary)', icon: 'forum' },
  medical_platforms_and_consultations: { label: 'Plataformas Médicas', color: 'var(--error)', icon: 'local_hospital' },
  specialized_blogs_and_institutions: { label: 'Blogs Especializados', color: 'var(--info)', icon: 'article' },
  product_portals_and_ergonomic_adaptation: { label: 'Portales y Adaptación', color: 'var(--warning)', icon: 'shopping_bag' },
};

const TABS = [
  { key: 'dementia', label: 'Con Demencia Senil', icon: 'psychology' },
  { key: 'nodementia', label: 'Sin Demencia Senil', icon: 'sentiment_satisfied' },
  { key: 'resources', label: 'Recursos Externos', icon: 'link' },
];

/* ═══════════════════════════════════════════
   QUOTE CARD
═══════════════════════════════════════════ */
function QuoteCard({ q, roleId }) {
  const role = ROLES[roleId] || { label: 'Desconocido', color: '#666', icon: 'person' };
  
  // Extract cite from quote if embedded
  const citeMatch = q.quote.match(/(\[cite:\s*[\d,\s]+\])/);
  const cleanQuote = q.quote.replace(/(\[cite:\s*[\d,\s]+\])/g, '').trim();
  const cite = citeMatch ? citeMatch[1] : '';

  return (
    <div style={{
      backgroundColor: 'var(--card)', borderRadius: 'var(--r)',
      border: `1px solid ${role.color}30`, padding: '20px',
      display: 'flex', flexDirection: 'column', height: '100%',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 28px ${role.color}15`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontSize: '11px', fontWeight: 700, padding: '4px 12px',
          borderRadius: 'var(--r-pill)',
          backgroundColor: `${role.color}15`, color: role.color,
          border: `1px solid ${role.color}30`,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{role.icon}</span> {role.label}
        </span>
        {q.publication_date && (
          <span style={{ fontSize: '11px', color: 'var(--fg-subtle)' }}>
            {q.publication_date.replace(/\[cite:.*?\]/g, '').trim()}
          </span>
        )}
      </div>

      <div style={{ flex: 1, marginBottom: '16px' }}>
        <blockquote style={{ fontSize: '14px', color: 'var(--fg)', lineHeight: 1.6, fontStyle: 'italic', fontWeight: 400 }}>
          "{cleanQuote}"
        </blockquote>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px dashed var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--card-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--fg-muted)' }}>person</span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--fg-muted)', fontWeight: 600, lineHeight: 1.3 }}>
          {q.author}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LINK CARD
═══════════════════════════════════════════ */
function LinkCard({ linkString, catId }) {
  const cat = LINK_CATEGORIES[catId] || { label: 'Enlace', color: '#666', icon: 'link' };
  
  let title = "Enlace Externo";
  let url = "#";
  let cite = "";
  
  // Parse "Title (Context): https://url [cite: x]"
  const match = linkString.match(/^(.*?):\s*(https?:\/\/[^\s]+)(?:\s*(\[cite:.*?\]))?$/);
  if (match) {
    title = match[1].trim();
    url = match[2].trim();
    cite = match[3] ? match[3].trim() : "";
  } else {
    title = linkString;
  }

  return (
    <a href={url} target="_blank" rel="noreferrer" style={{
      display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none',
      backgroundColor: 'var(--card)', borderRadius: 'var(--r)',
      border: `1px solid ${cat.color}30`, padding: '16px 20px',
      transition: 'transform 0.2s, background 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.backgroundColor = 'var(--card-2)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.backgroundColor = 'var(--card)'; }}
    >
      <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: `${cat.color}15`, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{cat.icon}</span>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: cat.color, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cat.label}</p>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--fg)', lineHeight: 1.4 }}>{title}</p>
        {cite && <p style={{ fontSize: '11px', color: 'var(--fg-subtle)', marginTop: '4px' }}>Cita: {cite}</p>}
      </div>
      <span className="material-symbols-outlined" style={{ color: 'var(--fg-subtle)' }}>open_in_new</span>
    </a>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function CuidadoresDashboard() {
  const [tab, setTab] = useState('dementia');
  const [search, setSearch] = useState('');

  // Parsers
  const getQuotes = (section) => {
    if (!section) return [];
    const quotes = [];
    Object.keys(ROLES).forEach(roleKey => {
      if(section[roleKey]?.comments) {
        section[roleKey].comments.forEach((c, i) => {
          quotes.push({ ...c, roleId: roleKey, id: `${roleKey}-${i}` });
        });
      }
    });
    return quotes;
  };

  const getLinks = (section) => {
    if (!section) return [];
    const links = [];
    Object.keys(LINK_CATEGORIES).forEach(catKey => {
      if(section[catKey]?.links) {
        section[catKey].links.forEach((l, i) => {
          links.push({ raw: l, catId: catKey, id: `${catKey}-${i}` });
        });
      }
    });
    return links;
  };

  const demQuotes = useMemo(() => getQuotes(researchData.elderly_with_senile_dementia), []);
  const noDemQuotes = useMemo(() => getQuotes(researchData.elderly_without_senile_dementia), []);
  const allLinks = useMemo(() => getLinks(researchData.external_resources_and_links), []);

  // Filter handlers
  const filteredDem = useMemo(() => demQuotes.filter(q => 
    q.quote.toLowerCase().includes(search.toLowerCase()) || q.author.toLowerCase().includes(search.toLowerCase())
  ), [demQuotes, search]);

  const filteredNoDem = useMemo(() => noDemQuotes.filter(q => 
    q.quote.toLowerCase().includes(search.toLowerCase()) || q.author.toLowerCase().includes(search.toLowerCase())
  ), [noDemQuotes, search]);

  const filteredLinks = useMemo(() => allLinks.filter(l => 
    l.raw.toLowerCase().includes(search.toLowerCase())
  ), [allLinks, search]);

  // Chart data generators
  const getPieData = (quotes) => {
    const counts = { doctors_and_specialists: 0, caregivers_and_professionals: 0, family_members: 0 };
    quotes.forEach(q => counts[q.roleId]++);
    return Object.entries(counts).filter(([_, v]) => v > 0).map(([k, v]) => ({
      name: ROLES[k].label, value: v, color: ROLES[k].color
    }));
  };

  const demPieData = useMemo(() => getPieData(demQuotes), [demQuotes]);
  const noDemPieData = useMemo(() => getPieData(noDemQuotes), [noDemQuotes]);

  const linkBarData = useMemo(() => {
    const counts = {};
    Object.keys(LINK_CATEGORIES).forEach(k => counts[k] = 0);
    allLinks.forEach(l => counts[l.catId]++);
    return Object.entries(counts).filter(([_, v]) => v > 0).map(([k, v]) => ({
      name: LINK_CATEGORIES[k].label, value: v, color: LINK_CATEGORIES[k].color
    }));
  }, [allLinks]);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* HEADER */}
      <div className="hide-on-mobile" style={{
        borderRadius: 'var(--r)',
        padding: '36px',
        background: 'linear-gradient(135deg, #0a0a1a 0%, #111111 40%, #0d0010 100%)',
        border: '1px solid rgba(178,178,255,0.15)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(178,178,255,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1 style={{ fontWeight: 900, fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--fg)', lineHeight: 1.1, marginBottom: '4px' }}>
            Investigación: Ancianos y Demencia
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--fg-muted)', maxWidth: '600px', lineHeight: 1.6 }}>
            Recopilación de comentarios, citas y fuentes sobre el uso de actividades lúdicas, estimulación sensorial y juegos de mesa adaptados para adultos mayores (con y sin demencia).
          </p>
        </div>
      </div>

      {/* KPI ROW */}
      <div className="grid-kpi">
        <KpiCard icon="psychology" value={demQuotes.length} label="Citas: Con Demencia" accent="var(--primary)" delay={50} />
        <KpiCard icon="sentiment_satisfied" value={noDemQuotes.length} label="Citas: Sin Demencia" accent="var(--success)" delay={100} />
        <KpiCard icon="link" value={allLinks.length} label="Recursos Externos" accent="var(--info)" delay={150} className="span-2-mobile" />
      </div>

      {/* SEARCH + TABS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <SearchInput
          value={search} onChange={setSearch}
          placeholder="Buscar palabras clave, autores o enlaces..."
          accent="var(--violet)"
        />
        <div className="scroll-tabs" style={{ display: 'flex', gap: '8px' }}>
          {TABS.map(t => (
            <TabBtn key={t.key} active={tab === t.key} onClick={() => setTab(t.key)} accent="var(--violet)">
              <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '6px' }}>{t.icon}</span>
              {t.label}
            </TabBtn>
          ))}
        </div>
      </div>

      {/* ── CON DEMENCIA ── */}
      {tab === 'dementia' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="anim-fade-up">
          <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--fg)' }}>Distribución de citas por actor</p>
            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={demPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={4}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={12}>
                    {demPieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} contentStyle={TT_STYLE} />
                  <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'var(--font)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ backgroundColor: 'var(--card-2)', padding: '12px', borderRadius: 'var(--r-sm)', fontSize: '12px', color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--info)' }}>info</span>
              En pacientes con demencia senil, la mayoría de hallazgos se enfocan en estimulación propioceptiva, uso de texturas y actividades lúdicas sencillas.
            </div>
          </Card>

          <div>
            <p style={{ fontWeight: 700, fontSize: '16px', color: 'var(--fg)', marginBottom: '16px' }}>
              Testimonios y Citas ({filteredDem.length})
            </p>
            {filteredDem.length > 0 ? (
              <div className="grid-3col">
                {filteredDem.map(q => <QuoteCard key={q.id} q={q} roleId={q.roleId} />)}
              </div>
            ) : (
              <EmptyState icon="search" text="No se encontraron citas." />
            )}
          </div>
        </div>
      )}

      {/* ── SIN DEMENCIA ── */}
      {tab === 'nodementia' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="anim-fade-up">
          <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--fg)' }}>Distribución de citas por actor</p>
            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={noDemPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={4}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={12}>
                    {noDemPieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} contentStyle={TT_STYLE} />
                  <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'var(--font)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ backgroundColor: 'var(--card-2)', padding: '12px', borderRadius: 'var(--r-sm)', fontSize: '12px', color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--info)' }}>info</span>
              En pacientes sin demencia senil, se aborda la introducción de juegos de mesa más estratégicos y estructurados, pero con advertencias sobre la frustración competitiva.
            </div>
          </Card>

          <div>
            <p style={{ fontWeight: 700, fontSize: '16px', color: 'var(--fg)', marginBottom: '16px' }}>
              Testimonios y Citas ({filteredNoDem.length})
            </p>
            {filteredNoDem.length > 0 ? (
              <div className="grid-3col">
                {filteredNoDem.map(q => <QuoteCard key={q.id} q={q} roleId={q.roleId} />)}
              </div>
            ) : (
              <EmptyState icon="search" text="No se encontraron citas." />
            )}
          </div>
        </div>
      )}

      {/* ── RECURSOS EXTERNOS ── */}
      {tab === 'resources' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="anim-fade-up">
          <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--fg)' }}>Fuentes de información</p>
            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={linkBarData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" tick={TICK_STYLE} />
                  <YAxis type="category" dataKey="name" tick={TICK_STYLE} width={130} />
                  <Tooltip contentStyle={TT_STYLE} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={30} name="Total enlaces">
                    {linkBarData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div>
            <p style={{ fontWeight: 700, fontSize: '16px', color: 'var(--fg)', marginBottom: '16px' }}>
              Enlaces Recopilados ({filteredLinks.length})
            </p>
            {filteredLinks.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '16px' }}>
                {filteredLinks.map(l => <LinkCard key={l.id} linkString={l.raw} catId={l.catId} />)}
              </div>
            ) : (
              <EmptyState icon="link_off" text="No se encontraron enlaces." />
            )}
          </div>
        </div>
      )}

    </div>
  );
}
