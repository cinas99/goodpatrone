'use client';
import { useState, useEffect } from 'react';
import ToolWrapper from '../components/ToolWrapper';
import { Scale, RefreshCw, Calculator } from 'lucide-react';

type Gender = 'male' | 'female';
type Unit   = 'metric' | 'imperial';

const RANGES = {
  metric:   { weight: { min: 30,  max: 200, step: 0.5, unit: 'kg'  }, height: { min: 100, max: 220, step: 1, unit: 'cm'  } },
  imperial: { weight: { min: 66,  max: 440, step: 1,   unit: 'lbs' }, height: { min: 39,  max: 87,  step: 1, unit: 'in'  } },
};

function getCategory(bmi: number) {
  if (bmi < 18.5) return { label: 'Underweight',   color: 'text-blue-400',    bar: 'bg-blue-500',    pct: 15, tip: 'Consider consulting a nutritionist.' };
  if (bmi < 25)   return { label: 'Normal weight', color: 'text-emerald-400', bar: 'bg-emerald-500', pct: 42, tip: 'Great — keep it up!' };
  if (bmi < 30)   return { label: 'Overweight',    color: 'text-yellow-400',  bar: 'bg-yellow-500',  pct: 66, tip: 'Light exercise and diet adjustments help.' };
  if (bmi < 35)   return { label: 'Obese I',       color: 'text-orange-400',  bar: 'bg-orange-500',  pct: 80, tip: 'Consult a doctor for a health plan.' };
  return           { label: 'Obese II+',           color: 'text-red-400',     bar: 'bg-red-500',     pct: 94, tip: 'Please seek medical advice.' };
}

function idealWeight(heightCm: number, gender: Gender) {
  const inches = (heightCm - 152.4) / 2.54;
  return Math.round((gender === 'male' ? 50 : 45.5) + 2.3 * inches);
}

export default function BMIClient() {
  const [unit,   setUnit]   = useState<Unit>('metric');
  const [gender, setGender] = useState<Gender>('male');
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [age,    setAge]    = useState(25);
  const [bmi,    setBmi]    = useState<number | null>(null);

  useEffect(() => {
    let w = weight, h = height;
    if (unit === 'imperial') { w *= 0.453592; h *= 2.54; }
    const val = w / Math.pow(h / 100, 2);
    setBmi(val > 10 && val < 100 ? parseFloat(val.toFixed(1)) : null);
  }, [weight, height, unit]);

  const reset = () => {
    setWeight(unit === 'metric' ? 70 : 154);
    setHeight(unit === 'metric' ? 175 : 69);
    setAge(25);
    setBmi(null);
  };

  const r     = RANGES[unit];
  const cat   = bmi ? getCategory(bmi) : null;
  const ideal = height ? idealWeight(unit === 'imperial' ? height * 2.54 : height, gender) : null;

  return (
    <ToolWrapper
      title="BMI Calculator"
      subtitle="Adjust sliders — result updates live"
      icon={<Scale size={17} className="text-gray-400" />}
      adSlot="bmi"
    >

      {/* Unit + Gender row */}
      <div className="flex items-center justify-between 8 gap-4">

        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-600 uppercase tracking-widest">Unit</span>
          <div className="flex items-center bg-white/5 border border-white/8 rounded-lg p-0.5 gap-0.5">
            {(['metric', 'imperial'] as Unit[]).map(u => (
              <button key={u}
                onClick={() => { setUnit(u); setWeight(u === 'metric' ? 70 : 154); setHeight(u === 'metric' ? 175 : 69); setBmi(null); }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${unit === u ? 'bg-white/15 text-white' : 'text-gray-600 hover:text-gray-400'}`}>
                {u === 'metric' ? 'kg / cm' : 'lbs / in'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-600 uppercase tracking-widest">Biological sex</span>
          <div className="flex gap-2">
            {([
              { key: 'male',   label: 'Male',   path: 'M 12 2 C 12 2 16 6 16 10 C 16 14 13 17 12 17 C 11 17 8 14 8 10 C 8 6 12 2 12 2 Z M 12 17 L 12 22 M 9 20 L 15 20' },
              { key: 'female', label: 'Female', path: 'M 12 8 C 9.8 8 8 9.8 8 12 C 8 14.2 9.8 16 12 16 C 14.2 16 16 14.2 16 12 C 16 9.8 14.2 8 12 8 Z M 12 16 L 12 22 M 9 19 L 15 19' },
            ] as { key: Gender; label: string; path: string }[]).map(({ key, label, path }) => (
              <button key={key} onClick={() => setGender(key)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                  gender === key
                    ? 'bg-white/10 border-white/25 text-white'
                    : 'bg-transparent border-white/8 text-gray-600 hover:text-gray-400'
                }`}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d={path} />
                </svg>
                {label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Sliders */}
      <div className="space-y-5 mb-8">
        {[
          { label: 'Age',    val: age,    set: setAge,    min: 10,           max: 100,           step: 1,            unit: 'yrs'        },
          { label: 'Weight', val: weight, set: setWeight, min: r.weight.min, max: r.weight.max,  step: r.weight.step, unit: r.weight.unit },
          { label: 'Height', val: height, set: setHeight, min: r.height.min, max: r.height.max,  step: r.height.step, unit: r.height.unit },
        ].map(s => (
          <div key={s.label}>
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{s.label}</label>
              <span className="text-lg font-black text-white tabular-nums">
                {s.val} <span className="text-gray-600 font-normal text-xs">{s.unit}</span>
              </span>
            </div>
            <input type="range" min={s.min} max={s.max} step={s.step} value={s.val}
              onChange={e => s.set(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none bg-white/10 accent-emerald-500 cursor-pointer" />
            <div className="flex justify-between text-[10px] text-gray-700 mt-1">
              <span>{s.min}</span><span>{s.max}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mb-5">
        <button onClick={() => setBmi(bmi)}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-95">
          <Calculator size={15} strokeWidth={2} /> Calculate
        </button>
        <button onClick={reset}
          className="flex items-center justify-center px-4 bg-white/5 hover:bg-white/10 border border-white/8 text-gray-500 py-3 rounded-xl transition-all">
          <RefreshCw size={14} strokeWidth={2} />
        </button>
      </div>

      {/* Result */}
      {bmi !== null && cat && (
        <div className="space-y-4 border-t border-white/8 pt-5">

          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">Your BMI</div>
              <div className={`text-6xl font-black tracking-tighter ${cat.color}`}>{bmi}</div>
            </div>
            <div className="text-right">
              <div className={`text-base font-bold ${cat.color}`}>{cat.label}</div>
              <div className="text-xs text-gray-600 mt-1 max-w-[160px] text-right leading-snug">{cat.tip}</div>
            </div>
          </div>

          <div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${cat.bar}`} style={{ width: `${cat.pct}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-gray-700 mt-1.5">
              <span>Under</span><span>Normal</span><span>Over</span><span>Obese</span>
            </div>
          </div>

          {ideal && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/8">
              <span className="text-gray-500 text-xs">Ideal weight (Devine formula)</span>
              <span className="font-black text-white text-sm">{ideal} kg</span>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2 text-[10px]">
            {[
              { range: '< 18.5',    label: 'Under',  color: 'text-blue-400' },
              { range: '18.5–24.9', label: 'Normal', color: 'text-emerald-400' },
              { range: '25–29.9',   label: 'Over',   color: 'text-yellow-400' },
              { range: '≥ 30',      label: 'Obese',  color: 'text-red-400' },
            ].map(r => (
              <div key={r.range} className="flex flex-col items-center p-2 bg-white/5 rounded-lg border border-white/5 gap-0.5 text-center">
                <span className={`font-bold ${r.color}`}>{r.label}</span>
                <span className="text-gray-700">{r.range}</span>
              </div>
            ))}
          </div>

        </div>
      )}
    </ToolWrapper>
  );
}
