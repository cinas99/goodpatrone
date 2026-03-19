import type { Metadata } from 'next';
import CurrencyClient from './CurrencyClient';

export const metadata: Metadata = {
  title: 'Currency Converter – Live EUR, USD, GBP, JPY, CHF Rates',
  description: 'Free live currency converter. Convert between Euro, US Dollar, British Pound, Japanese Yen and Swiss Franc using real-time exchange rates.',
  keywords: ['currency converter', 'exchange rate', 'EUR USD', 'live currency', 'forex'],
  alternates: { canonical: 'https://goodpatrone.com/currency' },
  openGraph: {
    title: 'Currency Converter – Live Exchange Rates',
    description: 'Convert EUR, USD, GBP, JPY and CHF instantly with live rates.',
    url: 'https://goodpatrone.com/currency',
  },
};

export default function CurrencyPage() {
  return <CurrencyClient />;
}
