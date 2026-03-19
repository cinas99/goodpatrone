export default function ToolWrapper({ title, subtitle, icon, children }: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  adSlot?: string;
}) {
  return (
    <div style={{ width: '100%', maxWidth: '780px', margin: '0 auto', padding: '56px 48px' }}>
      <div className="flex items-center gap-4 mb-2">
        {icon && (
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">{title}</h1>
          {subtitle && <p className="text-base text-zinc-400 mt-2">{subtitle}</p>}
        </div>
      </div>
      <div className="border-t border-zinc-800 mt-10 mb-12" />
      {children}
    </div>
  );
}
