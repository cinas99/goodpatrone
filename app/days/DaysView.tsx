'use client';
import { useState, useMemo } from 'react';
import ToolWrapper from '../components/ToolWrapper';
import { CalendarDays, RefreshCw } from 'lucide-react';

const PRESETS = [
  { label: '2 weeks',  days: 14   },
  { label: '1 month',  days: 30   },
  { label: '100 days', days: 100  },
  { label: '6 months', days: 182  },
  { label: '1 year',   days: 365  },
  { label: '500 days', days: 500  },
  { label: '5 years',  days: 1825 },
  { label: '10 years', days: 3650 },
  { label: '15 years', days: 5475 },
];

function toInput(date: Date) { return date.toISOString().split('T')[0]; }
function addDays(base: Date, days: number) {
  const d = new Date(base); d.setDate(d.getDate() + days); return toInput(d);
}
function formatDate(str: string) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function DaysClient() {
  const [start, setStart] = useState('');
  const [end,   setEnd]   = useState('');

  const result = useMemo(() => {
    if (!start || !end) return null;
    const days = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000);
    return { days, weeks: Math.floor(Math.abs(days) / 7), months: Math.round(Math.abs(days) / 30.44), hours: Math.abs(days) * 24, isPast: days < 0 };
  }, [start, end]);

  const applyPreset = (days: number) => {
    const t = toInput(new Date());
    setStart(t);
    setEnd(addDays(new Date(), days));
  };

  const reset = () => { setStart(toInput(new Date())); setEnd(''); };

  return (
    <ToolWrapper
      title="Days Between"
      subtitle="How much time between two dates?"
      icon={<CalendarDays size={22} className="text-emerald-400" />}
      adSlot="days"
    >
      <div className="space-y-12">

        {/* Presets */}
        <div className="space-y-5 pb-4">
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-medium mb-3">
            Quick presets from today
          </p>
          <div className="flex flex-wrap gap-3">
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => applyPreset(p.days)}
                className="px-6 py-3 rounded-full border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-950/30 transition-all">
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date inputs */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-zinc-400 font-semibold uppercase tracking-wider">From</label>
              <button onClick={() => setStart(toInput(new Date()))} className="text-sm text-emerald-500 hover:text-emerald-400 font-semibold transition-colors">Today</button>
            </div>
            <input type="date" value={start} onChange={e => setStart(e.target.value)}
              className="w-full px-5 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-white text-base focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-zinc-400 font-semibold uppercase tracking-wider">To</label>
              <button onClick={() => setEnd(toInput(new Date()))} className="text-sm text-emerald-500 hover:text-emerald-400 font-semibold transition-colors">Today</button>
            </div>
            <input type="date" value={end} onChange={e => setEnd(e.target.value)}
              className="w-full px-5 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-white text-base focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center pt-2">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-all active:scale-[0.98]"
          >
            <RefreshCw size={14} strokeWidth={2} />
            Reload
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-8 pt-10 border-t border-zinc-800">

            <div className="text-center space-y-3">
              <p className="text-sm text-zinc-500 uppercase tracking-widest font-medium">
                {result.isPast ? 'Days ago' : 'Days from now'}
              </p>
              <p className="text-[96px] font-black tracking-tighter text-white leading-none tabular-nums">
                {Math.abs(result.days)}
              </p>
              <p className="text-base text-zinc-500">
                {formatDate(start)} → {formatDate(end)}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {[
                { val: Math.abs(result.days),        label: 'Days'   },
                { val: result.weeks,                  label: 'Weeks'  },
                { val: result.months,                 label: 'Months' },
                { val: result.hours.toLocaleString(), label: 'Hours'  },
              ].map(r => (
                <div key={r.label} className="flex flex-col items-center py-6 px-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-center hover:border-zinc-600 transition-colors">
                  <span className="text-3xl font-black tabular-nums text-white">{r.val}</span>
                  <span className="text-xs text-zinc-500 mt-2 uppercase tracking-widest font-medium">{r.label}</span>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </ToolWrapper>
  );
}
