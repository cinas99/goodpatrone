import type { Metadata } from 'next';
import BMIClient from './bmi-client';

export const metadata: Metadata = {
  title: 'BMI Calculator – Calculate Your Body Mass Index Free',
  description: 'Free online BMI calculator. Enter your height and weight to instantly calculate your Body Mass Index, ideal weight using the Devine formula, and health category.',
  keywords: ['BMI calculator', 'body mass index', 'ideal weight calculator', 'BMI chart', 'overweight calculator'],
  alternates: { canonical: 'https://goodpatrone.com/bmi' },
  openGraph: {
    title: 'BMI Calculator – Free Body Mass Index Tool',
    description: 'Calculate your BMI instantly. Supports metric and imperial units. Shows ideal weight and health category.',
    url: 'https://goodpatrone.com/bmi',
  },
};

export default function BMIPage() {
  return <BMIClient />;
}
