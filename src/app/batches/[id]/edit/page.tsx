'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Batch } from '@/db/schema';

const TYPES = ['wine', 'kefir', 'sourdough', 'kombucha', 'other'] as const;

export default function EditBatchPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', type: 'wine', notes: '' });

  useEffect(() => {
    fetch(`/api/batches/${id}`)
      .then(r => r.json())
      .then((b: Batch) => setForm({ name: b.name, type: b.type, notes: b.notes ?? '' }))
      .finally(() => setLoading(false));
  }, [id]);

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/batches/${id}`, {
        method: 'PATCH',
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

  if (loading) return <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--pebble)' }}>Loading...</div>;

  return (
    <section className="section" style={{ paddingTop: '3rem' }}>
      <div className="container-prose">
        <Link href={`/batches/${id}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--moss)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2rem' }}>
          ← Back to batch
        </Link>

        <span className="hero-eyebrow">Edit Batch</span>
        <h1 className="hero-title" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '2.5rem' }}>
          Update <em>Details</em>
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="field">
            <label className="field-label">Batch Name</label>
            <input className="field-input" type="text" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>

          <div className="field">
            <label className="field-label">Type</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {TYPES.map(t => (
                <button key={t} type="button" onClick={() => set('type', t)} style={{
                  padding: '0.5rem 1.1rem', borderRadius: '9999px', border: '1.5px solid',
                  borderColor: form.type === t ? 'var(--moss)' : 'var(--chalk)',
                  background: form.type === t ? 'var(--moss-light)' : '#fff',
                  color: form.type === t ? 'var(--moss)' : 'var(--stone)',
                  fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                  fontWeight: form.type === t ? 500 : 400, cursor: 'pointer',
                  transition: 'all 150ms', textTransform: 'capitalize',
                }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="field-label">Notes <span style={{ color: 'var(--pebble)', fontWeight: 400 }}>(optional)</span></label>
            <textarea className="field-input" rows={4} value={form.notes} onChange={e => set('notes', e.target.value)} style={{ resize: 'vertical' }} />
          </div>

          {error && <p style={{ color: '#c0392b', fontSize: '0.875rem' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-moss btn-md" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
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
