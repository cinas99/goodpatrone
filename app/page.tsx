import type { Metadata } from 'next';
import ToolWrapper from './components/ToolWrapper';
import Link from 'next/link';
import { Scale, CalendarDays, Leaf, Timer, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Online Tools – BMI, Date Calculator, Stopwatch & Timer',
  description: 'Good Patrone offers free online tools: BMI calculator with ideal weight, days between dates, online stopwatch with lap tracking, and countdown timer with sound alerts.',
  alternates: { canonical: 'https://goodpatrone.com' },
};

const tools = [
  {
    href: '/bmi',
    label: 'BMI Calculator',
    Icon: Scale,
    desc: 'Body mass index & ideal weight range',
    accent: 'text-blue-400',
    bg: 'bg-blue-500/10',
    ring: 'group-hover:border-blue-500/40 group-hover:shadow-blue-500/10',
  },
  {
    href: '/days',
    label: 'Days Between',
    Icon: CalendarDays,
    desc: 'Count days, weeks & months between dates',
    accent: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    ring: 'group-hover:border-emerald-500/40 group-hover:shadow-emerald-500/10',
  },
  {
    href: '/stopwatch',
    label: 'Stopwatch',
    Icon: Timer,
    desc: 'Precision timing with mark timestamps',
    accent: 'text-amber-400',
    bg: 'bg-amber-500/10',
    ring: 'group-hover:border-amber-500/40 group-hover:shadow-amber-500/10',
  },
  {
    href: '/countdown',
    label: 'Countdown',
    Icon: Clock,
    desc: 'Timer with sound alerts & presets',
    accent: 'text-rose-400',
    bg: 'bg-rose-500/10',
    ring: 'group-hover:border-rose-500/40 group-hover:shadow-rose-500/10',
  },
];

export default function HomePage() {
  return (
    <ToolWrapper
      title="Good Patrone"
      subtitle="Free online tools — no sign-up, no nonsense."
      icon={<Leaf size={22} className="text-emerald-400" />}
      adSlot="home"
    >
      {/* Hero banner */}
      <div className="relative rounded-3xl overflow-hidden mb-8 px-8 py-10">
        {/* Mesh gradient blobs */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse at 15% 60%, rgba(16,185,129,0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 15%, rgba(59,130,246,0.14) 0%, transparent 50%),
            radial-gradient(ellipse at 65% 85%, rgba(244,63,94,0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(251,191,36,0.06) 0%, transparent 70%)
          `
        }} />
        <div className="absolute inset-0 bg-white/[0.02] rounded-3xl border border-white/8" />
        <div className="relative z-10 space-y-2">
          <p className="text-2xl font-black text-white tracking-tight leading-snug">
            Simple tools.<br />No distractions.
          </p>
          <p className="text-sm text-zinc-400">Free, fast, no sign-up. Pick a tool below.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tools.map(({ href, label, Icon, desc, accent, bg, ring }) => (
          <Link key={href} href={href}
            className={`group flex flex-col gap-4 p-6 rounded-2xl bg-white/4 border border-white/8 hover:bg-white/7 transition-all duration-200 shadow-lg hover:shadow-xl ${ring}`}>
            <div className={`w-12 h-12 rounded-xl ${bg} border border-white/10 flex items-center justify-center`}>
              <Icon size={22} className={accent} strokeWidth={1.8} />
            </div>
            <div>
              <div className={`font-bold text-white text-base group-hover:${accent} transition-colors`}>{label}</div>
              <div className="text-gray-500 text-sm mt-1 leading-snug">{desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </ToolWrapper>
  );
}
