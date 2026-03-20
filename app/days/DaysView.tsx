'use client';
import { useState, useMemo } from 'react';
import ToolWrapper from '../components/ToolWrapper';
import { CalendarDays, RefreshCw } from 'lucide-react';

const PRESETS: { label: string; days?: number; months?: number; years?: number }[] = [
  { label: '2 weeks',  days:   14 },
  { label: '1 month',  months:  1 },
  { label: '100 days', days:  100 },
  { label: '6 months', months:  6 },
  { label: '1 year',   years:   1 },
  { label: '500 days', days:  500 },
  { label: '5 years',  years:   5 },
  { label: '10 years', years:  10 },
  { label: '15 years', years:  15 },
];

function toInput(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
function addDays(base: Date, days: number) {
  const d = new Date(Date.UTC(base.getFullYear(), base.getMonth(), base.getDate() + days));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
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

  const applyPreset = (p: typeof PRESETS[0]) => {
    const today = new Date();
    const end = new Date(today);
    if (p.years)  end.setFullYear(end.getFullYear() + p.years);
    else if (p.months) end.setMonth(end.getMonth() + p.months);
    else if (p.days)   end.setDate(end.getDate() + p.days);
    setStart(toInput(today));
    setEnd(toInput(end));
  };

  const reset = () => { setStart(toInput(new Date())); setEnd(''); };

  return (
    <ToolWrapper
      title="Days Between"
      subtitle="How much time between two dates?"
      icon={<CalendarDays size={22} className="text-emerald-400" />}
      adSlot="days"
    >
      <div className="space-y-6">

        {/* Presets */}
        <div className="space-y-5 pb-4">
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-medium mb-3">
            Quick presets from today
          </p>
          <div className="flex flex-wrap gap-3">
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => applyPreset(p)}
                className="px-6 py-3 rounded-full border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-950/30 transition-all">
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date inputs */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-zinc-400 font-semibold uppercase tracking-wider">Date from</label>
              <button onClick={() => setStart(toInput(new Date()))} className="text-sm text-emerald-500 hover:text-emerald-400 font-semibold transition-colors">Today</button>
            </div>
            <input type="date" value={start} min="1800-01-01" max="2100-12-31"
              onChange={e => {
                const val = e.target.value;
                if (val) { const y = parseInt(val.split('-')[0]); if (y < 1800 || y > 2100) return; }
                setStart(val);
              }}
              className="w-full px-5 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-white text-base focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-zinc-400 font-semibold uppercase tracking-wider">Date to</label>
              <button onClick={() => setEnd(toInput(new Date()))} className="text-sm text-emerald-500 hover:text-emerald-400 font-semibold transition-colors">Today</button>
            </div>
            <input type="date" value={end} min="1800-01-01" max="2100-12-31"
              onChange={e => {
                const val = e.target.value;
                if (val) { const y = parseInt(val.split('-')[0]); if (y < 1800 || y > 2100) return; }
                setEnd(val);
              }}
              className="w-full px-5 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-white text-base focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" />
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-8 pt-6 border-t border-zinc-800">

            {/* All stats in unified 2-column layout */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 pt-4">
              {[
                { label: result.isPast ? 'Days ago' : 'Days from now', val: String(Math.abs(result.days)), mono: true },
                { label: 'Date from', val: formatDate(start), mono: false },
                { label: 'Weeks',     val: String(result.weeks),               mono: true },
                { label: 'Date to',   val: formatDate(end),                    mono: false },
                { label: 'Months',    val: String(result.months),              mono: true },
                { label: 'Hours',     val: result.hours.toLocaleString(),       mono: true },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-2">{item.label}</p>
                  <p className={`text-lg font-semibold text-white leading-none ${item.mono ? 'tabular-nums tracking-tight' : ''}`}>
                    {item.val}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={reset}
                className="flex flex-row items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-[8.75rem] py-2 rounded-xl text-sm transition-all active:scale-[0.98]"
              >
                <RefreshCw size={16} strokeWidth={2} />
                Reload
              </button>
            </div>

          </div>
        )}

      </div>
    </ToolWrapper>
  );
}
