import React from 'react';
import { Check } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

export const ContributorsSection: React.FC = () => {
  const {
    kicker,
    heading,
    subheading,
    interestsIntro,
    interestsList,
    memberStages,
    closingStatement,
  } = SITE_CONFIG.communitySection;

  return (
    <section
      id="community"
      className="scroll-mt-16 border-b border-white/[0.08] bg-[#06080C] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Top Header + Shared Interests Grid */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold tracking-wider text-emerald-400">
              04. {kicker}
            </p>
            <h2
              className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              {heading}
            </h2>
            <p className="mt-2.5 text-base font-medium leading-relaxed text-slate-300 sm:text-lg">
              {subheading}
            </p>
          </div>

          {/* Areas of Interest */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F16] p-6 sm:p-7 lg:col-span-6">
            <p className="text-xs font-semibold tracking-wider text-emerald-400">
              SHARED FOCUS AREAS
            </p>
            <p className="mt-1.5 text-sm font-medium text-slate-200">
              {interestsIntro}
            </p>

            <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {interestsList.map((interest) => (
                <li
                  key={interest}
                  className="flex items-start gap-2.5 text-sm text-slate-200"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{interest}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 5 Cards: Types of Members in the Community */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {memberStages.map((stage) => (
            <article
              key={stage.id}
              className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0B0F16] p-5 sm:p-6 transition-colors duration-150 hover:border-white/[0.16]"
            >
              <div>
                <span className="font-mono-tabular text-xs font-semibold text-emerald-400">
                  {stage.index}.
                </span>
                <h3 className="mt-2.5 font-display text-base font-bold text-white sm:text-lg">
                  {stage.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                  {stage.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Closing Statement */}
        <div className="mt-8 rounded-2xl border border-emerald-500/25 bg-[#0D131C] p-6 sm:p-7">
          <p className="text-sm font-medium leading-relaxed text-slate-100 sm:text-base">
            “{closingStatement}”
          </p>
        </div>
      </div>
    </section>
  );
};
