'use client';
import { useState, useMemo } from 'react';
import ToolWrapper from '../components/ToolWrapper';
import { Droplets } from 'lucide-react';

type Fixture = { id: string; icon: string; label: string; litersPerUse: number; timesPerDay: number };

const INITIAL: Fixture[] = [
  { id: 'shower',   icon: '🚿', label: 'Shower',            litersPerUse: 60,  timesPerDay: 1   },
  { id: 'bath',     icon: '🛁', label: 'Bath',              litersPerUse: 150, timesPerDay: 0   },
  { id: 'toilet',   icon: '🚽', label: 'Toilet Flush',      litersPerUse: 6,   timesPerDay: 5   },
  { id: 'tap',      icon: '🚰', label: 'Tap', litersPerUse: 2,   timesPerDay: 8   },
  { id: 'dishwash', icon: '🍽️', label: 'Dishwasher',        litersPerUse: 12,  timesPerDay: 1   },
  { id: 'washing',  icon: '👕', label: 'Washing Machine',   litersPerUse: 50,  timesPerDay: 0.5 },
  { id: 'garden',   icon: '🌱', label: 'Garden / Lawn',     litersPerUse: 500, timesPerDay: 0   },
  { id: 'carwash',  icon: '🚗', label: 'Car Wash',          litersPerUse: 150, timesPerDay: 0   },
];

const inputCls = 'w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm text-center px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

export default function WaterClient() {
  const [price, setPrice]     = useState(2.5);
  const [fixtures, setFixtures] = useState<Fixture[]>(INITIAL);

  const update = (id: string, field: 'litersPerUse' | 'timesPerDay', raw: string) => {
    const v = parseFloat(raw);
    setFixtures(prev => prev.map(f => f.id === id ? { ...f, [field]: isNaN(v) ? 0 : Math.max(0, v) } : f));
  };

  const { dailyL, monthlyL, bill, aboveAvg, diffPct } = useMemo(() => {
    const dailyL   = fixtures.reduce((s, f) => s + f.litersPerUse * f.timesPerDay, 0);
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

        {/* Price input */}
        <div className="flex items-center gap-4">
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-medium whitespace-nowrap">Price / m³ €</p>
          <input
            type="number" min={0} step={0.01} value={price}
            onChange={e => setPrice(parseFloat(e.target.value) || 0)}
            className="w-28 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
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

          {fixtures.map(f => {
            const daily = f.litersPerUse * f.timesPerDay;
            return (
              <div key={f.id} className="grid grid-cols-[1fr_80px_80px_64px] gap-2 items-center py-2.5 border-b border-zinc-800/50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{f.icon}</span>
                  <span className="text-sm text-zinc-300">{f.label}</span>
                </div>
                <input type="number" min={0} step={1}   value={f.litersPerUse} onChange={e => update(f.id, 'litersPerUse', e.target.value)} className={inputCls} />
                <input type="number" min={0} step={0.1} value={f.timesPerDay}  onChange={e => update(f.id, 'timesPerDay',  e.target.value)} className={inputCls} />
                <span className={`text-sm font-semibold tabular-nums text-right ${daily > 0 ? 'text-white' : 'text-zinc-600'}`}>
                  {daily % 1 === 0 ? daily.toFixed(0) : daily.toFixed(1)} L
                </span>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-6 pt-2 border-t border-zinc-800">
          {[
            { label: 'Daily',   val: `${dailyL.toFixed(0)} L`  },
            { label: 'Monthly', val: `${monthlyL.toFixed(0)} L` },
            { label: 'Bill',    val: `€${bill.toFixed(2)}`      },
          ].map(item => (
            <div key={item.label}>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-xl font-black text-white tabular-nums">{item.val}</p>
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
