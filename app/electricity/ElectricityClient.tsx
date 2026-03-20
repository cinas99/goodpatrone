'use client';
import { useState, useMemo } from 'react';
import ToolWrapper from '../components/ToolWrapper';
import { Zap } from 'lucide-react';
import { CURRENCY_OPTIONS } from '../../lib/currencies';

type Appliance = {
  id: string;
  icon: string;
  label: string;
  watts: number;
  hoursPerDay: number;
  enabled: boolean;
};

const INITIAL: Appliance[] = [
  { id: 'led',      icon: '💡', label: 'LED Light',        watts: 10,   hoursPerDay: 5,   enabled: true  },
  { id: 'tv',       icon: '📺', label: 'TV',               watts: 100,  hoursPerDay: 4,   enabled: true  },
  { id: 'fridge',   icon: '🧊', label: 'Refrigerator',     watts: 150,  hoursPerDay: 24,  enabled: true  },
  { id: 'washer',   icon: '👕', label: 'Washing Machine',  watts: 2000, hoursPerDay: 1,   enabled: true  },
  { id: 'dishwash', icon: '🍽️', label: 'Dishwasher',       watts: 1800, hoursPerDay: 1,   enabled: true  },
  { id: 'ac',       icon: '❄️', label: 'Air Conditioner',  watts: 1500, hoursPerDay: 8,   enabled: false },
  { id: 'laptop',   icon: '💻', label: 'Laptop',           watts: 50,   hoursPerDay: 8,   enabled: true  },
  { id: 'desktop',  icon: '🖥️', label: 'Desktop PC',       watts: 200,  hoursPerDay: 6,   enabled: false },
  { id: 'oven',     icon: '🔥', label: 'Electric Oven',    watts: 2000, hoursPerDay: 1,   enabled: true  },
  { id: 'micro',    icon: '📡', label: 'Microwave',        watts: 800,  hoursPerDay: 0.3, enabled: true  },
  { id: 'ev',       icon: '🔌', label: 'EV Charger',       watts: 7000, hoursPerDay: 6,   enabled: false },
];

const SOLAR_3KW_MONTHLY = 300;
const VISIBLE_DEFAULT = 5;

const inputCls = 'w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs sm:text-sm text-center px-1 sm:px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-40 disabled:cursor-not-allowed';


export default function ElectricityClient() {
  const [rate, setRate]               = useState(0.30);
  const [rateInput, setRateInput]     = useState('0.30');
  const [currency, setCurrency]       = useState('€');
  const [appliances, setAppliances]   = useState<Appliance[]>(INITIAL);
  const [showDisabled, setShowDisabled] = useState(false);

  const update = (id: string, field: 'watts' | 'hoursPerDay', raw: string) => {
    const val = parseFloat(raw);
    setAppliances(prev =>
      prev.map(a => a.id === id ? { ...a, [field]: isNaN(val) ? 0 : Math.max(0, val) } : a)
    );
  };

  const toggle = (id: string) =>
    setAppliances(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));

  const rows = useMemo(() =>
    appliances.map(a => {
      const monthlyKwh = a.enabled ? (a.watts / 1000) * a.hoursPerDay * 30 : 0;
      return { ...a, monthlyKwh, monthlyCost: monthlyKwh * rate };
    }),
    [appliances, rate]
  );

  const { totalKwh, totalCost, solarPct } = useMemo(() => {
    const totalKwh = rows.reduce((s, r) => s + r.monthlyKwh, 0);
    const totalCost = rows.reduce((s, r) => s + r.monthlyCost, 0);
    return { totalKwh, totalCost, solarPct: Math.min(100, (SOLAR_3KW_MONTHLY / totalKwh) * 100) };
  }, [rows]);

  return (
    <ToolWrapper
      title="Electricity"
      subtitle="Estimate monthly usage and cost by appliance"
      icon={<Zap size={17} className="text-gray-400" />}
      adSlot="electricity"
    >
      <div className="space-y-8">

        {/* Rate + currency */}
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-medium whitespace-nowrap">Rate / kWh</p>
          <input
            type="number" min={0} step={0.01} value={rateInput}
            onChange={e => {
              setRateInput(e.target.value);
              const parsed = parseFloat(e.target.value);
              if (!isNaN(parsed)) setRate(parsed);
            }}
            onFocus={e => e.target.select()}
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

        {/* Appliances table */}
        <div>
          {/* Header */}
          <div className="grid grid-cols-[20px_1fr_72px_64px_56px] sm:grid-cols-[24px_1fr_90px_80px_64px_64px] gap-2 pb-2 border-b border-zinc-800">
            <span />
            <span className="hidden sm:block text-xs text-zinc-600 uppercase tracking-widest">Appliance</span>
            <span className="sm:hidden" />
            <span className="text-xs text-zinc-600 uppercase tracking-widest text-center">Watts</span>
            <span className="text-xs text-zinc-600 uppercase tracking-widest text-center">h / day</span>
            <span className="text-xs text-zinc-600 uppercase tracking-widest text-right">kWh</span>
            <span className="hidden sm:block text-xs text-zinc-600 uppercase tracking-widest text-right">{currency} / mo</span>
          </div>

          {rows.filter(a => showDisabled || a.enabled).map((a, i) => (
            <div
              key={a.id}
              className={`grid grid-cols-[20px_1fr_72px_64px_56px] sm:grid-cols-[24px_1fr_90px_80px_64px_64px] gap-2 items-center py-2.5 border-b border-zinc-800/50 last:border-0 transition-opacity ${!a.enabled ? 'opacity-40' : ''}`}
            >
              {/* Toggle */}
              <button
                onClick={() => toggle(a.id)}
                className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                  a.enabled ? 'bg-emerald-600 border-emerald-500' : 'bg-zinc-800 border-zinc-700'
                }`}
              >
                {a.enabled && (
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              {/* Label */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base leading-none select-none">{a.icon}</span>
                <span className="text-sm text-zinc-300 truncate">{a.label}</span>
              </div>

              <input type="number" min={0} step={1}   value={a.watts}      disabled={!a.enabled} aria-label={`${a.label} watts`}        onChange={e => update(a.id, 'watts',      e.target.value)} onFocus={e => e.target.select()} className={inputCls} />
              <input type="number" min={0} step={0.1} value={a.hoursPerDay} disabled={!a.enabled} aria-label={`${a.label} hours per day`} onChange={e => update(a.id, 'hoursPerDay', e.target.value)} onFocus={e => e.target.select()} className={inputCls} />

              <span className={`text-sm font-semibold tabular-nums text-right ${a.enabled && a.monthlyKwh > 0 ? 'text-white' : 'text-zinc-600'}`}>
                {a.monthlyKwh.toFixed(1)}
              </span>
              <span className={`hidden sm:block text-sm font-semibold tabular-nums text-right ${a.enabled && a.monthlyCost > 0 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                {currency}{a.monthlyCost.toFixed(2)}
              </span>
            </div>
          ))}

          {(() => {
            const hiddenCount = rows.filter(a => !a.enabled).length;
            if (hiddenCount === 0) return null;
            return (
              <button onClick={() => setShowDisabled(v => !v)}
                className="w-full py-2.5 text-xs text-zinc-600 hover:text-zinc-400 uppercase tracking-widest font-medium transition-colors border-t border-zinc-800/50">
                {showDisabled ? 'Hide disabled appliances' : `+ ${hiddenCount} disabled appliances`}
              </button>
            );
          })()}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-6 pt-2 border-t border-zinc-800">
          {[
            { label: 'Monthly kWh', val: `${totalKwh.toFixed(1)} kWh` },
            { label: 'Monthly Cost', val: `${currency}${totalCost.toFixed(2)}` },
            { label: 'Rate',         val: `${currency}${rate.toFixed(2)}/kWh`  },
          ].map(item => (
            <div key={item.label}>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-base font-semibold text-white tabular-nums">{item.val}</p>
            </div>
          ))}
        </div>

        {/* Solar tip */}
        {totalKwh > 200 && (
          <div className="flex items-start gap-3 pt-2 border-t border-zinc-800">
            <span className="text-emerald-400 text-base mt-0.5">☀️</span>
            <div className="space-y-1">
              <p className="text-xs text-emerald-400 uppercase tracking-widest font-medium">Solar tip</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                A <strong className="text-white">3 kW solar system</strong> (~{SOLAR_3KW_MONTHLY} kWh/month) could cover{' '}
                <strong className="text-emerald-400">{solarPct.toFixed(0)}%</strong> of your usage ({totalKwh.toFixed(0)} kWh/mo).
              </p>
            </div>
          </div>
        )}

      </div>
    </ToolWrapper>
  );
}
