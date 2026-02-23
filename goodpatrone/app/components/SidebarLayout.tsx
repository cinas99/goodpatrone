'use client';
import Link from 'next/link';
import { useState } from 'react';
import AdSlot from './AdSlot';
import {
  Leaf, Home, Scale, CalendarDays, Timer, Clock as CountdownIcon,
  TrendingUp, Triangle, Shuffle, DollarSign, Menu, X,
  Info, Mail, ShieldCheck,
} from 'lucide-react';

const tools = [
  { href: '/bmi',       label: 'BMI Calculator', Icon: Scale         },
  { href: '/days',      label: 'Days Between',   Icon: CalendarDays  },
  { href: '/stopwatch', label: 'Stopwatch',       Icon: Timer         },
  { href: '/countdown', label: 'Countdown',       Icon: CountdownIcon },
];

const comingSoon = [
  { label: 'Currency',         Icon: DollarSign },
  { label: 'Calories',         Icon: TrendingUp },
  { label: 'Geometry',         Icon: Triangle   },
  { label: 'Random Generator', Icon: Shuffle    },
];

const pages = [
  { href: '/about',          label: 'About',          Icon: Info        },
  { href: '/contact',        label: 'Contact',         Icon: Mail        },
  { href: '/privacy-policy', label: 'Privacy Policy',  Icon: ShieldCheck },
];

function NavLink({ href, label, Icon, onClose }: {
  href: string; label: string; Icon: any; onClose?: () => void;
}) {
  return (
    <Link href={href} onClick={onClose}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/6 text-sm font-medium group transition-all">
      <Icon size={15} className="group-hover:text-emerald-400 transition-colors flex-shrink-0" strokeWidth={1.8} />
      {label}
    </Link>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mt-4 mb-1 px-2">
      <div className="h-px flex-1 bg-white/10" />
      <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">{label}</span>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  );
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  return (
    <div className="w-60 flex flex-col py-6 px-3 h-full">

      {/* Logo */}
      <div className="flex items-center justify-between mb-8 px-2">

        <Link href="/" onClick={onClose} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800/50 flex items-center justify-center group-hover:border-emerald-600 transition-all flex-shrink-0">
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

      {/* Nav */}
      <nav className="flex flex-col flex-1 overflow-y-auto gap-0.5">

        <NavLink href="/" label="Dashboard" Icon={Home} onClose={onClose} />

        <SectionDivider label="Tools" />
        {tools.map(({ href, label, Icon }) => (
          <NavLink key={href} href={href} label={label} Icon={Icon} onClose={onClose} />
        ))}

        <div className="mt-3 mb-1 px-3">
          <span className="text-[9px] font-bold text-gray-800 uppercase tracking-widest">Coming soon</span>
        </div>
        {comingSoon.map(({ label, Icon }) => (
          <div key={label}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-800 text-sm cursor-not-allowed select-none">
            <Icon size={14} strokeWidth={1.5} className="flex-shrink-0" />
            {label}
          </div>
        ))}

        <SectionDivider label="Info" />
        {pages.map(({ href, label, Icon }) => (
          <NavLink key={href} href={href} label={label} Icon={Icon} onClose={onClose} />
        ))}

      </nav>

      {/* Ad */}
      <div className="mt-4">
        <AdSlot format="rectangle" slot="sidebar-left" />
      </div>

      {/* Footer */}
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

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-shrink-0 bg-[#0f0f0f] border-r border-white/5 shadow-2xl z-20 flex-col">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-[#0f0f0f] border-r border-white/5 shadow-2xl z-50 flex flex-col overflow-y-auto">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Mobile topbar */}
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

        <main className="flex-1 overflow-y-auto w-full">{children}</main>
      </div>

    </div>
  );
}
