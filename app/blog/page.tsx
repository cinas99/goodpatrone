import type { Metadata } from 'next';
import Link from 'next/link';
import ToolWrapper from '../components/ToolWrapper';
import { BookOpen } from 'lucide-react';
import { getAllPosts } from '../../lib/posts';

export const metadata: Metadata = {
  title: 'Blog – Good Patrone',
  description: 'Articles about time management, health metrics, fitness, and everyday tools.',
  alternates: { canonical: 'https://goodpatrone.com/blog' },
};

const CATEGORY_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  time:     { label: 'Time',     color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  health:   { label: 'Health',   color: 'text-rose-400',    bg: 'bg-rose-500/10'    },
  fitness:  { label: 'Fitness',  color: 'text-amber-400',   bg: 'bg-amber-500/10'   },
  currency: { label: 'Currency', color: 'text-blue-400',    bg: 'bg-blue-500/10'    },
  water:    { label: 'Water',    color: 'text-cyan-400',    bg: 'bg-cyan-500/10'    },
  energy:   { label: 'Energy',   color: 'text-yellow-400',  bg: 'bg-yellow-500/10'  },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogPage() {
  const posts = getAllPosts();
  const cat = CATEGORY_STYLES;

  return (
    <ToolWrapper
      title="Blog"
      subtitle="Tips, guides, and context behind the tools."
      icon={<BookOpen size={17} className="text-gray-400" />}
    >
      <div className="flex flex-col gap-5">
        {posts.map(post => {
          const c = cat[post.category] ?? { label: post.category, color: 'text-zinc-400', bg: 'bg-zinc-800' };
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-3 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-800/50 hover:bg-white/[0.06] transition-all duration-200"
            >
              <div className="flex items-center gap-2.5">
                <span className={`text-[11px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${c.color} ${c.bg}`}>
                  {c.label}
                </span>
                <span className="text-zinc-600 text-xs">{fmtDate(post.date)}</span>
              </div>
              <h2 className="text-white font-bold text-base leading-snug group-hover:text-emerald-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">{post.description}</p>
              <span className="text-xs text-emerald-600 group-hover:text-emerald-400 transition-colors mt-1">Read article →</span>
            </Link>
          );
        })}
      </div>
    </ToolWrapper>
  );
}
