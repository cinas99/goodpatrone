import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDir = path.join(process.cwd(), 'content/posts');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  description: string;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter(f => f.endsWith('.md'))
    .map(filename => {
      const slug = filename.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(postsDir, filename), 'utf8');
      const { data } = matter(raw);
      return { slug, ...(data as Omit<PostMeta, 'slug'>) };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): Post | null {
  const filePath = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  return { slug, content, ...(data as Omit<PostMeta, 'slug'>) };
}
