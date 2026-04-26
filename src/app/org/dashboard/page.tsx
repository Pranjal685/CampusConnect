"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Zap, Clock, Star, CheckCircle, XCircle } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import Leaderboard from "@/components/dashboard/Leaderboard";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import {
  getCurrentUser,
  getSubmissionsByOrg,
  getLeaderboard,
  getTasksByOrg,
  approveSubmission,
  rejectSubmission,
} from "@/lib/db";
import { processApprovedSubmission } from "@/lib/points";
import type { Profile, Submission, LeaderboardEntry } from "@/lib/db";
import { createOrg } from "@/lib/db";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-white/[0.06] rounded-lg ${className}`} />
);

function buildWeekData(submissions: Submission[]) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 6 + i);
    const dayStr = d.toDateString();
    return {
      day: days[d.getDay()],
      count: submissions.filter((s) => new Date(s.submitted_at).toDateString() === dayStr).length,
    };
  });
}

export default function OrgDashboard() {
  const [user, setUser] = useState<Profile | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTasks, setActiveTasks] = useState(0);
  const [ambassadorCount, setAmbassadorCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);
  
  // Org setup state
  const [orgName, setOrgName] = useState("");
  const [orgDesc, setOrgDesc] = useState("");
  const [creatingOrg, setCreatingOrg] = useState(false);

  // eslint-disable-next-line react-hooks/purity
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    async function load() {
      try {
        const profile = await getCurrentUser();
        if (!profile) return;
        setUser(profile);

        if (!profile.org_id) {
          setLoading(false);
          return;
        }

        const [subs, lb, tasks] = await Promise.all([
          getSubmissionsByOrg(profile.org_id),
          getLeaderboard(profile.org_id),
          getTasksByOrg(profile.org_id),
        ]);

        setSubmissions(subs);
        setLeaderboard(lb);
        setActiveTasks(tasks.filter((t) => t.status === "active").length);
        setAmbassadorCount(lb.length);
        setTotalPoints(lb.reduce((s, a) => s + a.total_points, 0));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleApprove(submissionId: string) {
    setActioning(submissionId);
    try {
      await approveSubmission(submissionId);
      await processApprovedSubmission(submissionId);
      setSubmissions((prev) =>
        prev.map((s) => (s.id === submissionId ? { ...s, status: "approved" as const } : s))
      );
    } finally {
      setActioning(null);
    }
  }

  async function handleReject(submissionId: string) {
    setActioning(submissionId);
    try {
      await rejectSubmission(submissionId);
      setSubmissions((prev) =>
        prev.map((s) => (s.id === submissionId ? { ...s, status: "rejected" as const } : s))
      );
    } finally {
      setActioning(null);
    }
  }

  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const recentSubs = submissions.slice(0, 6);
  // eslint-disable-next-line react-hooks/purity
  const weekData = buildWeekData(submissions);

  async function handleCreateOrg(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !orgName.trim()) return;
    setCreatingOrg(true);
    try {
      const org = await createOrg(orgName.trim(), orgDesc.trim() || "Welcome to our ambassador program!", user.id);
      setUser({ ...user, org_id: org.id });
      // Refresh data
      const [subs, lb, tasks] = await Promise.all([
        getSubmissionsByOrg(org.id),
        getLeaderboard(org.id),
        getTasksByOrg(org.id),
      ]);
      setSubmissions(subs);
      setLeaderboard(lb);
      setActiveTasks(tasks.filter((t) => t.status === "active").length);
      setAmbassadorCount(lb.length);
      setTotalPoints(lb.reduce((s, a) => s + a.total_points, 0));
    } catch (err) {
      console.error("Failed to create org:", err);
    } finally {
      setCreatingOrg(false);
    }
  }

  if (!loading && user && !user.org_id) {
    return (
      <div className="max-w-md mx-auto mt-20 glass p-8 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-2">Set Up Your Organization</h2>
        <p className="text-sm text-[#6b6b8a] mb-6">You need to create an organization profile before managing ambassadors.</p>
        <form onSubmit={handleCreateOrg} className="space-y-4">
          <div>
            <label className="text-xs text-[#6b6b8a] mb-1.5 block">Organization Name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full px-3 py-2.5 rounded-xl text-sm text-white bg-white/[0.04] border border-white/[0.08] focus:border-[#6C5CE7] outline-none"
              required
            />
          </div>
          <div>
            <label className="text-xs text-[#6b6b8a] mb-1.5 block">Description</label>
            <textarea
              value={orgDesc}
              onChange={(e) => setOrgDesc(e.target.value)}
              placeholder="Brief description of your program..."
              className="w-full px-3 py-2.5 rounded-xl text-sm text-white bg-white/[0.04] border border-white/[0.08] focus:border-[#6C5CE7] outline-none min-h-[80px]"
            />
          </div>
          <button
            type="submit"
            disabled={creatingOrg}
            className="w-full py-2.5 rounded-xl text-sm font-medium bg-[#6C5CE7] text-white disabled:opacity-50"
          >
            {creatingOrg ? "Creating..." : "Create Organization"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        {loading ? (
          <Skeleton className="h-6 w-48 mb-1" />
        ) : (
          <h1 className="text-xl font-bold text-white">
            {greeting}, {user?.full_name?.split(" ")[0] ?? "there"} 👋
          </h1>
        )}
        <p className="text-xs text-[#6b6b8a] mt-0.5">Your program at a glance</p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[88px]" />
          ))
        ) : (
          <>
            <StatsCard title="Total Ambassadors" value={ambassadorCount} icon={Users} trend="up" trendValue={`${ambassadorCount}`} delay={0} />
            <StatsCard title="Active Tasks" value={activeTasks} icon={Zap} delay={1} />
            <StatsCard title="Pending Reviews" value={pendingCount} icon={Clock} trend={pendingCount > 3 ? "up" : "neutral"} trendValue={pendingCount > 3 ? "Needs attention" : ""} delay={2} highlight={pendingCount > 3} />
            <StatsCard title="Points Distributed" value={totalPoints} icon={Star} trend="up" delay={3} />
          </>
        )}
      </div>

      {/* Chart + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-4 lg:col-span-3"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Submissions This Week</h3>
          {loading ? (
            <Skeleton className="h-[200px]" />
          ) : (
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="day" tick={{ fill: "#6b6b8a", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b6b8a", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(12,12,24,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12, color: "#f0f0f5" }} />
                  <Bar dataKey="count" fill="#6C5CE7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-4 lg:col-span-2"
        >
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 mb-3" />
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
              <Users className="w-8 h-8 text-[#6b6b8a] mb-2" />
              <p className="text-xs text-[#6b6b8a]">No ambassadors yet</p>
            </div>
          ) : (
            <Leaderboard data={leaderboard.slice(0, 5)} compact />
          )}
        </motion.div>
      </div>

      {/* Recent Submissions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-white/[0.04]">
          <h3 className="text-sm font-semibold text-white">Recent Submissions</h3>
        </div>

        {loading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : recentSubs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="w-8 h-8 text-[#6b6b8a] mb-2" />
            <p className="text-sm text-[#6b6b8a]">No submissions yet</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-5 gap-2 px-4 py-2 bg-white/[0.02] border-b border-white/[0.04]">
              <span className="label-text">Ambassador</span>
              <span className="label-text">Task</span>
              <span className="label-text">Submitted</span>
              <span className="label-text">Status</span>
              <span className="label-text text-right">Action</span>
            </div>
            {recentSubs.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.03 }}
                className="grid grid-cols-5 gap-2 px-4 py-2.5 border-b border-white/[0.02] hover:bg-white/[0.02] items-center transition-colors"
              >
                <span className="text-xs text-white">
                  {(sub.ambassador as Profile)?.full_name ?? "—"}
                </span>
                <span className="text-xs text-[#6b6b8a] truncate">
                  {sub.task?.title ?? "—"}
                </span>
                <span className="text-[11px] text-[#6b6b8a]">
                  {new Date(sub.submitted_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium w-fit ${sub.status === "approved" ? "bg-emerald-500/10 text-emerald-400" : sub.status === "rejected" ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                  {sub.status}
                </span>
                <div className="flex justify-end gap-1.5">
                  {sub.status === "pending" && (
                    <>
                      <button
                        disabled={actioning === sub.id}
                        onClick={() => handleApprove(sub.id)}
                        className="p-1 rounded-lg hover:bg-emerald-500/10 text-emerald-400 transition-colors disabled:opacity-40"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={actioning === sub.id}
                        onClick={() => handleReject(sub.id)}
                        className="p-1 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors disabled:opacity-40"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </>
        )}
      </motion.div>
    </div>
  );
}
