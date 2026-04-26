"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Trophy, Award, CheckCircle } from "lucide-react";
import { getCurrentUser, getLeaderboard } from "@/lib/db";
import type { LeaderboardEntry, Profile } from "@/lib/db";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-white/[0.06] rounded-lg ${className}`} />
);

const getRankDisplay = (rank: number) => {
  if (rank === 1) return { emoji: "🥇", bg: "bg-yellow-500/10 border-yellow-500/20" };
  if (rank === 2) return { emoji: "🥈", bg: "bg-gray-400/10 border-gray-400/20" };
  if (rank === 3) return { emoji: "🥉", bg: "bg-amber-600/10 border-amber-600/20" };
  return { emoji: `#${rank}`, bg: "" };
};

export default function AmbassadorLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const profile = await getCurrentUser();
        if (!profile) return;
        setCurrentUser(profile);
        if (profile.org_id) {
          const lb = await getLeaderboard(profile.org_id);
          setLeaderboard(lb);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = leaderboard.filter((a) =>
    a.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-bold text-white">Leaderboard</h1>
        <p className="text-xs text-[#6b6b8a] mt-0.5">See where you stand</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b8a]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white bg-white/[0.04] border border-white/[0.08] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7]/30 outline-none placeholder:text-[#6b6b8a]/60 transition-all"
          />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass overflow-hidden">
        <div className="grid grid-cols-6 gap-2 px-4 py-2.5 bg-white/[0.03] border-b border-white/5">
          <span className="label-text">Rank</span>
          <span className="label-text col-span-2">Name</span>
          <span className="label-text">Points</span>
          <span className="label-text">Tasks</span>
          <span className="label-text">Badges</span>
        </div>

        {loading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Trophy className="w-8 h-8 text-[#6b6b8a] mb-2" />
            <p className="text-sm text-[#6b6b8a]">
              {leaderboard.length === 0 ? "No ambassadors yet" : "No results found"}
            </p>
          </div>
        ) : (
          filtered.map((entry, i) => {
            const rank = leaderboard.indexOf(entry) + 1;
            const isCurrentUser = entry.id === currentUser?.id;
            const display = getRankDisplay(rank);

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`grid grid-cols-6 gap-2 px-4 py-3 border-b border-white/[0.03] items-center transition-colors ${
                  isCurrentUser
                    ? "bg-[#6C5CE7]/10 border-l-2 border-l-[#6C5CE7]"
                    : "hover:bg-white/[0.02]"
                } ${display.bg}`}
              >
                <span className={`text-sm font-bold ${rank <= 3 ? "text-lg" : "text-[#6b6b8a]"}`}>
                  {display.emoji}
                </span>
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#6C5CE7]/20 flex items-center justify-center text-xs font-medium text-[#A29BFE]">
                    {entry.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-white">
                      {entry.full_name}{" "}
                      {isCurrentUser && (
                        <span className="text-[10px] text-[#A29BFE]">(You)</span>
                      )}
                    </p>
                    <p className="text-[10px] text-[#6b6b8a]">{entry.email}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-[#A29BFE]">{entry.total_points}</p>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span className="text-sm text-white">{entry.tasks_completed}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#A29BFE]" />
                  <span className="text-sm text-white">{entry.badges_count}</span>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}
