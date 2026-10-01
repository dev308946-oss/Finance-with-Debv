import React from 'react';
import { SITE_CONFIG } from '../config/siteConfig';

export const AudienceAndNoteSection: React.FC = () => {
  const { audienceSection } = SITE_CONFIG;

  return (
    <section className="border-b border-white/[0.08] py-16 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* SECTION 8 — WHO IS THIS FOR? */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-emerald-400">
            07. WHO IS THIS FOR?
          </p>
          <h2
            className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            {audienceSection.heading}
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {audienceSection.cards.map((card) => (
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
