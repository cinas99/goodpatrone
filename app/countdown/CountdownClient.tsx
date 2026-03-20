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

type SoundMode = 'off' | 'canal' | 'kids' | 'pop' | 'soft' | 'villageParty';

const MP3_SOUNDS: { key: SoundMode; label: string; src: string; img: string }[] = [
  { key: 'canal',        label: 'Stock Music',  src: '/sounds/canal.mp3',        img: '/sounds/img/canal.png'        },
  { key: 'kids',         label: 'Kids',         src: '/sounds/kids.mp3',         img: '/sounds/img/kids.png'         },
  { key: 'pop',          label: 'Pop',          src: '/sounds/pop.mp3',          img: '/sounds/img/pop.png'          },
  { key: 'soft',         label: 'Soft',         src: '/sounds/soft.mp3',         img: '/sounds/img/soft.png'         },
  { key: 'villageParty', label: 'Village Party',src: '/sounds/villageParty.mp3', img: '/sounds/img/villageParty.png' },
];

function formatDisplay(ms: number) {
  const h  = Math.floor(ms / 3600000);
  const m  = Math.floor((ms % 3600000) / 60000);
  const s  = Math.floor((ms % 60000) / 1000);
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${String(h).padStart(2, '0')}:${mm}:${ss}` : `${mm}:${ss}`;
}

export default function CountdownClient() {
  const [target,    setTarget]    = useState(600000);
  const [elapsed,   setElapsed]   = useState(0);
  const [running,   setRunning]   = useState(false);
  const [done,      setDone]      = useState(false);
  const [soundMode, setSoundMode] = useState<SoundMode>('off');
  const [loopSound, setLoopSound] = useState(false);
  const [customH,   setCustomH]   = useState('0');
  const [customM,   setCustomM]   = useState('10');
  const [customS,   setCustomS]   = useState('0');

  const startRef    = useRef<number | null>(null);
  const baseRef     = useRef(0);
  const frameRef    = useRef<number | null>(null);
  const mp3Ref      = useRef<HTMLAudioElement | null>(null);
  const mp3LoopRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loopSoundRef = useRef(loopSound);

  const stopMp3 = () => {
    if (mp3Ref.current) { mp3Ref.current.onended = null; mp3Ref.current.pause(); mp3Ref.current = null; }
    if (mp3LoopRef.current) { clearTimeout(mp3LoopRef.current); mp3LoopRef.current = null; }
  };

  const playMp3 = (src: string, loop: boolean) => {
    stopMp3();
    const fire = () => {
      const audio = new Audio(src);
      mp3Ref.current = audio;
      if (loop) audio.onended = () => fire();
      audio.play().catch(() => {});
    };
    fire();
    if (loop) {
      // hard-stop after 60 s so it doesn't run forever
      mp3LoopRef.current = setTimeout(() => stopMp3(), 60000);
    }
  };

  useEffect(() => () => stopMp3(), []);

  useEffect(() => {
    if (running) {
      startRef.current = performance.now();
      const tick = () => {
        const delta = baseRef.current + (performance.now() - startRef.current!);
        if (delta >= target) {
          setElapsed(target); setRunning(false); setDone(true);
          if (soundMode !== 'off') {
            const mp3 = MP3_SOUNDS.find(s => s.key === soundMode);
            if (mp3) playMp3(mp3.src, loopSoundRef.current);
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
    stopMp3(); setRunning(false); setElapsed(0); baseRef.current = 0; setDone(false); setTarget(ms);
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

  const reset = () => { stopMp3(); setRunning(false); setElapsed(0); baseRef.current = 0; setDone(false); };

  const handleSelectSound = (mode: SoundMode) => {
    setSoundMode(mode);
    if (mode !== 'off') {
      const mp3 = MP3_SOUNDS.find(s => s.key === mode);
      if (mp3) playMp3(mp3.src, false);
    } else {
      stopMp3();
    }
  };

  const preview = () => {
    if (soundMode === 'off') return;
    const mp3 = MP3_SOUNDS.find(s => s.key === soundMode);
    if (mp3) playMp3(mp3.src, false);
  };

  const remaining = Math.max(0, target - elapsed);
  const isNearEnd = remaining < 10000 && running && !done;

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
        <div className="space-y-3">
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-medium">Alert sound</p>

          {/* Grid — auto-rows forces equal height in both rows on mobile */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3" style={{ gridAutoRows: '96px' }}>

            {/* Silent */}
            <button
              onClick={() => handleSelectSound('off')}
              className={`relative rounded-2xl overflow-hidden border-2 transition-all active:scale-95 flex flex-col items-center justify-center gap-1.5 ${
                soundMode === 'off'
                  ? 'border-emerald-500 bg-zinc-800 shadow-lg shadow-emerald-500/20'
                  : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'
              }`}
            >
              <VolumeX size={22} className={soundMode === 'off' ? 'text-emerald-400' : 'text-zinc-500'} strokeWidth={1.7} />
              <span className={`text-xs font-semibold ${soundMode === 'off' ? 'text-emerald-400' : 'text-zinc-500'}`}>Silent</span>
              {soundMode === 'off' && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>

            {/* MP3 image buttons */}
            {MP3_SOUNDS.map(s => (
              <button key={s.key} onClick={() => handleSelectSound(s.key)}
                className={`relative rounded-2xl overflow-hidden border-2 transition-all active:scale-95 flex items-center justify-center ${
                  soundMode === s.key
                    ? 'border-emerald-500 shadow-lg shadow-emerald-500/20'
                    : 'border-zinc-700 hover:border-zinc-500'
                }`}
                style={{ backgroundImage: `url(${s.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className={`absolute inset-0 pointer-events-none transition-colors ${soundMode === s.key ? 'bg-black/30' : 'bg-black/55'}`} />
                <span className="relative z-10 text-xs font-bold text-white drop-shadow-md leading-tight px-1 text-center">{s.label}</span>
                {soundMode === s.key && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 shadow-sm pointer-events-none" />
                )}
              </button>
            ))}
          </div>

          {/* Preview + Once / 1 min loop */}
          {soundMode !== 'off' && (
            <div className="flex items-center gap-4">
              <button
                onClick={preview}
                className="text-sm text-emerald-500 hover:text-emerald-400 font-semibold transition-colors">
                Preview
              </button>
              <div className="flex gap-1.5">
                {(['Once', '1 min'] as const).map(opt => {
                  const isLoop = opt === '1 min';
                  const active = isLoop === loopSound;
                  return (
                    <button key={opt}
                      onClick={() => { setLoopSound(isLoop); loopSoundRef.current = isLoop; }}
                      className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${
                        active
                          ? 'border-emerald-500 text-emerald-400 bg-emerald-950/30'
                          : 'border-zinc-700 text-zinc-600 hover:text-zinc-300 hover:border-zinc-500'
                      }`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Custom time */}
        <div className="pt-4 pb-2 border-t border-zinc-800 space-y-4">
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-medium pt-2">Set Custom time</p>
          <div className="flex items-center gap-3">
            {([
              { val: customH, label: 'Hours',   max: 23, onChange: (v: string) => { setCustomH(v); onFieldChange(v, customM, customS); } },
              { val: customM, label: 'Minutes', max: 59, onChange: (v: string) => { setCustomM(v); onFieldChange(customH, v, customS); } },
              { val: customS, label: 'Seconds', max: 59, onChange: (v: string) => { setCustomS(v); onFieldChange(customH, customM, v); } },
            ] as const).map((f, i) => (
              <div key={f.label} className="flex items-center gap-3">
                {i > 0 && <span className="text-zinc-600 text-xl font-bold pb-5">:</span>}
                <div className="text-center">
                  <input
                    type="number" min={0} max={f.max} value={f.val}
                    onChange={e => f.onChange(e.target.value)}
                    className="w-20 px-2 py-3 bg-zinc-900 border border-zinc-700 rounded-2xl text-white text-lg font-bold text-center tabular-nums focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2">{f.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Countdown row: title + time + Play + Reload in one row */}
        <div className="pt-4 border-t border-zinc-800 space-y-3">
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-medium pt-2">Countdown</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className={`text-[40px] sm:text-[60px] md:text-[80px] font-black tracking-tighter tabular-nums leading-none transition-colors duration-500 ${
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
            <button
              onClick={() => { if (done) { reset(); return; } setRunning(r => !r); }}
              disabled={remaining === 0 && !done}
              className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white transition-all active:scale-95 shadow-lg disabled:opacity-30 flex-shrink-0 ${
                running
                  ? 'bg-red-600/80 hover:bg-red-600 border border-red-500/50'
                  : 'bg-emerald-700/80 hover:bg-emerald-700 border border-emerald-600/50'
              }`}>
              {done
                ? <RefreshCw size={20} strokeWidth={2} />
                : running
                ? <Pause size={20} strokeWidth={2} />
                : <Play  size={20} strokeWidth={2} className="ml-0.5" />
              }
            </button>
            <button onClick={reset}
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all active:scale-95 flex-shrink-0">
              <RotateCcw size={15} strokeWidth={1.8} />
            </button>
            {done && soundMode !== 'off' && (
              <button onClick={stopMp3}
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-600/40 transition-all active:scale-95 flex-shrink-0">
                <VolumeX size={15} strokeWidth={1.8} />
              </button>
            )}
          </div>
        </div>

      </div>
    </ToolWrapper>
  );
}
