"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Award, Flame, Trophy } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import PointsChart from "@/components/dashboard/PointsChart";
import BadgeShelf from "@/components/dashboard/BadgeShelf";
import TaskCard from "@/components/dashboard/TaskCard";
import {
  getCurrentUser,
  getSubmissionsByAmbassador,
  getBadgesByAmbassador,
  getActiveTasksForAmbassador,
  getLeaderboard,
  getPointsHistory,
} from "@/lib/db";
import type { Profile, Submission, Badge, Task, LeaderboardEntry, PointsLog } from "@/lib/db";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-white/[0.06] rounded-lg ${className}`} />
);

function computeStreak(submissions: Submission[]): number {
  const uniqueDays = [
    ...new Set(
      submissions
        .filter((s) => s.status === "approved")
        .map((s) => s.submitted_at.split("T")[0])
    ),
  ].sort().reverse();

  if (uniqueDays.length === 0) return 0;
  let streak = 0;
  for (let i = 0; i < uniqueDays.length; i++) {
    const expected = new Date();
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().split("T")[0];
    if (uniqueDays[i] === expectedStr) streak++;
    else break;
  }
  return streak;
}

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

export default function AmbassadorDashboard() {
  const [user, setUser] = useState<Profile | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [chartData, setChartData] = useState<{ date: string; points: number }[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [rank, setRank] = useState(0);
  const [leaderboardSize, setLeaderboardSize] = useState(0);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/purity
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    async function load() {
      try {
        const profile = await getCurrentUser();
        if (!profile) return;
        setUser(profile);

        const [subs, bdgs, history, activeTasks, lb] = await Promise.all([
          getSubmissionsByAmbassador(profile.id),
          getBadgesByAmbassador(profile.id),
          getPointsHistory(profile.id),
          profile.org_id ? getActiveTasksForAmbassador(profile.org_id) : Promise.resolve([]),
          profile.org_id ? getLeaderboard(profile.org_id) : Promise.resolve([]),
        ]);

        setSubmissions(subs);
        setBadges(bdgs);
        setChartData(buildChartData(history));
        setTotalPoints(history.reduce((s, p) => s + p.points, 0));

        const submittedTaskIds = new Set(subs.map((s) => s.task_id));
        setAvailableTasks(activeTasks.filter((t) => !submittedTaskIds.has(t.id)).slice(0, 3));

        const rankIdx = (lb as LeaderboardEntry[]).findIndex((e) => e.id === profile.id);
        setRank(rankIdx >= 0 ? rankIdx + 1 : lb.length + 1);
        setLeaderboardSize(lb.length);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const tasksCompleted = submissions.filter((s) => s.status === "approved").length;
  // eslint-disable-next-line react-hooks/purity
  const streak = computeStreak(submissions);

  return (
    <div className="max-w-6xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        {loading ? (
          <Skeleton className="h-6 w-48 mb-1" />
        ) : (
          <h1 className="text-xl font-bold text-white">
            {greeting}, {user?.full_name?.split(" ")[0] ?? "there"} 👋
          </h1>
        )}
        <p className="text-xs text-[#6b6b8a] mt-0.5">Here&apos;s how you&apos;re doing</p>
      </motion.div>

      {/* Points Hero */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-5 mb-6 flex items-center justify-between"
      >
        {loading ? (
          <>
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="w-16 h-16 rounded-2xl" />
          </>
        ) : (
          <>
            <div>
              <p className="label-text mb-1">Total Points Earned</p>
              <p className="text-4xl font-extrabold text-white">{totalPoints}</p>
              <p className="text-xs text-[#6b6b8a] mt-1">
                Rank #{rank} of {leaderboardSize}
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-[#6C5CE7]/15 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-[#A29BFE]" />
            </div>
          </>
        )}
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[88px]" />)
        ) : (
          <>
            <StatsCard title="Tasks Completed" value={tasksCompleted} icon={CheckCircle} trend="up" delay={0} />
            <StatsCard title="Badges Earned" value={badges.length} icon={Award} delay={1} />
            <StatsCard title="Current Streak" value={streak} icon={Flame} suffix="days" trend={streak > 0 ? "up" : "neutral"} trendValue={streak > 0 ? "Active" : ""} delay={2} />
          </>
        )}
      </div>

      {/* Chart + Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
        {loading ? (
          <>
            <Skeleton className="h-[220px]" />
            <Skeleton className="h-[220px]" />
          </>
        ) : (
          <>
            <PointsChart data={chartData} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-[#A29BFE]" />
                <h3 className="text-sm font-semibold text-white">Your Badges</h3>
              </div>
              {badges.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Award className="w-8 h-8 text-[#6b6b8a] mb-2" />
                  <p className="text-xs text-[#6b6b8a]">Complete tasks to earn badges</p>
                </div>
              ) : (
                <BadgeShelf earnedBadges={badges} showAll />
              )}
            </motion.div>
          </>
        )}
      </div>

      {/* Available Tasks */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h3 className="text-sm font-semibold text-white mb-3">Available Tasks</h3>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-36" />)}
          </div>
        ) : availableTasks.length === 0 ? (
          <div className="glass rounded-2xl flex flex-col items-center justify-center py-10 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-400 mb-2" />
            <p className="text-sm text-[#6b6b8a]">All tasks submitted — check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {availableTasks.map((task) => (
              <TaskCard key={task.id} task={task} showSubmit />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
