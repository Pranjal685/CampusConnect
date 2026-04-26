"use client";

import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { Send, Link2, CheckCircle } from "lucide-react";
import { getCurrentUser, submitProof } from "@/lib/db";
import type { Task } from "@/lib/db";
import { supabase } from "@/lib/supabase";

const typeColors: Record<string, string> = {
  referral: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  content: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  promotion: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  event: "bg-amber-500/15 text-amber-400 border-amber-500/20",
};

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-white/[0.06] rounded-lg ${className}`} />
);

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [proofText, setProofText] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!supabase) return;
      try {
        const { data } = await supabase
          .from("tasks")
          .select("*")
          .eq("id", id)
          .single();
        setTask(data ?? null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const profile = await getCurrentUser();
      if (!profile) throw new Error("Not authenticated");
      await submitProof(id, profile.id, proofText, proofUrl || undefined);
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-4 w-20 mb-4" />
        <Skeleton className="h-40" />
        <Skeleton className="h-56" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-white mb-2">Task not found</p>
        <Link href="/ambassador/tasks" className="text-sm text-[#A29BFE] hover:text-white">
          ← Back to Tasks
        </Link>
      </div>
    );
  }

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          href="/ambassador/tasks"
          className="inline-flex items-center gap-1 text-xs text-[#6b6b8a] hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Tasks
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 mb-4">
        <div className="flex items-start justify-between mb-3">
          <h1 className="text-lg font-bold text-white">{task.title}</h1>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${typeColors[task.task_type]}`}>
            {task.task_type}
          </span>
        </div>
        <p className="text-sm text-[#6b6b8a] leading-relaxed mb-4">{task.description}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-[#A29BFE]" />
            <span className="text-sm font-bold text-[#A29BFE]">{task.points_value} points</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#6b6b8a]" />
            <span className="text-sm text-[#6b6b8a]">{daysLeft} days remaining</span>
          </div>
        </div>
      </motion.div>

      <div className="h-px bg-white/[0.05] my-4" />

      {/* Proof Submission */}
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Proof Submitted!</h3>
          <p className="text-sm text-[#6b6b8a]">
            Your submission is under review. Points will be awarded once approved.
          </p>
          <Link
            href="/ambassador/tasks"
            className="mt-4 inline-block text-sm text-[#A29BFE] hover:text-white transition-colors"
          >
            ← Back to Tasks
          </Link>
        </motion.div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="glass p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold text-white mb-1">Submit Your Proof</h3>

          <div>
            <label className="text-xs text-[#6b6b8a] mb-1.5 block">Describe what you did</label>
            <textarea
              value={proofText}
              onChange={(e) => setProofText(e.target.value)}
              placeholder="I posted on LinkedIn and got 200+ impressions. I tagged 5 connections including..."
              className="w-full px-3 py-2.5 rounded-xl text-sm text-white bg-white/[0.04] border border-white/[0.08] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7]/30 outline-none placeholder:text-[#6b6b8a]/60 transition-all min-h-[100px] resize-none"
              required
            />
          </div>

          <div>
            <label className="text-xs text-[#6b6b8a] mb-1.5 flex items-center gap-1">
              <Link2 className="w-3 h-3" /> Proof Link (optional)
            </label>
            <input
              type="url"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="https://linkedin.com/posts/your-post"
              className="w-full px-3 py-2.5 rounded-xl text-sm text-white bg-white/[0.04] border border-white/[0.08] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7]/30 outline-none placeholder:text-[#6b6b8a]/60 transition-all"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {submitting ? "Submitting..." : "Submit Proof"}
          </button>
        </motion.form>
      )}
    </div>
  );
}
