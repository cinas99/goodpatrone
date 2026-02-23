import type { Metadata } from 'next';
import DaysClient from './DaysClient';

export const metadata: Metadata = {
  title: 'Days Between Dates Calculator – Count Days, Weeks & Months Free',
  description: 'Calculate the number of days, weeks, months and hours between any two dates. Free online date difference calculator with quick presets.',
  keywords: ['days between dates', 'date calculator', 'how many days', 'date difference calculator', 'days counter'],
  alternates: { canonical: 'https://goodpatrone.com/days' },
  openGraph: {
    title: 'Days Between Dates – Free Date Difference Calculator',
    description: 'Count days, weeks, months and hours between any two dates. Includes presets for common durations.',
    url: 'https://goodpatrone.com/days',
  },
};

export default function DaysPage() {
  return <DaysClient />;
}
