'use client';

import Link from 'next/link';


/* ============================================================
   FERMENTED WITH LOVE — Landing Page (Next.js)
   ============================================================ */

/* ── Component ──────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      {/* HERO */}
      {/* <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <span className="hero-eyebrow">Live cultures · Probiotic · Home fermented</span>
              <h1 className="hero-title">
                Milk, grains,<br />
                <em>& a little patience.</em>
              </h1>
              <p className="hero-lead">
                Everything you need to culture your own kefir at home — from understanding the grains to your first perfect glass.
              </p>
              <div className="hero-actions">
                <Link href="/kefir" className="btn btn-moss btn-lg">Learn the Basics</Link>
                <Link href="/kefir/care" className="btn btn-outline btn-lg">Care Guide →</Link>
              </div>
              <div className="hero-stats">
                {[
                  { val: "24h", label: "Typical ferment time" },
                  { val: "30+", label: "Probiotic strains" },
                  { val: "∞",  label: "Reusable grains" },
                ].map(s => (
                  <div key={s.label}>
                    <div className="stat-val">{s.val}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero illustration — swap contents for <Image> */}
            {/* <div className="hero-img">
              <div className="kefir-scene">
                <div className="kefir-lid" />
                <div className="kefir-jar">
                  <div className="kefir-fill" />
                  <div className="kefir-grains">
                    {[...Array(5)].map((_, i) => <div key={i} className="grain" />)}
                  </div>
                  <div className="kefir-label-strip">
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.08em", color: "var(--moss)", textTransform: "uppercase" }}>milk kefir</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginTop: "0.75rem", transform: "rotate(-25deg)" }}>
                  <div style={{ width: 60, height: 5, background: "rgba(255,255,255,0.9)", border: "1px solid var(--chalk)", borderRadius: 9999 }} />
                  <div style={{ width: 28, height: 18, background: "rgba(255,255,255,0.9)", border: "1.5px solid var(--chalk)", borderRadius: "50%", marginTop: -3, boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }} />
                </div>
                <div className="scene-herbs">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="herb-sprig">
                      <div className="herb-leaf" style={{ transform: i % 2 === 0 ? "rotate(-10deg)" : "rotate(10deg)" }} />
                      <div className="herb-stem" />
                    </div>
                  ))}
                </div>
              </div>
              <span className="hero-img-caption">styled product shot · replace with photo</span>
            </div>
          </div>
        </div>
      </section> */} 

      {/* TEASER STRIP */}
      {/* <div className="teaser-strip">
        <div className="container">
          <div className="teaser-grid">
            {[
              { icon: "🌿", label: "Kefir",    sub: "Complete fermentation guide",    href: "/kefir" },
              { icon: "🍞", label: "Sourdough",      sub: "Coming soon",      href: "#" },
              { icon: "🍎", label: "Ciders & More",  sub: "Coming soon",      href: "#" },
            ].map(t => (
              <Link key={t.label} href={t.href} className="teaser-item">
                <span className="teaser-icon">{t.icon}</span>
                <div>
                  <div className="teaser-label">{t.label}</div>
                  <div className="teaser-sub">{t.sub}</div>
                </div>
                <span className="teaser-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div> */}

      {/* EXPLORE GUIDES */}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2 className="section-title">Fun With Fermentation</h2>
            <p className="section-lead">Choose a guide to learn about making, caring for, and enjoying fermented foods at home.</p>
          </div>

          <div className="guide-sections-grid">
            <Link href="/kefir" className="guide-card">
              <div className="guide-card-icon">🥛</div>
              <h3 className="guide-card-title">Milk Kefir</h3>
              <p className="guide-card-desc">A probiotic dairy beverage with 30+ beneficial strains. Learn to culture and care for living kefir grains.</p>
              <span className="guide-card-link">Explore →</span>
            </Link>

            <Link href="/sourdough" className="guide-card">
              <div className="guide-card-icon">🥖</div>
              <h3 className="guide-card-title">Sourdough</h3>
              <p className="guide-card-desc">Master the art of sourdough from starter to loaf with detailed step-by-step guides.</p>
              <span className="guide-card-link">Explore →</span>
            </Link>

            <Link href="/winemaking" className="guide-card">
              <div className="guide-card-icon">🍎</div>
              <h3 className="guide-card-title">Winemaking</h3>
              <p className="guide-card-desc">Master wild fermentation from fruit selection to bottling. Complete guide to making fruit wine at home.</p>
              <span className="guide-card-link">Explore →</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
