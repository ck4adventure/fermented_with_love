'use client';

import Link from 'next/link';
import { COLORS } from '@/lib/colors';
import { MilkGlass } from '../../design/logo/page';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div>
            <div className="footer-logo">
              <MilkGlass size={48} color={COLORS.moss} />
              Fermented<em>WithLove</em>
            </div>
            <p className="footer-tagline">A small guide to making kefir, sourdough & ferments at home.</p>
          </div>
          <div className="footer-links">
            {[
              { label: "Kefir", href: "/kefir" },
              { label: "Sourdough", href: "/sourdough" },
              { label: "Cider and Wines", href: "/winemaking" },
            ].map(l => (
              <Link key={l.label} href={l.href} className="footer-link">{l.label}</Link>
            ))}
          </div>
        </div>
        <div className="footer-copy">© 2026 fermentedwithlove.com — made with live cultures</div>
      </div>
    </footer>
  );
}
