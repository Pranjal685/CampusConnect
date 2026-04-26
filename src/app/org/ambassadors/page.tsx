"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, ChevronUp, Users } from "lucide-react";
import { getCurrentUser, getLeaderboard, getSubmissionsByOrg } from "@/lib/db";
import type { LeaderboardEntry, Submission } from "@/lib/db";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-white/[0.06] rounded-lg ${className}`} />
);

interface AmbassadorRow extends LeaderboardEntry {
  submissions: (Submission & { task_title: string })[];
}

export default function OrgAmbassadorsPage() {
  const [rows, setRows] = useState<AmbassadorRow[]>([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const profile = await getCurrentUser();
        if (!profile?.org_id) return;

        const [lb, subs] = await Promise.all([
          getLeaderboard(profile.org_id),
          getSubmissionsByOrg(profile.org_id),
        ]);

        const data: AmbassadorRow[] = lb.map((amb) => ({
          ...amb,
          submissions: subs
            .filter((s) => s.ambassador_id === amb.id)
            .map((s) => ({
              ...s,
              task_title: s.task?.title ?? "Unknown",
            })),
        }));

        setRows(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = rows.filter(
    (a) =>
      a.full_name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-bold text-white">Ambassadors</h1>
        <p className="text-xs text-[#6b6b8a] mt-0.5">
          {loading ? "Loading..." : `${rows.length} total ambassadors`}
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b8a]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ambassadors..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white bg-white/[0.04] border border-white/[0.08] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7]/30 outline-none placeholder:text-[#6b6b8a]/60 transition-all"
          />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass overflow-hidden">
        <div className="grid grid-cols-7 gap-2 px-4 py-2.5 bg-white/[0.03] border-b border-white/5">
          <span className="label-text col-span-2">Name</span>
          <span className="label-text">Points</span>
          <span className="label-text">Tasks Done</span>
          <span className="label-text">Badges</span>
          <span className="label-text">Joined</span>
          <span className="label-text text-right">Details</span>
        </div>

        {loading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="w-8 h-8 text-[#6b6b8a] mb-2" />
            <p className="text-sm text-[#6b6b8a]">
              {rows.length === 0 ? "No ambassadors have joined yet" : "No results found"}
            </p>
          </div>
        ) : (
          filtered.map((amb, i) => (
            <div key={amb.id}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-7 gap-2 px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer items-center"
                onClick={() => setExpanded(expanded === amb.id ? null : amb.id)}
              >
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#6C5CE7]/20 flex items-center justify-center text-xs font-medium text-[#A29BFE]">
                    {amb.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-white">{amb.full_name}</p>
                    <p className="text-[10px] text-[#6b6b8a]">{amb.email}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-[#A29BFE]">{amb.total_points}</p>
                <p className="text-sm text-white">{amb.tasks_completed}</p>
                <p className="text-sm text-white">{amb.badges_count}</p>
                <p className="text-xs text-[#6b6b8a]">
                  {new Date(amb.created_at).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <div className="text-right">
                  {expanded === amb.id ? (
                    <ChevronUp className="w-4 h-4 text-[#6b6b8a] ml-auto" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6b6b8a] ml-auto" />
                  )}
                </div>
              </motion.div>

              {expanded === amb.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-4 py-3 bg-white/[0.02] border-b border-white/[0.03]"
                >
                  <p className="label-text mb-2">Recent Submissions</p>
                  {amb.submissions.length === 0 ? (
                    <p className="text-xs text-[#6b6b8a]">No submissions yet</p>
                  ) : (
                    <div className="space-y-1">
                      {amb.submissions.slice(0, 5).map((sub) => (
                        <div key={sub.id} className="flex items-center gap-3 text-xs py-1">
                          <span className="text-[#6b6b8a] flex-1 truncate">{sub.task_title}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              sub.status === "approved"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : sub.status === "rejected"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-yellow-500/10 text-yellow-400"
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          ))
        )}
      </motion.div>
    </div>
  );
}
