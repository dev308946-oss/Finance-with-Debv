import React from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

interface ComparisonSectionProps {
  onPaymentLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, source: string) => void;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  onPaymentLinkClick,
}) => {
  const { heading, freeTier, communityTier } = SITE_CONFIG.comparison;

  return (
    <section
      id="comparison"
      className="scroll-mt-16 border-b border-white/[0.08] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-emerald-400">
            FREE VS COMMUNITY
          </p>
          <h2
            className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            {heading}
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* LEFT: FREE */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0B0F16] p-6 sm:p-8 lg:col-span-5">
            <div>
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-xl font-bold tracking-tight text-slate-200">
                  {freeTier.title}
                </h3>
                <span className="font-mono-tabular text-lg font-semibold text-slate-400">
                  {freeTier.priceLabel}
                </span>
              </div>

              <div className="my-5 border-t border-white/[0.07]" />

              <ul className="space-y-3.5">
                {freeTier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border-t border-white/[0.06] pt-4 text-xs text-slate-500">
              Public starter resources
            </div>
          </div>

          {/* RIGHT: COMMUNITY — ₹199/MONTH (Prominent) */}
          <div className="relative flex flex-col justify-between rounded-2xl border-2 border-emerald-500/60 bg-[#0D151F] p-6 sm:p-8 lg:col-span-7">
            <div>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-mono-tabular font-bold tracking-wider text-emerald-400">
                  {communityTier.badge}
                </span>
                <span className="text-slate-400">
                  {SITE_CONFIG.pricing.heroSmallText}
                </span>
              </div>

              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  {communityTier.title}
                </h3>
                <span className="font-mono-tabular text-xl font-bold text-emerald-400 sm:text-2xl">
                  {communityTier.priceLabel}
                </span>
              </div>

              <div className="my-5 border-t border-white/[0.1]" />

              <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {communityTier.features.map((feature) => {
                  const isHighlighted =
                    feature === communityTier.highlightedFeature;
                  return (
                    <li
                      key={feature}
                      className={`flex items-start gap-3 text-sm ${
                        isHighlighted
                          ? 'sm:col-span-2 rounded-xl border border-emerald-500/35 bg-emerald-500/10 p-3 font-bold text-emerald-300'
                          : 'font-medium text-white'
                      }`}
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
                        <span>{feature}</span>
                        {isHighlighted && (
                          <span className="font-mono-tabular text-[11px] font-bold tracking-wider text-emerald-400">
                            EVERY MARKET DAY
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.1] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-slate-300">
                Full community, daily briefs, tools & resource access
              </span>
              <a
                href={SITE_CONFIG.links.PAYMENT_URL}
                onClick={(e) => onPaymentLinkClick(e, 'comparison_section_cta')}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition-colors hover:bg-emerald-400 whitespace-nowrap"
              >
                <span>{SITE_CONFIG.pricing.primaryCtaText}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
