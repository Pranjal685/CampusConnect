"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import TaskCard from "@/components/dashboard/TaskCard";
import {
  getCurrentUser,
  getActiveTasksForAmbassador,
  getSubmissionsByAmbassador,
} from "@/lib/db";
import type { Task, Submission } from "@/lib/db";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-white/[0.06] rounded-lg ${className}`} />
);

export default function AmbassadorTasksPage() {
  const [available, setAvailable] = useState<Task[]>([]);
  const [submitted, setSubmitted] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const profile = await getCurrentUser();
        if (!profile) return;

        const [subs, tasks] = await Promise.all([
          getSubmissionsByAmbassador(profile.id),
          profile.org_id
            ? getActiveTasksForAmbassador(profile.org_id)
            : Promise.resolve([] as Task[]),
        ]);

        const submittedTaskIds = new Set(subs.map((s) => s.task_id));
        setAvailable(tasks.filter((t) => !submittedTaskIds.has(t.id)));
        setSubmitted(subs);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-6xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-bold text-white">Tasks</h1>
        <p className="text-xs text-[#6b6b8a] mt-0.5">Complete tasks to earn points and badges</p>
      </motion.div>

      {/* Available Tasks */}
      <h3 className="text-sm font-semibold text-white mb-3">Available Tasks</h3>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : available.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {available.map((task) => (
            <TaskCard key={task.id} task={task} showSubmit />
          ))}
        </div>
      ) : (
        <div className="glass p-6 col-span-full text-center mb-8 rounded-2xl">
          <CheckCircle className="w-7 h-7 text-emerald-400 mx-auto mb-2" />
          <p className="text-sm text-[#6b6b8a]">
            {loading ? "Loading..." : "No new tasks available right now. Check back soon!"}
          </p>
        </div>
      )}

      {/* Submitted Tasks */}
      <h3 className="text-sm font-semibold text-white mb-3">Submitted Tasks</h3>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : submitted.length === 0 ? (
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-sm text-[#6b6b8a]">No submissions yet — complete a task above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {submitted.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-white line-clamp-2">
                  {sub.task?.title ?? "Task"}
                </h4>
                <span
                  className={`ml-2 shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${
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
              <p className="text-xs text-[#6b6b8a] line-clamp-2 mb-2">{sub.proof_text}</p>
              {sub.ai_feedback && (
                <p className="text-[11px] text-[#A29BFE] italic">{sub.ai_feedback}</p>
              )}
              <p className="text-[10px] text-[#6b6b8a] mt-2">
                {new Date(sub.submitted_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
