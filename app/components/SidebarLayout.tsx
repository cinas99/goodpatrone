'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Leaf, Home, Scale, CalendarDays, Timer, Clock as CountdownIcon,
  DollarSign, Menu, X,
  Info, Mail, ShieldCheck, BookOpen, Droplets, Zap,
} from 'lucide-react';
import Footer from './SiteFooter';

const tools = [
  { href: '/days',         label: 'Days Between',   Icon: CalendarDays  },
  { href: '/stopwatch',    label: 'Stopwatch',       Icon: Timer         },
  { href: '/countdown',    label: 'Countdown',       Icon: CountdownIcon },
  { href: '/bmi',          label: 'BMI Calculator',  Icon: Scale         },
  { href: '/currency',     label: 'Currency',        Icon: DollarSign    },
  { href: '/water',        label: 'Water Usage',     Icon: Droplets      },
  { href: '/electricity',  label: 'Electricity',     Icon: Zap           },
];

const pages = [
  { href: '/blog',           label: 'Blog',           Icon: BookOpen    },
  { href: '/about',          label: 'About',          Icon: Info        },
  { href: '/contact',        label: 'Contact',        Icon: Mail        },
  { href: '/privacy-policy', label: 'Privacy Policy', Icon: ShieldCheck },
];

function NavLink({ href, label, Icon, onClose }: {
  href: string; label: string; Icon: React.ElementType; onClose?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 text-sm transition-colors group"
    >
      <Icon size={15} className="flex-shrink-0 group-hover:text-emerald-400 transition-colors" strokeWidth={1.8} />
      {label}
    </Link>
  );
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex flex-col h-full px-3 py-5">

      {/* Logo */}
      <div className="flex items-center justify-between px-2 mb-5">
        <Link href="/" onClick={onClose} className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center group-hover:border-emerald-600 transition-colors">
            <Leaf size={13} className="text-emerald-400" strokeWidth={2} />
          </div>
          <span className="text-sm font-semibold text-white">Good Patrone</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-zinc-600 hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col flex-1 overflow-y-auto gap-px">
        <NavLink href="/" label="Dashboard" Icon={Home} onClose={onClose} />
        <NavLink href="/blog" label="Blog" Icon={BookOpen} onClose={onClose} />

        <p className="px-3 pt-4 pb-1 text-[10px] font-medium text-zinc-600 uppercase tracking-widest">Tools</p>
        {tools.map(({ href, label, Icon }) => (
          <NavLink key={href} href={href} label={label} Icon={Icon} onClose={onClose} />
        ))}

        <p className="px-3 pt-4 pb-1 text-[10px] font-medium text-zinc-600 uppercase tracking-widest">Info</p>
        {pages.filter(p => p.href !== '/blog').map(({ href, label, Icon }) => (
          <NavLink key={href} href={href} label={label} Icon={Icon} onClose={onClose} />
        ))}
      </nav>

      <div className="px-3 pt-4 mt-2 border-t border-zinc-800">
        <span className="text-xs text-zinc-700">© 2026 Good Patrone</span>
      </div>
    </div>
  );
}

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-shrink-0 w-56 bg-zinc-900 border-r border-zinc-800">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-56 bg-zinc-900 border-r border-zinc-800 z-10">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile topbar */}
        <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-zinc-900 border-b border-zinc-800">
          <button onClick={() => setMobileOpen(true)} className="text-zinc-400 hover:text-white">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Leaf size={13} className="text-emerald-400" strokeWidth={2} />
            <span className="text-white font-semibold text-sm">Good Patrone</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        <Footer />
      </div>

    </div>
  );
}
