"use client";

import { motion } from "framer-motion";
import { Activity, CheckCircle, XCircle, Clock } from "lucide-react";

interface ActivityItem {
  id: string;
  ambassador_name: string;
  task_title: string;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

const statusConfig = {
  pending: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10", label: "Pending" },
  approved: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Approved" },
  rejected: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10", label: "Rejected" },
};

export default function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass p-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-[#A29BFE]" />
        <h3 className="text-sm font-semibold text-white">Recent Submissions</h3>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.03]">
          <span className="text-[10px] label-text w-28">Ambassador</span>
          <span className="text-[10px] label-text flex-1">Task</span>
          <span className="text-[10px] label-text w-20">Date</span>
          <span className="text-[10px] label-text w-20 text-right">Status</span>
        </div>
        {items.map((item, i) => {
          const config = statusConfig[item.status];
          const StatusIcon = config.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-colors"
            >
              <span className="text-xs text-white w-28 truncate">{item.ambassador_name}</span>
              <span className="text-xs text-[#6b6b8a] flex-1 truncate">{item.task_title}</span>
              <span className="text-[10px] text-[#6b6b8a] w-20">
                {new Date(item.submitted_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
              </span>
              <div className="w-20 flex justify-end">
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${config.bg} ${config.color}`}>
                  <StatusIcon className="w-2.5 h-2.5" />
                  {config.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
