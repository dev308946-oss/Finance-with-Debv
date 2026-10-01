import React from 'react';
import { SITE_CONFIG } from '../config/siteConfig';

export const InsideCommunitySection: React.FC = () => {
  const { heading, subheading, items } = SITE_CONFIG.whatHappensInside;

  return (
    <section
      id="what-happens-inside"
      className="scroll-mt-16 border-b border-white/[0.08] bg-[#06080C] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-wider text-emerald-400">
              08. WHAT YOU CAN EXPECT
            </p>
            <h2
              className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              {heading}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              {subheading}
            </p>
          </div>

          {/* Right Feed / Timeline Column */}
          <div className="lg:col-span-7">
            <div className="relative border-l border-emerald-500/30 pl-6 sm:pl-8 space-y-5">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="relative rounded-2xl border border-white/[0.08] bg-[#0B0F16] p-5 sm:p-6 transition-colors duration-150 hover:border-white/[0.16]"
                >
                  {/* Timeline Node Marker */}
                  <span
                    aria-hidden="true"
                    className="absolute -left-[31px] sm:-left-[39px] top-6 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-emerald-400 bg-[#06080C]"
                  />

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono-tabular font-bold tracking-wider text-emerald-400">
                      {item.label}
                    </span>
                    <span className="font-mono-tabular text-slate-500">
                      0{idx + 1}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-slate-200 sm:text-base">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
