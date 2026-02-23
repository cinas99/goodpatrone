import type { Metadata } from 'next';
import StopwatchClient from './StopwatchClient';

export const metadata: Metadata = {
  title: 'Online Stopwatch with Lap Timer – Free Precision Timer',
  description: 'Free online stopwatch with lap tracking. Records split times, shows fastest and slowest laps, and calculates average lap time. No download needed.',
  keywords: ['online stopwatch', 'lap timer', 'split timer', 'free stopwatch', 'online timer'],
  alternates: { canonical: 'https://goodpatrone.com/stopwatch' },
  openGraph: {
    title: 'Online Stopwatch with Lap Timer – Free',
    description: 'Precise online stopwatch with lap tracking, split times, and fastest/slowest lap highlighting.',
    url: 'https://goodpatrone.com/stopwatch',
  },
};

export default function StopwatchPage() {
  return <StopwatchClient />;
}
