'use client';
import { useState, useMemo } from 'react';
import ToolWrapper from '../components/ToolWrapper';
import { Droplets } from 'lucide-react';
import { CURRENCY_OPTIONS } from '../../lib/currencies';

type Fixture = { id: string; icon: string; label: string; litersPerUse: number; timesPerDay: number; enabled: boolean };

const INITIAL: Fixture[] = [
  { id: 'shower',   icon: '🚿', label: 'Shower',       litersPerUse: 60,  timesPerDay: 1,   enabled: true  },
  { id: 'bath',     icon: '🛁', label: 'Bath',          litersPerUse: 150, timesPerDay: 0,   enabled: false },
  { id: 'toilet',   icon: '🚽', label: 'Toilet Flush',  litersPerUse: 6,   timesPerDay: 5,   enabled: true  },
  { id: 'tap',      icon: '🚰', label: 'Tap',           litersPerUse: 2,   timesPerDay: 8,   enabled: true  },
  { id: 'dishwash', icon: '🍽️', label: 'Dishes',        litersPerUse: 12,  timesPerDay: 1,   enabled: true  },
  { id: 'washing',  icon: '👕', label: 'Washer',        litersPerUse: 50,  timesPerDay: 0.5, enabled: true  },
  { id: 'garden',   icon: '🌱', label: 'Garden',        litersPerUse: 500, timesPerDay: 0,   enabled: false },
  { id: 'carwash',  icon: '🚗', label: 'Car Wash',      litersPerUse: 150, timesPerDay: 0,   enabled: false },
];

const inputCls = 'w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm text-center px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-40 disabled:cursor-not-allowed';
export default function WaterClient() {
  const [price, setPrice]       = useState(2.5);
  const [currency, setCurrency] = useState('€');
  const [fixtures, setFixtures] = useState<Fixture[]>(INITIAL);
  const [showDisabled, setShowDisabled] = useState(false);

  const update = (id: string, field: 'litersPerUse' | 'timesPerDay', raw: string) => {
    const v = parseFloat(raw);
    setFixtures(prev => prev.map(f => f.id === id ? { ...f, [field]: isNaN(v) ? 0 : Math.max(0, v) } : f));
  };

  const toggle = (id: string) =>
    setFixtures(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));

  const { dailyL, monthlyL, bill, aboveAvg, diffPct } = useMemo(() => {
    const dailyL   = fixtures.reduce((s, f) => s + (f.enabled ? f.litersPerUse * f.timesPerDay : 0), 0);
    const monthlyL = dailyL * 30;
    const bill     = (monthlyL / 1000) * price;
    const aboveAvg = dailyL > 150;
    const diffPct  = Math.abs(((dailyL - 150) / 150) * 100);
    return { dailyL, monthlyL, bill, aboveAvg, diffPct };
  }, [fixtures, price]);

  return (
    <ToolWrapper
      title="Water Usage"
      subtitle="Estimate daily consumption and monthly bill"
      icon={<Droplets size={17} className="text-gray-400" />}
      adSlot="water"
    >
      <div className="space-y-8">

        {/* Price + currency */}
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-medium whitespace-nowrap">Price / m³</p>
          <input
            type="number" min={0} step={0.01} value={price}
            onChange={e => setPrice(parseFloat(e.target.value) || 0)}
            className="w-28 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <div className="flex gap-1.5">
            {CURRENCY_OPTIONS.map(({ code, symbol }) => (
              <button key={code} onClick={() => setCurrency(symbol)}
                className={`px-2.5 h-8 rounded-lg border text-sm font-semibold transition-all ${
                  currency === symbol
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-950/30'
                    : 'border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                }`}>
                {symbol}
              </button>
            ))}
          </div>
        </div>

        {/* Fixtures table */}
        <div>
          {/* Header */}
          <div className="grid grid-cols-[1fr_80px_80px_64px] gap-2 pb-2 border-b border-zinc-800">
            <span className="text-xs text-zinc-600 uppercase tracking-widest">Fixture</span>
            <span className="text-xs text-zinc-600 uppercase tracking-widest text-center">L / use</span>
            <span className="text-xs text-zinc-600 uppercase tracking-widest text-center">× / day</span>
            <span className="text-xs text-zinc-600 uppercase tracking-widest text-right">L / day</span>
          </div>

          {fixtures.filter(f => showDisabled || f.enabled).map(f => {
            const daily = f.enabled ? f.litersPerUse * f.timesPerDay : 0;
            return (
              <div key={f.id} className={`grid grid-cols-[1fr_80px_80px_64px] gap-2 items-center py-2.5 border-b border-zinc-800/50 last:border-0 transition-opacity ${!f.enabled ? 'opacity-40' : ''}`}>
                <div className="flex items-center gap-2 min-w-0">
                  {/* Checkbox — inside the label column, no grid change */}
                  <button
                    onClick={() => toggle(f.id)}
                    aria-label={f.enabled ? `Disable ${f.label}` : `Enable ${f.label}`}
                    className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                      f.enabled ? 'bg-emerald-600 border-emerald-500' : 'bg-zinc-800 border-zinc-700'
                    }`}
                  >
                    {f.enabled && (
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <span className="text-base leading-none flex-shrink-0">{f.icon}</span>
                  <span className="text-sm text-zinc-300 truncate">{f.label}</span>
                </div>
                <input type="number" min={0} step={1}   value={f.litersPerUse} disabled={!f.enabled} aria-label={`${f.label} liters per use`} onChange={e => update(f.id, 'litersPerUse', e.target.value)} onFocus={e => e.target.select()} className={inputCls} />
                <input type="number" min={0} step={0.1} value={f.timesPerDay}  disabled={!f.enabled} aria-label={`${f.label} times per day`}  onChange={e => update(f.id, 'timesPerDay',  e.target.value)} onFocus={e => e.target.select()} className={inputCls} />
                <span className={`text-sm font-semibold tabular-nums text-right ${daily > 0 ? 'text-white' : 'text-zinc-600'}`}>
                  {daily % 1 === 0 ? daily.toFixed(0) : daily.toFixed(1)} L
                </span>
              </div>
            );
          })}

          {(() => {
            const hiddenCount = fixtures.filter(f => !f.enabled).length;
            if (hiddenCount === 0) return null;
            return (
              <button onClick={() => setShowDisabled(v => !v)}
                className="w-full py-2.5 text-xs text-zinc-600 hover:text-zinc-400 uppercase tracking-widest font-medium transition-colors border-t border-zinc-800/50">
                {showDisabled ? 'Hide disabled fixtures' : `+ ${hiddenCount} disabled fixtures`}
              </button>
            );
          })()}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-6 pt-2 border-t border-zinc-800">
          {[
            { label: 'Daily',   val: `${dailyL.toFixed(0)} L`  },
            { label: 'Monthly', val: `${monthlyL.toFixed(0)} L` },
            { label: 'Bill',    val: `${currency}${bill.toFixed(2)}` },
          ].map(item => (
            <div key={item.label}>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-base font-semibold text-white tabular-nums">{item.val}</p>
            </div>
          ))}
        </div>

        {/* Eco status */}
        <div className="flex items-center gap-3 text-sm">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${aboveAvg ? 'border-amber-700 text-amber-400 bg-amber-950/30' : 'border-emerald-700 text-emerald-400 bg-emerald-950/30'}`}>
            {aboveAvg ? `+${diffPct.toFixed(0)}% above avg` : `${diffPct.toFixed(0)}% below avg`}
          </span>
          <span className="text-zinc-600 text-xs">vs 150 L/person/day average</span>
        </div>

        {aboveAvg && (
          <ul className="space-y-1.5">
            {[
              'Showers use ~60% less water than baths.',
              'Fix dripping taps — a single drip wastes ~20 L/day.',
              'Run dishwasher and washing machine only when fully loaded.',
              'Water garden early morning to reduce evaporation.',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-zinc-500">
                <span className="text-emerald-500 flex-shrink-0">•</span>{tip}
              </li>
            ))}
          </ul>
        )}

      </div>
    </ToolWrapper>
  );
}
