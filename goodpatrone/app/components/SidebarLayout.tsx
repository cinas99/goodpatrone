'use client';
import Link from 'next/link';
import { useState } from 'react';
import AdSlot from './AdSlot';
import {
  Leaf, Home, Scale, CalendarDays, Timer, Clock as CountdownIcon,
  TrendingUp, Triangle, Shuffle, DollarSign, Menu, X
} from 'lucide-react';

const tools = [
  { href: '/',           label: 'Dashboard',      Icon: Home },
  { href: '/bmi',        label: 'BMI Calculator',  Icon: Scale },
  { href: '/days',       label: 'Days Between',    Icon: CalendarDays },
  { href: '/stopwatch',  label: 'Stopwatch',       Icon: Timer },
  { href: '/countdown',  label: 'Countdown',       Icon: CountdownIcon },
];

const comingSoon = [
  { label: 'Currency',         Icon: DollarSign },
  { label: 'Calories',         Icon: TrendingUp },
  { label: 'Geometry',         Icon: Triangle },
  { label: 'Random Generator', Icon: Shuffle },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  return (
    <div className="w-60 flex flex-col py-6 px-3 h-full">
      <div className="flex items-center justify-between mb-8 px-2">
        <Link href="/" onClick={onClose} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800/50 flex items-center justify-center group-hover:border-emerald-600 transition-all">
            <Leaf size={16} className="text-emerald-400" strokeWidth={2} />
          </div>
          <div>
            <div className="text-white font-black text-sm leading-tight">Good Patrone</div>
            <div className="text-[10px] text-gray-600 leading-tight">Free online tools</div>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-gray-600 hover:text-white p-1">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="h-px bg-white/5 mb-4" />

      <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest px-3 mb-2">Tools</p>
        {tools.map(({ href, label, Icon }) => (
          <Link key={href} href={href} onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/6 text-sm font-medium group transition-all">
            <Icon size={15} className="group-hover:text-emerald-400 transition-colors" strokeWidth={1.8} />
            {label}
          </Link>
        ))}
        <div className="h-px bg-white/5 my-3" />
        <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest px-3 mb-2">Coming Soon</p>
        {comingSoon.map(({ label, Icon }) => (
          <div key={label} className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-800 text-sm cursor-not-allowed select-none">
            <Icon size={14} strokeWidth={1.5} />
            {label}
          </div>
        ))}
      </nav>

      <div className="mt-4">
        <AdSlot format="rectangle" slot="sidebar-left" />
      </div>

      <div className="text-[10px] text-gray-800 px-3 pt-3 border-t border-white/5 mt-3">
        © 2026 Good Patrone
      </div>
    </div>
  );
}

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      <aside className="hidden md:flex flex-shrink-0 bg-[#0f0f0f] border-r border-white/5 shadow-2xl z-20 flex-col">
        <Sidebar />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-[#0f0f0f] border-r border-white/5 shadow-2xl z-50 flex flex-col overflow-y-auto">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-[#0f0f0f] border-b border-white/5 z-30">
          <button onClick={() => setMobileOpen(true)} className="text-gray-400 hover:text-white p-1">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-950 border border-emerald-800/50 flex items-center justify-center">
              <Leaf size={12} className="text-emerald-400" strokeWidth={2} />
            </div>
            <span className="text-white font-black text-sm">Good Patrone</span>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
