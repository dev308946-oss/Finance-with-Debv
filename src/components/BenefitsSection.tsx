import React, { useState } from 'react';
import { ChevronDown, ExternalLink, ArrowUpRight, Check } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

interface BenefitsSectionProps {
  onPremiumIpoClick: (e: React.MouseEvent<HTMLAnchorElement>, source: string) => void;
}

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({
  onPremiumIpoClick,
}) => {
  const {
    heading,
    subheading,
    dailyBriefSpotlight,
    orderedBenefits,
    ipoCard,
  } = SITE_CONFIG.whatIsInside;

  const [expandedNismId, setExpandedNismId] = useState<string>('nism-xv');

  const toggleNismItem = (id: string) => {
    setExpandedNismId((prev) => (prev === id ? '' : id));
  };

  return (
    <section
      id="what-is-inside"
      className="scroll-mt-16 border-b border-white/[0.08] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-emerald-400">
            WHAT&apos;S INSIDE THE COMMUNITY?
          </p>
          <h2
            className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            {heading}
          </h2>
          <p className="mt-2.5 text-base leading-relaxed text-slate-300 sm:text-lg">
            {subheading}
          </p>
        </div>

        {/* MAJOR BENEFIT SPOTLIGHT: 01 — DAILY MARKET BRIEF */}
        <article
          id="daily-market-brief"
          className="mt-10 rounded-2xl border-2 border-emerald-500/45 bg-[#0C141E] p-6 sm:p-8"
        >
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono-tabular font-bold tracking-wider text-emerald-400">
                  01 — DAILY MARKET BRIEF
                </span>
                <span aria-hidden="true" className="text-slate-600">
                  ·
                </span>
                <span className="font-mono-tabular font-bold tracking-wider text-emerald-300">
                  {dailyBriefSpotlight.badge}
                </span>
              </div>

              <h3 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {dailyBriefSpotlight.title}
              </h3>

              <p className="mt-2 font-display text-base font-semibold text-emerald-400 sm:text-lg">
                {dailyBriefSpotlight.subtitle}
              </p>

              <p className="mt-2.5 text-sm leading-relaxed text-slate-200 sm:text-base">
                {dailyBriefSpotlight.description}
              </p>

              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                {dailyBriefSpotlight.orderedSummary}
              </p>
            </div>

            <div className="border-t border-white/[0.08] pt-6 lg:col-span-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
              <p className="text-xs font-semibold tracking-wider text-slate-400">
                WHAT EACH BRIEF COVERS
              </p>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {dailyBriefSpotlight.bullets.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm font-medium text-white"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        {/* THE 6 ORDERED COMMUNITY BENEFITS (01 TO 06) */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {orderedBenefits.map((benefit, idx) => (
            <article
              key={benefit.index}
              className={`flex flex-col justify-between rounded-2xl border p-6 transition-colors duration-150 ${
                idx === 0
                  ? 'border-emerald-500/35 bg-[#0D1520]'
                  : 'border-white/[0.08] bg-[#0B0F16] hover:border-white/[0.16]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono-tabular font-bold tracking-wider text-emerald-400">
                    {benefit.index}
                  </span>
                  <span className="font-mono-tabular text-[11px] font-semibold tracking-wider text-slate-400">
                    {benefit.badge}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-white sm:text-xl">
                  {benefit.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {benefit.description}
                </p>
              </div>

              <div className="mt-5 border-t border-white/[0.06] pt-3">
                <a
                  href={benefit.anchor}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
                >
                  <span>Explore {benefit.title}</span>
                  <span>↓</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* INTERACTIVE DEEP-DIVE CARDS FOR 02 (IPO RESEARCH) & 05 (CERTIFICATION & PRACTICE TOOLS) */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* 02 — IPO RESEARCH & DISCUSSION ACTION CARD */}
          <article className="flex flex-col justify-between rounded-2xl border border-white/[0.09] bg-[#0B1018] p-6 sm:p-7 lg:col-span-6">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono-tabular font-semibold tracking-wider text-emerald-400">
                  02 — {ipoCard.category}
                </span>
                <span className="text-slate-400">Basic Free vs. Member Premium</span>
              </div>

              <h3 className="mt-2.5 font-display text-xl font-bold tracking-tight text-white">
                {ipoCard.title}
              </h3>

              <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                {ipoCard.summary}
              </p>

              <div className="mt-4 space-y-2.5 border-t border-b border-white/[0.08] py-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Basic IPO Check</span>
                  <span className="font-mono-tabular text-slate-400">Free for Everyone</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">
                    Detailed IPO Analysis & Discussions
                  </span>
                  <span className="font-mono-tabular font-semibold text-emerald-400">
                    Community Members
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={ipoCard.freeButtonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/[0.14] bg-white/[0.03] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-white/[0.08] whitespace-nowrap"
              >
                <span>{ipoCard.freeButtonText}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </a>

              <a
                href={ipoCard.premiumButtonUrl}
                onClick={(e) => onPremiumIpoClick(e, 'what_is_inside_ipo_card')}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-emerald-400 whitespace-nowrap"
              >
                <span>{ipoCard.premiumButtonText}</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
              </a>
            </div>
          </article>

          {/* 05 — CERTIFICATION & PRACTICE TOOLS EXPANDABLE PREVIEW */}
          <article className="flex flex-col justify-between rounded-2xl border border-white/[0.09] bg-[#0B1018] p-6 sm:p-7 lg:col-span-6">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono-tabular font-semibold tracking-wider text-emerald-400">
                  05 — CERTIFICATION & PRACTICE TOOLS
                </span>
                <span className="text-slate-400">Expandable Suite</span>
              </div>

              <h3 className="mt-2.5 font-display text-xl font-bold tracking-tight text-white">
                NISM & Finance Practice Modules
              </h3>

              <div className="mt-4 divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
                {SITE_CONFIG.nismCertifications.map((cert) => {
                  const isExpanded = expandedNismId === cert.id;
                  const isAvailable = cert.status === 'AVAILABLE';

                  return (
                    <div key={cert.id} className="py-2.5">
                      <button
                        type="button"
                        onClick={() => toggleNismItem(cert.id)}
                        aria-expanded={isExpanded}
                        className="flex min-h-[38px] w-full items-center justify-between gap-3 text-left"
                      >
                        <span className="font-display text-sm font-bold text-white">
                          {cert.title}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`font-mono-tabular text-[11px] font-semibold ${
                              isAvailable ? 'text-emerald-400' : 'text-slate-400'
                            }`}
                          >
                            {isAvailable
                              ? cert.comparisonBadge
                              : cert.status}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 text-slate-400 transition-transform duration-150 ${
                              isExpanded ? 'rotate-180 text-emerald-400' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="mt-2.5 flex flex-col gap-2.5 border-t border-white/[0.06] pt-2.5 text-xs sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-slate-300">{cert.description}</p>
                          {isAvailable && cert.freeUrl && (
                            <a
                              href={cert.freeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-[38px] shrink-0 items-center justify-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 whitespace-nowrap"
                            >
                              <span>{cert.freeCtaText}</span>
                              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
