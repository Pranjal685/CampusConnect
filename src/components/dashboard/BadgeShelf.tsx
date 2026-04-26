"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { Badge } from "@/lib/supabase";
import { BADGE_INFO, BadgeType } from "@/lib/badges";

interface BadgeShelfProps {
  earnedBadges: Badge[];
  showAll?: boolean;
}

const ALL_TYPES: BadgeType[] = ["first_task", "rising_star", "referral_king", "content_creator", "top_performer", "week_streak"];

export default function BadgeShelf({ earnedBadges, showAll = false }: BadgeShelfProps) {
  const earnedTypes = new Set(earnedBadges.map(b => b.badge_type));
  const display = showAll ? ALL_TYPES : (earnedBadges.map(b => b.badge_type) as BadgeType[]);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {display.map((type, i) => {
        const info = BADGE_INFO[type];
        const isEarned = earnedTypes.has(type);

        return (
          <motion.div
            key={type}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className={`relative rounded-xl p-3 text-center transition-all group cursor-default ${
              isEarned
                ? "glass-md card-hover"
                : "bg-white/[0.02] border border-white/[0.04]"
            }`}
            title={isEarned ? `${info.name}: ${info.description}` : `${info.howToEarn} to unlock`}
          >
            <div className={`text-2xl mb-1 ${!isEarned ? "opacity-20 grayscale" : ""}`}>
              {info.icon}
            </div>
            <p className={`text-[10px] font-medium ${isEarned ? "text-white" : "text-[#6b6b8a]/50"}`}>
              {info.name}
            </p>
            {!isEarned && (
              <Lock className="w-2.5 h-2.5 text-[#6b6b8a]/30 absolute top-1.5 right-1.5" />
            )}
            {isEarned && (
              <div className="absolute inset-0 rounded-xl border border-[#6C5CE7]/20 pointer-events-none" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
