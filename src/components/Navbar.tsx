import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import { trackEvent } from '../utils/analytics';

interface NavbarProps {
  onPaymentLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, source: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onPaymentLinkClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Inside', href: '#what-is-inside' },
    { label: 'Discussions', href: '#discussions' },
    { label: 'Resources', href: '#resources' },
    { label: 'Tools', href: '#tools' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = (label: string) => {
    trackEvent(SITE_CONFIG.analytics.events.navSectionClick, { section: label });
    setMobileMenuOpen(false);
  };

  return (
    <header className="relative z-30 border-b border-white/[0.08] bg-[#070A0E]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element Brand Wordmark */}
        <a
          href="#"
          className="font-display text-base font-bold tracking-tight text-white sm:text-lg whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
        >
          {SITE_CONFIG.brand.name}
        </a>

        {/* Zone 2: 5 clean text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => handleNavClick(item.label)}
              className="py-1 text-slate-300 transition-colors duration-150 hover:text-white hover:underline hover:decoration-emerald-400/80 hover:underline-offset-8 whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2.5">
          <a
            href={SITE_CONFIG.links.PAYMENT_URL}
            onClick={(e) => onPaymentLinkClick(e, 'navbar_cta')}
            className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold tracking-tight text-slate-950 transition-transform duration-150 hover:bg-emerald-400 active:scale-[0.98] whitespace-nowrap shrink-0 sm:text-sm"
          >
            {SITE_CONFIG.pricing.navCtaText}
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-slate-200 transition-colors hover:bg-white/[0.06] md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-white/[0.08] bg-[#0B0F17] px-4 py-4 md:hidden">
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => handleNavClick(item.label)}
                className="flex min-h-[44px] items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/[0.04] hover:text-emerald-400"
              >
                <span>{item.label}</span>
                <span className="font-mono-tabular text-xs text-slate-500">→</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
