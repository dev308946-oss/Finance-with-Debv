import React, { useState } from 'react';
import { ArrowUpRight, ExternalLink, Check } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

interface HeroSectionProps {
  onPaymentLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, source: string) => void;
  onPremiumIpoClick: (e: React.MouseEvent<HTMLAnchorElement>, source: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onPaymentLinkClick,
  onPremiumIpoClick,
}) => {
  const [activeTab, setActiveTab] = useState<'brief' | 'ipo' | 'community'>('brief');
  const { dailyBriefSpotlight } = SITE_CONFIG.whatIsInside;

  return (
    <section className="relative overflow-hidden border-b border-white/[0.08] bg-market-grid pt-7 pb-14 sm:pt-14 sm:pb-22">
      {/* Subtle ambient radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[480px] w-full max-w-[1100px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_65%)]"
      />

      {/* Abstract background SVG chart curve */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 320"
        fill="none"
        className="pointer-events-none absolute right-0 bottom-0 left-0 -z-10 h-52 w-full opacity-25 sm:h-68"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="heroChartFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 260 C 180 245, 260 190, 420 205 C 580 220, 680 120, 860 135 C 990 145, 1090 65, 1200 40 L 1200 320 L 0 320 Z"
          fill="url(#heroChartFade)"
        />
        <path
          d="M0 260 C 180 245, 260 190, 420 205 C 580 220, 680 120, 860 135 C 990 145, 1090 65, 1200 40"
          stroke="#10B981"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
      </svg>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Primary Value Proposition */}
          <div className="lg:col-span-7">
            {/* Small brand text + Core positioning */}
            <div className="mb-3.5 flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 sm:text-sm">
              <span>{SITE_CONFIG.brand.upperName}</span>
              <span aria-hidden="true" className="text-slate-600">
                ·
              </span>
              <span className="font-medium tracking-normal text-slate-300">
                {SITE_CONFIG.brand.coreMessage}
              </span>
            </div>

            {/* Main Headline */}
            <h1
              className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[52px] lg:leading-[1.08]"
              style={{ textWrap: 'balance' }}
            >
              {SITE_CONFIG.hero.headline}
            </h1>

            {/* Supporting Text (Updated as requested) */}
            <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-200 sm:text-lg">
              {SITE_CONFIG.hero.subheadline}
            </p>

            {/* Above-the-fold Pricing Block */}
            <div className="mt-6 flex flex-wrap items-baseline gap-x-3.5 gap-y-1 border-l-2 border-emerald-500 pl-4">
              <span className="font-mono-tabular text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {SITE_CONFIG.pricing.formattedPrice}
              </span>
              <span aria-hidden="true" className="text-slate-600">
                ·
              </span>
              <span className="text-xs font-medium text-emerald-400 sm:text-sm">
                {SITE_CONFIG.pricing.heroSmallText}
              </span>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center sm:gap-4">
              <a
                href={SITE_CONFIG.links.PAYMENT_URL}
                onClick={(e) => onPaymentLinkClick(e, 'hero_primary_cta')}
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold tracking-tight text-slate-950 shadow-lg shadow-emerald-500/15 transition-all duration-150 hover:bg-emerald-400 active:scale-[0.99] whitespace-nowrap sm:text-base"
              >
                <span>{SITE_CONFIG.pricing.primaryCtaText}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0" />
              </a>

              <a
                href="#what-is-inside"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-[#10151E] px-5 py-3 text-sm font-semibold text-slate-200 transition-colors duration-150 hover:border-white/[0.22] hover:bg-[#161D29] hover:text-white whitespace-nowrap"
              >
                <span>{SITE_CONFIG.pricing.secondaryHeroCtaText}</span>
              </a>
            </div>

            {/* Broad Finance Topics Line (Clean Unboxed Typography) */}
            <div className="mt-7 border-t border-white/[0.07] pt-4">
              <p className="text-[11px] font-semibold tracking-wider text-slate-400">
                FINANCE + RESEARCH + LEARNING + COMMUNITY
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                {SITE_CONFIG.brand.topicsCovered.join('  ·  ')}
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Product & Community Preview */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/[0.09] bg-[#0D1219] p-5 sm:p-6">
              <div className="flex flex-col gap-3 border-b border-white/[0.07] pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium text-emerald-400">
                    {SITE_CONFIG.brand.communityName}
                  </p>
                  <h2 className="font-display text-sm font-bold text-white sm:text-base">
                    Daily Briefs, Tools & Community
                  </h2>
                </div>

                {/* Segmented Interactive Switcher */}
                <div
                  role="tablist"
                  aria-label="Community preview tabs"
                  className="inline-flex rounded-lg border border-white/[0.06] bg-[#070A0E] p-1"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'brief'}
                    onClick={() => setActiveTab('brief')}
                    className={`min-h-[34px] rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                      activeTab === 'brief'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Daily Brief
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'ipo'}
                    onClick={() => setActiveTab('ipo')}
                    className={`min-h-[34px] rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                      activeTab === 'ipo'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    IPO & Tools
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'community'}
                    onClick={() => setActiveTab('community')}
                    className={`min-h-[34px] rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                      activeTab === 'community'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Community
                  </button>
                </div>
              </div>

              {/* Tab 1: Daily Market Brief */}
              {activeTab === 'brief' && (
                <div className="mt-4 space-y-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono-tabular font-bold tracking-wider text-emerald-400">
                      {dailyBriefSpotlight.badge}
                    </span>
                    <span className="text-slate-400">Member Benefit 01</span>
                  </div>

                  <div>
                    <h3 className="font-display text-base font-bold text-white sm:text-lg">
                      {dailyBriefSpotlight.title}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-emerald-300/95">
                      {dailyBriefSpotlight.subtitle}
                    </p>
                  </div>

                  <ul className="grid grid-cols-1 gap-2 border-t border-b border-white/[0.07] py-3.5 sm:grid-cols-2">
                    {dailyBriefSpotlight.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2 text-xs text-slate-200"
                      >
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-0.5 text-xs">
                    <span className="text-slate-400">Concise & educational</span>
                    <a
                      href="#what-is-inside"
                      className="font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 whitespace-nowrap"
                    >
                      See All Benefits ↓
                    </a>
                  </div>
                </div>
              )}

              {/* Tab 2: IPO Research & Practice Tools */}
              {activeTab === 'ipo' && (
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-emerald-400">
                      IPO Research & Certification Practice
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300">
                      Basic IPO checking for everyone, with more detailed IPO analysis and practice banks available to community members.
                    </p>
                  </div>

                  <div className="space-y-2.5 border-t border-b border-white/[0.07] py-3.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Basic IPO Check</span>
                      <span className="font-mono-tabular text-slate-400">Free Public Access</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">
                        Premium IPO Analysis + Discussions
                      </span>
                      <span className="font-mono-tabular font-semibold text-emerald-400">
                        Community (₹199/mo)
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <a
                      href={SITE_CONFIG.links.FREE_IPO_TOOL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/[0.12] bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/[0.07] whitespace-nowrap"
                    >
                      <span>TRY FREE IPO CHECK</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                    <a
                      href={SITE_CONFIG.links.PREMIUM_IPO_TOOL_URL}
                      onClick={(e) => onPremiumIpoClick(e, 'hero_preview_premium_ipo')}
                      className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 whitespace-nowrap"
                    >
                      <span>Premium Access</span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  </div>
                </div>
              )}

              {/* Tab 3: Discussions, Resources & Community */}
              {activeTab === 'community' && (
                <div className="mt-4 space-y-3.5">
                  <div className="divide-y divide-white/[0.06]">
                    <div className="pb-3">
                      <p className="text-xs font-semibold text-emerald-400">
                        Market, Sector & Company Discussions
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-300">
                        Discuss market movements, companies, sectors and important financial developments.
                      </p>
                    </div>
                    <div className="py-3">
                      <p className="text-xs font-semibold text-white">
                        Finance Learning Resources
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-300">
                        Books, movies, articles, assignments and other curated finance resources.
                      </p>
                    </div>
                    <div className="pt-3">
                      <p className="text-xs font-semibold text-white">
                        Finance-Focused Community
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-300">
                        Connect with people interested in CFA, equity research, markets, valuation and finance careers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/[0.07] pt-3 text-xs">
                    <span className="text-slate-400">Educational & discussion-based</span>
                    <a
                      href="#community"
                      className="font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 whitespace-nowrap"
                    >
                      Explore Community ↓
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
