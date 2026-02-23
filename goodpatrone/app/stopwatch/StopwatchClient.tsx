'use client';
import { useState, useEffect, useRef } from 'react';
import ToolWrapper from '../components/ToolWrapper';
import { Timer, Flag, Trash2, Play, Pause, RotateCcw } from 'lucide-react';

function formatTime(ms: number, showMs = true) {
  const h  = Math.floor(ms / 3600000);
  const m  = Math.floor((ms % 3600000) / 60000);
  const s  = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  const cc = String(cs).padStart(2, '0');
  if (!showMs) return h > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
  return h > 0 ? `${hh}:${mm}:${ss}.${cc}` : `${mm}:${ss}.${cc}`;
}

function formatLapDelta(delta: number) {
  const sign = delta >= 0 ? '+' : '-';
  const abs  = Math.abs(delta);
  return `${sign}${Math.floor(abs / 1000)}.${String(Math.floor((abs % 1000) / 10)).padStart(2, '0')}s`;
}

type Lap = { index: number; total: number; split: number };

export default function StopwatchClient() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps,    setLaps]    = useState<Lap[]>([]);
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

  const handleLap = () => {
    if (!running) return;
    const lastTotal = laps.length > 0 ? laps[laps.length - 1].total : 0;
    setLaps(prev => [...prev, { index: prev.length + 1, total: elapsed, split: elapsed - lastTotal }]);
  };

  const handleTrash = () => {
    setRunning(false);
    baseRef.current = 0;
    setElapsed(0);
    setLaps([]);
  };

  const handleReset = () => {
    setRunning(false);
    setElapsed(0);
    baseRef.current = 0;
    setLaps([]);
  };

  const splits   = laps.map(l => l.split);
  const minSplit = laps.length > 1 ? Math.min(...splits) : null;
  const maxSplit = laps.length > 1 ? Math.max(...splits) : null;
  const avgSplit = laps.length > 0 ? splits.reduce((a, b) => a + b, 0) / splits.length : null;

  return (
    <ToolWrapper
      title="Stopwatch"
      subtitle="Measure time with lap tracking"
      icon={<Timer size={17} className="text-gray-400" />}
      adSlot="stopwatch"
    >

      {/* Main display */}
      <div className="flex flex-col items-center py-6 mb-2">
        <div className="text-[64px] md:text-[80px] font-black tracking-tighter tabular-nums text-white leading-none">
          {formatTime(elapsed).split('.')[0]}
        </div>
        <div className="text-3xl font-bold text-gray-500 tabular-nums mt-1">
          .{formatTime(elapsed).split('.')[1] ?? '00'}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-6">

        {/* Lap / Reset */}
        <button
          onClick={running ? handleLap : handleReset}
          disabled={!running && elapsed === 0}
          className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all disabled:opacity-20 active:scale-95">
          {running
            ? <Flag size={18} strokeWidth={1.8} />
            : <RotateCcw size={18} strokeWidth={1.8} />
          }
        </button>

        {/* Start / Stop */}
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

        {/* Trash — stops + clears */}
        <button
          onClick={handleTrash}
          className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-red-600/20 hover:border-red-500/30 hover:text-red-400 transition-all active:scale-95">
          <Trash2 size={18} strokeWidth={1.8} />
        </button>

      </div>

      {/* Lap stats */}
      {laps.length >= 2 && avgSplit !== null && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Fastest', val: formatTime(minSplit!, false), color: 'text-emerald-400' },
            { label: 'Average', val: formatTime(Math.round(avgSplit), false), color: 'text-slate-300' },
            { label: 'Slowest', val: formatTime(maxSplit!, false), color: 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center p-3 bg-white/5 border border-white/8 rounded-xl text-center">
              <span className={`text-sm font-black tabular-nums ${s.color}`}>{s.val}</span>
              <span className="text-[10px] text-gray-600 mt-0.5 uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Lap table */}
      {laps.length > 0 && (
        <div className="border border-white/8 rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 px-4 py-2 bg-white/5 border-b border-white/8 text-[10px] text-gray-600 uppercase tracking-widest">
            <span>Lap</span>
            <span className="text-right">Split</span>
            <span className="text-right">+/− avg</span>
            <span className="text-right">Total</span>
          </div>
          <div className="max-h-52 overflow-y-auto">
            {[...laps].reverse().map((lap) => {
              const isFastest = minSplit !== null && lap.split === minSplit && laps.length > 1;
              const isSlowest = maxSplit !== null && lap.split === maxSplit && laps.length > 1;
              const delta     = avgSplit !== null ? lap.split - avgSplit : null;
              return (
                <div key={lap.index}
                  className={`grid grid-cols-4 px-4 py-2.5 border-b border-white/5 last:border-0 tabular-nums ${
                    isFastest ? 'bg-emerald-950/40' : isSlowest ? 'bg-red-950/30' : 'hover:bg-white/3'
                  }`}>
                  <span className={`font-semibold text-xs ${isFastest ? 'text-emerald-400' : isSlowest ? 'text-red-400' : 'text-gray-500'}`}>
                    {isFastest ? '▲ ' : isSlowest ? '▼ ' : ''}{lap.index}
                  </span>
                  <span className="text-right text-white font-bold text-xs">{formatTime(lap.split, false)}</span>
                  <span className={`text-right text-xs font-semibold ${
                    delta === null ? 'text-gray-600' : delta <= 0 ? 'text-emerald-500' : 'text-red-400'
                  }`}>
                    {delta !== null ? formatLapDelta(delta) : '—'}
                  </span>
                  <span className="text-right text-gray-500 text-xs">{formatTime(lap.total, false)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </ToolWrapper>
  );
}
