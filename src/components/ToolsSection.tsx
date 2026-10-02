import React from 'react';
import { motion } from 'motion/react';
import {
  Newspaper,
  BarChart3,
  BrainCircuit,
  TrendingUp,
  ExternalLink,
  FileText,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import { trackEvent } from '../utils/analytics';

interface ToolsSectionProps {
  onViewClosingBellSample: () => void;
}

export const ToolsSection: React.FC<ToolsSectionProps> = ({
  onViewClosingBellSample,
}) => {
  const {
    heading,
    subtitle,
    closingBell,
    ipoCheck,
    nismSeriesXv,
    nismSeriesViii,
  } = SITE_CONFIG.realProductsSection;

  const handleSampleClick = () => {
    trackEvent(SITE_CONFIG.analytics.events.closingBellSampleClick);
    onViewClosingBellSample();
  };

  return (
    <section
      id="real-products"
      className="scroll-mt-16 border-b border-[#1B2735] bg-[#0A1018] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl"
        >
          <p className="font-mono-tabular text-[11px] font-semibold tracking-[0.14em] uppercase text-[#19D3A2] sm:text-[12px]">
            CORE PRODUCTS
          </p>
          <h2
            className="mt-2 font-display text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-[#F5F7FA] sm:text-[34px] lg:text-[36px]"
            style={{ textWrap: 'balance' }}
          >
            {heading}
          </h2>
          <p className="mt-2.5 text-[15px] leading-[1.65] text-[#8D99A8] sm:text-[16px]">
            {subtitle}
          </p>
        </motion.div>

        {/* FOCAL HERO PRODUCT: THE CLOSING BELL (LARGE PUBLICATION PREVIEW) */}
        <motion.article
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
          className="card-elevate mt-10 rounded-[18px] border border-[#19D3A2]/35 bg-[#0D141D] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10"
        >
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left Column: Editorial Product Positioning (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#19D3A2]/30 bg-[#19D3A2]/10 text-[#19D3A2]">
                  <Newspaper className="h-4 w-4" />
                </div>
                <span className="font-mono-tabular text-[11px] font-bold tracking-[0.14em] uppercase text-[#19D3A2]">
                  DAILY MARKET BRIEF
                </span>
                <span aria-hidden="true" className="text-[#1B2735]">
                  •
                </span>
                <span className="font-mono-tabular text-[11px] font-medium text-[#8D99A8]">
                  Every Market Day
                </span>
              </div>

              <h3 className="mt-4 font-display text-[26px] font-bold tracking-[-0.02em] text-[#F5F7FA] sm:text-[32px]">
                {closingBell.name}
              </h3>

              <p className="mt-1.5 text-[15px] font-semibold text-[#19D3A2]">
                {closingBell.tagline}
              </p>

              <p className="mt-3.5 text-[15px] leading-[1.65] text-[#F5F7FA]/90">
                {closingBell.description}
              </p>

              <p className="mt-2.5 text-[14px] leading-[1.6] text-[#8D99A8]">
                {closingBell.supportingCopy}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSampleClick}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[12px] bg-[#16E0A5] px-6 py-3 text-[14px] font-bold tracking-tight text-[#070B12] shadow-[0_0_24px_rgba(22,224,165,0.16)] transition-all duration-150 hover:bg-[#19D3A2] hover:shadow-[0_0_30px_rgba(22,224,165,0.26)] active:scale-[0.99] whitespace-nowrap"
                >
                  <FileText className="h-4 w-4 shrink-0" />
                  <span>{closingBell.ctaText}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Realistic Financial Publication / PDF Report Preview (7 Cols) */}
            <div className="lg:col-span-7">
              <div
                onClick={handleSampleClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSampleClick();
                  }
                }}
                aria-label="Preview The Closing Bell daily market brief document"
                className="group cursor-pointer overflow-hidden rounded-[14px] border border-[#1B2735] bg-[#070B12] transition-colors hover:border-[#19D3A2]/45"
              >
                {/* Top PDF Viewer Bar */}
                <div className="flex items-center justify-between border-b border-[#1B2735] bg-[#0A1018] px-4 py-2.5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#19D3A2]" />
                    <span className="font-mono-tabular font-semibold text-[#F5F7FA]">
                      The_Closing_Bell_Daily_Brief.pdf
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-mono-tabular font-semibold text-[#19D3A2] group-hover:underline">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Open Report Preview</span>
                  </span>
                </div>

                {/* Publication Page Sheet */}
                <div className="p-5 sm:p-6">
                  {/* Publication Masthead */}
                  <div className="border-b-2 border-[#19D3A2]/40 pb-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-mono-tabular text-[10px] font-semibold tracking-[0.16em] uppercase text-[#19D3A2]">
                        FINANCEWITHDEV · END-OF-DAY EDITION
                      </span>
                      <span className="font-mono-tabular text-[10px] text-[#8D99A8]">
                        EVERY MARKET DAY
                      </span>
                    </div>
                    <h4 className="mt-1.5 font-display text-xl font-extrabold tracking-tight text-[#F5F7FA] sm:text-2xl">
                      THE CLOSING BELL
                    </h4>
                    <p className="mt-0.5 text-xs text-[#8D99A8]">
                      {closingBell.documentSubtitle}
                    </p>
                  </div>

                  {/* Two-Column Publication Index Layout */}
                  <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div className="rounded-[10px] border border-[#1B2735] bg-[#0A1018] p-3">
                      <p className="font-mono-tabular text-[10px] font-bold tracking-wider uppercase text-[#19D3A2]">
                        01 · BENCHMARK &amp; SESSION
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#F5F7FA]">
                        Nifty, Sensex &amp; Bank Nifty
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-[#8D99A8]">
                        How the market session unfolded &amp; key market takeaways.
                      </p>
                    </div>

                    <div className="rounded-[10px] border border-[#1B2735] bg-[#0A1018] p-3">
                      <p className="font-mono-tabular text-[10px] font-bold tracking-wider uppercase text-[#19D3A2]">
                        02 · INSTITUTIONAL &amp; MACRO
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#F5F7FA]">
                        FII/DII Flows &amp; Cues
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-[#8D99A8]">
                        Institutional cash activity, major India stories &amp; global market cues.
                      </p>
                    </div>

                    <div className="rounded-[10px] border border-[#1B2735] bg-[#0A1018] p-3">
                      <p className="font-mono-tabular text-[10px] font-bold tracking-wider uppercase text-[#19D3A2]">
                        03 · DERIVATIVES &amp; LEVELS
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#F5F7FA]">
                        Options Desk &amp; Key Levels
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-[#8D99A8]">
                        Support &amp; resistance zones and options desk structure.
                      </p>
                    </div>

                    <div className="rounded-[10px] border border-[#1B2735] bg-[#0A1018] p-3">
                      <p className="font-mono-tabular text-[10px] font-bold tracking-wider uppercase text-[#19D3A2]">
                        04 · CORPORATE &amp; RADAR
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#F5F7FA]">
                        Commentary &amp; Key Events
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-[#8D99A8]">
                        Management commentary &amp; key developments to watch.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.article>

        {/* BELOW: GRID FOR [ IPO CHECK ], [ NISM SERIES XV ], AND [ NISM SERIES VIII ] */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* PRODUCT 2: IPO CHECK */}
          <motion.article
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="card-elevate flex flex-col justify-between rounded-[16px] border border-[#1B2735] bg-[#0D141D] p-6 shadow-[0_14px_34px_rgba(0,0,0,0.28)]"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#1B2735] bg-[#0A1018] text-[#19D3A2]">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <span className="font-mono-tabular text-[11px] font-semibold tracking-[0.12em] uppercase text-[#19D3A2]">
                    {ipoCheck.label}
                  </span>
                </div>
                <span className="font-mono-tabular text-[11px] text-[#8D99A8]">
                  Live Tool
                </span>
              </div>

              <h3 className="mt-4 font-display text-[20px] font-bold tracking-[-0.015em] text-[#F5F7FA]">
                {ipoCheck.name}
              </h3>

              <p className="mt-1 text-[13px] font-semibold text-[#19D3A2]">
                {ipoCheck.subtitle}
              </p>

              <p className="mt-2 text-[14px] leading-[1.6] text-[#8D99A8]">
                {ipoCheck.description}
              </p>

              {/* Visual App Mockup of IPO Check */}
              <div className="mt-5 overflow-hidden rounded-[12px] border border-[#1B2735] bg-[#070B12]">
                <div className="flex items-center justify-between border-b border-[#1B2735] bg-[#0A1018] px-3.5 py-2 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#1B2735]" />
                    <span className="h-2 w-2 rounded-full bg-[#1B2735]" />
                    <span className="ml-1 font-mono-tabular text-[#8D99A8]">
                      ipo-check-financewithdev.ai.studio
                    </span>
                  </div>
                  <span className="font-mono-tabular text-[10px] font-semibold text-[#19D3A2]">
                    ACTIVE
                  </span>
                </div>

                <div className="p-3.5 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-[8px] border border-[#1B2735] bg-[#0A1018] p-2">
                      <p className="font-mono-tabular text-[9px] text-[#8D99A8]">
                        ANALYSIS VIEW
                      </p>
                      <p className="mt-0.5 text-[11px] font-semibold text-[#F5F7FA]">
                        IPO Key Factors
                      </p>
                    </div>
                    <div className="rounded-[8px] border border-[#1B2735] bg-[#0A1018] p-2">
                      <p className="font-mono-tabular text-[9px] text-[#8D99A8]">
                        COMPARISON
                      </p>
                      <p className="mt-0.5 text-[11px] font-semibold text-[#F5F7FA]">
                        Side-by-Side Check
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-[8px] border border-[#19D3A2]/25 bg-[#19D3A2]/[0.06] px-2.5 py-1.5">
                    <span className="text-[11px] font-medium text-[#F5F7FA]">
                      {ipoCheck.communityNote}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <a
                href={ipoCheck.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent(SITE_CONFIG.analytics.events.ipoToolClick, {
                    url: ipoCheck.url,
                  })
                }
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-[12px] border border-[#19D3A2]/40 bg-[#19D3A2]/10 px-5 py-2.5 text-[14px] font-bold text-[#19D3A2] transition-all duration-150 hover:bg-[#16E0A5] hover:text-[#070B12] whitespace-nowrap"
              >
                <span>{ipoCheck.ctaText}</span>
                <ExternalLink className="h-4 w-4 shrink-0" />
              </a>
            </div>
          </motion.article>

          {/* PRODUCT 3: NISM SERIES XV — RESEARCH ANALYST PRACTICE */}
          <motion.article
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="card-elevate flex flex-col justify-between rounded-[16px] border border-[#1B2735] bg-[#0D141D] p-6 shadow-[0_14px_34px_rgba(0,0,0,0.28)]"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#1B2735] bg-[#0A1018] text-[#19D3A2]">
                    <BrainCircuit className="h-4 w-4" />
                  </div>
                  <span className="font-mono-tabular text-[11px] font-semibold tracking-[0.12em] uppercase text-[#19D3A2]">
                    {nismSeriesXv.label}
                  </span>
                </div>
                <span className="font-mono-tabular text-[11px] text-[#8D99A8]">
                  {nismSeriesXv.subLabel}
                </span>
              </div>

              <h3 className="mt-4 font-display text-[20px] font-bold tracking-[-0.015em] text-[#F5F7FA]">
                {nismSeriesXv.upperName}
              </h3>

              <p className="mt-1 text-[13px] font-semibold text-[#19D3A2]">
                {nismSeriesXv.subtitle}
              </p>

              <p className="mt-2 text-[14px] leading-[1.6] text-[#8D99A8]">
                {nismSeriesXv.description}
              </p>

              {/* Visual App Mockup of NISM Series XV Tool */}
              <div className="mt-5 overflow-hidden rounded-[12px] border border-[#1B2735] bg-[#070B12]">
                <div className="flex items-center justify-between border-b border-[#1B2735] bg-[#0A1018] px-3.5 py-2 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#1B2735]" />
                    <span className="h-2 w-2 rounded-full bg-[#1B2735]" />
                    <span className="ml-1 font-mono-tabular text-[#8D99A8]">
                      nismxvresearchanalyst-4m18.vercel.app
                    </span>
                  </div>
                  <span className="font-mono-tabular text-[10px] font-semibold text-[#19D3A2]">
                    ACTIVE
                  </span>
                </div>

                <div className="p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between rounded-[8px] border border-[#1B2735] bg-[#0A1018] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#19D3A2]" />
                      <span className="text-[12px] font-semibold text-[#F5F7FA]">
                        {nismSeriesXv.previewTitle}
                      </span>
                    </div>
                    <span className="font-mono-tabular text-[10px] text-[#19D3A2]">
                      {nismSeriesXv.previewTier1}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-[8px] border border-[#19D3A2]/25 bg-[#19D3A2]/[0.06] px-2.5 py-1.5">
                    <span className="text-[11px] font-medium text-[#F5F7FA]">
                      {nismSeriesXv.previewTier2}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <a
                href={nismSeriesXv.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent(SITE_CONFIG.analytics.events.nismTestClick, {
                    url: nismSeriesXv.url,
                    tool: 'nism_xv',
                  })
                }
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-[12px] border border-[#19D3A2]/40 bg-[#19D3A2]/10 px-5 py-2.5 text-[14px] font-bold text-[#19D3A2] transition-all duration-150 hover:bg-[#16E0A5] hover:text-[#070B12] whitespace-nowrap"
              >
                <span>{nismSeriesXv.ctaText}</span>
                <ExternalLink className="h-4 w-4 shrink-0" />
              </a>
            </div>
          </motion.article>

          {/* PRODUCT 4: NISM SERIES VIII — EQUITY DERIVATIVES PRACTICE */}
          <motion.article
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="card-elevate flex flex-col justify-between rounded-[16px] border border-[#1B2735] bg-[#0D141D] p-6 shadow-[0_14px_34px_rgba(0,0,0,0.28)]"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#1B2735] bg-[#0A1018] text-[#19D3A2]">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <span className="font-mono-tabular text-[11px] font-semibold tracking-[0.12em] uppercase text-[#19D3A2]">
                    {nismSeriesViii.label}
                  </span>
                </div>
                <span className="font-mono-tabular text-[11px] text-[#8D99A8]">
                  {nismSeriesViii.subLabel}
                </span>
              </div>

              <h3 className="mt-4 font-display text-[20px] font-bold tracking-[-0.015em] text-[#F5F7FA]">
                {nismSeriesViii.upperName}
              </h3>

              <p className="mt-1 text-[13px] font-semibold text-[#19D3A2]">
                {nismSeriesViii.subtitle}
              </p>

              <p className="mt-2 text-[14px] leading-[1.6] text-[#8D99A8]">
                {nismSeriesViii.description}
              </p>

              {/* Visual App Mockup of NISM Series VIII Tool */}
              <div className="mt-5 overflow-hidden rounded-[12px] border border-[#1B2735] bg-[#070B12]">
                <div className="flex items-center justify-between border-b border-[#1B2735] bg-[#0A1018] px-3.5 py-2 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#1B2735]" />
                    <span className="h-2 w-2 rounded-full bg-[#1B2735]" />
                    <span className="ml-1 font-mono-tabular text-[#8D99A8] truncate max-w-[170px]">
                      nism-series-viii-equity-derivatives...
                    </span>
                  </div>
                  <span className="font-mono-tabular text-[10px] font-semibold text-[#19D3A2]">
                    ACTIVE
                  </span>
                </div>

                <div className="p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between rounded-[8px] border border-[#1B2735] bg-[#0A1018] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#19D3A2]" />
                      <span className="text-[12px] font-semibold text-[#F5F7FA]">
                        {nismSeriesViii.previewTitle}
                      </span>
                    </div>
                    <span className="font-mono-tabular text-[10px] text-[#19D3A2]">
                      {nismSeriesViii.previewTier1}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-[8px] border border-[#19D3A2]/25 bg-[#19D3A2]/[0.06] px-2.5 py-1.5">
                    <span className="text-[11px] font-medium text-[#F5F7FA]">
                      {nismSeriesViii.previewTier2}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <a
                href={nismSeriesViii.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent(SITE_CONFIG.analytics.events.nismTestClick, {
                    url: nismSeriesViii.url,
                    tool: 'nism_viii',
                  })
                }
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-[12px] border border-[#19D3A2]/40 bg-[#19D3A2]/10 px-5 py-2.5 text-[14px] font-bold text-[#19D3A2] transition-all duration-150 hover:bg-[#16E0A5] hover:text-[#070B12] whitespace-nowrap"
              >
                <span>{nismSeriesViii.ctaText}</span>
                <ExternalLink className="h-4 w-4 shrink-0" />
              </a>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
};
