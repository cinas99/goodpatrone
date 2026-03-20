import type { Metadata } from 'next';
import Link from 'next/link';
import ToolWrapper from '../components/ToolWrapper';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllPosts } from '../../lib/posts';

export const metadata: Metadata = {
  title: 'Blog – Good Patrone',
  description: 'Articles about time management, health metrics, fitness, and everyday tools.',
  alternates: { canonical: 'https://goodpatrone.com/blog' },
};

const POSTS_PER_PAGE = 5;

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

export default function BlogPage({ searchParams }: { searchParams: { page?: string } }) {
  const allPosts = getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const page = Math.min(Math.max(parseInt(searchParams.page ?? '1', 10) || 1, 1), totalPages);
  const posts = allPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <Link
              href={`/blog?page=${page - 1}`}
              aria-disabled={page <= 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                page <= 1
                  ? 'border-zinc-800 text-zinc-700 pointer-events-none'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
              }`}
            >
              <ChevronLeft size={15} />
              Previous
            </Link>

            <span className="text-xs text-zinc-600 tabular-nums">
              Page {page} of {totalPages}
            </span>

            <Link
              href={`/blog?page=${page + 1}`}
              aria-disabled={page >= totalPages}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                page >= totalPages
                  ? 'border-zinc-800 text-zinc-700 pointer-events-none'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
              }`}
            >
              Next
              <ChevronRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}
