'use client';
import { useState, useEffect, useCallback } from 'react';
import ToolWrapper from '../components/ToolWrapper';
import { DollarSign, RefreshCw, ArrowRightLeft } from 'lucide-react';

const CURRENCIES = ['EUR', 'USD', 'GBP', 'JPY', 'CHF'] as const;
type Currency = typeof CURRENCIES[number];

const SYMBOLS: Record<Currency, string> = {
  EUR: '€', USD: '$', GBP: '£', JPY: '¥', CHF: 'Fr',
};

const FLAGS: Record<Currency, string> = {
  EUR: '🇪🇺', USD: '🇺🇸', GBP: '🇬🇧', JPY: '🇯🇵', CHF: '🇨🇭',
};

const NAMES: Record<Currency, string> = {
  EUR: 'Euro', USD: 'US Dollar', GBP: 'British Pound', JPY: 'Japanese Yen', CHF: 'Swiss Franc',
};

export default function CurrencyClient() {
  const [base,      setBase]      = useState<Currency>('EUR');
  const [amount,    setAmount]    = useState('1');
  const [rates,     setRates]     = useState<Partial<Record<Currency, number>>>({});
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(false);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const targets = CURRENCIES.filter(c => c !== base).join(',');
      const res = await fetch(`https://api.frankfurter.app/latest?from=${base}&to=${targets}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      // include base itself as 1
      const full: Partial<Record<Currency, number>> = { [base]: 1 };
      for (const [k, v] of Object.entries(data.rates)) {
        full[k as Currency] = v as number;
      }
      setRates(full);
      setUpdatedAt(data.date);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [base]);

  useEffect(() => { fetchRates(); }, [fetchRates]);

  const num = parseFloat(amount) || 0;

  const switchBase = (c: Currency) => {
    setBase(c);
  };

  return (
    <ToolWrapper
      title="Currency"
      subtitle="Live exchange rates — EUR, USD, GBP, JPY, CHF"
      icon={<DollarSign size={17} className="text-gray-400" />}
      adSlot="currency"
    >
      <div className="space-y-8">

        {/* Base currency selector */}
        <div className="space-y-3">
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-medium">Base currency</p>
          <div className="flex flex-wrap gap-2">
            {CURRENCIES.map(c => (
              <button key={c} onClick={() => switchBase(c)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all active:scale-95 ${
                  base === c
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-950/30'
                    : 'border-zinc-700 text-zinc-300 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-950/30'
                }`}>
                <span>{FLAGS[c]}</span>
                <span>{c}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Amount input */}
        <div className="space-y-2">
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-medium">Amount</p>
          <div className="relative w-65">
            <input
              type="number"
              min={0}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full pl-4 pr-14 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-lg font-bold tabular-nums focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="1"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base font-semibold text-zinc-500 pointer-events-none ml-2">
              {SYMBOLS[base]}
            </span>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500 uppercase tracking-widest font-medium">Conversions</p>
            <div className="flex items-center gap-3">
              {updatedAt && (
                <span className="text-xs text-zinc-600">Updated {updatedAt}</span>
              )}
              <button onClick={fetchRates} disabled={loading}
                className="flex items-center gap-1.5 text-xs text-emerald-500 hover:text-emerald-400 font-semibold transition-colors disabled:opacity-40">
                <RefreshCw size={12} strokeWidth={2} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 py-4 text-center">Could not fetch rates. Check your connection and refresh.</p>
          )}

          {!error && (
            <div className="space-y-2">
              {CURRENCIES.filter(c => c !== base).map(c => {
                const rate = rates[c];
                const converted = rate !== undefined ? num * rate : null;
                return (
                  <div key={c}
                    className="flex items-center justify-between px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-600 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{FLAGS[c]}</span>
                      <div>
                        <p className="text-sm font-semibold text-white">{c}</p>
                        <p className="text-xs text-zinc-500">{NAMES[c]}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {converted !== null ? (
                        <>
                          <p className="text-2xl font-black tabular-nums text-white">
                            {c === 'JPY'
                              ? Math.round(converted).toLocaleString()
                              : converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {SYMBOLS[c]}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            1 {base} = {c === 'JPY'
                              ? rate!.toFixed(2)
                              : rate!.toFixed(4)} {SYMBOLS[c]}
                          </p>
                        </>
                      ) : (
                        <div className="h-8 w-24 bg-zinc-800 rounded-lg animate-pulse" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Swap hint */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 pt-2 border-t border-zinc-800">
          <ArrowRightLeft size={12} strokeWidth={2} />
          <span>Click any base currency above to switch and recalculate instantly.</span>
        </div>

      </div>
    </ToolWrapper>
  );
}
