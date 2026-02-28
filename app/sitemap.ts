import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://goodpatrone.com';
  return [
    { url: base,                  lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: `${base}/bmi`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/days`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/stopwatch`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/countdown`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];
}