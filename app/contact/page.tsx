import type { Metadata } from 'next';
import ToolWrapper from '../components/ToolWrapper';
import { Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact – Good Patrone',
  description: 'Get in touch with the Good Patrone team. We welcome feedback, bug reports, and tool suggestions.',
  alternates: { canonical: 'https://goodpatrone.com/contact' },
};

export default function ContactPage() {
  return (
    <ToolWrapper
      title="Contact"
      subtitle="We'd love to hear from you"
      icon={<Mail size={17} className="text-gray-400" />}
      adSlot="contact"
    >
      <div className="space-y-5 text-sm text-gray-400">

        <p className="leading-relaxed">
          Have a bug to report, a tool to suggest, or just want to say hello?
          Drop us an email — we read every message.
        </p>

        <div className="p-3 bg-emerald-950/30 border border-emerald-800/50 rounded-xl">
          <p className="text-xs text-emerald-400 uppercase tracking-widest font-medium mb-1">Recently added</p>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Currency Converter · Water Usage Calculator · Electricity Bill Estimator
          </p>
        </div>

        {/* Email */}
        <a href="mailto:maichejn@gmail.com"
          className="flex items-center gap-3 p-4 bg-white/5 border border-white/8 hover:border-emerald-700/50 hover:bg-white/10 rounded-xl transition-all group">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center group-hover:border-emerald-700/50 transition-all flex-shrink-0">
            <Mail size={16} className="text-gray-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">maichejn@gmail.com</div>
            <div className="text-gray-600 text-xs">We typically reply within 48 hours</div>
          </div>
        </a>

        <div className="h-px bg-white/5" />

        {/* What to write about */}
        <div>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-3">You can reach us about</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { icon: '🐛', label: 'Bug reports',       desc: 'Something broken or not working as expected'  },
              { icon: '💡', label: 'Tool suggestions',  desc: 'Have an idea for a new tool? Tell us!'         },
              { icon: '🤝', label: 'Partnerships',      desc: 'Collaboration or business enquiries'           },
              { icon: '💬', label: 'General feedback',  desc: 'Anything else on your mind'                    },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 p-3 bg-white/5 border border-white/8 rounded-xl">
                <span className="text-base">{item.icon}</span>
                <div>
                  <div className="text-white font-bold text-xs">{item.label}</div>
                  <div className="text-gray-600 text-xs">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/5" />

        <p className="text-xs text-gray-700 text-center">
          © 2026 Good Patrone ·{' '}
          <a href="/privacy-policy" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
        </p>

      </div>
    </ToolWrapper>
  );
}
