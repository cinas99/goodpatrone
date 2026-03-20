import type { Metadata } from 'next';
import { BookOpen } from 'lucide-react';
import ToolWrapper from '../components/ToolWrapper';
import { getAllPosts } from '../../lib/posts';
import BlogList from './BlogList';

export const metadata: Metadata = {
  title: 'Blog – Good Patrone',
  description: 'Articles about time management, health metrics, fitness, and everyday tools.',
  alternates: { canonical: 'https://goodpatrone.com/blog' },
};

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <ToolWrapper
      title="Blog"
      subtitle="Tips, guides, and context behind the tools."
      icon={<BookOpen size={17} className="text-gray-400" />}
    >
      <BlogList posts={posts} />
    </ToolWrapper>
  );
}
