import React from 'react';
import { SITE_CONFIG } from '../config/siteConfig';

export const ContributorsSection: React.FC = () => {
  const {
    kicker,
    heading,
    subtitle,
    text,
    memberStages,
    closingStatement,
  } = SITE_CONFIG.communitySection;

  return (
    <section
      id="community"
      className="scroll-mt-16 border-b border-white/[0.08] bg-[#06080C] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-emerald-400">
            {kicker}
          </p>
          <h2
            className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            {heading}
          </h2>
          <p className="mt-2 font-display text-base font-semibold text-emerald-400 sm:text-lg">
            {subtitle}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
            {text}
          </p>
        </div>

        {/* 4 Simple Cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {memberStages.map((stage) => (
            <article
              key={stage.id}
              className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0B0F16] p-6 transition-colors duration-150 hover:border-white/[0.16]"
            >
              <div>
                <span className="font-mono-tabular text-xs font-semibold text-emerald-400">
                  {stage.index}.
                </span>
                <h3 className="mt-2.5 font-display text-lg font-bold text-white">
                  {stage.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {stage.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Closing Line */}
        <div className="mt-8 rounded-2xl border border-emerald-500/25 bg-[#0D131C] p-6">
          <p className="text-sm font-semibold leading-relaxed text-slate-100 sm:text-base">
            {closingStatement}
          </p>
        </div>
      </div>
    </section>
  );
};
