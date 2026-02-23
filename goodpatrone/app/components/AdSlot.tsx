'use client';

interface AdSlotProps {
  slot?: string;
  format?: 'banner' | 'rectangle' | 'sidebar';
  className?: string;
}

const sizes = {
  banner:    'h-[90px] w-full',
  rectangle: 'h-[250px] w-full max-w-[300px] mx-auto',
  sidebar:   'h-[600px] w-full max-w-[160px]',
};

export default function AdSlot({ slot, format = 'banner', className = '' }: AdSlotProps) {
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    return (
      <div className={`${sizes[format]} flex items-center justify-center rounded-xl border border-dashed border-gray-800 bg-gray-900/30 text-gray-700 text-xs font-mono ${className}`}>
        📢 Ad – {format} {slot ? `[${slot}]` : ''}
      </div>
    );
  }
  return (
    <div className={`${sizes[format]} ${className}`}>
      <ins className="adsbygoogle" style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot ?? '0000000000'}
        data-ad-format="auto"
        data-full-width-responsive="true" />
    </div>
  );
}
