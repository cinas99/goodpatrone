import type { Metadata } from 'next';
import ElectricityClient from './ElectricityClient';

export const metadata: Metadata = {
  title: 'Electricity Bill Estimator – Calculate Your Monthly Energy Cost',
  description: 'Free online electricity bill calculator. Add your appliances, set wattage and daily hours, and instantly see your monthly kWh usage and estimated electricity cost.',
  keywords: ['electricity bill calculator', 'energy cost estimator', 'kWh calculator', 'monthly electricity cost', 'appliance energy usage'],
  alternates: { canonical: 'https://goodpatrone.com/electricity' },
  openGraph: {
    title: 'Electricity Bill Estimator – Monthly Energy Cost Calculator',
    description: 'Estimate your monthly electricity bill by appliance. Toggle devices on/off, adjust wattage and usage hours, and get a solar savings tip.',
    url: 'https://goodpatrone.com/electricity',
  },
};

export default function ElectricityPage() {
  return <ElectricityClient />;
}
