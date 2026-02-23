import type { Metadata } from 'next';
import ToolWrapper from '../components/ToolWrapper';
import { Leaf, Wrench, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About – Good Patrone',
  description: 'Good Patrone is a collection of free, fast, and privacy-friendly online tools. No signup, no tracking, no ads — just useful tools.',
  alternates: { canonical: 'https://goodpatrone.com/about' },
};

export default function AboutPage() {
  return (
    <ToolWrapper
      title="About"
      subtitle="What is Good Patrone?"
      icon={<Leaf size={17} className="text-emerald-400" />}
      adSlot="about"
    >
      <div className="space-y-6 text-sm text-gray-400 leading-relaxed">

        {/* What */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Wrench size={14} className="text-emerald-500" />
            <h2 className="text-white font-bold text-sm uppercase tracking-widest">What is this?</h2>
          </div>
          <p>
            Good Patrone is a free collection of everyday online tools — built to be fast,
            simple, and distraction-free. No signup required, no unnecessary data collected,
            no bloat. Just open the tool and use it.
          </p>
        </div>

        <div className="h-px bg-white/5" />

        {/* Tools */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Leaf size={14} className="text-emerald-500" />
            <h2 className="text-white font-bold text-sm uppercase tracking-widest">Available tools</h2>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: 'BMI Calculator',    desc: 'Calculate Body Mass Index with ideal weight — metric & imperial'  },
              { label: 'Days Between',      desc: 'Count days, weeks, months and hours between any two dates'        },
              { label: 'Stopwatch',         desc: 'Precise stopwatch with lap tracking and split time analysis'      },
              { label: 'Countdown Timer',   desc: 'Countdown with presets, custom time, and sound alerts'            },
            ].map(t => (
              <div key={t.label} className="flex flex-col p-3 bg-white/5 border border-white/8 rounded-xl">
                <span className="text-white font-bold text-xs">{t.label}</span>
                <span className="text-gray-600 text-xs mt-0.5">{t.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/5" />

        {/* Why */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Heart size={14} className="text-emerald-500" />
            <h2 className="text-white font-bold text-sm uppercase tracking-widest">Why we built it</h2>
          </div>
          <p>
            Most online tools are cluttered with ads, require accounts, or demand permissions
            they don't need. Good Patrone exists to offer a cleaner alternative — lightweight
            tools that work instantly in your browser, with no strings attached.
          </p>
        </div>

        <div className="h-px bg-white/5" />

        {/* Footer note */}
        <div className="flex items-center justify-between text-xs text-gray-700">
          <span>© 2026 Good Patrone</span>
          <a href="/privacy-policy" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
        </div>

      </div>
    </ToolWrapper>
  );
}
