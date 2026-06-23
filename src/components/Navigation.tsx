'use client';

import Link from 'next/link';
import { COLORS } from '@/lib/colors';
import { MilkGlass } from '../../design/logo/page';

export function Navigation() {
  const navItems = [
    { label: 'Kefir', href: '/kefir' },
    { label: 'Sourdough', href: '/sourdough' },
    { label: 'Cider and Wines', href: '/winemaking' },
    { label: 'Batch Log', href: '/batches' },
  ];

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <MilkGlass size={48} color={COLORS.moss} />
          Fermented<em>WithLove</em>
        </Link>
        <ul className="nav-links">
          {navItems.map(item => (
            <li key={item.label}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
        {/* <Link href="/kefir" className="btn btn-moss btn-sm">
          Get Started
        </Link> */}
      </div>
    </nav>
  );
}
