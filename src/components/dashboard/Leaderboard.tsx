"use client";

import { motion } from "framer-motion";
import { Trophy, ChevronRight } from "lucide-react";
import Link from "next/link";

interface LeaderboardEntry {
  id: string;
  full_name: string;
  total_points: number;
  tasks_completed: number;
  badges_count: number;
  college?: string;
}

interface LeaderboardProps {
  data: LeaderboardEntry[];
  compact?: boolean;
  viewAllHref?: string;
  highlightId?: string;
}

export default function Leaderboard({ data, compact = false, viewAllHref = "/org/leaderboard", highlightId }: LeaderboardProps) {
  const getRank = (i: number) => {
    if (i === 0) return "🥇";
    if (i === 1) return "🥈";
    if (i === 2) return "🥉";
    return `#${i + 1}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#A29BFE]" />
          <h3 className="text-sm font-semibold text-white">Leaderboard</h3>
        </div>
        {compact && (
          <Link href={viewAllHref} className="text-[11px] text-[#6b6b8a] hover:text-[#A29BFE] flex items-center gap-0.5 transition-colors">
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {data.map((entry, i) => {
          const isHighlighted = entry.id === highlightId;
          const maxPoints = data[0]?.total_points || 1;
          const barWidth = `${(entry.total_points / maxPoints) * 100}%`;

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className={`flex items-center gap-2 py-1.5 px-2 rounded-xl transition-colors ${isHighlighted ? "bg-[#6C5CE7]/10 border border-[#6C5CE7]/15" : "hover:bg-white/[0.02]"}`}
            >
              <span className={`text-xs w-5 text-center ${i < 3 ? "text-sm" : "text-[#6b6b8a]"}`}>{getRank(i)}</span>
              <div className="w-6 h-6 rounded-full bg-[#6C5CE7]/15 flex items-center justify-center text-[10px] font-bold text-[#A29BFE] shrink-0">
                {entry.full_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-white truncate">{entry.full_name}</p>
                {!compact && entry.college && <p className="text-[10px] text-[#6b6b8a] truncate">{entry.college}</p>}
              </div>
              {!compact && (
                <div className="w-20 h-1 rounded-full bg-white/5 overflow-hidden hidden sm:block">
                  <motion.div initial={{ width: 0 }} animate={{ width: barWidth }} transition={{ duration: 0.8, delay: i * 0.1 }} className="h-full rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE]" />
                </div>
              )}
              <span className="text-xs font-bold text-[#A29BFE] w-10 text-right">{entry.total_points}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
