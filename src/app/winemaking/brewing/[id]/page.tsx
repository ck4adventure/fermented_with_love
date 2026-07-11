'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Batch, BatchEntry } from '@/db/schema';

const TYPE_EMOJI: Record<string, string> = {
  wine: '🍷', kefir: '🥛', sourdough: '🍞', kombucha: '🍵', other: '🫙',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'var(--moss)',
  paused: 'var(--fjord)',
  finished: 'var(--pebble)',
  abandoned: 'var(--stone)',
};

const VOLUME_UNIT_LABELS: Record<string, string> = {
  oz: 'fl oz', pint: 'pt', quart: 'qt', gallon: 'gal', ml: 'mL', liter: 'L',
};

export default function PublicBatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [entries, setEntries] = useState<BatchEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/batches/${id}`).then(async r => {
      if (!r.ok) {
        setLoading(false);
        return;
      }
      const [b, e] = await Promise.all([
        r.json(),
        fetch(`/api/public/batches/${id}/entries`).then(er => (er.ok ? er.json() : [])),
      ]);
      setBatch(b);
      setEntries(e);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--pebble)' }}>Loading...</div>
  );
  if (!batch) return (
    <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--stone)' }}>
      Batch not found. <Link href="/winemaking/brewing" style={{ color: 'var(--moss)' }}>Back to what&apos;s brewing</Link>
    </div>
  );

  const daysActive = Math.floor((Date.now() - new Date(batch.startDate).getTime()) / 86400000);

  return (
    <>
      <section style={{ paddingTop: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--chalk)', background: '#fff' }}>
        <div className="container">
          <Link href="/winemaking/brewing" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--moss)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
            ← What&apos;s brewing
          </Link>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <span style={{ fontSize: '3rem' }}>{TYPE_EMOJI[batch.type] ?? '🫙'}</span>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.3rem' }}>
                  {batch.name}
                </h1>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.08em', color: 'var(--pebble)', textTransform: 'uppercase' }}>
                  {batch.type} &middot; Started {new Date(batch.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} &middot; Day {daysActive}
                  {batch.volumeAmount != null && <> &middot; {batch.volumeAmount} {VOLUME_UNIT_LABELS[batch.volumeUnit ?? ''] ?? batch.volumeUnit}</>}
                </p>
              </div>
            </div>

            <span style={{
              padding: '0.5rem 0.9rem',
              borderRadius: '9999px',
              border: '1.5px solid var(--chalk)',
              background: 'var(--milk-deep)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: STATUS_COLORS[batch.status] ?? 'var(--stone)',
            }}>
              {batch.status}
            </span>
          </div>

          {batch.notes && (
            <p style={{ marginTop: '1.25rem', color: 'var(--stone)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '65ch', background: 'var(--milk-deep)', padding: '1rem 1.25rem', borderRadius: '8px', borderLeft: '3px solid var(--chalk)' }}>
              {batch.notes}
            </p>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: '2.5rem' }}>
        <div className="container" style={{ maxWidth: '740px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '1.5rem' }}>
            Log Entries <span style={{ color: 'var(--pebble)', fontWeight: 400, fontSize: '1rem' }}>({entries.length})</span>
          </h2>

          {entries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--pebble)' }}>
              <p>No entries yet.</p>
            </div>
          ) : (
            <div className="timeline">
              {entries.map((entry, i) => (
                <div key={entry.id} className="timeline-item">
                  <div className="timeline-dot" style={{ background: i === 0 ? 'var(--moss)' : 'var(--chalk)', border: `2px solid ${i === 0 ? 'var(--moss)' : 'var(--pebble)'}` }} />
                  <div className="timeline-card">
                    <p className="timeline-date">
                      {new Date(entry.entryDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p style={{ color: 'var(--ink)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: entry.actionTaken ? '0.75rem' : 0 }}>
                      {entry.observation}
                    </p>
                    {entry.actionTaken && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--moss)', fontWeight: 500, borderTop: '1px solid var(--chalk)', paddingTop: '0.6rem', marginTop: '0.6rem' }}>
                        Action: {entry.actionTaken}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .timeline { display: flex; flex-direction: column; gap: 0; }
        .timeline-item { display: flex; gap: 1rem; position: relative; padding-bottom: 1.5rem; }
        .timeline-item:last-child { padding-bottom: 0; }
        .timeline-item:not(:last-child)::before {
          content: '';
          position: absolute;
          left: 7px;
          top: 16px;
          bottom: 0;
          width: 2px;
          background: var(--chalk);
        }
        .timeline-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 4px;
        }
        .timeline-card {
          flex: 1;
          background: #fff;
          border: 1px solid var(--chalk);
          border-radius: 10px;
          padding: 1rem 1.25rem;
        }
        .timeline-date {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--pebble);
          margin-bottom: 0.5rem;
        }
      `}</style>
    </>
  );
}
