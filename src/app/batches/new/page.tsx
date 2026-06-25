'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

const TYPES = ['wine', 'kefir', 'sourdough', 'kombucha', 'other'] as const;

export default function NewBatchPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    type: 'wine',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
    gravity: '',
  });

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          gravity: form.gravity !== '' ? parseFloat(form.gravity) : null,
        }),
      });
      if (!res.ok) throw new Error('Failed to create batch');
      const batch = await res.json();
      router.push(`/batches/${batch.id}`);
    } catch {
      setError('Something went wrong. Please try again.');
      setSaving(false);
    }
  }

  return (
    <section className="section" style={{ paddingTop: '3rem' }}>
      <div className="container-prose">
        <Link href="/batches" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--moss)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2rem' }}>
          ← Back to batches
        </Link>

        <span className="hero-eyebrow">New Batch</span>
        <h1 className="hero-title" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '2.5rem' }}>
          Start a <em>Ferment</em>
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="field">
            <label className="field-label">Batch Name</label>
            <input
              className="field-input"
              type="text"
              placeholder="e.g. Blackberry Wine 2026"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="field-label">Type</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {TYPES.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set('type', t)}
                  style={{
                    padding: '0.5rem 1.1rem',
                    borderRadius: '9999px',
                    border: '1.5px solid',
                    borderColor: form.type === t ? 'var(--moss)' : 'var(--chalk)',
                    background: form.type === t ? 'var(--moss-light)' : '#fff',
                    color: form.type === t ? 'var(--moss)' : 'var(--stone)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: form.type === t ? 500 : 400,
                    cursor: 'pointer',
                    transition: 'all 150ms',
                    textTransform: 'capitalize',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="field-label">Start Date</label>
            <input
              className="field-input"
              type="date"
              value={form.startDate}
              onChange={e => set('startDate', e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="field-label">Original Gravity <span style={{ color: 'var(--pebble)', fontWeight: 400 }}>(optional)</span></label>
            <input
              className="field-input"
              type="number"
              step="0.001"
              min="0.900"
              max="1.200"
              placeholder="e.g. 1.052"
              value={form.gravity}
              onChange={e => set('gravity', e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field-label">Notes <span style={{ color: 'var(--pebble)', fontWeight: 400 }}>(optional)</span></label>
            <textarea
              className="field-input"
              placeholder="Recipe details, source of fruit, any initial observations..."
              rows={4}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          {error && <p style={{ color: '#c0392b', fontSize: '0.875rem' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-moss btn-md" disabled={saving}>
              {saving ? 'Creating...' : 'Create Batch'}
            </button>
            <Link href="/batches" className="btn btn-outline btn-md">Cancel</Link>
          </div>
        </form>
      </div>

      <style jsx>{`
        .field { display: flex; flex-direction: column; gap: 0.5rem; }
        .field-label {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--stone);
          font-weight: 500;
        }
        .field-input {
          padding: 0.65rem 0.9rem;
          border: 1.5px solid var(--chalk);
          border-radius: 8px;
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: var(--ink);
          background: #fff;
          outline: none;
          transition: border-color 150ms;
          width: 100%;
        }
        .field-input:focus { border-color: var(--moss); }
      `}</style>
    </section>
  );
}
