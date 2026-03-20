import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ToolWrapper from '../../components/ToolWrapper';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { getAllPosts, getPost } from '../../../lib/posts';
import { marked } from 'marked';

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} – Good Patrone`,
    description: post.description,
    alternates: { canonical: `https://goodpatrone.com/blog/${slug}` },
  };
}

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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const html = await marked(post.content, { gfm: true });
  const c = CATEGORY_STYLES[post.category] ?? { label: post.category, color: 'text-zinc-400', bg: 'bg-zinc-800' };

  return (
    <ToolWrapper
      title={post.title}
      icon={<BookOpen size={17} className="text-gray-400" />}
    >
      {/* Back + meta */}
      <div className="flex items-center gap-3 mb-6 -mt-4">
        <Link
          href="/blog"
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft size={13} />
          All posts
        </Link>
        <span className="text-zinc-800">·</span>
        <span className={`text-[11px] font-semibold uppercase tracking-widest px-3.5 py-1 rounded-full ${c.color} ${c.bg}`}>
          {c.label}
        </span>
        <span className="text-zinc-600 text-xs">{fmtDate(post.date)}</span>
      </div>

      <div className="h-px bg-white/5 mb-8" />

      {/* Prose */}
      <div
        className="prose-blog max-w-2xl"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Back to all articles */}
      <div className="mt-12 pt-8 border-t border-zinc-800">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-sm font-semibold text-zinc-300 hover:border-emerald-600 hover:text-emerald-400 transition-all">
          <ArrowLeft size={15} strokeWidth={2} />
          All articles
        </Link>
      </div>
    </ToolWrapper>
  );
}
