import type { MetadataRoute } from 'next';
import { getAllPosts } from '../lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://goodpatrone.com';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                     lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/days`,           lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/stopwatch`,      lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/countdown`,      lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/bmi`,            lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/currency`,       lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    // { url: `${base}/water`,       lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    // { url: `${base}/electricity`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/about`,          lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`,        lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const posts = getAllPosts().map(post => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...posts];
}
