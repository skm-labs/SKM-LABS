'use client';
import { useState, useEffect, useCallback } from 'react';

// ─── Printer Presets ──────────────────────────────────────────────────────────
const PRESETS = {
  'Bambu Lab': {
    'P1S':     { power: 120,  price: 36599, lifespan: 7500 },
    'P1P':     { power: 100,  price: 28000, lifespan: 7500 },
    'X1C':     { power: 350,  price: 65000, lifespan: 7500 },
    'A1':      { power: 85,   price: 19999, lifespan: 7500 },
    'A1 Mini': { power: 65,   price: 14999, lifespan: 7500 },
  },
  'Creality': {
    'Ender 3 V3': { power: 350,  price: 12000, lifespan: 5000 },
    'K1':         { power: 350,  price: 22000, lifespan: 6000 },
    'K2 Plus':    { power: 1000, price: 85000, lifespan: 8000 },
  },
  'Prusa': {
    'MK4':  { power: 240, price: 42000, lifespan: 8000 },
    'Mini+':{ power: 180, price: 22000, lifespan: 7000 },
  },
};

const php = (n?: number) =>
  '₱' + (n ?? 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
let _id = 0;
const uid = () => ++_id;

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const icons = {
  layers:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  printer:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  user:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  briefcase:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  chevDown: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  chevRight:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  plus:     <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  x:        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  download: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  zap:      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
};

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label style={{ position: 'relative', display: 'inline-block', width: 34, height: 18, cursor: 'pointer', flexShrink: 0 }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 99,
        background: checked ? 'rgba(0,255,136,0.12)' : '#1e1e1e',
        border: `1px solid ${checked ? 'var(--accent)' : '#2e2e2e'}`,
        transition: 'all 0.2s',
      }} />
      <div style={{
        position: 'absolute', top: 3, left: checked ? 19 : 3,
        width: 10, height: 10, borderRadius: '50%',
        background: checked ? 'var(--accent)' : '#555',
        transition: 'all 0.2s',
      }} />
    </label>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({
  id,
  icon,
  title,
  includeable,
  included,
  onInclude,
  children,
}: {
  id?: string | number;
  icon: React.ReactNode;
  title: string;
  includeable?: boolean;
  included?: boolean;
  onInclude?: (val: boolean) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 10, marginBottom: 12, overflow: 'hidden',
    }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px', borderBottom: open ? '1px solid var(--border)' : 'none',
          cursor: 'pointer', userSelect: 'none', transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)' }}>
          <span style={{ color: 'var(--accent)' }}>{icon}</span>
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {includeable && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)' }}
              onClick={e => e.stopPropagation()}>
              <span>Include</span>
              <Toggle checked={included} onChange={e => onInclude(e.target.checked)} />
            </div>
          )}
          <span style={{ color: 'var(--dim)', transition: 'transform 0.2s', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', display: 'flex' }}>
            {icons.chevDown}
          </span>
        </div>
      </div>
      {open && (
        <div style={{
          padding: '18px', opacity: includeable && !included ? 0.3 : 1,
          pointerEvents: includeable && !included ? 'none' : 'auto', transition: 'opacity 0.2s',
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Field helpers ────────────────────────────────────────────────────────────
function FieldLabel({ label }) {
  return <label style={{ display: 'block', fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>{label}</label>;
}

function NumInput({ value, onChange, unit, min, max, step = 'any', disabled }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input
        type="number" value={value} onChange={onChange}
        min={min} max={max} step={step} disabled={disabled}
        style={{
          width: '100%', padding: unit ? '8px 48px 8px 11px' : '8px 11px',
          background: 'var(--surface2)', border: '1px solid var(--border2)',
          borderRadius: 6, fontSize: 12, color: disabled ? 'var(--dim)' : 'var(--text)',
          fontFamily: 'var(--mono)', outline: 'none', transition: 'border-color 0.15s',
          appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'textfield',
          cursor: disabled ? 'not-allowed' : 'text', boxSizing: 'border-box',
        }}
        onFocus={e => { if (!disabled) e.target.style.borderColor = 'var(--accent)'; }}
        onBlur={e => e.target.style.borderColor = 'var(--border2)'}
      />
      {unit && <span style={{ position: 'absolute', right: 10, fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--dim)', pointerEvents: 'none' }}>{unit}</span>}
    </div>
  );
}

function SelectInput({ value, onChange, children }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={onChange} style={{
        width: '100%', padding: '8px 32px 8px 11px',
        background: 'var(--surface2)', border: '1px solid var(--border2)',
        borderRadius: 6, fontSize: 12, color: 'var(--text)',
        fontFamily: 'var(--mono)', outline: 'none', transition: 'border-color 0.15s',
        appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', boxSizing: 'border-box',
      }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border2)'}
      >{children}</select>
      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--dim)' }}>{icons.chevDown}</span>
    </div>
  );
}

function Grid2({ children, mb = 10 }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: mb }}>{children}</div>;
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '14px 0' }} />;
}

function BkRow({ label, val }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', fontSize: 11, borderBottom: '1px solid var(--border)' }}>
      <span style={{ color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text)' }}>{val}</span>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PrintQuotePage() {
  const [fils, setFils] = useState([{ id: uid(), g: 397.08, cpk: 4000 }]);

  const [brand, setBrand]     = useState('Bambu Lab');
  const [model, setModel]     = useState('P1S');
  const [power, setPower]     = useState(120);
  const [price, setPrice]     = useState(36599);
  const [life, setLife]       = useState(7500);
  const [pHr, setPHr]         = useState(0);
  const [pMin, setPMin]       = useState(0);
  const [elec, setElec]       = useState(11);

  const [laborOn, setLaborOn]   = useState(false);
  const [laborRate, setLaborRate] = useState(750);
  const [laborHr, setLaborHr]   = useState(1);

  const [bizOn, setBizOn]       = useState(false);
  const [failPct, setFailPct]   = useState(15);
  const [markupPct, setMarkupPct] = useState(30);

  const [tab, setTab]           = useState('internal');

  const [r, setR] = useState({ mat: 0, elec: 0, wear: 0, lab: 0, sub: 0, fail: 0, mup: 0, finalInt: 0, finalCli: 0, price: 0 });

  useEffect(() => {
    const ms = PRESETS[brand];
    if (!ms) return;
    const first = Object.keys(ms)[0];
    setModel(first);
    const p = ms[first];
    setPower(p.power); setPrice(p.price); setLife(p.lifespan);
  }, [brand]);

  useEffect(() => {
    const p = PRESETS[brand]?.[model];
    if (p) { setPower(p.power); setPrice(p.price); setLife(p.lifespan); }
  }, [model]);

  const calc = useCallback(() => {
    const mat  = fils.reduce((s, f) => s + (f.g / 1000) * (f.cpk || 0), 0);
    const th   = (pHr || 0) + (pMin || 0) / 60;
    const el   = (power / 1000) * th * elec;
    const wear = life > 0 ? (price / life) * th : 0;
    const lab  = laborOn ? (laborRate || 0) * (laborHr || 0) : 0;
    const sub  = mat + el + wear + lab;
    const fail = bizOn ? sub * (failPct / 100) : 0;
    const mup  = bizOn ? (sub + fail) * (markupPct / 100) : 0;
    const finalInt = sub + fail;
    const finalCli = finalInt + mup;
    const svcFee   = el + wear + lab + fail + mup;
    const displayPrice = tab === 'client' ? finalCli : finalInt;
    setR({ mat, elec: el, wear, lab, sub, fail, mup, finalInt, finalCli, svcFee, price: displayPrice });
  }, [fils, pHr, pMin, elec, power, price, life, laborOn, laborRate, laborHr, bizOn, failPct, markupPct, tab]);

  useEffect(() => { calc(); }, [calc]);

  const addFil    = ()         => setFils(f => [...f, { id: uid(), g: 0, cpk: 0 }]);
  const removeFil = (id)       => setFils(f => f.filter(x => x.id !== id));
  const updFil    = (id, k, v) => setFils(f => f.map(x => x.id === id ? { ...x, [k]: parseFloat(v) || 0 } : x));

  const exportPDF = async () => {
    try {
      const jsPDF = window.jspdf?.jsPDF;
      if (!jsPDF) { alert('jsPDF not loaded'); return; }
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const now = new Date().toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
      doc.setFillColor(10, 10, 10); doc.rect(0, 0, 210, 32, 'F');
      doc.setFont('courier', 'bold'); doc.setFontSize(16); doc.setTextColor(0, 255, 136); doc.text('skm.labs', 14, 14);
      doc.setFont('courier', 'normal'); doc.setFontSize(9); doc.setTextColor(85, 85, 85);
      doc.text('// print-quote', 14, 21); doc.text('Generated: ' + now, 14, 28);
      doc.setFont('courier', 'bold'); doc.setFontSize(14); doc.setTextColor(20, 20, 20); doc.text('3D Print Cost Report', 14, 44);
      doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3); doc.line(14, 47, 196, 47);
      doc.setFont('courier', 'normal'); doc.setFontSize(8); doc.setTextColor(100, 100, 100);
      doc.text(`Printer: ${brand} ${model}  |  ${power}W  |  ₱${price.toLocaleString()}  |  ${life}hr lifespan`, 14, 54);
      const rows = [['Material Cost', r.mat], ['Electricity Cost', r.elec], ['Printer Wear & Tear', r.wear]];
      if (laborOn) rows.push([`Labor Cost  (₱${laborRate}/hr)`, r.lab]);
      rows.push(['SUBTOTAL', r.sub]);
      if (bizOn) { rows.push([`Failure Cost  (${failPct}%)`, r.fail]); if (tab === 'client') rows.push([`Profit Margin  (${markupPct}%)`, r.mup]); }
      let y = 64;
      rows.forEach(([lbl, val]) => {
        const isSub = lbl === 'SUBTOTAL';
        if (isSub) { doc.setFillColor(220, 255, 240); doc.rect(14, y - 4, 182, 9, 'F'); }
        doc.setFont('courier', isSub ? 'bold' : 'normal'); doc.setFontSize(9);
        doc.setTextColor(isSub ? 10 : 60, isSub ? 10 : 60, isSub ? 10 : 65);
        doc.text(lbl, 16, y); doc.text('P ' + val.toFixed(2), 195, y, { align: 'right' });
        if (!isSub) { doc.setDrawColor(220, 220, 220); doc.setLineWidth(0.2); doc.line(14, y + 2, 196, y + 2); }
        y += 10;
      });
      y += 6; doc.setFillColor(0, 255, 136); doc.roundedRect(14, y, 182, 22, 2, 2, 'F');
      doc.setFont('courier', 'bold'); doc.setFontSize(9); doc.setTextColor(10, 10, 10);
      doc.text(tab === 'client' ? 'CLIENT PRICE' : 'INTERNAL COST', 20, y + 9);
      doc.setFontSize(14); doc.text('P ' + r.price.toFixed(2), 194, y + 14, { align: 'right' });
      doc.save('skmlabs-print-quote.pdf');
    } catch (e) { console.error(e); }
  };

  const brands   = Object.keys(PRESETS);
  const models   = PRESETS[brand] ? Object.keys(PRESETS[brand]) : [];
  const inclList = ['material', 'printer', ...(laborOn ? ['labor'] : []), ...(bizOn ? ['business'] : [])];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');
        :root {
          --bg:#0a0a0a; --surface:#111111; --surface2:#161616; --surface3:#1e1e1e;
          --border:#1e1e1e; --border2:#2e2e2e;
          --accent:#00FF88; --accent-dim:rgba(0,255,136,0.07); --accent-border:rgba(0,255,136,0.2);
          --text:#f0f0f0; --muted:#555; --dim:#333; --danger:#ff5555;
          --mono:'JetBrains Mono',monospace; --serif:'Fraunces',serif;
        }
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:var(--bg);color:var(--text);font-family:var(--mono);min-height:100vh;}
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        input[type=number]{-moz-appearance:textfield;}
        @keyframes pop{from{opacity:0;transform:translateY(-4px);}to{opacity:1;transform:translateY(0);}}
        @media(max-width:740px){
          .page-grid{grid-template-columns:1fr!important;}
          .sidebar{position:static!important;}
          .g2{grid-template-columns:1fr!important;}
          .g3{grid-template-columns:1fr 1fr!important;}
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px', height: 54, borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(18px)', zIndex: 100,
      }}>
        <a style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700, color: 'var(--text)', textDecoration: 'none', letterSpacing: '-0.02em' }} href="#">
          skm<span style={{ color: 'var(--accent)' }}>.</span>labs
        </a>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--accent)',
          background: 'var(--accent-dim)', border: '1px solid var(--accent-border)',
          padding: '3px 12px', borderRadius: 3, letterSpacing: '0.08em',
        }}>// print-quote</span>
      </nav>

      {/* PAGE */}
      <div className="page-grid" style={{
        maxWidth: 1100, margin: '0 auto', padding: '32px 20px 80px',
        display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start',
      }}>
        {/* Header */}
        <div style={{ gridColumn: '1 / -1', marginBottom: 4 }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: 4 }}>
            3D Print Quote
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 11, fontFamily: 'var(--mono)' }}>// accurate costing for your 3D prints</p>
        </div>

        {/* LEFT COLUMN */}
        <div>

          {/* MATERIAL */}
          <Card icon={icons.layers} title="Material / Filaments">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
              {fils.length === 0 && (
                <p style={{ color: 'var(--dim)', fontSize: 11, fontFamily: 'var(--mono)', paddingBottom: 8 }}>// no filaments added yet.</p>
              )}
              {fils.map(f => (
                <div key={f.id} style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8,
                  alignItems: 'end', background: 'var(--surface2)', border: '1px solid var(--border)',
                  borderRadius: 6, padding: 12, animation: 'pop 0.15s ease',
                }}>
                  <div>
                    <FieldLabel label="Weight (grams)" />
                    <NumInput value={f.g || ''} onChange={e => updFil(f.id, 'g', e.target.value)} unit="g" min={0} />
                  </div>
                  <div>
                    <FieldLabel label="Cost per kg (₱)" />
                    <NumInput value={f.cpk || ''} onChange={e => updFil(f.id, 'cpk', e.target.value)} unit="₱/kg" min={0} />
                  </div>
                  {fils.length > 1 && (
                    <button onClick={() => removeFil(f.id)} style={{
                      background: 'none', border: '1px solid var(--border)', borderRadius: 6,
                      color: 'var(--dim)', cursor: 'pointer', padding: '7px 8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--danger)'; e.currentTarget.style.color = 'var(--danger)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--dim)'; }}
                    >{icons.x}</button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={addFil} style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'none', border: '1px dashed var(--border2)', borderRadius: 6,
              color: 'var(--muted)', padding: '7px 14px', fontFamily: 'var(--mono)', fontSize: 11,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--muted)'; }}
            >
              {icons.plus} Add Filament
            </button>
          </Card>

          {/* PRINTER */}
          <Card icon={icons.printer} title="Printer Costs">
            {/* Preset badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--accent-dim)', border: '1px solid var(--accent-border)',
              borderRadius: 3, padding: '4px 10px', fontFamily: 'var(--mono)',
              fontSize: 9, color: 'var(--accent)', marginBottom: 14, letterSpacing: '0.08em',
            }}>
              <div style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%' }} />
              {brand} {model} — active preset
            </div>

            {/* Brand / Model */}
            <Grid2 mb={10}>
              <div>
                <FieldLabel label="Printer Brand" />
                <SelectInput value={brand} onChange={e => setBrand(e.target.value)}>
                  {brands.map(b => <option key={b}>{b}</option>)}
                </SelectInput>
              </div>
              <div>
                <FieldLabel label="Printer Model" />
                <SelectInput value={model} onChange={e => setModel(e.target.value)}>
                  {models.map(m => <option key={m}>{m}</option>)}
                </SelectInput>
              </div>
            </Grid2>

            {/* Time + Elec */}
            <Grid2 mb={10}>
              <div>
                <FieldLabel label="Print Time — Hours" />
                <NumInput value={pHr} onChange={e => setPHr(parseFloat(e.target.value) || 0)} unit="hr" min={0} />
              </div>
              <div>
                <FieldLabel label="Print Time — Minutes" />
                <NumInput value={pMin} onChange={e => setPMin(parseFloat(e.target.value) || 0)} unit="min" min={0} max={59} />
              </div>
            </Grid2>
            <div style={{ marginBottom: 10 }}>
              <FieldLabel label="Electricity Rate" />
              <NumInput value={elec} onChange={e => setElec(parseFloat(e.target.value) || 0)} unit="₱/kWh" step={0.01} />
            </div>

            <Divider />
            <p style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--muted)', marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Or override manually:</p>
            <div className="g3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div>
                <FieldLabel label="Printer Power" />
                <NumInput value={power} onChange={e => setPower(parseFloat(e.target.value) || 0)} unit="W" />
              </div>
              <div>
                <FieldLabel label="Printer Price" />
                <NumInput value={price} onChange={e => setPrice(parseFloat(e.target.value) || 0)} unit="₱" />
              </div>
              <div>
                <FieldLabel label="Lifespan" />
                <NumInput value={life} onChange={e => setLife(parseFloat(e.target.value) || 0)} unit="hr" />
              </div>
            </div>
          </Card>

          {/* LABOR */}
          <Card icon={icons.user} title="Labor Costs" includeable included={laborOn} onInclude={setLaborOn}>
            <Grid2 mb={0}>
              <div>
                <FieldLabel label="Labor Rate" />
                <NumInput value={laborRate} onChange={e => setLaborRate(parseFloat(e.target.value) || 0)} unit="₱/hr" />
              </div>
              <div>
                <FieldLabel label="Actual Labor Hours" />
                <NumInput value={laborHr} onChange={e => setLaborHr(parseFloat(e.target.value) || 0)} unit="hr" step={0.5} />
              </div>
            </Grid2>
          </Card>

          {/* BUSINESS */}
          <Card icon={icons.briefcase} title="Business Costs" includeable included={bizOn} onInclude={setBizOn}>
            <Grid2 mb={0}>
              <div>
                <FieldLabel label="Failure Rate (%)" />
                <NumInput value={failPct} onChange={e => setFailPct(parseFloat(e.target.value) || 0)} unit="%" />
              </div>
              <div>
                <FieldLabel label="Markup / Profit (%)" />
                <NumInput value={markupPct} onChange={e => setMarkupPct(parseFloat(e.target.value) || 0)} unit="%" />
              </div>
            </Grid2>
          </Card>

        </div>

        {/* SIDEBAR */}
        <div className="sidebar" style={{ position: 'sticky', top: 70 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>

            {/* Top */}
            <div style={{ padding: 18, borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 5 }}>Final Price</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 38, fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>
                {php(r.price)}
              </div>
              <div style={{ fontSize: 10, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>// {inclList.join(' + ')}</div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
                {['internal', 'client'].map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{
                    flex: 1, padding: 6, borderRadius: 3,
                    border: `1px solid ${tab === t ? 'var(--accent)' : 'var(--border)'}`,
                    background: tab === t ? 'var(--accent-dim)' : 'none',
                    color: tab === t ? 'var(--accent)' : 'var(--muted)',
                    fontSize: 10, fontFamily: 'var(--mono)', cursor: 'pointer',
                    textAlign: 'center', letterSpacing: '0.04em', transition: 'all 0.15s',
                    textTransform: 'capitalize',
                  }}>
                    {t === 'internal' ? 'Internal' : 'Client View'}
                  </button>
                ))}
              </div>
            </div>

            {/* Breakdown */}
            <div style={{ padding: '14px 18px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>// cost breakdown</div>

              {tab === 'client' ? (
                <>
                  <BkRow label="Material Cost" val={php(r.mat)} />
                  <BkRow label="Service Fee" val={php(r.svcFee)} />
                </>
              ) : (
                <>
                  <BkRow label="Material Cost" val={php(r.mat)} />
                  <BkRow label="Electricity Cost" val={php(r.elec)} />
                  <BkRow label="Printer Wear & Tear" val={php(r.wear)} />
                  {laborOn && <BkRow label="Labor Cost" val={php(r.lab)} />}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 11px', background: 'var(--surface2)', border: '1px solid var(--border2)',
                    borderRadius: 6, margin: '8px 0', fontFamily: 'var(--mono)', fontSize: 12,
                  }}>
                    <span style={{ color: 'var(--muted)' }}>Subtotal</span>
                    <span style={{ color: 'var(--accent)' }}>{php(r.sub)}</span>
                  </div>
                  {bizOn && <BkRow label={`Failure Cost (${failPct}%)`} val={php(r.fail)} />}
                  {bizOn && <BkRow label={`Profit Margin (${markupPct}%)`} val={php(r.mup)} />}
                </>
              )}

              <button onClick={exportPDF} style={{
                width: '100%', padding: 10, background: 'var(--accent)', color: '#0a0a0a',
                border: 'none', borderRadius: 6, fontFamily: 'var(--mono)', fontSize: 11,
                fontWeight: 700, cursor: 'pointer', marginTop: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'opacity 0.15s, transform 0.1s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {icons.download} Export as PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#0f0f0f', borderTop: '1px solid var(--border)', padding: '36px 40px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32, marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
              <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>
                skm<span style={{ color: 'var(--accent)' }}>.</span>labs
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)' }}>Smart 3D Printing Solutions for the Philippines.</p>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 10, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Quick Links</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', cursor: 'pointer', marginBottom: 6 }}>Calculator</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', cursor: 'pointer' }}>Contact</div>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 10, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Contact Us</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', cursor: 'pointer', marginBottom: 6 }}>Send us a message</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Philippines-based</div>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', borderTop: '1px solid var(--border)', paddingTop: 16, fontSize: 11, color: 'var(--muted)' }}>
          © 2026 skm.labs. All rights reserved.
        </div>
      </footer>
    </>
  );
}