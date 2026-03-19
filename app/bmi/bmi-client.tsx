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

  const reset = () => switchUnit(unit);
  const cat   = bmi !== null ? getCategory(bmi) : null;
  const r     = RANGES[unit];

  const wThresholds = useMemo(() => {
    const hM = unit === 'metric' ? height / 100 : height * 2.54 / 100;
    return [18.5, 25, 30, 35].map(b => {
      let w = b * hM * hM;
      if (unit === 'imperial') w = w / 0.453592;
      return Math.min(100, Math.max(0, (w - r.weight.min) / (r.weight.max - r.weight.min) * 100));
    });
  }, [height, unit, r.weight.min, r.weight.max]);


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
          {/* Height */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-zinc-500 uppercase tracking-widest font-medium">Height</span>
              <span className="text-3xl font-black tabular-nums text-white">
                {height}<span className="text-base font-normal text-zinc-500 ml-1">{r.height.unit}</span>
              </span>
            </div>
            <input
              type="range"
              min={r.height.min} max={r.height.max} step={r.height.step}
              value={height}
              onChange={e => setHeight(Number(e.target.value))}
              className="bmi-slider w-full h-1.5 rounded-full appearance-none bg-zinc-800 cursor-pointer"
              suppressHydrationWarning
            />
            <div className="flex justify-between text-xs text-zinc-600">
              <span>{r.height.min} {r.height.unit}</span>
              <span>{r.height.max} {r.height.unit}</span>
            </div>
          </div>

          {/* Weight with BMI threshold markers */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-zinc-500 uppercase tracking-widest font-medium">Weight</span>
              <span className="text-3xl font-black tabular-nums text-white">
                {weight}<span className="text-base font-normal text-zinc-500 ml-1">{r.weight.unit}</span>
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min={r.weight.min} max={r.weight.max} step={r.weight.step}
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
                className="bmi-slider w-full h-1.5 rounded-full appearance-none bg-zinc-800 cursor-pointer"
                suppressHydrationWarning
              />
              <div className="h-2 mt-1 rounded-full"
                style={{
                  opacity: 0.3,
                  background: `linear-gradient(to right,
                    #facc15 0%, #facc15 ${wThresholds[0]}%,
                    #34d399 ${wThresholds[0]}%, #34d399 ${wThresholds[1]}%,
                    #f59e0b ${wThresholds[1]}%, #f59e0b ${wThresholds[2]}%,
                    #fb923c ${wThresholds[2]}%, #fb923c ${wThresholds[3]}%,
                    #f87171 ${wThresholds[3]}%, #f87171 100%
                  )`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-600">
              <span>{r.weight.min} {r.weight.unit}</span>
              <span>{r.weight.max} {r.weight.unit}</span>
            </div>
          </div>
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
            <p className="text-xs text-zinc-600 mt-4 max-w-sm mx-auto leading-relaxed border-t border-zinc-800 pt-4">
              Note: BMI is designed for people with average muscle mass. For athletes or highly muscular individuals the result may not accurately reflect body fat levels.
            </p>
          </div>
        )}

      </div>
    </ToolWrapper>
  );
}
