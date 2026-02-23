import type { Metadata } from 'next';
import ToolWrapper from './components/ToolWrapper';
import Link from 'next/link';
import { Scale, CalendarDays, ChevronRight, Leaf, Timer, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Online Tools – BMI, Date Calculator, Stopwatch & Timer',
  description: 'Good Patrone offers free online tools: BMI calculator with ideal weight, days between dates, online stopwatch with lap tracking, and countdown timer with sound alerts.',
  alternates: { canonical: 'https://goodpatrone.com' },
};

const tools = [
  { href: '/bmi',       label: 'BMI Calculator', Icon: Scale,        desc: 'Calculate your Body Mass Index instantly' },
  { href: '/days',      label: 'Days Between',   Icon: CalendarDays, desc: 'Count days between any two dates' },
  { href: '/stopwatch', label: 'Stopwatch',      Icon: Timer,        desc: 'Lap timer with split tracking' },
  { href: '/countdown', label: 'Countdown',      Icon: Clock,        desc: 'Custom countdown with presets' },
];

export default function HomePage() {
  return (
    <ToolWrapper title="Good Patrone" subtitle="Free online tools — pick one below or from the left panel." icon={<Leaf size={22} className="text-emerald-400" />} adSlot="home">
      <div className="grid grid-cols-1 gap-3">
        {tools.map(({ href, label, Icon, desc }) => (
          <Link key={href} href={href}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-700/50 group transition-all">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-emerald-700/50 transition-all flex-shrink-0">
              <Icon size={18} className="text-gray-400 group-hover:text-emerald-400 transition-colors" strokeWidth={1.8} />
            </div>
            <div>
              <div className="font-bold text-white text-sm">{label}</div>
              <div className="text-gray-500 text-xs">{desc}</div>
            </div>
            <ChevronRight size={16} className="ml-auto text-gray-700 group-hover:text-emerald-400 transition-colors" />
          </Link>
        ))}
      </div>
    </ToolWrapper>
  );
}
