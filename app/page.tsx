import type { Metadata } from 'next';
import ToolWrapper from './components/ToolWrapper';
import Link from 'next/link';
import { Scale, CalendarDays, Leaf, Timer, Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Online Tools – BMI, Date Calculator, Stopwatch & Timer',
  description: 'Good Patrone offers free online tools: BMI calculator with ideal weight, days between dates, online stopwatch with lap tracking, and countdown timer with sound alerts.',
  alternates: { canonical: 'https://goodpatrone.com' },
};

const tools = [
  {
    href: '/days',
    label: 'Days Between',
    Icon: CalendarDays,
    desc: 'Count days, weeks & months between dates',
    accent: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    hoverBorder: 'hover:border-emerald-500/40',
    glow: 'hover:shadow-emerald-500/10',
  },
  {
    href: '/stopwatch',
    label: 'Stopwatch',
    Icon: Timer,
    desc: 'Precision timing with lap timestamps',
    accent: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    hoverBorder: 'hover:border-amber-500/40',
    glow: 'hover:shadow-amber-500/10',
  },
  {
    href: '/countdown',
    label: 'Countdown',
    Icon: Clock,
    desc: 'Timer with sound alerts & presets',
    accent: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    hoverBorder: 'hover:border-rose-500/40',
    glow: 'hover:shadow-rose-500/10',
  },
  {
    href: '/bmi',
    label: 'BMI Calculator',
    Icon: Scale,
    desc: 'Body mass index & ideal weight range',
    accent: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    hoverBorder: 'hover:border-blue-500/40',
    glow: 'hover:shadow-blue-500/10',
  },
];

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: '100%',
        background: `
          radial-gradient(ellipse at 10% 15%, rgba(16,185,129,0.13) 0%, transparent 45%),
          radial-gradient(ellipse at 88% 12%, rgba(59,130,246,0.11) 0%, transparent 42%),
          radial-gradient(ellipse at 72% 85%, rgba(244,63,94,0.09) 0%, transparent 42%),
          radial-gradient(ellipse at 25% 75%, rgba(251,191,36,0.07) 0%, transparent 48%)
        `,
      }}
    >
      <ToolWrapper
        title="Good Patrone"
        subtitle="Free online tools — no sign-up, no nonsense."
        icon={<Leaf size={22} className="text-emerald-400" />}
        adSlot="home"
      >
        {/* Headline */}
        <div className="mb-8">
          <p className="text-2xl font-black text-white tracking-tight leading-snug">
            Simple tools.<br />No distractions.
          </p>
          <p className="text-sm text-zinc-400 mt-2">Free, fast, no sign-up. Pick a tool below.</p>
        </div>

        {/* Tool rows */}
        <div className="flex flex-col gap-3">
          {tools.map(({ href, label, Icon, desc, accent, bg, border, hoverBorder, glow }) => (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-5 p-5 rounded-2xl bg-white/[0.03] border ${border} ${hoverBorder} hover:bg-white/[0.06] hover:shadow-lg ${glow} transition-all duration-200`}
            >
              <div className={`w-12 h-12 rounded-xl ${bg} border border-white/10 flex items-center justify-center flex-shrink-0`}>
                <Icon size={22} className={accent} strokeWidth={1.7} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold text-white text-[15px] group-hover:${accent} transition-colors`}>
                  {label}
                </div>
                <div className="text-zinc-500 text-sm mt-0.5 leading-snug">{desc}</div>
              </div>
              <ArrowRight
                size={16}
                className="text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all flex-shrink-0"
              />
            </Link>
          ))}
        </div>
      </ToolWrapper>
    </div>
  );
}
