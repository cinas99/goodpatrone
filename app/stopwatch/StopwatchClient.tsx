'use client';
import { useState, useEffect, useRef } from 'react';
import ToolWrapper from '../components/ToolWrapper';
import { Timer, Flag, Trash2, Play, Pause, RotateCcw } from 'lucide-react';

function formatTime(ms: number) {
  const h  = Math.floor(ms / 3600000);
  const m  = Math.floor((ms % 3600000) / 60000);
  const s  = Math.floor((ms % 60000) / 1000);
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
}

function formatMs(ms: number) {
  return String(Math.floor(ms % 1000)).padStart(3, '0');
}

function formatFlag(ms: number) {
  return `${formatTime(ms)}.${formatMs(ms)}`;
}

export default function StopwatchClient() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [flags,   setFlags]   = useState<number[]>([]);
  const startRef  = useRef<number | null>(null);
  const baseRef   = useRef(0);
  const frameRef  = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      startRef.current = performance.now();
      const tick = () => {
        setElapsed(baseRef.current + (performance.now() - startRef.current!));
        frameRef.current = requestAnimationFrame(tick);
      };
      frameRef.current = requestAnimationFrame(tick);
    } else {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      baseRef.current = elapsed;
    }
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [running]);

  const handleFlag = () => {
    if (!running) return;
    setFlags(prev => [...prev, elapsed]);
  };

  const handleReset = () => {
    setRunning(false);
    baseRef.current = 0;
    setElapsed(0);
    setFlags([]);
  };

  return (
    <ToolWrapper
      title="Stopwatch"
      subtitle="Measure time and mark moments"
      icon={<Timer size={17} className="text-gray-400" />}
      adSlot="stopwatch"
    >

      {/* Main display */}
      <div className="flex flex-col items-center py-6 mb-2">
        <div className="text-[64px] md:text-[80px] font-black tracking-tighter tabular-nums text-white leading-none">
          {formatTime(elapsed)}
        </div>
        <div className="text-3xl font-bold text-gray-500 tabular-nums mt-1">
          .{formatMs(elapsed)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-end justify-center gap-5 mb-8">

        {/* Reset */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={handleReset}
            disabled={elapsed === 0}
            className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all disabled:opacity-20 active:scale-95">
            <RotateCcw size={18} strokeWidth={1.8} />
          </button>
          <span className="text-[10px] text-gray-600 uppercase tracking-widest">Reset</span>
        </div>

        {/* Start / Stop */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={() => setRunning(r => !r)}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all active:scale-95 shadow-lg ${
              running
                ? 'bg-red-600/80 hover:bg-red-600 border border-red-500/50'
                : 'bg-emerald-700/80 hover:bg-emerald-700 border border-emerald-600/50'
            }`}>
            {running
              ? <Pause size={26} strokeWidth={2} />
              : <Play  size={26} strokeWidth={2} className="ml-1" />
            }
          </button>
          <span className="text-[10px] text-gray-600 uppercase tracking-widest">{running ? 'Pause' : 'Start'}</span>
        </div>

        {/* Flag */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={handleFlag}
            disabled={!running}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg disabled:opacity-20 ${
              running
                ? 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 hover:text-amber-300'
                : 'bg-white/5 border border-white/10 text-gray-500'
            }`}>
            <Flag size={26} strokeWidth={1.8} />
          </button>
          <span className="text-[10px] text-gray-600 uppercase tracking-widest">Mark</span>
        </div>

        {/* Trash */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={() => setFlags([])}
            disabled={flags.length === 0}
            className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-red-600/20 hover:border-red-500/30 hover:text-red-400 transition-all disabled:opacity-20 active:scale-95">
            <Trash2 size={18} strokeWidth={1.8} />
          </button>
          <span className="text-[10px] text-gray-600 uppercase tracking-widest">Clear</span>
        </div>

      </div>

      {/* Flags */}
      {flags.length > 0 && (
        <div className="rounded-xl overflow-hidden border border-white/8">

          {/* First flag — reference / winner, pinned */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-yellow-500/10 border-b border-yellow-500/20">
            <span className="text-xs font-bold text-yellow-400 flex items-center gap-1.5">
              <span>🥇</span> Reference
            </span>
            <span className="text-sm font-black tabular-nums text-yellow-300 tracking-tight">
              {formatFlag(flags[0])}
            </span>
          </div>

          {/* Rest — scrollable */}
          {flags.length > 1 && (
            <div className="max-h-52 overflow-y-auto">
              {flags.slice(1).map((ms, i) => (
                <div key={i}
                  className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/3">
                  <span className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Flag size={11} strokeWidth={1.8} className="text-gray-600" />
                    {i + 2}
                  </span>
                  <span className="text-sm font-black tabular-nums text-white tracking-tight">
                    {formatFlag(ms)}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </ToolWrapper>
  );
}
