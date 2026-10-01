import React from 'react';
import { SITE_CONFIG } from '../config/siteConfig';

export const DiscussionsAndResourcesSection: React.FC = () => {
  const { marketDiscussions, learningResources } = SITE_CONFIG;

  return (
    <>
      {/* SECTION 3 — MARKET DISCUSSIONS */}
      <section
        id="discussions"
        className="scroll-mt-16 border-b border-white/[0.08] bg-[#06080C] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-emerald-400">
              02. MARKET & RESEARCH DISCUSSIONS
            </p>
            <h2
              className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              {marketDiscussions.heading}
            </h2>
            <p className="mt-2.5 text-base leading-relaxed text-slate-300 sm:text-lg">
              {marketDiscussions.description}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {marketDiscussions.cards.map((card) => (
              <article
                key={card.id}
                className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0B0F16] p-6 transition-colors duration-150 hover:border-white/[0.16]"
              >
                <div>
                  <span className="font-mono-tabular text-xs font-semibold text-emerald-400">
                    {card.index}.
                  </span>
                  <h3 className="mt-2.5 font-display text-lg font-bold text-white">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-white/[0.06] pt-3">
                  <p className="text-xs text-slate-400">{card.topics}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Educational & Non-Advisory Note */}
          <p className="mt-6 border-l-2 border-emerald-500/50 pl-3.5 text-xs leading-relaxed text-slate-400 sm:text-sm">
            {marketDiscussions.educationalNote}
          </p>
        </div>
      </section>

      {/* SECTION 4 — LEARNING RESOURCES */}
      <section
        id="resources"
        className="scroll-mt-16 border-b border-white/[0.08] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-emerald-400">
              03. LEARNING RESOURCES
            </p>
            <h2
              className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              {learningResources.heading}
            </h2>
            <p className="mt-2.5 text-base leading-relaxed text-slate-400">
              {learningResources.subheading}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {learningResources.cards.map((card) => (
              <article
                key={card.id}
                className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0B0F16] p-6 transition-colors duration-150 hover:border-white/[0.16]"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono-tabular font-semibold text-emerald-400">
                      {card.index}.
                    </span>
                    <span className="text-slate-500">Curated for Members</span>
                  </div>

                  <h3 className="mt-2.5 font-display text-lg font-bold text-white sm:text-xl">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {card.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
