import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-transparent mt-6">
      <div className="px-0 py-8">

        {/* Logo + tagline */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800/50 flex items-center justify-center flex-shrink-0">
            <Leaf size={13} className="text-emerald-400" strokeWidth={2} />
          </div>
          <div>
            <div className="text-white font-black text-sm leading-tight">Good Patrone</div>
            <div className="text-[10px] text-gray-700 leading-tight">Free online tools</div>
          </div>
        </div>

        <p className="text-xs text-gray-700 mb-8 leading-relaxed">
          A collection of free, fast, and privacy-friendly online tools.
          No signup, no tracking — just useful tools that work instantly in your browser.
        </p>

        {/* Links — fixed gap */}
        <div className="flex gap-12 mb-8">
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest mb-0.5">Tools</span>
            {[
              { href: '/bmi',       label: 'BMI Calculator' },
              { href: '/days',      label: 'Days Between'   },
              { href: '/stopwatch', label: 'Stopwatch'      },
              { href: '/countdown', label: 'Countdown'      },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="text-xs text-gray-600 hover:text-emerald-400 transition-colors whitespace-nowrap">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest mb-0.5">Company</span>
            {[
              { href: '/about',          label: 'About'          },
              { href: '/contact',        label: 'Contact'        },
              { href: '/privacy-policy', label: 'Privacy Policy' },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="text-xs text-gray-600 hover:text-emerald-400 transition-colors whitespace-nowrap">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-px bg-white/5 mb-4" />
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-700">
          <span>© 2026 Good Patrone. All rights reserved.</span>
          <div className="flex items-center gap-3">
            <Link href="/privacy-policy" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link href="/contact"        className="hover:text-gray-400 transition-colors">Contact</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
