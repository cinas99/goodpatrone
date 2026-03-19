import type { Metadata } from 'next';
import WaterClient from './WaterClient';

export const metadata: Metadata = {
  title: 'Water Usage Calculator – Estimate Your Daily Water Consumption',
  description: 'Free online water usage calculator. Enter your daily fixtures and habits to estimate your water consumption and monthly water bill.',
  keywords: ['water usage calculator', 'water consumption', 'water bill estimator', 'household water usage', 'water cost calculator'],
  alternates: { canonical: 'https://goodpatrone.com/water' },
  openGraph: {
    title: 'Water Usage Calculator – Estimate Your Monthly Water Bill',
    description: 'Calculate your household water usage and monthly bill. Track showers, toilet flushes, washing machine, and more.',
    url: 'https://goodpatrone.com/water',
  },
};

export default function WaterPage() {
  return <WaterClient />;
}
