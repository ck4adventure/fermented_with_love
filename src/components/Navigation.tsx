'use client';

import Link from 'next/link';
import { useState } from 'react';
import { COLORS } from '@/lib/colors';
import { MilkGlass } from '../../design/logo/page';

export function Navigation() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: 'Kefir', href: '/kefir' },
    { label: 'Sourdough', href: '/sourdough' },
    { label: 'Cider and Wines', href: '/winemaking' },
  ];
	//     { label: "What's Brewing", href: '/winemaking/brewing' },

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo" onClick={() => setOpen(false)}>
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

        <button
          className="nav-hamburger"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span className={`hamburger-bar ${open ? 'open' : ''}`} />
          <span className={`hamburger-bar ${open ? 'open' : ''}`} />
          <span className={`hamburger-bar ${open ? 'open' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="nav-mobile-menu">
          {navItems.map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="nav-mobile-link"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
