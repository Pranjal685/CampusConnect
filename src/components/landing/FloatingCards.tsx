"use client";
import { motion } from "framer-motion";
import { Trophy, Star, Flame, Bell } from "lucide-react";

const cardBase = "glass-md rounded-2xl p-3 shadow-xl shadow-black/30 w-[200px]";

function LeaderboardCard() {
  return (
    <div className={cardBase}>
      <div className="flex items-center gap-1.5 mb-2">
        <Trophy className="w-3 h-3 text-[#A29BFE]" />
        <span className="text-[10px] font-semibold text-white/80">Leaderboard</span>
      </div>
      {[
        { rank: "🥇", name: "Priya S.", pts: 520, color: "text-yellow-400" },
        { rank: "🥈", name: "Rohan G.", pts: 525, color: "text-gray-300" },
        { rank: "🥉", name: "Ananya R.", pts: 140, color: "text-amber-500" },
      ].map((r) => (
        <div key={r.name} className="flex items-center gap-2 py-1">
          <span className="text-xs">{r.rank}</span>
          <span className="text-[11px] text-white/70 flex-1">{r.name}</span>
          <span className="text-[10px] font-bold text-[#A29BFE]">{r.pts}</span>
        </div>
      ))}
    </div>
  );
}

function TaskNotifCard() {
  return (
    <div className={cardBase}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Bell className="w-3 h-3 text-emerald-400" />
        <span className="text-[10px] font-semibold text-white/80">New Task Assigned</span>
      </div>
      <p className="text-[11px] text-white/60 mb-1.5">Share event on LinkedIn</p>
      <div className="flex items-center gap-1">
        <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-purple-500/15 text-purple-400">content</span>
        <span className="text-[10px] font-bold text-[#A29BFE] ml-auto">+50 pts</span>
      </div>
    </div>
  );
}

function BadgeCard() {
  return (
    <div className={`${cardBase} w-[180px]`}>
      <div className="flex items-center gap-1.5 mb-1">
        <Star className="w-3 h-3 text-yellow-400" />
        <span className="text-[10px] font-semibold text-white/80">Badge Earned</span>
      </div>
      <p className="text-lg mb-0.5">🏆</p>
      <p className="text-[11px] font-medium text-white/70">Top Performer</p>
      <p className="text-[9px] text-white/40">Reached #1 on leaderboard</p>
    </div>
  );
}

function StatsCard() {
  return (
    <div className={`${cardBase} w-[180px]`}>
      <div className="flex items-center gap-1.5 mb-2">
        <Flame className="w-3 h-3 text-orange-400" />
        <span className="text-[10px] font-semibold text-white/80">Your Stats</span>
      </div>
      <p className="text-xl font-bold text-white mb-0.5">520</p>
      <p className="text-[10px] text-white/40">Total Points</p>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-[10px] text-emerald-400">🔥 5 day streak</span>
      </div>
    </div>
  );
}

const floatingCards = [
  { Component: LeaderboardCard, x: -380, y: -60, rotate: -6, delay: 0.3 },
  { Component: TaskNotifCard, x: 300, y: -80, rotate: 5, delay: 0.5 },
  { Component: BadgeCard, x: -340, y: 180, rotate: 4, delay: 0.7 },
  { Component: StatsCard, x: 320, y: 160, rotate: -4, delay: 0.9 },
];

export default function FloatingCards() {
  return (
    <div className="absolute inset-0 pointer-events-none hidden lg:block">
      {floatingCards.map(({ Component, x, y, rotate, delay }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: y + 40, x, rotate: rotate - 5, scale: 0.9 }}
          animate={{ opacity: 1, y, x, rotate, scale: 1 }}
          transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute left-1/2 top-1/2"
          style={{ willChange: "transform" }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
          >
            <Component />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
