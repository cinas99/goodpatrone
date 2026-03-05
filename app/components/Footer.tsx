import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0a]/60 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-10 py-3.5 flex flex-wrap items-center justify-between gap-3">

        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-950 border border-emerald-800/50 flex items-center justify-center flex-shrink-0">
            <Leaf size={10} className="text-emerald-400" strokeWidth={2} />
          </div>
          <span className="text-xs font-black text-gray-600">Good Patrone</span>
          <span className="text-xs text-gray-800">© 2026</span>
        </div>

        {/* All links inline */}
        <div className="flex items-center gap-4">
          <Link href="/bmi"          className="text-xs text-gray-700 hover:text-emerald-400 transition-colors">BMI</Link>
          <Link href="/days"         className="text-xs text-gray-700 hover:text-emerald-400 transition-colors">Days</Link>
          <Link href="/stopwatch"    className="text-xs text-gray-700 hover:text-emerald-400 transition-colors">Stopwatch</Link>
          <Link href="/countdown"    className="text-xs text-gray-700 hover:text-emerald-400 transition-colors">Countdown</Link>
          <div className="w-px h-3 bg-white/10" />
          <Link href="/about"          className="text-xs text-gray-700 hover:text-gray-400 transition-colors">About</Link>
          <Link href="/privacy-policy" className="text-xs text-gray-700 hover:text-gray-400 transition-colors">Privacy</Link>
          <Link href="/contact"        className="text-xs text-gray-700 hover:text-gray-400 transition-colors">Contact</Link>
        </div>

      </div>
    </footer>
  );
}
