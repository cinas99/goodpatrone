'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PostMeta } from '../../lib/posts';

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

export default function BlogList({ posts }: { posts: PostMeta[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const visible = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  function goTo(n: number) {
    setPage(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="flex flex-col gap-5">
      {visible.map(post => {
        const c = CATEGORY_STYLES[post.category] ?? { label: post.category, color: 'text-zinc-400', bg: 'bg-zinc-800' };
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
          <button
            onClick={() => goTo(Math.max(1, page - 1))}
            disabled={page <= 1}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
              page <= 1
                ? 'border-zinc-800 text-zinc-700 cursor-not-allowed'
                : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
            }`}
          >
            <ChevronLeft size={15} />
            Previous
          </button>

          <span className="text-xs text-zinc-600 tabular-nums">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => goTo(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
              page >= totalPages
                ? 'border-zinc-800 text-zinc-700 cursor-not-allowed'
                : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
            }`}
          >
            Next
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
