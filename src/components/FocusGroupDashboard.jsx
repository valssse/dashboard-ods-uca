import { useState, useMemo, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, ReferenceArea, Cell, Rectangle
} from 'recharts';
import { LineChart as MuiLineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { participantes, categorias, metaDatos } from '../data/focusGroup';
import {
  Card, KpiCard, ScoreBar, SearchInput, TabBtn, DarkTooltip, EmptyState, Tag, Badge, Modal
} from './ui';

/* ── Math helpers ── */
const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
const stdDev = arr => {
  const m = avg(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / Math.max(arr.length, 1));
};

const TOOLTIP_STYLE = {
  backgroundColor: 'var(--card-2)', border: '1px solid var(--border)',
  borderRadius: '12px', fontFamily: 'var(--font)',
};
const TICK_STYLE = { fontSize: 10, fill: 'var(--fg-muted)', fontFamily: 'var(--font)' };

const darkTheme = createTheme({
  palette: { mode: 'dark', background: { paper: '#202020' }, text: { primary: '#FFFFFF', secondary: '#B8B9B6' } },
  typography: { fontFamily: 'Geist, system-ui, sans-serif' },
});

/* ═══════════════════════════════════════════
   PARTICIPANT CARD
═══════════════════════════════════════════ */
function ParticipantCard({ p, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        position: 'relative', padding: '16px 14px',
        borderRadius: 'var(--r)',
        border: `1px solid var(--primary)`,
        backgroundColor: selected ? `${p.color}14` : 'var(--card)',
        cursor: 'pointer', textAlign: 'left', width: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        transition: 'all 0.25s ease',
        transform: selected ? 'translateY(-2px)' : 'none',
        boxShadow: selected ? `0 6px 24px ${p.color}25` : 'none',
        opacity: selected ? 1 : 0.5,
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.opacity = '0.75'; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.opacity = '0.5'; }}
    >
      {p.estimado && (
        <span style={{
          position: 'absolute', top: '8px', right: '8px',
          fontSize: '9px', backgroundColor: 'var(--warning-bg)', color: 'var(--warning)',
          padding: '2px 6px', borderRadius: 'var(--r-pill)', fontWeight: 700,
        }}>Est.</span>
      )}
      <p style={{ fontWeight: 700, color: 'var(--fg)', fontSize: '20px', lineHeight: 1.3 }}>{p.nombre}</p>
      <p style={{ fontSize: '11px', color: 'var(--fg-muted)', marginTop: '2px' }}>{p.profesion}</p>
    </button>
  );
}

/* ═══════════════════════════════════════════
   OVERVIEW
═══════════════════════════════════════════ */
function Overview({ sel }) {
  const totalAttrs = Object.values(categorias).reduce((s, c) => s + c.atributos.length, 0);

  // Consensus & Divergence
  const { consensus, divergence } = useMemo(() => {
    const con = [], div = [];
    Object.entries(categorias).forEach(([catKey, cat]) => {
      if (catKey === 'utilidad') return;
      cat.atributos.forEach(attr => {
        const scores = sel.map(p => p[catKey]?.[attr.key] ?? 0);
        if (scores.length < 2) return;
        const a = avg(scores), s = stdDev(scores);
        if (s < 0.9 && Math.abs(a) >= 1.8) con.push({ label: attr.label, avg: a, std: s, catColor: cat.color, catTitle: cat.titulo, izq: attr.izq, der: attr.der });
        if (s > 1.5) div.push({ label: attr.label, avg: a, std: s, catColor: cat.color, catTitle: cat.titulo });
      });
    });
    return {
      consensus: con.sort((a, b) => Math.abs(b.avg) - Math.abs(a.avg)).slice(0, 5),
      divergence: div.sort((a, b) => b.std - a.std).slice(0, 5),
    };
  }, [sel]);

  // Category averages bar
  const catAvg = Object.entries(categorias)
    .filter(([k]) => k !== 'utilidad')
    .map(([k, cat]) => {
      const scores = cat.atributos.flatMap(a => sel.map(p => p[k]?.[a.key] ?? 0));
      return { name: cat.titulo.replace('Evaluación ', '').replace(' (Primera Impresión)', ''), avg: parseFloat(avg(scores).toFixed(2)), color: cat.color };
    });

  const scoreLabel = (a, izq, der) => a === 0 ? 'Neutral' : a < 0 ? `${Math.abs(a).toFixed(1)} → ${izq}` : `${a.toFixed(1)} → ${der}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Consensus & Divergence */}
      <div className="grid-2col">
        {/* Consensus */}
        <Card style={{ padding: '20px' }} accent="var(--success)">
          <p style={{ fontWeight: 700, color: 'var(--fg)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)', display: 'inline-block', flexShrink: 0 }} />
            Mayor consenso entre participantes
          </p>
          {consensus.length === 0
            ? <EmptyState icon="🤝" text="Seleccione más participantes para ver consensos." />
            : <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {consensus.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px', backgroundColor: 'var(--success-bg)', borderRadius: 'var(--r-sm)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: item.catColor, marginTop: '4px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fg)' }}>{item.label}</p>
                      <p style={{ fontSize: '10px', color: 'var(--fg-muted)' }}>{item.catTitle.replace('Evaluación ', '')}</p>
                      <p style={{ fontSize: '11px', color: 'var(--success)', marginTop: '2px' }}>{scoreLabel(item.avg, item.izq, item.der)}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p className="mono" style={{ fontSize: '13px', fontWeight: 700, color: item.catColor }}>{item.avg > 0 ? '+' : ''}{item.avg.toFixed(1)}</p>
                      <p className="mono" style={{ fontSize: '10px', color: 'var(--fg-muted)' }}>σ={item.std.toFixed(1)}</p>
                    </div>
                  </div>
                ))}
              </div>
          }
        </Card>

        {/* Divergence */}
        <Card style={{ padding: '20px' }} accent="var(--warning)">
          <p style={{ fontWeight: 700, color: 'var(--fg)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--warning)', display: 'inline-block', flexShrink: 0 }} />
            Mayor divergencia de opiniones
          </p>
          {divergence.length === 0
            ? <EmptyState icon="⚖️" text="Seleccione más participantes para ver divergencias." />
            : <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {divergence.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px', backgroundColor: 'var(--warning-bg)', borderRadius: 'var(--r-sm)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: item.catColor, marginTop: '4px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fg)' }}>{item.label}</p>
                      <p style={{ fontSize: '10px', color: 'var(--fg-muted)' }}>{item.catTitle.replace('Evaluación ', '')}</p>
                    </div>
                    <p className="mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--warning)', flexShrink: 0 }}>σ={item.std.toFixed(1)}</p>
                  </div>
                ))}
              </div>
          }
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TACTIL HEATMAP — full-width matrix for 18 attrs
═══════════════════════════════════════════ */
const SCORE_COLORS = {
  '-3': { bg: 'rgba(255,92,51,0.80)',  text: '#fff' },
  '-2': { bg: 'rgba(255,132,0,0.70)',  text: '#fff' },
  '-1': { bg: 'rgba(255,132,0,0.35)',  text: '#FFCC88' },
   '0': { bg: 'rgba(60,60,60,0.5)',    text: '#666' },
   '1': { bg: 'rgba(130,130,255,0.35)',text: '#AAAAFF' },
   '2': { bg: 'rgba(100,100,255,0.65)',text: '#fff' },
   '3': { bg: 'rgba(80,80,255,0.90)',  text: '#fff' },
};

function TactilHeatmap({ catData, catKey, sel }) {
  const scoreStyle = v => SCORE_COLORS[String(v)] ?? SCORE_COLORS['0'];
  return (
    <div style={{ overflowX: 'auto' }}>
      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginBottom: '18px' }}>
        {sel.map(p => (
          <span key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--fg-muted)' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: p.color, display: 'inline-block' }} />
            {p.nombre}
          </span>
        ))}
      </div>

      {/* Scale legend */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {Object.entries(SCORE_COLORS).map(([k, c]) => (
          <span key={k} style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: c.bg, color: c.text, fontSize: '10px', fontWeight: 700, fontFamily: 'var(--mono)' }}>
            {Number(k) > 0 ? '+' : ''}{k}
          </span>
        ))}
      </div>

      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ textAlign: 'left', padding: '6px 10px', fontSize: '10px', color: 'var(--fg-subtle)', fontWeight: 500, letterSpacing: '0.06em', width: '120px' }}>Lado −</th>
            <th style={{ textAlign: 'right', padding: '6px 10px', fontSize: '10px', color: 'var(--fg-subtle)', fontWeight: 500, letterSpacing: '0.06em', width: '120px' }}>Lado +</th>
            {sel.map(p => (
              <th key={p.id} style={{ textAlign: 'center', padding: '6px 8px', fontSize: '10px', color: p.color, fontWeight: 700, minWidth: '76px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.nombre.split(' ').slice(-1)[0]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {catData.atributos.map((attr, i) => {
            const isEven = i % 2 === 0;
            return (
              <tr key={attr.key} style={{ backgroundColor: isEven ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '9px 10px', fontSize: '11px', color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>{attr.izq}</td>
                <td style={{ padding: '9px 10px', fontSize: '11px', color: 'var(--fg-muted)', whiteSpace: 'nowrap', textAlign: 'right' }}>{attr.der}</td>
                {sel.map(p => {
                  const val = p[catKey]?.[attr.key] ?? 0;
                  const s = scoreStyle(val);
                  return (
                    <td key={p.id} style={{ padding: '6px', textAlign: 'center' }}>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        minWidth: '44px', padding: '5px 0',
                        borderRadius: '8px',
                        backgroundColor: s.bg,
                        color: s.text,
                        fontSize: '13px', fontWeight: 700,
                        fontFamily: 'var(--mono)',
                        transition: 'opacity 0.2s',
                      }}>
                        {val > 0 ? '+' : ''}{val}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CATEGORY SECTION
═══════════════════════════════════════════ */
function CategorySection({ catKey, catData, sel }) {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const VerticalDivLines = (props) => {
    const box = props.offset || props.viewBox;
    if (!box || !box.width) return null;
    const step = box.width / barData.length;
    
    const bands = Array.from({ length: barData.length }).map((_, i) => ({
      x: box.left || box.x || 0,
      width: step,
      isEven: i % 2 === 0
    }));
    bands.forEach((b, i) => b.x += step * i);

    return (
      <g style={{ pointerEvents: 'none' }}>
        {bands.slice(1).map((b, i) => (
          <line 
            key={`line-${i}`} 
            x1={b.x} 
            x2={b.x} 
            y1={box.top || box.y || 0} 
            y2={(box.top || box.y || 0) + box.height} 
            stroke="#666" 
            strokeWidth={1.5} 
          />
        ))}
      </g>
    );
  };

  const isUtil = catKey === 'utilidad';

  const filteredAttrs = useMemo(() => {
    if (!search) return catData.atributos;
    return catData.atributos.filter(a => a.label === search);
  }, [catData.atributos, search]);

  const radarData = useMemo(() =>
    filteredAttrs.map(a => {
      const row = { subject: a.label.length > 16 ? a.label.slice(0, 16) + '…' : a.label };
      sel.forEach(p => { row[p.nombre] = (p[catKey]?.[a.key] ?? 0) + 3; });
      return row;
    }), [filteredAttrs, catKey, sel]);

  const barData = useMemo(() =>
    filteredAttrs.map(a => {
      const row = { name: a.label.length > 20 ? a.label.slice(0, 20) + '…' : a.label, fullName: a.label, izq: a.izq, der: a.der };
      sel.forEach(p => { row[p.nombre] = p[catKey]?.[a.key] ?? 0; });
      return row;
    }), [filteredAttrs, catKey, sel]);

  const utilAvg = useMemo(() => {
    if (!isUtil) return [];
    return catData.atributos.map(a => ({
      name: a.label,
      avg: parseFloat(avg(sel.map(p => p[catKey]?.[a.key] ?? 0)).toFixed(2)),
      icon: a.icon, key: a.key,
    }));
  }, [catData, catKey, isUtil, sel]);

  const categoryQuotes = useMemo(() => {
    const quotes = [];
    const validAttrs = new Set(catData.atributos.map(a => a.label));

    sel.forEach(p => {
      if (p.comentarios_detallados) {
        p.comentarios_detallados.forEach(c => {
          if (validAttrs.has(c.atributo)) {
            quotes.push({
              id: `${p.id}-${c.atributo}`,
              text: c.cita,
              author: p.nombre,
              authorColor: p.color,
              attribute: c.atributo,
            });
          }
        });
      }
    });
    return quotes.slice(0, 6);
  }, [catData, sel]);

  const tooltipRenderer = props => {
    const fullLabel = props.payload?.[0]?.payload?.fullName || props.label;
    return <DarkTooltip {...props} label={fullLabel} barData={barData} />;
  };

  const CustomBarShape = (props) => {
    const { x, y, width, height, fill } = props;
    if (width === 0) {
      const size = 10;
      return <rect x={x - size / 2} y={y + height / 2 - size / 2} width={size} height={size} fill={fill} rx={2} />;
    }
    return <Rectangle {...props} />;
  };

  const chartHeight = Math.max(280, barData.length * (sel.length * 14 + 40)) + 32;

  const DivLines = (props) => {
    const box = props.offset || props.viewBox;
    if (!box || !box.height) return null;
    const step = box.height / barData.length;
    
    const bands = Array.from({ length: barData.length }).map((_, i) => ({
      y: box.top || box.y || 0,
      height: step,
      isEven: i % 2 === 0
    }));
    // Fix y positions
    bands.forEach((b, i) => b.y += step * i);

    return (
      <g style={{ pointerEvents: 'none' }}>
        {bands.slice(1).map((b, i) => (
          <line 
            key={`line-${i}`} 
            x1={box.left || box.x || 0} 
            x2={(box.left || box.x || 0) + box.width} 
            y1={b.y} 
            y2={b.y} 
            stroke="#666" 
            strokeWidth={1.5} 
          />
        ))}
      </g>
    );
  };

  const lineChartConfig = useMemo(() => {
    const xLabels = filteredAttrs.map(a => a.label);
    const series = sel.map(p => ({
      data: filteredAttrs.map(a => (p[catKey]?.[a.key] ?? 0)),
      label: p.nombre,
      color: p.color,
      yAxisId: 'score-axis',
      valueFormatter: (v, context) => {
        const originalValue = v;
        if (originalValue === 0) return '0 (indiferente)';
        const attr = filteredAttrs[context?.dataIndex];
        if (!attr) return `${originalValue}`;
        const word = originalValue < 0 ? attr.izq : attr.der;
        const abs = Math.abs(originalValue);
        let prefix = '';
        if (abs === 3) prefix = 'Muy ';
        if (abs === 1) prefix = 'Ligeramente ';
        return `${originalValue} (${prefix}${word.toLowerCase()})`;
      }
    }));

    return {
      xAxis: [{ 
        data: xLabels, 
        scaleType: 'point',
        tickInterval: xLabels,
        tickLabelStyle: { fontSize: 10, fill: '#8B8C89', fontFamily: 'Geist, system-ui, sans-serif' }
      }],
      yAxis: [{ 
        id: 'score-axis', 
        label: 'Puntuación (-3 a 3)',
        min: -3,
        max: 3,
        tickNumber: 7,
        tickLabelStyle: { fontSize: 10, fill: '#8B8C89', fontFamily: 'Geist, system-ui, sans-serif' }
      }],
      series: series
    };
  }, [filteredAttrs, catKey, sel]);

  return (
    <Card style={{ overflow: 'hidden' }}>
      {/* Collapsible header */}
      <div
        onClick={() => setOpen(x => !x)}
        style={{
          width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '18px 22px', cursor: 'pointer', background: 'transparent', border: 'none',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--fg)', lineHeight: 1.2 }}>{catData.titulo}</p>
            <p style={{ fontSize: '11px', color: 'var(--fg-muted)', marginTop: '4px' }}>{catData.subtitulo}</p>
            {open && (
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
                <select
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--card-2)', border: '1px solid var(--border)',
                    borderRadius: 'var(--r-sm)', fontSize: '12px', color: 'var(--fg)',
                    fontFamily: 'var(--font)', outline: 'none', cursor: 'pointer',
                    minWidth: '220px'
                  }}
                >
                  <option value="">Todos los atributos</option>
                  {catData.atributos.map(a => (
                    <option key={a.key} value={a.label}>{a.label}</option>
                  ))}
                </select>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  {sel.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: p.color }} />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fg)' }}>{p.nombre}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div style={{ marginTop: '2px' }}>
          <svg style={{ width: '18px', height: '18px', color: 'var(--fg-subtle)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', flexShrink: 0 }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {open && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '22px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '12px', paddingBottom: '40px', maskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)' }}>
                {/* Radar (requires at least 3 points to form a polygon) */}
                {filteredAttrs.length >= 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p style={{ fontWeight: 600, fontSize: '13px', color: 'var(--fg-muted)', marginBottom: '4px', alignSelf: 'flex-start' }}>Perfil comparativo (Escala -3 a 3)</p>
                    <div className="hover-card" style={{ width: '100%', maxWidth: '100%', display: 'flex', justifyContent: 'center', cursor: 'pointer', padding: '16px', borderRadius: 'var(--r-sm)', overflowX: 'auto' }}
                      onClick={() => setModalData({
                        title: 'Perfil comparativo',
                        content: (
                          <div style={{ width: '100%', height: '500px', display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
                            <div style={{ minWidth: '1000px', display: 'flex', justifyContent: 'center', paddingBottom: '40px' }}>
                              <ThemeProvider theme={darkTheme}>
                                <MuiLineChart
                                  {...lineChartConfig}
                                  width={1000}
                                  height={500}
                                  margin={{ top: 20, right: 40, bottom: 120, left: 40 }}
                                  slotProps={{ legend: { hidden: true } }}
                                  sx={{
                                    width: '100%',
                                    '& .MuiChartsAxis-label': { fill: '#8B8C89', fontSize: '10px' },
                                    [`& .${axisClasses.root}[data-axis-id="score-axis"] .${axisClasses.label}`]: { fill: '#8B8C89' }
                                  }}
                                />
                              </ThemeProvider>
                            </div>
                          </div>
                        )
                      })}
                    >
                      <div style={{ minWidth: isMobile ? '320px' : '900px', display: 'flex', justifyContent: 'center' }}>
                        <ThemeProvider theme={darkTheme}>
                        <MuiLineChart
                          {...lineChartConfig}
                          width={isMobile ? 320 : 900}
                          height={isMobile ? 300 : 400}
                          margin={{ top: 20, right: 40, bottom: 100, left: 40 }}
                          slotProps={{ legend: { hidden: true } }}
                          sx={{
                            width: '100%',
                            '& .MuiChartsAxis-label': { fill: '#8B8C89', fontSize: '10px' },
                            [`& .${axisClasses.root}[data-axis-id="score-axis"] .${axisClasses.label}`]: { fill: '#8B8C89' }
                          }}
                        />
                        </ThemeProvider>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bar horizontal */}
                <div>
                  <p style={{ fontWeight: 600, fontSize: '13px', color: 'var(--fg-muted)', marginBottom: '4px' }}>Puntuaciones por atributo</p>
                  <p style={{ fontSize: '11px', color: 'var(--fg-subtle)', marginBottom: '14px' }}>Negativo = primera opción · Positivo = segunda opción</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: barData.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {barData.map(attr => (
                      <div key={attr.name} className="hover-card" style={{ backgroundColor: 'var(--card-2)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px', cursor: 'pointer' }}
                        onClick={() => setModalData({
                          title: `Puntuación: ${attr.izq} / ${attr.der}`,
                          content: (
                            <div style={{ width: '100%', height: Math.max(400, sel.length * 40 + 60) }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[attr]} layout="vertical" margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                                  <CartesianGrid stroke="#252525" horizontal={false} vertical={true} strokeWidth={0.8} />
                                  <XAxis type="number" domain={[-3, 3]} tickCount={7} tick={{...TICK_STYLE, fontSize: 14}} />
                                  <YAxis yAxisId="left" orientation="left" type="category" dataKey="name" width={100} tickFormatter={() => attr.izq} tick={{ fontSize: 14, fill: 'var(--fg-muted)', fontFamily: 'var(--font)' }} axisLine={false} tickLine={false} />
                                  <YAxis yAxisId="right" orientation="right" type="category" dataKey="name" width={100} tickFormatter={() => attr.der} tick={{ fontSize: 14, fill: 'var(--fg-muted)', fontFamily: 'var(--font)' }} axisLine={false} tickLine={false} />
                                  <ReferenceLine x={0} stroke="#444" strokeWidth={1.5} />
                                  {sel.map(p => (
                                    <Bar yAxisId="left" key={p.id} dataKey={p.nombre} fill={p.color} radius={[0, 4, 4, 0]} maxBarSize={24} shape={<CustomBarShape />} />
                                  ))}
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          )
                        })}
                      >
                        <h5 style={{ fontFamily: 'var(--font)', fontSize: '13px', textAlign: 'center', marginBottom: '12px', color: 'var(--fg)' }}>{attr.izq} / {attr.der}</h5>
                        <ResponsiveContainer width="100%" height={sel.length * 18 + 40}>
                          <BarChart data={[attr]} layout="vertical" margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                            <CartesianGrid stroke="#252525" horizontal={false} vertical={true} strokeWidth={0.8} />
                            <XAxis type="number" domain={[-3, 3]} tickCount={7} tick={TICK_STYLE} />
                            <YAxis yAxisId="left" orientation="left" type="category" dataKey="name" width={70} tickFormatter={() => attr.izq} tick={{ fontSize: 10, fill: 'var(--fg-muted)', fontFamily: 'var(--font)' }} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="right" orientation="right" type="category" dataKey="name" width={70} tickFormatter={() => attr.der} tick={{ fontSize: 10, fill: 'var(--fg-muted)', fontFamily: 'var(--font)' }} axisLine={false} tickLine={false} />
                            <ReferenceLine x={0} stroke="#444" strokeWidth={1.5} />
                            {sel.map(p => (
                              <Bar yAxisId="left" key={p.id} dataKey={p.nombre} fill={p.color} radius={[0, 4, 4, 0]} maxBarSize={14} shape={<CustomBarShape />} />
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comments section */}
              <div>
                <p style={{ fontWeight: 600, fontSize: '13px', color: 'var(--fg-muted)', marginBottom: '14px' }}>💬 Sección de comentarios</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {categoryQuotes.map(quote => (
                    <div key={quote.id} style={{ backgroundColor: 'var(--card-2)', borderRadius: 'var(--r-sm)', padding: '16px', border: '1px solid var(--border-subtle)' }}>
                      <p style={{ fontSize: '11px', color: 'var(--fg-muted)', marginBottom: '8px' }}>
                        Sobre el atributo: <strong style={{ color: 'var(--fg)' }}>{quote.attribute}</strong>
                      </p>
                      <p style={{ fontSize: '13px', color: 'var(--fg)', fontStyle: 'italic', marginBottom: '12px', lineHeight: 1.5 }}>
                        "{quote.text}"
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: quote.authorColor }} />
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--fg)' }}>{quote.author}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
        </div>
      )}

      <Modal 
        isOpen={!!modalData} 
        onClose={() => setModalData(null)} 
        title={modalData?.title}
        showDownload={true}
      >
        {modalData?.content}
      </Modal>
    </Card>
  );
}

/* ═══════════════════════════════════════════
   QUALITATIVE SECTION
═══════════════════════════════════════════ */
const QUAL_QUESTIONS = [
  { key: 'opinion_general', label: 'Opinión general del material', icon: 'chat' },
  { key: 'cualidades',      label: 'Cualidades más y menos agradables', icon: 'star' },
  { key: 'asociacion',      label: 'Asociación con otros materiales', icon: 'link' },
  { key: 'descripcion',     label: 'Descripción del material', icon: 'description' },
  { key: 'emocion',         label: 'Emoción provocada', icon: 'lightbulb' },
  { key: 'usos',            label: 'Productos / usos percibidos', icon: 'center_focus_strong' },
  { key: 'compraria',       label: '¿Compraría el producto?', icon: 'shopping_cart' },
  { key: 'mejoraria',       label: '¿Qué mejoraría?', icon: 'build' },
  { key: 'opinion_olor',    label: 'Opinión sobre el olor', icon: 'local_florist' },
  { key: 'influencia_origen', label: 'Influencia del origen vegetal', icon: 'eco' },
];

function Qualitative({ sel, search }) {
  const filtered = QUAL_QUESTIONS.filter(q =>
    !search ||
    q.label.toLowerCase().includes(search.toLowerCase()) ||
    sel.some(p => p.cualitativo?.[q.key]?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Card style={{ padding: '24px' }}>
      <p style={{ fontWeight: 800, fontSize: '18px', color: 'var(--fg)', marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
        <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>chat</span> Perspectivas Cualitativas
      </p>
      <p style={{ fontSize: '13px', color: 'var(--fg-muted)', marginBottom: '24px' }}>Respuestas abiertas y discusión de los participantes</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.map(q => (
          <div key={q.key} style={{ borderRadius: 'var(--r-sm)', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div style={{ backgroundColor: 'var(--card-2)', padding: '11px 16px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fg)', display: 'flex', alignItems: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', marginRight: '6px' }}>{q.icon}</span> {q.label}
              </p>
            </div>
            <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '10px' }}>
              {sel.map(p => (
                <div key={p.id} style={{ padding: '12px', borderRadius: '8px', backgroundColor: `${p.color}10`, border: `1px solid ${p.color}28` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: p.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nombre}</span>
                    {p.estimado && <span style={{ fontSize: '9px', backgroundColor: 'var(--warning-bg)', color: 'var(--warning)', padding: '1px 5px', borderRadius: '99px', flexShrink: 0 }}>Est.</span>}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--fg-muted)', lineHeight: 1.6 }}>
                    {p.cualitativo?.[q.key] || '—'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <EmptyState icon="search" text={`Sin resultados para "${search}"`} />}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════
   SECTIONS CONFIG
═══════════════════════════════════════════ */
const SECTIONS = [
  { key: 'overview',       label: 'Resumen',        icon: 'bar_chart' },
  { key: 'visual',         label: 'Visual',         icon: 'visibility' },
  { key: 'tactil',         label: 'Táctil',         icon: 'front_hand' },
  { key: 'afectivo',       label: 'Afectivo',       icon: 'favorite' },
  { key: 'interpretativo', label: 'Interpretativo', icon: 'search' },
  { key: 'funcional',      label: 'Funcional',      icon: 'settings' },
  { key: 'utilidad',       label: 'Utilidad',       icon: 'center_focus_strong' },
  { key: 'olfativo',       label: 'Olfativo',       icon: 'local_florist' },
  { key: 'cualitativo',    label: 'Cualitativo',    icon: 'chat' },
];

/* ═══════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════ */
export default function FocusGroupDashboard() {
  const [selIds, setSelIds]    = useState(participantes.map(p => p.id));
  const [search, setSearch]    = useState('');
  const [section, setSection]  = useState('overview');

  const sel = participantes.filter(p => selIds.includes(p.id));

  const toggle = id => setSelIds(prev =>
    prev.includes(id) ? (prev.length > 1 ? prev.filter(x => x !== id) : prev) : [...prev, id]
  );

  const totalAttrs = Object.values(categorias).reduce((s, c) => s + c.atributos.length, 0);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── HEADER ── */}
      <div className="hide-on-mobile" style={{
        borderRadius: 'var(--r)',
        padding: '32px',
        background: 'linear-gradient(135deg, #1d0d00 0%, #171100 35%, #0a1400 70%, #111 100%)',
        border: '1px solid rgba(255,132,0,0.2)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(255,132,0,0.18) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '25%', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(182,255,206,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
            <div>
              <h1 style={{ fontWeight: 900, fontSize: 'clamp(22px, 4vw, 34px)', color: 'var(--fg)', lineHeight: 1.1, marginBottom: '6px' }}>
                Grupo Focal — Biomaterial
              </h1>
              <p style={{ fontSize: '12px', color: 'var(--fg-muted)', maxWidth: '520px', lineHeight: 1.7 }}>{metaDatos.descripcion}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── PARTICIPANT SELECTOR ── */}
      <div>
        <p className="mono uppercase" style={{ fontSize: '10px', color: 'var(--fg-subtle)', marginBottom: '12px' }}>
          Seleccionar participantes (clic para filtrar)
        </p>
        <div className="grid-4col">
          {participantes.map(p => (
            <ParticipantCard key={p.id} p={p} selected={selIds.includes(p.id)} onToggle={() => toggle(p.id)} />
          ))}
        </div>
        {sel.some(p => p.estimado) && (
          <div style={{
            marginTop: '12px', padding: '10px 16px',
            backgroundColor: 'var(--warning-bg)', borderRadius: 'var(--r-sm)',
            border: '1px solid rgba(255,132,0,0.25)',
            fontSize: '12px', color: 'var(--warning)',
            display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font)',
          }}>
            ⚠️ <strong>Jazmin Crepiat</strong> no cuenta con JSON formal. Sus puntuaciones son estimaciones extraídas de la transcripción y están marcadas como <strong>Est.</strong>
          </div>
        )}
      </div>

      {/* ── SEARCH + TABS ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <SearchInput
          value={search} onChange={setSearch}
          placeholder="Buscar atributos o respuestas..."
          accent="var(--primary)"
        />
        <div className="scroll-tabs">
          {SECTIONS.map(s => {
            const isActive = section === s.key;
            return (
              <TabBtn key={s.key} active={isActive} onClick={() => setSection(s.key)} accent="var(--primary)">
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '16px',
                    marginRight: '6px',
                    color: isActive ? '#000' : '#fff',
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                    verticalAlign: 'middle'
                  }}
                >
                  {s.icon}
                </span>
                <span style={{ verticalAlign: 'middle' }}>{s.label}</span>
              </TabBtn>
            );
          })}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="anim-fade-in">
        {section === 'overview'    && <Overview sel={sel} />}
        {section === 'cualitativo' && <Qualitative sel={sel} search={search} />}
        {section !== 'overview' && section !== 'cualitativo' && categorias[section] && (
          <CategorySection catKey={section} catData={categorias[section]} sel={sel} />
        )}
      </div>

      {/* ── SCALE LEGEND ── */}
      <Card style={{ padding: '16px 20px' }}>
        <p className="mono uppercase" style={{ fontSize: '10px', color: 'var(--fg-subtle)', marginBottom: '12px' }}>Leyenda de escala</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 22px' }}>
          {[
            { v: '−3', c: '#FF5C33', l: 'Muy [primera opción]' },
            { v: '−2', c: '#FF8400', l: 'Bastante [primera opción]' },
            { v: '−1', c: '#B8B9B6', l: 'Ligeramente [primera opción]' },
            { v: '0',  c: '#444',    l: 'Neutral / Indiferente' },
            { v: '+1', c: '#B2B2FF', l: 'Ligeramente [segunda opción]' },
            { v: '+2', c: '#8888FF', l: 'Bastante [segunda opción]' },
            { v: '+3', c: '#5555EE', l: 'Muy [segunda opción]' },
          ].map(item => (
            <span key={item.v} style={{ fontSize: '11px', color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <strong className="mono" style={{ color: item.c }}>{item.v}</strong> = {item.l}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
