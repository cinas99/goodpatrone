import type { Metadata } from 'next';
import CountdownClient from './CountdownClient';

export const metadata: Metadata = {
  title: 'Online Countdown Timer – Custom Time & Presets with Sound',
  description: 'Free online countdown timer with preset durations (5, 10, 15, 30, 60 minutes) and custom time input. Includes bell, alarm and beep sound alerts.',
  keywords: ['countdown timer', 'online timer', 'kitchen timer', 'interval timer', 'free countdown'],
  alternates: { canonical: 'https://goodpatrone.com/countdown' },
  openGraph: {
    title: 'Online Countdown Timer with Sound – Free',
    description: 'Countdown timer with presets, custom time, and sound alerts (beeps, bell, alarm). Free, no signup.',
    url: 'https://goodpatrone.com/countdown',
  },
};

export default function CountdownPage() {
  return <CountdownClient />;
}
