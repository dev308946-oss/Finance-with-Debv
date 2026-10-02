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
      className="scroll-mt-16 border-b border-[#1B2735] bg-[#070B12] py-16 sm:py-20 lg:py-24"
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
            COMMUNITY ECOSYSTEM
          </p>
          <h2
            className="mt-2 font-display text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-[#F5F7FA] sm:text-[34px] lg:text-[36px]"
            style={{ textWrap: 'balance' }}
          >
            {heading}
          </h2>
          <p className="mt-2.5 text-[15px] leading-[1.65] text-[#8D99A8] sm:text-[16px]">
            {subheading}
          </p>
        </motion.div>

        {/* 6 Concise Cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, idx) => {
            const IconComponent = ICON_MAP[card.iconName];

            return (
              <motion.article
                key={card.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="card-elevate flex flex-col justify-between rounded-[16px] border border-[#1B2735] bg-[#0D141D] p-6 shadow-[0_10px_28px_rgba(0,0,0,0.22)]"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#1B2735] bg-[#0A1018] text-[#19D3A2]">
                    <IconComponent className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 font-display text-[18px] font-bold tracking-[-0.01em] text-[#F5F7FA]">
                    {card.title}
                  </h3>

                  <p className="mt-1.5 text-[15px] leading-[1.6] text-[#8D99A8]">
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
