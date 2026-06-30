'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Post {
  title: string;
  description: string;
  section: string;
  slug: string;
  order: number;
}

export default function SourdoughPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        const sourdough = (data as Post[])
          .filter((p) => p.section === 'sourdough')
          .sort((a, b) => a.order - b.order);
        setPosts(sourdough);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <span className="hero-eyebrow">Sourdough Guides</span>
              <h1 className="hero-title">
                From Starter to<br />
                <em>Finished Loaf</em>
              </h1>
              <p className="hero-lead">
                Everything you need to build a starter, keep it alive, and bake sourdough bread at home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <p>Loading guides...</p>
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <p>No guides available yet.</p>
            </div>
          ) : (
            <div className="guides-grid">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="guide-card"
                  style={{
                    padding: '1.5rem',
                    background: 'var(--milk-deep)',
                    border: '1px solid var(--chalk)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(74, 124, 89, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Link
                    href={`/sourdough/${post.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <h3 style={{ margin: '0 0 0.75rem 0', color: 'var(--moss)' }}>
                      {post.title}
                    </h3>
                    <p style={{ margin: 0, color: 'var(--stone)', fontSize: '0.95rem' }}>
                      {post.description}
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .section {
          padding: 2rem 0;
          background: var(--milk);
        }

        .guides-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .guides-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
