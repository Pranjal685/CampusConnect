"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, ArrowRight, ToggleLeft, ToggleRight } from "lucide-react";
import type { Task } from "@/lib/supabase";

const typeColors: Record<string, string> = {
  referral: "bg-blue-500/10 text-blue-400",
  content: "bg-purple-500/10 text-purple-400",
  promotion: "bg-emerald-500/10 text-emerald-400",
  event: "bg-amber-500/10 text-amber-400",
};

interface TaskCardProps {
  task: Task;
  submissionCount?: number;
  showSubmit?: boolean;
  onToggleStatus?: (id: string) => void;
}

export default function TaskCard({ task, submissionCount, showSubmit, onToggleStatus }: TaskCardProps) {
  const daysLeft = Math.max(0, Math.ceil((new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="glass rounded-2xl p-4 card-hover flex flex-col h-full">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-white leading-tight pr-2">{task.title}</h4>
        <span className={`px-2 py-0.5 rounded-md text-[9px] font-medium shrink-0 ${typeColors[task.task_type]}`}>
          {task.task_type}
        </span>
      </div>

      <p className="text-[12px] text-[#6b6b8a] leading-relaxed mb-3 line-clamp-2 flex-1">{task.description}</p>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-bold text-[#A29BFE]">{task.points_value} pts</span>
        <div className="flex items-center gap-1 ml-auto text-[#6b6b8a]">
          <Clock className="w-3 h-3" />
          <span className="text-[11px]">{daysLeft}d left</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
        {submissionCount !== undefined && (
          <span className="text-[10px] text-[#6b6b8a]">{submissionCount} submission{submissionCount !== 1 ? "s" : ""}</span>
        )}

        {onToggleStatus && (
          <button
            onClick={(e) => { e.preventDefault(); onToggleStatus(task.id); }}
            className="ml-auto flex items-center gap-1 text-[11px] text-[#6b6b8a] hover:text-white transition-colors"
          >
            {task.status === "active" ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
            {task.status}
          </button>
        )}

        {showSubmit && (
          <Link
            href={`/ambassador/tasks/${task.id}`}
            className="ml-auto flex items-center gap-1 text-[11px] font-medium text-[#A29BFE] hover:text-white transition-colors"
          >
            Submit Proof <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
