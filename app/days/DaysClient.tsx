'use client';
import { useState, useEffect } from 'react';
import ToolWrapper from '../components/ToolWrapper';
import { CalendarDays, Calculator, RefreshCw } from 'lucide-react';

const PRESETS = [
  { label: '2 weeks',  days: 14  },
  { label: '1 month',  days: 30  },
  { label: '100 days', days: 100 },
  { label: '6 months', days: 182 },
  { label: '1 year',   days: 365 },
  { label: '500 days', days: 500 },
];

function toInput(date: Date) { return date.toISOString().split('T')[0]; }

function addDays(base: Date, days: number) {
  const d = new Date(base); d.setDate(d.getDate() + days); return toInput(d);
}

function formatDate(str: string) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getContext(days: number) {
  const abs = Math.abs(days);
  if (abs === 0)  return { label: 'Same day',           color: 'text-gray-400' };
  if (abs <= 7)   return { label: 'Less than a week',   color: 'text-gray-300' };
  if (abs <= 30)  return { label: 'Less than a month',  color: 'text-gray-300' };
  if (abs <= 90)  return { label: 'A few months away',  color: 'text-slate-300' };
  if (abs <= 365) return { label: 'Within the year',    color: 'text-slate-300' };
  if (abs <= 730) return { label: 'Over a year',        color: 'text-slate-400' };
  return           { label: 'Several years',            color: 'text-slate-400' };
}

export default function DaysClient() {
  const today = toInput(new Date());
  const [start,  setStart]  = useState(today);
  const [end,    setEnd]    = useState('');
  const [result, setResult] = useState<{
    days: number; weeks: number; months: number; hours: number; isPast: boolean;
  } | null>(null);

  useEffect(() => {
    if (!start || !end) { setResult(null); return; }
    const days = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000);
    setResult({ days, weeks: Math.floor(Math.abs(days) / 7), months: Math.floor(Math.abs(days) / 30.44), hours: Math.abs(days) * 24, isPast: days < 0 });
  }, [start, end]);

  const applyPreset = (days: number) => { setStart(toInput(new Date())); setEnd(addDays(new Date(), days)); };
  const reset = () => { setStart(today); setEnd(''); setResult(null); };

  const ctx        = result ? getContext(result.days) : null;
  const barPct     = result ? Math.min(100, (Math.abs(result.days) / 365) * 100) : 0;
  const isOverYear = result ? Math.abs(result.days) > 365 : false;

  return (
    <ToolWrapper
      title="Days Between"
      subtitle="How much time between two dates?"
      icon={<CalendarDays size={17} className="text-gray-400" />}
      adSlot="days"
    >

      {/* Presets */}
      <div className="mb-5">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Quick presets from today</p>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map(p => (
            <button key={p.days} onClick={() => applyPreset(p.days)}
              className="px-3 py-1 rounded-full bg-white/5 border border-white/8 text-gray-400 text-xs font-semibold hover:bg-emerald-900/40 hover:border-emerald-700/40 hover:text-white transition-all active:scale-95">
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date inputs */}
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold">From</label>
            <button onClick={() => setStart(today)} className="text-[10px] text-emerald-700 hover:text-emerald-400 font-bold uppercase tracking-wider transition-colors">Today</button>
          </div>
          <input type="date" value={start} onChange={e => setStart(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white text-sm focus:ring-1 focus:ring-emerald-600 outline-none" />
        </div>

        <div className="flex-shrink-0 mt-5 text-gray-700">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6"/>
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold">To</label>
            <button onClick={() => setEnd(today)} className="text-[10px] text-emerald-700 hover:text-emerald-400 font-bold uppercase tracking-wider transition-colors">Today</button>
          </div>
          <input type="date" value={end} onChange={e => setEnd(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white text-sm focus:ring-1 focus:ring-emerald-600 outline-none" />
        </div>
      </div>

      {(start || end) && (
        <div className="flex justify-between text-[10px] text-gray-700 mb-4 px-1">
          <span>{formatDate(start)}</span>
          <span>{formatDate(end)}</span>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 mb-5">
        <button onClick={() => {
          if (!start || !end) return;
          const days = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000);
          setResult({ days, weeks: Math.floor(Math.abs(days) / 7), months: Math.floor(Math.abs(days) / 30.44), hours: Math.abs(days) * 24, isPast: days < 0 });
        }} className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-95">
          <Calculator size={15} strokeWidth={2} /> Calculate
        </button>
        <button onClick={reset}
          className="flex items-center justify-center px-4 bg-white/5 hover:bg-white/10 border border-white/8 text-gray-500 py-3 rounded-xl transition-all">
          <RefreshCw size={14} strokeWidth={2} />
        </button>
      </div>

      {/* Result */}
      {result && ctx && (
        <div className="space-y-4 border-t border-white/8 pt-5">

          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">
                {result.isPast ? 'Days ago' : 'Days from now'}
              </div>
              <div className="text-6xl font-black tracking-tighter tabular-nums text-white">
                {Math.abs(result.days)}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-base font-bold ${ctx.color}`}>{ctx.label}</div>
              {result.isPast && <div className="text-xs text-gray-600 mt-1">This date has passed</div>}
            </div>
          </div>

          {/* Date strip */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/8">
            <span className="text-sm font-semibold text-gray-300">{formatDate(start)}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-px bg-white/10" />
              <span className="text-xs font-bold text-gray-500 tabular-nums">{Math.abs(result.days)}d</span>
              <div className="w-6 h-px bg-white/10" />
            </div>
            <span className="text-sm font-semibold text-gray-300">{formatDate(end)}</span>
          </div>

          {/* Bar */}
          <div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700 bg-slate-500"
                style={{ width: `${barPct}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-gray-700 mt-1.5">
              <span>0d</span><span>3 mo</span><span>6 mo</span><span>9 mo</span>
              <span className={isOverYear ? 'text-orange-600 font-bold' : ''}>1 yr+</span>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { val: Math.abs(result.days),        label: 'Days'   },
              { val: result.weeks,                  label: 'Weeks'  },
              { val: result.months,                 label: 'Months' },
              { val: result.hours.toLocaleString(), label: 'Hours'  },
            ].map(r => (
              <div key={r.label} className="flex flex-col items-center p-3 bg-white/5 border border-white/8 rounded-xl text-center">
                <span className="text-base font-black tabular-nums text-white">{r.val}</span>
                <span className="text-[10px] text-gray-600 mt-0.5 uppercase tracking-wider">{r.label}</span>
              </div>
            ))}
          </div>

        </div>
      )}
    </ToolWrapper>
  );
}
