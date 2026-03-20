'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

function updateConsent(granted: boolean) {
  const state = granted ? 'granted' : 'denied';
  window.gtag?.('consent', 'update', {
    ad_storage:              state,
    analytics_storage:       state,
    ad_user_data:            state,
    ad_personalization:      state,
  });
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    updateConsent(true);
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    updateConsent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      <div className="w-full max-w-sm bg-zinc-900/95 border border-zinc-700 rounded-2xl p-7 shadow-2xl flex flex-col gap-5">

        {/* Icon + heading */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center">
            <Cookie size={22} className="text-emerald-400" strokeWidth={1.8} />
          </div>
          <h2 className="text-white text-lg font-bold">We use cookies</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            We use cookies to improve your experience and analyse site traffic.
            By clicking <strong className="text-white">Accept</strong> you consent to our use of cookies.
            You can also <strong className="text-white">Decline</strong> non-essential cookies.
          </p>
          <Link
            href="/privacy-policy"
            className="text-xs text-emerald-500 hover:text-emerald-400 underline underline-offset-2 transition-colors">
            Read our Privacy Policy
          </Link>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={decline}
            className="flex-1 px-4 py-3 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:border-zinc-500 hover:text-zinc-200 transition-all">
            Decline
          </button>
          <button
            onClick={accept}
            className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all">
            Accept all
          </button>
        </div>

      </div>
    </div>
  );
}
