'use client';
import { useState, useMemo } from 'react';
import ToolWrapper from '../components/ToolWrapper';
import { Scale, RefreshCw } from 'lucide-react';

type Unit = 'metric' | 'imperial';

const RANGES = {
  metric:   { weight: { min: 30,  max: 200, step: 0.5, unit: 'kg' }, height: { min: 100, max: 220, step: 1, unit: 'cm' } },
  imperial: { weight: { min: 66,  max: 440, step: 1,   unit: 'lb' }, height: { min: 39,  max: 87,  step: 1, unit: 'in' } },
};

const DEFAULTS = {
  metric:   { weight: 70,  height: 175 },
  imperial: { weight: 154, height: 69  },
};

function getCategory(bmi: number) {
  if (bmi < 18.5) return { label: 'Underweight',   color: 'text-yellow-400', tip: 'Consider speaking with a nutritionist about healthy weight gain.'          };
  if (bmi < 25)   return { label: 'Normal weight', color: 'text-emerald-400', tip: "You're in the healthy range — keep it up."                                };
  if (bmi < 30)   return { label: 'Overweight',    color: 'text-amber-400',   tip: 'Light exercise and balanced diet adjustments can help.'                   };
  if (bmi < 35)   return { label: 'Obese I',       color: 'text-orange-400',  tip: 'A doctor can help you build a safe and effective health plan.'             };
  return           {       label: 'Obese II+',      color: 'text-red-400',     tip: 'Please seek medical advice — support is available and things can improve.' };
}

export default function BMIClient() {
  const [unit,   setUnit]   = useState<Unit>('metric');
  const [weight, setWeight] = useState(DEFAULTS.metric.weight);
  const [height, setHeight] = useState(DEFAULTS.metric.height);

  const switchUnit = (u: Unit) => {
    setUnit(u);
    setWeight(DEFAULTS[u].weight);
    setHeight(DEFAULTS[u].height);
  };

  const bmi = useMemo(() => {
    let w = weight, h = height;
    if (unit === 'imperial') { w = w * 0.453592; h = h * 2.54; }
    const raw = w / Math.pow(h / 100, 2);
    return raw > 10 && raw < 100 ? parseFloat(raw.toFixed(1)) : null;
  }, [weight, height, unit]);

  const reset        = () => switchUnit(unit);
  const cat          = bmi !== null ? getCategory(bmi) : null;
  const displayColor = cat?.color ?? 'text-emerald-400';
  const r            = RANGES[unit];

  return (
    <ToolWrapper
      title="BMI Calculator"
      subtitle="Body mass index from height and weight"
      icon={<Scale size={17} className="text-gray-400" />}
      adSlot="bmi"
    >
      <div className="space-y-8">

        {/* Unit toggle + reset */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(['metric', 'imperial'] as Unit[]).map(u => (
              <button key={u} onClick={() => switchUnit(u)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  unit === u
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-950/30'
                    : 'border-zinc-700 text-zinc-400 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-950/30'
                }`}>
                {u === 'metric' ? 'kg / cm' : 'lbs / in'}
              </button>
            ))}
          </div>
          <button onClick={reset}
            className="flex items-center justify-center w-9 h-9 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-500 hover:text-white rounded-xl transition-all">
            <RefreshCw size={13} strokeWidth={2} />
          </button>
        </div>

        {/* Sliders */}
        <div className="space-y-7">
          {[
            { label: 'Weight', val: weight, set: setWeight, cfg: r.weight },
            { label: 'Height', val: height, set: setHeight, cfg: r.height },
          ].map(s => (
            <div key={s.label} className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-zinc-500 uppercase tracking-widest font-medium">{s.label}</span>
                <span className={`text-3xl font-black tabular-nums transition-colors duration-300 ${displayColor}`}>
                  {s.val}<span className="text-base font-normal text-zinc-500 ml-1">{s.cfg.unit}</span>
                </span>
              </div>
              <input
                type="range"
                min={s.cfg.min}
                max={s.cfg.max} step={s.cfg.step}
                value={s.val}
                onChange={e => s.set(Number(e.target.value))}
                className="bmi-slider w-full h-1.5 rounded-full appearance-none bg-zinc-800 cursor-pointer"
                suppressHydrationWarning
              />
              <div className="flex justify-between text-xs text-zinc-600">
                <span>{s.cfg.min} {s.cfg.unit}</span>
                <span>{s.cfg.max} {s.cfg.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Result */}
        {bmi !== null && cat && (
          <div className="space-y-2 pt-8 border-t border-zinc-800 text-center">
            <p className="text-sm text-zinc-500 uppercase tracking-widest font-medium">Your BMI</p>
            <p className={`text-[96px] font-black tracking-tighter leading-none tabular-nums ${cat.color}`}>
              {bmi}
            </p>
            <p className={`text-lg font-semibold ${cat.color}`}>{cat.label}</p>
            <p className="text-sm text-zinc-500 mt-1 max-w-xs mx-auto leading-relaxed">{cat.tip}</p>
          </div>
        )}

      </div>
    </ToolWrapper>
  );
}
