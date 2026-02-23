'use client';
import React, { useState, useEffect, useRef } from 'react';
import ToolWrapper from '../components/ToolWrapper';
import { Clock, Play, Pause, RotateCcw, RefreshCw, Volume2, VolumeX } from 'lucide-react';

const PRESETS = [
  { label: '5 min',  ms: 5  * 60000 },
  { label: '10 min', ms: 10 * 60000 },
  { label: '15 min', ms: 15 * 60000 },
  { label: '20 min', ms: 20 * 60000 },
  { label: '30 min', ms: 30 * 60000 },
  { label: '1 hour', ms: 60 * 60000 },
];

type SoundMode = 'off' | 'short' | 'bell' | 'alarm';

const SOUND_OPTIONS: { key: SoundMode; label: string; desc: string; icon: string }[] = [
  { key: 'off',   label: 'Off',   desc: 'Silent',     icon: '🔇' },
  { key: 'short', label: 'Beeps', desc: '3 tones',    icon: '🔔' },
  { key: 'bell',  label: 'Bell',  desc: '30s chime',  icon: '⛪' },
  { key: 'alarm', label: 'Alarm', desc: '30s urgent', icon: '🚨' },
];

function formatDisplay(ms: number) {
  const h  = Math.floor(ms / 3600000);
  const m  = Math.floor((ms % 3600000) / 60000);
  const s  = Math.floor((ms % 60000) / 1000);
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
}

let soundLoopInterval: ReturnType<typeof setInterval> | null = null;

function stopSound() {
  if (soundLoopInterval) {
    clearInterval(soundLoopInterval);
    soundLoopInterval = null;
  }
}

function playSound(mode: SoundMode, loop = false) {
  if (mode === 'off') return;
  stopSound();
  try {
    const fire = () => {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = (freq: number, start: number, dur: number, vol = 0.4, type: OscillatorType = 'sine') => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = type;
        o.frequency.setValueAtTime(freq, start);
        g.gain.setValueAtTime(vol, start);
        g.gain.exponentialRampToValueAtTime(0.001, start + dur);
        o.start(start); o.stop(start + dur);
      };
      const t = ctx.currentTime;
      if (mode === 'short') {
        osc(880,  t + 0.0, 0.15);
        osc(880,  t + 0.2, 0.15);
        osc(880,  t + 0.4, 0.15);
        osc(1175, t + 0.7, 0.4);
      }
      if (mode === 'bell') {
        osc(523,  t + 0.0, 2.5, 0.5,  'sine');
        osc(1047, t + 0.0, 2.0, 0.2,  'sine');
        osc(1568, t + 0.0, 1.5, 0.1,  'sine');
        osc(2093, t + 0.0, 1.0, 0.05, 'sine');
        osc(523,  t + 1.2, 2.5, 0.3,  'sine');
        osc(1047, t + 1.2, 2.0, 0.12, 'sine');
      }
      if (mode === 'alarm') {
        for (let i = 0; i < 4; i++) {
          osc(1000, t + i * 0.5 + 0.0,  0.2, 0.5, 'square');
          osc(800,  t + i * 0.5 + 0.25, 0.2, 0.5, 'square');
        }
      }
    };
    fire();
    if (loop && (mode === 'bell' || mode === 'alarm')) {
      const interval = mode === 'bell' ? 3500 : 2200;
      let totalElapsed = 0;
      soundLoopInterval = setInterval(() => {
        totalElapsed += interval;
        if (totalElapsed >= 30000) { stopSound(); return; }
        fire();
      }, interval);
    }
  } catch (e) { /* silent fallback */ }
}

export default function CountdownClient() {
  const [target,    setTarget]    = useState(600000);
  const [elapsed,   setElapsed]   = useState(0);
  const [running,   setRunning]   = useState(false);
  const [done,      setDone]      = useState(false);
  const [soundMode, setSoundMode] = useState<SoundMode>('short');
  const [customH,   setCustomH]   = useState('0');
  const [customM,   setCustomM]   = useState('10');
  const [customS,   setCustomS]   = useState('0');
  const startRef = useRef<number | null>(null);
  const baseRef  = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => () => stopSound(), []);

  useEffect(() => {
    if (running) {
      startRef.current = performance.now();
      const tick = () => {
        const delta = baseRef.current + (performance.now() - startRef.current!);
        if (delta >= target) {
          setElapsed(target);
          setRunning(false);
          setDone(true);
          playSound(soundMode, true);
          return;
        }
        setElapsed(delta);
        frameRef.current = requestAnimationFrame(tick);
      };
      frameRef.current = requestAnimationFrame(tick);
    } else {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      baseRef.current = elapsed;
    }
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [running, target, soundMode]);

  const applyPreset = (ms: number) => {
    stopSound();
    setRunning(false); setElapsed(0); baseRef.current = 0; setDone(false);
    setTarget(ms);
    setCustomH(String(Math.floor(ms / 3600000)));
    setCustomM(String(Math.floor((ms % 3600000) / 60000)));
    setCustomS(String(Math.floor((ms % 60000) / 1000)));
  };

  const applyCustom = () => {
    const ms = (parseInt(customH) || 0) * 3600000
             + (parseInt(customM) || 0) * 60000
             + (parseInt(customS) || 0) * 1000;
    if (ms <= 0) return;
    stopSound();
    setRunning(false); setElapsed(0); baseRef.current = 0; setDone(false);
    setTarget(ms);
  };

  const reset = () => {
    stopSound();
    setRunning(false); setElapsed(0); baseRef.current = 0; setDone(false);
  };

  const remaining = Math.max(0, target - elapsed);
  const pct       = target > 0 ? ((target - remaining) / target) * 100 : 0;
  const isNearEnd = remaining < 10000 && running && !done;

  const FIELDS = [
    { val: customH, set: setCustomH, label: 'hrs', max: 23 },
    { val: customM, set: setCustomM, label: 'min', max: 59 },
    { val: customS, set: setCustomS, label: 'sec', max: 59 },
  ];

  return (
    <ToolWrapper
      title="Countdown"
      subtitle="Set a timer with presets or custom time"
      icon={<Clock size={17} className="text-gray-400" />}
      adSlot="countdown"
    >

      {/* Presets */}
      <div className="mb-5">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Presets</p>
        <div className="grid grid-cols-3 gap-1.5">
          {PRESETS.map(p => (
            <button key={p.ms} onClick={() => applyPreset(p.ms)}
              className={`py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                target === p.ms && elapsed === 0
                  ? 'bg-emerald-900/50 border-emerald-700/50 text-emerald-400'
                  : 'bg-white/5 border-white/8 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom time */}
      <div className="mb-5">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">
          Custom time
          <span className="normal-case text-gray-700 ml-1 tracking-normal font-normal">— tap ▲▼ or type directly</span>
        </p>
        <div className="flex items-stretch bg-white/5 border border-white/8 rounded-xl overflow-hidden">
          {FIELDS.map((f, i) => (
            <React.Fragment key={f.label}>
              {i > 0 && (
                <div className="flex items-center px-1 text-gray-700 font-black text-lg select-none">:</div>
              )}
              <div className={`flex-1 flex flex-col items-center ${i < 2 ? 'border-r border-white/8' : ''}`}>
                <button onClick={() => f.set(v => String(Math.min(f.max, (parseInt(v) || 0) + 1)))}
                  className="w-full py-1 text-gray-600 hover:text-white hover:bg-white/5 transition-all text-[11px] leading-none">▲</button>
                <input type="number" min={0} max={f.max} value={f.val}
                  onChange={e => f.set(e.target.value)}
                  className="w-full text-center bg-transparent text-white font-black text-lg outline-none tabular-nums py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <span className="text-[9px] text-gray-700 uppercase tracking-wider leading-none pb-1">{f.label}</span>
                <button onClick={() => f.set(v => String(Math.max(0, (parseInt(v) || 0) - 1)))}
                  className="w-full py-1 text-gray-600 hover:text-white hover:bg-white/5 transition-all text-[11px] leading-none">▼</button>
              </div>
            </React.Fragment>
          ))}
          <button onClick={applyCustom}
            className="px-4 text-xs font-black text-gray-500 hover:text-emerald-400 hover:bg-emerald-900/30 transition-all uppercase tracking-widest border-l border-white/8">
            Set
          </button>
        </div>
      </div>

      {/* Sound mode */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          {soundMode === 'off'
            ? <VolumeX size={11} className="text-gray-700" />
            : <Volume2 size={11} className="text-emerald-600" />
          }
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">Alert sound</p>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {SOUND_OPTIONS.map(s => (
            <button key={s.key} onClick={() => setSoundMode(s.key)}
              className={`flex flex-col items-center py-2.5 px-1 rounded-xl border text-center transition-all active:scale-95 ${
                soundMode === s.key
                  ? 'bg-emerald-900/50 border-emerald-700/50 text-emerald-400'
                  : 'bg-white/5 border-white/8 text-gray-500 hover:text-white hover:bg-white/10'
              }`}>
              <span className="text-base mb-0.5">{s.icon}</span>
              <span className="text-xs font-bold">{s.label}</span>
              <span className="text-[9px] text-gray-600 mt-0.5 leading-tight">{s.desc}</span>
            </button>
          ))}
        </div>
        {soundMode !== 'off' && (
          <button onClick={() => playSound(soundMode, false)}
            className="mt-2 w-full py-1.5 rounded-lg bg-white/5 border border-white/8 text-gray-600 text-[10px] font-bold uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all">
            ▶ Preview sound
          </button>
        )}
      </div>

      {/* Main display */}
      <div className="flex flex-col items-center py-4 mb-2">
        <div className={`text-[72px] md:text-[88px] font-black tracking-tighter tabular-nums leading-none transition-colors duration-500 ${
          done        ? 'text-emerald-400'
          : isNearEnd ? 'text-red-400'
          : 'text-white'
        }`}>
          {formatDisplay(remaining)}
        </div>
        {done && (
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mt-3 animate-pulse">
            <span>⏰</span><span>Time is up!</span>
          </div>
        )}
        {isNearEnd && (
          <div className="text-red-400 text-xs mt-2 uppercase tracking-widest font-bold animate-pulse">
            Almost done…
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${
            done        ? 'bg-emerald-500'
            : isNearEnd ? 'bg-red-500'
            : 'bg-slate-500'
          }`} style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-gray-700 mt-1.5">
          <span>0:00</span>
          <span>{formatDisplay(target)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button onClick={reset}
          className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all active:scale-95">
          <RotateCcw size={18} strokeWidth={1.8} />
        </button>
        <button
          onClick={() => { if (done) { reset(); return; } setRunning(r => !r); }}
          disabled={remaining === 0 && !done}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all active:scale-95 shadow-lg disabled:opacity-30 ${
            running
              ? 'bg-red-600/80 hover:bg-red-600 border border-red-500/50'
              : 'bg-emerald-700/80 hover:bg-emerald-700 border border-emerald-600/50'
          }`}>
          {done
            ? <RefreshCw size={24} strokeWidth={2} />
            : running
            ? <Pause size={26} strokeWidth={2} />
            : <Play  size={26} strokeWidth={2} className="ml-1" />
          }
        </button>
        {done && soundMode !== 'off' && soundMode !== 'short' ? (
          <button onClick={stopSound}
            className="w-14 h-14 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-600/40 transition-all active:scale-95">
            <VolumeX size={18} strokeWidth={1.8} />
          </button>
        ) : (
          <div className="w-14 h-14" />
        )}
      </div>

    </ToolWrapper>
  );
}
