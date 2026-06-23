'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewEntryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    entryDate: new Date().toISOString().split('T')[0],
    observation: '',
    actionTaken: '',
  });

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/batches/${id}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      router.push(`/batches/${id}`);
    } catch {
      setError('Something went wrong. Please try again.');
      setSaving(false);
    }
  }

  return (
    <section className="section" style={{ paddingTop: '3rem' }}>
      <div className="container-prose">
        <Link href={`/batches/${id}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--moss)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2rem' }}>
          ← Back to batch
        </Link>

        <span className="hero-eyebrow">Log Entry</span>
        <h1 className="hero-title" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '2.5rem' }}>
          Record an <em>Observation</em>
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="field">
            <label className="field-label">Date</label>
            <input className="field-input" type="date" value={form.entryDate} onChange={e => set('entryDate', e.target.value)} required />
          </div>

          <div className="field">
            <label className="field-label">Observation</label>
            <textarea
              className="field-input"
              placeholder="What do you notice? Color, smell, bubbling activity, clarity, taste..."
              rows={5}
              value={form.observation}
              onChange={e => set('observation', e.target.value)}
              required
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="field">
            <label className="field-label">Action Taken <span style={{ color: 'var(--pebble)', fontWeight: 400 }}>(optional)</span></label>
            <input
              className="field-input"
              type="text"
              placeholder="e.g. Racked to secondary, added pectic enzyme, tasted and adjusted..."
              value={form.actionTaken}
              onChange={e => set('actionTaken', e.target.value)}
            />
          </div>

          {error && <p style={{ color: '#c0392b', fontSize: '0.875rem' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-moss btn-md" disabled={saving}>{saving ? 'Saving...' : 'Save Entry'}</button>
            <Link href={`/batches/${id}`} className="btn btn-outline btn-md">Cancel</Link>
          </div>
        </form>
      </div>

      <style jsx>{`
        .field { display: flex; flex-direction: column; gap: 0.5rem; }
        .field-label { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--stone); font-weight: 500; }
        .field-input { padding: 0.65rem 0.9rem; border: 1.5px solid var(--chalk); border-radius: 8px; font-family: var(--font-body); font-size: 0.95rem; color: var(--ink); background: #fff; outline: none; transition: border-color 150ms; width: 100%; }
        .field-input:focus { border-color: var(--moss); }
      `}</style>
    </section>
  );
}
