'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Batch } from '@/db/schema';

const TYPE_EMOJI: Record<string, string> = {
  wine: '🍷',
  kefir: '🥛',
  sourdough: '🍞',
  kombucha: '🍵',
  other: '🫙',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'var(--moss)',
  paused: 'var(--fjord)',
  finished: 'var(--pebble)',
  abandoned: 'var(--stone)',
};

export default function BatchesPage() {
  const router = useRouter();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/batches')
      .then(r => r.json())
      .then(setBatches)
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  const active = batches.filter(b => b.status === 'active');
  const inactive = batches.filter(b => b.status !== 'active');

  return (
    <>
      <section className="hero" style={{ paddingBottom: '3rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span className="hero-eyebrow">Batch Log</span>
              <h1 className="hero-title">
                Active <em>Ferments</em>
              </h1>
              <p className="hero-lead" style={{ marginBottom: 0 }}>
                Track what&apos;s bubbling, when you started, and what you&apos;ve noticed along the way.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button onClick={handleLogout} className="btn btn-sm" style={{ background: 'transparent', color: 'var(--pebble)', border: '1.5px solid var(--chalk)' }}>
                Sign out
              </button>
              <Link href="/batches/new" className="btn btn-moss btn-md">
                + New Batch
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          {loading ? (
            <p style={{ color: 'var(--pebble)', textAlign: 'center', padding: '4rem 0' }}>Loading batches...</p>
          ) : batches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🫙</p>
              <p style={{ color: 'var(--stone)', marginBottom: '1.5rem' }}>No batches yet. Start your first ferment!</p>
              <Link href="/batches/new" className="btn btn-moss btn-md">+ New Batch</Link>
            </div>
          ) : (
            <>
              {active.length > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1.25rem', color: 'var(--ink)' }}>
                    Active
                  </h2>
                  <div className="batch-grid">
                    {active.map(batch => <BatchCard key={batch.id} batch={batch} />)}
                  </div>
                </div>
              )}
              {inactive.length > 0 && (
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1.25rem', color: 'var(--stone)' }}>
                    Past Batches
                  </h2>
                  <div className="batch-grid">
                    {inactive.map(batch => <BatchCard key={batch.id} batch={batch} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <style jsx>{`
        .batch-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
        }
        @media (max-width: 600px) {
          .batch-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}

function BatchCard({ batch }: { batch: Batch }) {
  const daysActive = Math.floor(
    (Date.now() - new Date(batch.startDate).getTime()) / 86400000
  );

  return (
    <Link
      href={`/batches/${batch.id}`}
      style={{
        display: 'block',
        padding: '1.5rem',
        background: '#fff',
        border: '1px solid var(--chalk)',
        borderRadius: '14px',
        textDecoration: 'none',
        transition: 'all 200ms',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(74,124,89,0.10)';
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--moss)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = '';
        (e.currentTarget as HTMLElement).style.boxShadow = '';
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--chalk)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '1.75rem' }}>{TYPE_EMOJI[batch.type] ?? '🫙'}</span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: STATUS_COLORS[batch.status] ?? 'var(--stone)',
          background: 'var(--milk-deep)',
          padding: '0.2rem 0.6rem',
          borderRadius: '9999px',
        }}>
          {batch.status}
        </span>
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.4rem' }}>
        {batch.name}
      </h3>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.05em', color: 'var(--pebble)', marginBottom: '0.75rem' }}>
        {batch.type.toUpperCase()} &middot; Day {daysActive}
      </p>
      {batch.notes && (
        <p style={{ fontSize: '0.85rem', color: 'var(--stone)', lineHeight: 1.6, margin: 0,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
          {batch.notes}
        </p>
      )}
    </Link>
  );
}
