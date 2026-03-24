import type { Metadata } from 'next';
import ToolWrapper from './components/ToolWrapper';
import Link from 'next/link';
import Image from 'next/image';
import { Scale, CalendarDays, Timer, Clock, ArrowRight, DollarSign, Droplets, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Online Tools – BMI, Date Calculator, Stopwatch, Timer & More',
  description: 'Good Patrone offers free online tools: BMI calculator, days between dates, stopwatch, countdown timer, currency converter, water usage calculator, and electricity bill estimator.',
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
    desc: 'Precision timing with millisecond accuracy',
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
  {
    href: '/currency',
    label: 'Currency',
    Icon: DollarSign,
    desc: 'Live EUR, USD, GBP, JPY & CHF exchange rates',
    accent: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    hoverBorder: 'hover:border-violet-500/40',
    glow: 'hover:shadow-violet-500/10',
  },
  {
    href: '/water',
    label: 'Water Usage',
    Icon: Droplets,
    desc: 'Estimate daily consumption & monthly bill',
    accent: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    hoverBorder: 'hover:border-cyan-500/40',
    glow: 'hover:shadow-cyan-500/10',
  },
  {
    href: '/electricity',
    label: 'Electricity',
    Icon: Zap,
    desc: 'Monthly cost by appliance & solar tip',
    accent: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    hoverBorder: 'hover:border-yellow-500/40',
    glow: 'hover:shadow-yellow-500/10',
  },
];

export default function HomePage() {
  return (
    <div className="relative" style={{ minHeight: '100%' }}>
      {/* Background image with opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url(/sounds/img/jungle.png)`,
          opacity: 0.09,
        }}
      />
      {/* Gradient overlay to fade edges and keep dark tone */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 30%, #09090b 85%),
            linear-gradient(to bottom, #09090b 0%, transparent 15%, transparent 85%, #09090b 100%)
          `,
        }}
      />
      <div className="relative z-10">
      <ToolWrapper
        title="Good Patrone"
        subtitle="Free online tools — no sign-up, no nonsense."
        icon={<Image src="/logo.png" alt="Good Patrone" width={40} height={40} className="object-contain" />}
        adSlot="home"
      >
        {/* Headline */}
        <div className="mb-8">
          <p className="text-2xl font-black text-white tracking-tight leading-snug">
            Simple tools.<br />No distractions.
          </p>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
            Free, fast, no sign-up. Calculate your BMI, count days between dates, convert currencies live, estimate your water and electricity bills, and more — all in one place.
          </p>
        </div>

        {/* Tool rows */}
        <div className="flex flex-col gap-3">
          {tools.map(({ href, label, Icon, desc, accent, bg, border, hoverBorder, glow }) => (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-5 p-5 rounded-2xl bg-zinc-950/80 border ${border} ${hoverBorder} hover:bg-zinc-900/80 hover:shadow-lg ${glow} transition-all duration-200`}
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
    </div>
  );
}
