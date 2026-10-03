import React from 'react';
import { motion } from 'motion/react';
import {
  Newspaper,
  BarChart3,
  TrendingUp,
  BookOpen,
  BrainCircuit,
  Users,
} from 'lucide-react';
import { SITE_CONFIG, BenefitCardItem } from '../config/siteConfig';

const ICON_MAP: Record<
  BenefitCardItem['iconName'],
  React.FC<{ className?: string }>
> = {
  newspaper: Newspaper,
  chart: BarChart3,
  trending: TrendingUp,
  book: BookOpen,
  brain: BrainCircuit,
  users: Users,
};

export const BenefitsSection: React.FC = () => {
  const { heading, subheading, cards } = SITE_CONFIG.benefitsSection;

  return (
    <section
      id="benefits"
      className="scroll-mt-16 border-b border-[#E2E8F0] bg-[#F8FAFC] py-14 sm:py-18 lg:py-20"
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
            COMMUNITY ECOSYSTEM
          </p>
          <h2
            className="mt-1.5 font-display text-[26px] font-bold leading-[1.18] tracking-[-0.02em] text-[#0F172A] sm:text-[32px]"
            style={{ textWrap: 'balance' }}
          >
            {heading}
          </h2>
          <p className="mt-2 text-[15px] leading-[1.6] text-[#475569] sm:text-[16px]">
            {subheading}
          </p>
        </motion.div>

        {/* 6 Concise Cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, idx) => {
            const IconComponent = ICON_MAP[card.iconName];

            return (
              <motion.article
                key={card.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="card-elevate flex flex-col justify-between rounded-[10px] border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6"
              >
                <div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A]">
                    <IconComponent className="h-4 w-4" />
                  </div>

                  <h3 className="mt-3.5 font-display text-[16px] font-bold tracking-[-0.01em] text-[#0F172A]">
                    {card.title}
                  </h3>

                  <p className="mt-1.5 text-[13px] leading-[1.6] text-[#475569]">
                    {card.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
