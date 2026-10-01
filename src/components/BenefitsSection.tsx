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
    ipoCard,
    nismCard,
    additionalOverviewCards,
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
            01. WHAT IS INSIDE?
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

        {/* 6 Cards Grid: Top 2 Flagship Cards (6 cols each) + 4 Core Pillars (3 cols each on xl, 6 on sm) */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* CARD 1: IPO RESEARCH */}
          <article className="flex flex-col justify-between rounded-2xl border border-emerald-500/25 bg-[#0D131C] p-6 sm:p-7 lg:col-span-6">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono-tabular font-semibold tracking-wider text-emerald-400">
                  01 · {ipoCard.category}
                </span>
                <span className="text-slate-400">Basic Free vs. Member Premium</span>
              </div>

              <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                {ipoCard.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {ipoCard.description}
              </p>

              {/* Clear Distinction Between Basic and Premium */}
              <div className="mt-5 space-y-3 border-t border-b border-white/[0.08] py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-slate-200">
                      BASIC VERSION · FREE
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                      {ipoCard.freeNote}
                    </p>
                  </div>
                  <span className="font-mono-tabular text-xs text-slate-400 shrink-0">
                    Public
                  </span>
                </div>

                <div className="border-t border-white/[0.06] pt-3 flex items-start justify-between gap-3">
                  <div className="border-l-2 border-emerald-500 pl-3">
                    <p className="text-xs font-bold tracking-wide text-emerald-400">
                      PREMIUM VERSION · COMMUNITY
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-200">
                      {ipoCard.premiumNote}
                    </p>
                  </div>
                  <span className="font-mono-tabular text-xs font-semibold text-emerald-400 shrink-0">
                    Included
                  </span>
                </div>
              </div>
            </div>

            {/* Two Required Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={ipoCard.freeButtonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/[0.14] bg-white/[0.03] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-white/[0.08] whitespace-nowrap"
              >
                <span>{ipoCard.freeButtonText}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </a>

              <a
                href={ipoCard.premiumButtonUrl}
                onClick={(e) => onPremiumIpoClick(e, 'what_is_inside_ipo_card')}
                className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-emerald-400 whitespace-nowrap"
              >
                <span>{ipoCard.premiumButtonText}</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
              </a>
            </div>
          </article>

          {/* CARD 2: NISM PRACTICE & CERTIFICATION PREP (Expandable Multi-Certification List) */}
          <article className="flex flex-col justify-between rounded-2xl border border-white/[0.1] bg-[#0B0F16] p-6 sm:p-7 lg:col-span-6">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono-tabular font-semibold tracking-wider text-emerald-400">
                  02 · {nismCard.category}
                </span>
                <span className="text-slate-400">Multi-Exam Architecture</span>
              </div>

              <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                {nismCard.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {nismCard.description}
              </p>

              {/* Expandable List of Available / Planned NISM Tools */}
              <div className="mt-5 divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
                {SITE_CONFIG.nismCertifications.map((cert) => {
                  const isExpanded = expandedNismId === cert.id;
                  const isAvailable = cert.status === 'AVAILABLE';

                  return (
                    <div key={cert.id} className="py-3">
                      <button
                        type="button"
                        onClick={() => toggleNismItem(cert.id)}
                        aria-expanded={isExpanded}
                        className="flex min-h-[40px] w-full items-center justify-between gap-3 text-left"
                      >
                        <div className="min-w-0">
                          <p className="font-display text-sm font-bold text-white sm:text-base">
                            {cert.title}
                          </p>
                          <p className="mt-0.5 font-mono-tabular text-[11px] text-slate-400">
                            {isAvailable
                              ? `Free: ${cert.freeTierLabel} · Community: ${cert.communityTierLabel}`
                              : `${cert.status} · ${cert.badge}`}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`font-mono-tabular text-[11px] font-semibold ${
                              isAvailable ? 'text-emerald-400' : 'text-slate-400'
                            }`}
                          >
                            {isAvailable ? 'Available' : 'Coming Soon'}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 text-slate-400 transition-transform duration-150 ${
                              isExpanded ? 'rotate-180 text-emerald-400' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="mt-3 space-y-3 border-t border-white/[0.06] pt-3 text-xs">
                          <p className="leading-relaxed text-slate-300">
                            {cert.description}
                          </p>

                          {isAvailable ? (
                            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                              <div className="space-y-0.5 font-mono-tabular text-xs">
                                <p className="text-slate-300">
                                  Free: <strong className="text-white">{cert.freeTierLabel}</strong>
                                </p>
                                <p className="text-emerald-400">
                                  Community: <strong>{cert.communityTierLabel}</strong>
                                </p>
                              </div>

                              {cert.freeUrl && (
                                <a
                                  href={cert.freeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500 hover:text-slate-950 whitespace-nowrap"
                                >
                                  <span>{cert.freeCtaText}</span>
                                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                </a>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-between text-xs text-slate-400">
                              <span>Status: Coming Soon</span>
                              <span className="font-mono-tabular font-semibold text-emerald-400/90">
                                {cert.badge}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Additional NISM certification banks will be unlocked inside the community as they launch.
            </p>
          </article>

          {/* CARDS 3, 4, 5, 6: BROADER COMMUNITY PILLARS */}
          {additionalOverviewCards.map((card, index) => (
            <article
              key={card.id}
              className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0B0F16] p-6 transition-colors duration-150 hover:border-white/[0.16] lg:col-span-3"
            >
              <div>
                <p className="font-mono-tabular text-xs font-semibold tracking-wider text-emerald-400">
                  0{index + 3} · {card.category}
                </p>

                <h3 className="mt-2.5 font-display text-lg font-bold text-white">
                  {card.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                  {card.description}
                </p>

                <ul className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-3.5">
                  {card.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-xs text-slate-300"
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 pt-2">
                <a
                  href={card.anchor}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
                >
                  <span>Explore details</span>
                  <span>↓</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
