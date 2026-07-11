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

interface GroupedPosts {
  [section: string]: Post[];
}

export default function WinemakingPage() {
  const [posts, setPosts] = useState<GroupedPosts>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        
        // Group posts by section
        const grouped: GroupedPosts = {};
        data.forEach((post: Post) => {
          if (!grouped[post.section]) {
            grouped[post.section] = [];
          }
          grouped[post.section].push(post);
        });
        
        setPosts(grouped);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const sectionNames: { [key: string]: string } = {
    'getting-started': 'Getting Started',
    'working-with-fruit': 'Working with Fruit',
    fermentation: 'Fermentation',
		'beyond-fruit-wines': 'Beyond Fruit Wines',
		'starting-points': 'Starting Points',
  };

  const sectionEmojis: { [key: string]: string } = {
    'getting-started': '🍇',
    'working-with-fruit': '🍑',
    fermentation: '🍾',
		'beyond-fruit-wines': '🌿',
		'starting-points': '🌸',
  };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="">
            <div style={{ textAlign: "center", margin: "2rem 0", display: "flex", flexFlow: "column", alignItems: "center" }}>
              <span className="hero-eyebrow">Winemaking Guides</span>
              <h1 className="hero-title">
                From Fruit to<br />
                <em>Finished Wine</em>
              </h1>
              <p className="hero-lead">
                A complete guide to wild fermentation, from selecting fruit to bottling. Learn the art and science of making wine at home.
              </p>
            </div>
						<div style={{ textAlign: "center", margin: "2rem 0"}}>
							<Link href={"/winemaking/brewing"}><span className="hero-eyebrow" style={{ margin: "0 2rem", background: "moccasin"}}>See What's Brewing</span></Link>
							{/* <Link href={"/winemaking/batches"}><span className="hero-eyebrow" style={{ margin: "0 2rem", background: "lightgreen"}}>Batch Log</span></Link> */}
						</div>
          </div>
        </div>
      </section>
			<section>

			</section>

      {/* CONTENT */}
      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <p>Loading guides...</p>
            </div>
          ) : Object.keys(posts).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <p>No guides available yet.</p>
            </div>
          ) : (
            <>
              {Object.entries(sectionNames)
                .filter(([key]) => posts[key])
                .map(([sectionKey, sectionName]) => (
                  <div key={sectionKey} className="section-group" style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      <span style={{ fontSize: '2rem' }}>
                        {sectionEmojis[sectionKey] || '📖'}
                      </span>
                      <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{sectionName}</h2>
                    </div>
                    
                    <div className="guides-grid">
                      {posts[sectionKey]
                        .sort((a, b) => a.order - b.order)
                        .map((post) => (
                          <article
                            key={post.slug}
                            className="guide-card"
                            style={{
                              padding: '1.5rem',
                              background: 'var(--milk-deep)',
                              border: '1px solid var(--chalk)',
                              borderRadius: '8px',
                              textDecoration: 'none',
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
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
                              href={`/winemaking/${sectionKey}/${post.slug}`}
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
                  </div>
                ))}
            </>
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

          .hero-title {
            font-size: 2rem;
          }

          .hero-lead {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
}
