import AdSlot from './AdSlot';
import Image from 'next/image';
import { Leaf } from 'lucide-react';

interface ToolWrapperProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  adSlot?: string;
  children: React.ReactNode;
}

export default function ToolWrapper({ title, subtitle, icon, adSlot, children }: ToolWrapperProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start p-4 md:p-6 pt-8 md:pt-10">
      <div className="absolute inset-0 z-0">
        <Image
          src="/jungle.png"
          alt=""                   // decorative — empty alt is correct
          fill
          className="object-cover opacity-20"
          priority                 // marks as LCP — preloads immediately
          fetchPriority="high"     // fetchpriority=high on the <img> tag
          quality={60}             // was 75 — drops ~30% size, no visible diff at 20% opacity
          sizes="100vw"            // tells browser full-width — picks correct srcset
        />
        <div className="absolute inset-0 bg-[#0a0a0a]" style={{ opacity: 0.82 }} />
      </div>

      <div className="relative z-10 w-full max-w-xl mb-4">
        <AdSlot format="banner" slot={adSlot ? `${adSlot}-top` : 'tool-top'} />
      </div>

      <div className="relative z-10 w-full max-w-xl mb-5">
        <div className="flex items-center gap-1.5 mb-2">
          <Leaf size={11} className="text-emerald-600" strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Good Patrone</span>
        </div>
        <div className="flex items-center gap-2.5">
          {icon && (
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight leading-none">{title}</h2>
            {subtitle && <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-5 md:p-7">
          {children}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-xl mt-4">
        <AdSlot format="banner" slot={adSlot ? `${adSlot}-bottom` : 'tool-bottom'} />
      </div>
    </div>
  );
}
