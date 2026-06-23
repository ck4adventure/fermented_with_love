'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import MDXContent from '@/components/MDXContent';

interface PostData {
  title: string;
  description: string;
  section: string;
  slug: string;
  order: number;
  tags: string[];
  lastUpdated: string;
  content: string;
}

const sectionNames: { [key: string]: string } = {
  'getting-started': 'Getting Started',
  'working-with-fruit': 'Working with Fruit',
  fermentation: 'Fermentation',
};

export default function PostPage() {
  const params = useParams();
  const section = params.section as string;
  const slug = params.slug as string;
  
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${section}/${slug}`);
        if (!res.ok) {
          throw new Error('Post not found');
        }
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [section, slug]);

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h1>Post not found</h1>
        <p>{error}</p>
        <Link href="/winemaking" style={{ color: 'var(--moss)' }}>
          ← Back to Winemaking
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumbs */}
      <div style={{ padding: '1.5rem', background: 'var(--milk-deep)', borderBottom: '1px solid var(--chalk)' }}>
        <div className="container">
          <nav style={{ fontSize: '0.95rem', color: 'var(--stone)' }}>
            <Link href="/" style={{ color: 'var(--moss)', textDecoration: 'none' }}>
              Home
            </Link>
            {' > '}
            <Link href="/winemaking" style={{ color: 'var(--moss)', textDecoration: 'none' }}>
              Winemaking
            </Link>
            {' > '}
            <span>{sectionNames[section] || section}</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <article style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ margin: '0 0 0.5rem 0', color: 'var(--ink)' }}>{post.title}</h1>
          <p style={{ margin: '0', color: 'var(--stone)', fontSize: '1rem' }}>
            {post.description}
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {post.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '0.25rem 0.75rem',
                  background: 'var(--moss-light)',
                  color: 'var(--moss)',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <p style={{ marginTop: '1rem', color: 'var(--pebble)', fontSize: '0.9rem' }}>
            Last updated: {new Date(post.lastUpdated).toLocaleDateString()}
          </p>
        </header>

        <div style={{ marginBottom: '3rem', lineHeight: '1.8' }}>
          <MDXContent content={post.content} />
        </div>

        {/* Navigation */}
        <div
          style={{
            padding: '1.5rem',
            background: 'var(--milk-deep)',
            borderRadius: '8px',
            marginTop: '3rem',
            textAlign: 'center',
          }}
        >
          <Link href="/winemaking" style={{ color: 'var(--moss)', fontWeight: '500' }}>
            ← Back to all guides
          </Link>
        </div>
      </article>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
      `}</style>
    </>
  );
}
