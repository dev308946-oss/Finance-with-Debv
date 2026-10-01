import React from 'react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

interface ToolsSectionProps {
  onPremiumIpoClick: (e: React.MouseEvent<HTMLAnchorElement>, source: string) => void;
}

export const ToolsSection: React.FC<ToolsSectionProps> = ({
  onPremiumIpoClick,
}) => {
  const { heading, basicIpoTool } = SITE_CONFIG.toolsSection;
  const certifications = SITE_CONFIG.nismCertifications;

  return (
    <section
      id="tools"
      className="scroll-mt-16 border-b border-white/[0.08] bg-[#06080C] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-emerald-400">
            RESEARCH & PRACTICE TOOLS
          </p>
          <h2
            className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            {heading}
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* TOOL 01 — BASIC IPO CHECK + PREMIUM IPO ANALYSIS */}
          <article className="flex flex-col justify-between rounded-2xl border border-emerald-500/30 bg-[#0C121B] p-6 sm:p-8 lg:col-span-6">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono-tabular font-semibold tracking-wider text-emerald-400">
                  {basicIpoTool.code}
                </span>
                <span className="font-mono-tabular font-semibold text-slate-300">
                  {basicIpoTool.badge} & {basicIpoTool.premiumBadge}
                </span>
              </div>

              {/* Part A: Basic IPO Check */}
              <div className="mt-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
                    {basicIpoTool.title}
                  </h3>
                  <span className="font-mono-tabular text-xs font-bold tracking-wider text-slate-300">
                    {basicIpoTool.badge}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                  {basicIpoTool.description}
                </p>
                <div className="mt-4">
                  <a
                    href={basicIpoTool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-white/[0.14] bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-white/[0.09] sm:w-auto whitespace-nowrap"
                  >
                    <span>{basicIpoTool.buttonText}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Divider */}
              <div className="my-6 border-t border-white/[0.09]" />

              {/* Part B: Premium IPO Analysis (Community) */}
              <div className="border-l-2 border-emerald-500 pl-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="font-display text-lg font-bold text-white sm:text-xl">
                    {basicIpoTool.premiumTitle}
                  </h4>
                  <span className="font-mono-tabular text-xs font-bold tracking-wider text-emerald-400">
                    {basicIpoTool.premiumBadge}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                  {basicIpoTool.premiumDescription}
                </p>
                <div className="mt-4">
                  <a
                    href={basicIpoTool.premiumUrl}
                    onClick={(e) => onPremiumIpoClick(e, 'tools_section_premium_ipo')}
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-emerald-400 sm:w-auto whitespace-nowrap"
                  >
                    <span>{basicIpoTool.premiumButtonText}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </article>

          {/* RIGHT COLUMN: EXPANDABLE / ADDABLE CERTIFICATION PRACTICE TOOLS */}
          <div className="flex flex-col gap-4 lg:col-span-6">
            {certifications.map((cert) => {
              const isAvailable = cert.status === 'AVAILABLE';
              return (
                <article
                  key={cert.id}
                  className="flex flex-col justify-between rounded-2xl border border-white/[0.09] bg-[#0B0F16] p-5 sm:p-6"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono-tabular font-semibold tracking-wider text-slate-400">
                        {cert.code}
                      </span>
                      <span
                        className={`font-mono-tabular text-xs font-bold tracking-wider ${
                          isAvailable ? 'text-emerald-400' : 'text-slate-400'
                        }`}
                      >
                        {isAvailable
                          ? cert.comparisonBadge
                          : cert.status}
                      </span>
                    </div>

                    <h3 className="mt-2 font-display text-base font-bold text-white sm:text-lg">
                      {cert.title}
                    </h3>

                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      {cert.description}
                    </p>
                  </div>

                  {isAvailable && cert.freeUrl && (
                    <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.07] pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <span className="font-mono-tabular text-xs font-semibold text-emerald-400">
                        {cert.comparisonBadge}
                      </span>

                      <a
                        href={cert.freeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500 hover:text-slate-950 whitespace-nowrap"
                      >
                        <span>{cert.freeCtaText}</span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      </a>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
