"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, TrendingUp } from "lucide-react";
import PointsChart from "@/components/dashboard/PointsChart";
import BadgeShelf from "@/components/dashboard/BadgeShelf";
import { getCurrentUser, getPointsHistory, getBadgesByAmbassador } from "@/lib/db";
import type { Badge, PointsLog } from "@/lib/db";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-white/[0.06] rounded-lg ${className}`} />
);

function buildChartData(history: PointsLog[]) {
  let cumulative = 0;
  return history.map((p) => {
    cumulative += p.points;
    return {
      date: new Date(p.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      points: cumulative,
    };
  });
}

export default function AchievementsPage() {
  const [pointsLog, setPointsLog] = useState<PointsLog[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [chartData, setChartData] = useState<{ date: string; points: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const profile = await getCurrentUser();
        if (!profile) return;

        const [history, bdgs] = await Promise.all([
          getPointsHistory(profile.id),
          getBadgesByAmbassador(profile.id),
        ]);

        setChartData(buildChartData(history));
        setPointsLog([...history].reverse());
        setBadges(bdgs);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalPoints = pointsLog.reduce((s, p) => s + p.points, 0);

  return (
    <div className="w-full">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-bold text-white">Achievements</h1>
        <p className="text-xs text-[#6b6b8a] mt-0.5">Your points and badges</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
        {loading ? (
          <>
            <Skeleton className="h-[220px]" />
            <Skeleton className="h-[220px]" />
          </>
        ) : (
          <>
            <PointsChart data={chartData} title="Points History" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass p-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-[#A29BFE]" />
                <h3 className="text-sm font-semibold text-white">Points Log</h3>
                <span className="ml-auto text-xs text-[#A29BFE] font-bold">{totalPoints} total</span>
              </div>
              {pointsLog.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <TrendingUp className="w-7 h-7 text-[#6b6b8a] mb-2" />
                  <p className="text-xs text-[#6b6b8a]">Complete tasks to earn points</p>
                </div>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {pointsLog.map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center justify-between py-1.5 border-b border-white/[0.03] last:border-0"
                    >
                      <div>
                        <p className="text-xs text-white">{entry.reason}</p>
                        <p className="text-[10px] text-[#6b6b8a]">
                          {new Date(entry.created_at).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">+{entry.points}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-[#A29BFE]" />
          <h3 className="text-sm font-semibold text-white">All Badges</h3>
          <span className="ml-auto text-xs text-[#6b6b8a]">{badges.length}/6 earned</span>
        </div>
        {loading ? (
          <Skeleton className="h-20" />
        ) : (
          <BadgeShelf earnedBadges={badges} showAll />
        )}
      </motion.div>
    </div>
  );
}
