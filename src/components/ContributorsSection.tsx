import React from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  LineChart,
  TrendingUp,
  Briefcase,
} from 'lucide-react';
import { SITE_CONFIG, CommunityMemberCard } from '../config/siteConfig';

const MEMBER_ICONS: Record<
  CommunityMemberCard['iconName'],
  React.FC<{ className?: string }>
> = {
  graduation: GraduationCap,
  research: LineChart,
  market: TrendingUp,
  career: Briefcase,
};

export const ContributorsSection: React.FC = () => {
  const { communitySection, howItWorksSection } = SITE_CONFIG;

  return (
    <>
      {/* SECTION 4 — WHO YOU'LL FIND INSIDE (#0A1018) */}
      <section
        id="community"
        className="scroll-mt-16 border-b border-[#1B2735] bg-[#0A1018] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl"
          >
            <p className="font-mono-tabular text-[11px] font-semibold tracking-[0.14em] uppercase text-[#19D3A2] sm:text-[12px]">
              COMMUNITY MEMBERS
            </p>
            <h2
              className="mt-2 font-display text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-[#F5F7FA] sm:text-[34px] lg:text-[36px]"
              style={{ textWrap: 'balance' }}
            >
              {communitySection.heading}
            </h2>
            <p className="mt-2.5 text-[15px] leading-[1.65] text-[#8D99A8] sm:text-[16px]">
              {communitySection.supportingText}
            </p>
          </motion.div>

          {/* 4 Simple Categories */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {communitySection.cards.map((card, idx) => {
              const IconComponent = MEMBER_ICONS[card.iconName];
              return (
                <motion.article
                  key={card.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="card-elevate flex items-center gap-4 rounded-[16px] border border-[#1B2735] bg-[#0D141D] p-5 shadow-[0_10px_28px_rgba(0,0,0,0.22)] sm:p-6"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[#1B2735] bg-[#070B12] text-[#19D3A2]">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-[16px] font-bold leading-snug text-[#F5F7FA]">
                    {card.title}
                  </h3>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5 — HOW JOINING WORKS (#070B12) */}
      <section
        id="how-it-works"
        className="scroll-mt-16 border-b border-[#1B2735] bg-[#070B12] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4 }}
            className="max-w-xl"
          >
            <p className="font-mono-tabular text-[11px] font-semibold tracking-[0.14em] uppercase text-[#19D3A2] sm:text-[12px]">
              JOINING FLOW
            </p>
            <h2
              className="mt-2 font-display text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-[#F5F7FA] sm:text-[34px] lg:text-[36px]"
              style={{ textWrap: 'balance' }}
            >
              {howItWorksSection.heading}
            </h2>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
            {howItWorksSection.steps.map((step, idx) => (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="card-elevate flex flex-col justify-between rounded-[16px] border border-[#1B2735] bg-[#0D141D] p-6 shadow-[0_10px_28px_rgba(0,0,0,0.22)] sm:p-7"
              >
                <div>
                  <span className="font-mono-tabular text-[22px] font-bold text-[#19D3A2]">
                    {step.number}
                  </span>

                  <h3 className="mt-3.5 font-display text-[18px] font-bold tracking-[-0.01em] text-[#F5F7FA]">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-[15px] leading-[1.6] text-[#8D99A8]">
                    {step.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
