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
      {/* SECTION 4 — WHO YOU'LL FIND INSIDE (#F8FAFC) */}
      <section
        id="community"
        className="scroll-mt-16 border-b border-[#E2E8F0] bg-white py-14 sm:py-18 lg:py-20"
      >
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl"
          >
            <p className="font-mono-tabular text-[11px] font-bold tracking-[0.14em] uppercase text-[#059669] sm:text-[12px]">
              COMMUNITY MEMBERS
            </p>
            <h2
              className="mt-1.5 font-display text-[26px] font-bold leading-[1.18] tracking-[-0.02em] text-[#0F172A] sm:text-[32px]"
              style={{ textWrap: 'balance' }}
            >
              {communitySection.heading}
            </h2>
            <p className="mt-2 text-[15px] leading-[1.6] text-[#475569] sm:text-[16px]">
              {communitySection.supportingText}
            </p>
          </motion.div>

          {/* 4 Simple Categories */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {communitySection.cards.map((card, idx) => {
              const IconComponent = MEMBER_ICONS[card.iconName];
              return (
                <motion.article
                  key={card.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="card-elevate flex flex-col justify-between rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] p-5 shadow-sm"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#CBD5E1] bg-white text-[#0F172A]">
                    <IconComponent className="h-4 w-4" />
                  </div>

                  <h3 className="mt-4 font-display text-[15px] font-bold tracking-tight text-[#0F172A]">
                    {card.title}
                  </h3>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5 — HOW JOINING WORKS (#F8FAFC) */}
      <section
        id="how-it-works"
        className="scroll-mt-16 border-b border-[#E2E8F0] bg-[#F8FAFC] py-14 sm:py-18 lg:py-20"
      >
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4 }}
            className="max-w-xl"
          >
            <p className="font-mono-tabular text-[11px] font-bold tracking-[0.14em] uppercase text-[#059669] sm:text-[12px]">
              JOINING FLOW
            </p>
            <h2
              className="mt-1.5 font-display text-[26px] font-bold leading-[1.18] tracking-[-0.02em] text-[#0F172A] sm:text-[32px]"
              style={{ textWrap: 'balance' }}
            >
              {howItWorksSection.heading}
            </h2>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
            {howItWorksSection.steps.map((step, idx) => (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="card-elevate flex flex-col justify-between rounded-[10px] border border-[#CBD5E1] bg-white p-5 shadow-sm sm:p-6"
              >
                <div>
                  <span className="font-mono-tabular text-[18px] font-bold text-[#059669]">
                    {step.number}
                  </span>

                  <h3 className="mt-3 font-display text-[16px] font-bold tracking-tight text-[#0F172A]">
                    {step.title}
                  </h3>

                  <p className="mt-1.5 text-[14px] leading-[1.6] text-[#475569]">
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
