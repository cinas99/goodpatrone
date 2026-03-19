'use client';
import { useState, useEffect, useRef } from 'react';
import ToolWrapper from '../components/ToolWrapper';
import { Clock, Play, Pause, RotateCcw, RefreshCw, VolumeX } from 'lucide-react';

const PRESETS = [
  { label: '5 min',   ms:  5 * 60000 },
  { label: '10 min',  ms: 10 * 60000 },
  { label: '15 min',  ms: 15 * 60000 },
  { label: '30 min',  ms: 30 * 60000 },
  { label: '45 min',  ms: 45 * 60000 },
  { label: '1 hour',  ms:  1 * 3600000 },
  { label: '2 hours', ms:  2 * 3600000 },
  { label: '3 hours', ms:  3 * 3600000 },
  { label: '5 hours', ms:  5 * 3600000 },
];

type SoundMode = 'off' | 'chime' | 'fanfare' | 'sonar' | 'siren' | 'mp3-1' | 'mp3-2' | 'mp3-3' | 'mp3-4';

const SYNTH_OPTIONS: { key: SoundMode; label: string; emoji: string }[] = [
  { key: 'off',     label: 'Silence', emoji: '🔇' },
  { key: 'chime',   label: 'Chime',   emoji: '🔔' },
  { key: 'fanfare', label: 'Fanfare', emoji: '🎵' },
  { key: 'sonar',   label: 'Sonar',   emoji: '📡' },
  { key: 'siren',   label: 'Siren',   emoji: '🚨' },
];

const MP3_SOUNDS: { key: SoundMode; label: string; src: string; img: string }[] = [
  { key: 'mp3-1', label: 'Sound 1', src: '/sounds/sound1.mp3', img: '/sounds/img/sound1.jpg' },
  { key: 'mp3-2', label: 'Sound 2', src: '/sounds/sound2.mp3', img: '/sounds/img/sound2.jpg' },
  { key: 'mp3-3', label: 'Sound 3', src: '/sounds/sound3.mp3', img: '/sounds/img/sound3.jpg' },
  { key: 'mp3-4', label: 'Sound 4', src: '/sounds/sound4.mp3', img: '/sounds/img/sound4.jpg' },
];

function formatDisplay(ms: number) {
  const h  = Math.floor(ms / 3600000);
  const m  = Math.floor((ms % 3600000) / 60000);
  const s  = Math.floor((ms % 60000) / 1000);
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${String(h).padStart(2, '0')}:${mm}:${ss}` : `${mm}:${ss}`;
}

type IntervalRef = { current: ReturnType<typeof setInterval> | null };

function stopSound(ref: IntervalRef) {
  if (ref.current) { clearInterval(ref.current); ref.current = null; }
}

function playSound(mode: SoundMode, loop: boolean, ref: IntervalRef) {
  if (mode === 'off' || mode.startsWith('mp3-')) return;
  stopSound(ref);
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
      if (mode === 'chime') {
        osc(523, t + 0.0, 3.5, 0.6); osc(1047, t + 0.0, 2.8, 0.25);
        osc(1568, t + 0.0, 2.2, 0.12); osc(2093, t + 0.0, 1.5, 0.06);
      }
      if (mode === 'fanfare') {
        osc(523, t + 0.00, 0.35, 0.5); osc(659, t + 0.22, 0.35, 0.5);
        osc(784, t + 0.44, 0.35, 0.5); osc(1047, t + 0.66, 0.9, 0.55);
        osc(1047, t + 0.66, 0.9, 0.2, 'triangle');
      }
      if (mode === 'sonar') {
        [0, 1.1, 2.2].forEach(offset => {
          const o = ctx.createOscillator(); const g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination); o.type = 'sine';
          o.frequency.setValueAtTime(900, t + offset);
          o.frequency.exponentialRampToValueAtTime(320, t + offset + 0.7);
          g.gain.setValueAtTime(0.55, t + offset);
          g.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.9);
          o.start(t + offset); o.stop(t + offset + 1.0);
        });
      }
      if (mode === 'siren') {
        for (let i = 0; i < 4; i++) {
          osc(960, t + i * 0.55 + 0.00, 0.25, 0.55, 'sawtooth');
          osc(1280, t + i * 0.55 + 0.28, 0.25, 0.55, 'sawtooth');
        }
      }
    };
    fire();
    if (loop) {
      const intervals: Record<string, number> = { chime: 4500, fanfare: 3000, sonar: 3500, siren: 2400 };
      const interval = intervals[mode] ?? 4000;
      let total = 0;
      ref.current = setInterval(() => {
        total += interval;
        if (total >= 30000) { stopSound(ref); return; }
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
  const [soundMode, setSoundMode] = useState<SoundMode>('chime');
  const [loopSound, setLoopSound] = useState(true);
  const [customH,   setCustomH]   = useState('0');
  const [customM,   setCustomM]   = useState('10');
  const [customS,   setCustomS]   = useState('0');
  const startRef     = useRef<number | null>(null);
  const baseRef      = useRef(0);
  const frameRef     = useRef<number | null>(null);
  const soundRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const loopSoundRef = useRef(loopSound);
  const mp3Ref       = useRef<HTMLAudioElement | null>(null);
  const mp3LoopRef   = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopMp3 = () => {
    if (mp3Ref.current) { mp3Ref.current.pause(); mp3Ref.current = null; }
    if (mp3LoopRef.current) { clearInterval(mp3LoopRef.current); mp3LoopRef.current = null; }
  };

  const playMp3 = (src: string, loop: boolean) => {
    stopMp3();
    const fire = () => {
      const audio = new Audio(src);
      mp3Ref.current = audio;
      audio.play().catch(() => {});
    };
    fire();
    if (loop) {
      let total = 0;
      mp3LoopRef.current = setInterval(() => {
        total += 5000;
        if (total >= 30000) { stopMp3(); return; }
        fire();
      }, 5000);
    }
  };

  const stopAll = () => { stopSound(soundRef); stopMp3(); };

  useEffect(() => () => stopAll(), []);

  useEffect(() => {
    if (running) {
      startRef.current = performance.now();
      const tick = () => {
        const delta = baseRef.current + (performance.now() - startRef.current!);
        if (delta >= target) {
          setElapsed(target); setRunning(false); setDone(true);
          const mode = soundMode;
          if (mode.startsWith('mp3-')) {
            const mp3 = MP3_SOUNDS.find(s => s.key === mode);
            if (mp3) playMp3(mp3.src, loopSoundRef.current);
          } else {
            playSound(mode, loopSoundRef.current, soundRef);
          }
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

  const applyMs = (ms: number) => {
    if (ms <= 0) return;
    stopAll(); setRunning(false); setElapsed(0); baseRef.current = 0; setDone(false); setTarget(ms);
  };

  const applyPreset = (ms: number) => {
    applyMs(ms);
    setCustomH(String(Math.floor(ms / 3600000)));
    setCustomM(String(Math.floor((ms % 3600000) / 60000)));
    setCustomS(String(Math.floor((ms % 60000) / 1000)));
  };

  const onFieldChange = (h: string, m: string, s: string) => {
    const ms = (parseInt(h) || 0) * 3600000 + (parseInt(m) || 0) * 60000 + (parseInt(s) || 0) * 1000;
    applyMs(ms);
  };

  const reset = () => { stopAll(); setRunning(false); setElapsed(0); baseRef.current = 0; setDone(false); };

  const handleSelectSound = (mode: SoundMode) => {
    setSoundMode(mode);
    // preview on select
    if (mode.startsWith('mp3-')) {
      const mp3 = MP3_SOUNDS.find(s => s.key === mode);
      if (mp3) playMp3(mp3.src, false);
    } else if (mode !== 'off') {
      playSound(mode, false, soundRef);
    }
  };

  const remaining  = Math.max(0, target - elapsed);
  const isNearEnd  = remaining < 10000 && running && !done;
  const isMp3Mode  = soundMode.startsWith('mp3-');

  return (
    <ToolWrapper
      title="Countdown"
      subtitle="Set a timer with presets or custom time"
      icon={<Clock size={17} className="text-gray-400" />}
      adSlot="countdown"
    >
      <div className="space-y-8">

        {/* Presets */}
        <div className="space-y-3">
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-medium">Presets</p>
          <div className="flex flex-wrap gap-3">
            {PRESETS.map(p => (
              <button key={p.ms} onClick={() => applyPreset(p.ms)}
                className={`px-6 py-3 rounded-full border text-sm font-medium transition-all active:scale-95 ${
                  target === p.ms && elapsed === 0
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-950/30'
                    : 'border-zinc-700 text-zinc-300 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-950/30'
                }`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sound */}
        <div className="space-y-4">
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-medium">Alert sound</p>

          {/* Synth options */}
          <div className="flex flex-wrap gap-3">
            {SYNTH_OPTIONS.map(s => (
              <button key={s.key} onClick={() => handleSelectSound(s.key)}
                className={`px-5 py-3 rounded-full border text-sm font-medium transition-all flex items-center gap-2 ${
                  soundMode === s.key
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-950/30'
                    : 'border-zinc-700 text-zinc-300 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-950/30'
                }`}>
                <span>{s.emoji}</span>{s.label}
              </button>
            ))}
          </div>

          {/* MP3 image buttons */}
          <div className="grid grid-cols-4 gap-3">
            {MP3_SOUNDS.map(s => (
              <button key={s.key} onClick={() => handleSelectSound(s.key)}
                className={`relative h-24 rounded-2xl overflow-hidden border-2 transition-all active:scale-95 ${
                  soundMode === s.key
                    ? 'border-emerald-500 shadow-lg shadow-emerald-500/20'
                    : 'border-zinc-700 hover:border-zinc-500'
                }`}
                style={{ backgroundImage: `url(${s.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className={`absolute inset-0 transition-colors ${soundMode === s.key ? 'bg-black/30' : 'bg-black/50'}`} />
                <span className="relative z-10 text-xs font-bold text-white drop-shadow">{s.label}</span>
                {soundMode === s.key && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 shadow-sm" />
                )}
              </button>
            ))}
          </div>

          {/* Preview + Once/30s */}
          {soundMode !== 'off' && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (isMp3Mode) {
                    const mp3 = MP3_SOUNDS.find(s => s.key === soundMode);
                    if (mp3) playMp3(mp3.src, false);
                  } else {
                    playSound(soundMode, false, soundRef);
                  }
                }}
                className="text-sm text-emerald-500 hover:text-emerald-400 font-semibold transition-colors">
                Preview
              </button>
              <div className="flex gap-1.5">
                {(['Once', '30s'] as const).map(opt => (
                  <button key={opt} onClick={() => { const v = opt === '30s'; setLoopSound(v); loopSoundRef.current = v; }}
                    className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${
                      (opt === '30s') === loopSound
                        ? 'border-emerald-500 text-emerald-400 bg-emerald-950/30'
                        : 'border-zinc-700 text-zinc-600 hover:text-zinc-300 hover:border-zinc-500'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main display */}
        <div className="flex flex-col items-center py-6">
          <div className={`text-[72px] md:text-[88px] font-black tracking-tighter tabular-nums leading-none transition-colors duration-500 ${
            done ? 'text-emerald-400' : isNearEnd ? 'text-red-400' : 'text-white'
          }`}>
            {formatDisplay(remaining)}
          </div>
          {done && (
            <p className="text-emerald-400 font-semibold text-sm mt-3 uppercase tracking-widest">Time is up</p>
          )}
          {isNearEnd && (
            <p className="text-red-400 text-xs mt-2 uppercase tracking-widest font-bold">Almost done…</p>
          )}
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
          {done && soundMode !== 'off' ? (
            <button onClick={stopAll}
              className="w-14 h-14 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-600/40 transition-all active:scale-95">
              <VolumeX size={18} strokeWidth={1.8} />
            </button>
          ) : (
            <div className="w-14 h-14" />
          )}
        </div>

        {/* Custom time */}
        <div className="space-y-3 pt-2 border-t border-zinc-800">
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-medium pt-2">Custom time</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { val: customH, label: 'Hours',   max: 23, onChange: (v: string) => { setCustomH(v); onFieldChange(v, customM, customS); } },
              { val: customM, label: 'Minutes', max: 59, onChange: (v: string) => { setCustomM(v); onFieldChange(customH, v, customS); } },
              { val: customS, label: 'Seconds', max: 59, onChange: (v: string) => { setCustomS(v); onFieldChange(customH, customM, v); } },
            ].map(f => (
              <div key={f.label} className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase tracking-widest font-medium block text-center">{f.label}</label>
                <input
                  type="number" min={0} max={f.max} value={f.val}
                  onChange={e => f.onChange(e.target.value)}
                  className="w-full px-3 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-white text-2xl font-black text-center tabular-nums focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </ToolWrapper>
  );
}
