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
      className="scroll-mt-16 border-b border-[#E2E8F0] bg-white py-14 sm:py-18 lg:py-20"
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
          <p className="font-mono-tabular text-[11px] font-bold tracking-[0.14em] uppercase text-[#059669] sm:text-[12px]">
            CORE PRODUCTS
          </p>
          <h2
            className="mt-1.5 font-display text-[26px] font-bold leading-[1.18] tracking-[-0.02em] text-[#0F172A] sm:text-[32px]"
            style={{ textWrap: 'balance' }}
          >
            {heading}
          </h2>
          <p className="mt-2 text-[15px] leading-[1.6] text-[#475569] sm:text-[16px]">
            {subtitle}
          </p>
        </motion.div>

        {/* FOCAL HERO PRODUCT: THE CLOSING BELL (LARGE PUBLICATION PREVIEW) */}
        <motion.article
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
          className="card-elevate mt-8 rounded-[12px] border border-[#CBD5E1] bg-[#F8FAFC] p-6 shadow-sm sm:p-8"
        >
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left Column: Editorial Product Positioning (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#CBD5E1] bg-white text-[#0F172A]">
                  <Newspaper className="h-4 w-4" />
                </div>
                <span className="font-mono-tabular text-[11px] font-bold tracking-[0.12em] uppercase text-[#0F172A]">
                  DAILY MARKET BRIEF
                </span>
                <span aria-hidden="true" className="text-[#94A3B8]">
                  •
                </span>
                <span className="font-mono-tabular text-[11px] font-medium text-[#64748B]">
                  Every Market Day
                </span>
              </div>

              <h3 className="mt-3.5 font-display text-[24px] font-bold tracking-[-0.02em] text-[#0F172A] sm:text-[28px]">
                {closingBell.name}
              </h3>

              <p className="mt-1 text-[14px] font-semibold text-[#059669]">
                {closingBell.tagline}
              </p>

              <p className="mt-3 text-[14px] leading-[1.6] text-[#334155]">
                {closingBell.description}
              </p>

              <p className="mt-2 text-[13px] leading-[1.6] text-[#64748B]">
                {closingBell.supportingCopy}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSampleClick}
                  className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-[8px] bg-[#0F172A] px-5 py-2.5 text-[13px] font-bold tracking-tight text-white transition-all duration-150 hover:bg-[#1E293B] shadow-sm whitespace-nowrap"
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
                className="group cursor-pointer overflow-hidden rounded-[10px] border border-[#CBD5E1] bg-white transition-all hover:border-[#94A3B8] shadow-sm"
              >
                {/* Top PDF Viewer Bar */}
                <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F1F5F9] px-4 py-2.5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#059669]" />
                    <span className="font-mono-tabular font-semibold text-[#0F172A]">
                      The_Closing_Bell_Daily_Brief.pdf
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-mono-tabular font-bold text-[#0F172A] group-hover:underline">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Open Report Preview</span>
                  </span>
                </div>

                {/* Publication Page Sheet */}
                <div className="p-5 sm:p-6 bg-white">
                  {/* Publication Masthead */}
                  <div className="border-b-2 border-[#0F172A] pb-3.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-mono-tabular text-[10px] font-bold tracking-[0.16em] uppercase text-[#64748B]">
                        FINANCEWITHDEV · END-OF-DAY EDITION
                      </span>
                      <span className="font-mono-tabular text-[10px] font-semibold text-[#059669]">
                        EVERY MARKET DAY
                      </span>
                    </div>
                    <h4 className="mt-1 font-display text-lg font-extrabold tracking-tight text-[#0F172A] sm:text-xl">
                      THE CLOSING BELL
                    </h4>
                    <p className="mt-0.5 text-xs text-[#64748B]">
                      {closingBell.documentSubtitle}
                    </p>
                  </div>

                  {/* Two-Column Publication Index Layout */}
                  <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div className="rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                      <p className="font-mono-tabular text-[10px] font-bold tracking-wider uppercase text-[#059669]">
                        01 · BENCHMARK &amp; SESSION
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#0F172A]">
                        Nifty, Sensex &amp; Bank Nifty
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-[#64748B]">
                        How the market session unfolded &amp; key market takeaways.
                      </p>
                    </div>

                    <div className="rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                      <p className="font-mono-tabular text-[10px] font-bold tracking-wider uppercase text-[#059669]">
                        02 · INSTITUTIONAL &amp; MACRO
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#0F172A]">
                        FII/DII Flows &amp; Cues
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-[#64748B]">
                        Institutional cash activity, major India stories &amp; global market cues.
                      </p>
                    </div>

                    <div className="rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                      <p className="font-mono-tabular text-[10px] font-bold tracking-wider uppercase text-[#059669]">
                        03 · DERIVATIVES &amp; LEVELS
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#0F172A]">
                        Options Desk &amp; Key Levels
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-[#64748B]">
                        Support &amp; resistance zones and options desk structure.
                      </p>
                    </div>

                    <div className="rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                      <p className="font-mono-tabular text-[10px] font-bold tracking-wider uppercase text-[#059669]">
                        04 · CORPORATE &amp; RADAR
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#0F172A]">
                        Commentary &amp; Key Events
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-[#64748B]">
                        Management commentary &amp; key developments to watch.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.article>

        {/* DEDICATED FREE TOOLS SECTION WITH CLEAR HEADING */}
        <div id="free-tools" className="mt-14 scroll-mt-24 pt-8 border-t border-[#E2E8F0]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl"
          >
            <p className="font-mono-tabular text-[11px] font-bold tracking-[0.14em] uppercase text-[#059669] sm:text-[12px]">
              FREE TOOLS &amp; PRACTICE
            </p>
            <h3
              className="mt-1.5 font-display text-[24px] font-bold leading-[1.2] tracking-[-0.02em] text-[#0F172A] sm:text-[28px]"
              style={{ textWrap: 'balance' }}
            >
              TRY BEFORE YOU JOIN
            </h3>
            <p className="mt-1.5 text-[15px] leading-[1.6] text-[#475569] sm:text-[16px]">
              Explore our finance tools and practice resources before becoming a member.
            </p>
          </motion.div>

          {/* GRID FOR [ IPO CHECK ], [ NISM SERIES XV ], AND [ NISM SERIES VIII ] */}
          <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* PRODUCT 2: IPO CHECK */}
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="card-elevate flex flex-col justify-between rounded-[10px] border border-[#CBD5E1] bg-white p-5 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A]">
                      <BarChart3 className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-mono-tabular text-[11px] font-bold tracking-[0.1em] uppercase text-[#0F172A]">
                      {ipoCheck.label}
                    </span>
                  </div>
                  <span className="font-mono-tabular text-[10px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-[4px]">
                    Live Tool
                  </span>
                </div>

                <h3 className="mt-3.5 font-display text-[18px] font-bold tracking-[-0.015em] text-[#0F172A]">
                  {ipoCheck.name}
                </h3>

                <p className="mt-0.5 text-[13px] font-semibold text-[#059669]">
                  {ipoCheck.subtitle}
                </p>

                <p className="mt-2 text-[13px] leading-[1.6] text-[#475569]">
                  {ipoCheck.description}
                </p>

                {/* Visual App Mockup of IPO Check */}
                <div className="mt-4 overflow-hidden rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F1F5F9] px-3 py-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                      <span className="font-mono-tabular text-[10px] text-[#64748B]">
                        ipo-check-financewithdev.ai.studio
                      </span>
                    </div>
                    <span className="font-mono-tabular text-[9px] font-bold text-[#059669]">
                      ACTIVE
                    </span>
                  </div>

                  <div className="p-3 space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-[6px] border border-[#E2E8F0] bg-white p-2">
                        <p className="font-mono-tabular text-[9px] font-semibold text-[#64748B]">
                          ANALYSIS VIEW
                        </p>
                        <p className="mt-0.5 text-[11px] font-bold text-[#0F172A]">
                          IPO Key Factors
                        </p>
                      </div>
                      <div className="rounded-[6px] border border-[#E2E8F0] bg-white p-2">
                        <p className="font-mono-tabular text-[9px] font-semibold text-[#64748B]">
                          COMPARISON
                        </p>
                        <p className="mt-0.5 text-[11px] font-bold text-[#0F172A]">
                          Side-by-Side Check
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-[6px] border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-[11px] text-[#334155] font-medium">
                      <span>{ipoCheck.communityNote}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <a
                  href={ipoCheck.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent(SITE_CONFIG.analytics.events.ipoToolClick, {
                      url: ipoCheck.url,
                    })
                  }
                  className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#0F172A] px-4 py-2 text-[13px] font-bold text-white transition-all duration-150 hover:bg-[#1E293B] shadow-sm whitespace-nowrap"
                >
                  <span>{ipoCheck.ctaText}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              </div>
            </motion.article>

            {/* PRODUCT 3: NISM SERIES XV — RESEARCH ANALYST PRACTICE */}
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="card-elevate flex flex-col justify-between rounded-[10px] border border-[#CBD5E1] bg-white p-5 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A]">
                      <BrainCircuit className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-mono-tabular text-[11px] font-bold tracking-[0.1em] uppercase text-[#0F172A]">
                      {nismSeriesXv.label}
                    </span>
                  </div>
                  <span className="font-mono-tabular text-[10px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-[4px]">
                    {nismSeriesXv.subLabel}
                  </span>
                </div>

                <h3 className="mt-3.5 font-display text-[18px] font-bold tracking-[-0.015em] text-[#0F172A]">
                  {nismSeriesXv.upperName}
                </h3>

                <p className="mt-0.5 text-[13px] font-semibold text-[#059669]">
                  {nismSeriesXv.subtitle}
                </p>

                <p className="mt-2 text-[13px] leading-[1.6] text-[#475569]">
                  {nismSeriesXv.description}
                </p>

                {/* Visual App Mockup of NISM Series XV Tool */}
                <div className="mt-4 overflow-hidden rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F1F5F9] px-3 py-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                      <span className="font-mono-tabular text-[10px] text-[#64748B]">
                        nismxvresearchanalyst-4m18.vercel.app
                      </span>
                    </div>
                    <span className="font-mono-tabular text-[9px] font-bold text-[#059669]">
                      ACTIVE
                    </span>
                  </div>

                  <div className="p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between rounded-[6px] border border-[#E2E8F0] bg-white px-3 py-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#059669]" />
                        <span className="text-[11px] font-bold text-[#0F172A]">
                          {nismSeriesXv.previewTitle}
                        </span>
                      </div>
                      <span className="font-mono-tabular text-[10px] font-bold text-[#059669]">
                        {nismSeriesXv.previewTier1}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-[6px] border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-[11px] text-[#334155] font-medium">
                      <span>{nismSeriesXv.previewTier2}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5">
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
                  className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#0F172A] px-4 py-2 text-[13px] font-bold text-white transition-all duration-150 hover:bg-[#1E293B] shadow-sm whitespace-nowrap"
                >
                  <span>{nismSeriesXv.ctaText}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              </div>
            </motion.article>

            {/* PRODUCT 4: NISM SERIES VIII — EQUITY DERIVATIVES PRACTICE */}
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="card-elevate flex flex-col justify-between rounded-[10px] border border-[#CBD5E1] bg-white p-5 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A]">
                      <TrendingUp className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-mono-tabular text-[11px] font-bold tracking-[0.1em] uppercase text-[#0F172A]">
                      {nismSeriesViii.label}
                    </span>
                  </div>
                  <span className="font-mono-tabular text-[10px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-[4px]">
                    {nismSeriesViii.subLabel}
                  </span>
                </div>

                <h3 className="mt-3.5 font-display text-[18px] font-bold tracking-[-0.015em] text-[#0F172A]">
                  {nismSeriesViii.upperName}
                </h3>

                <p className="mt-0.5 text-[13px] font-semibold text-[#059669]">
                  {nismSeriesViii.subtitle}
                </p>

                <p className="mt-2 text-[13px] leading-[1.6] text-[#475569]">
                  {nismSeriesViii.description}
                </p>

                {/* Visual App Mockup of NISM Series VIII Tool */}
                <div className="mt-4 overflow-hidden rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F1F5F9] px-3 py-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                      <span className="font-mono-tabular text-[10px] text-[#64748B] truncate max-w-[170px]">
                        nism-series-viii-equity-derivatives...
                      </span>
                    </div>
                    <span className="font-mono-tabular text-[9px] font-bold text-[#059669]">
                      ACTIVE
                    </span>
                  </div>

                  <div className="p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between rounded-[6px] border border-[#E2E8F0] bg-white px-3 py-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#059669]" />
                        <span className="text-[11px] font-bold text-[#0F172A]">
                          {nismSeriesViii.previewTitle}
                        </span>
                      </div>
                      <span className="font-mono-tabular text-[10px] font-bold text-[#059669]">
                        {nismSeriesViii.previewTier1}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-[6px] border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-[11px] text-[#334155] font-medium">
                      <span>{nismSeriesViii.previewTier2}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5">
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
                  className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#0F172A] px-4 py-2 text-[13px] font-bold text-white transition-all duration-150 hover:bg-[#1E293B] shadow-sm whitespace-nowrap"
                >
                  <span>{nismSeriesViii.ctaText}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              </div>
            </motion.article>
          </div>
        </div>
      </div>
    </section>
  );
};
