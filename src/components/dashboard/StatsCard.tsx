"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  delay?: number;
  suffix?: string;
  highlight?: boolean;
}

export default function StatsCard({ title, value, icon: Icon, trend, trendValue, delay = 0, suffix = "", highlight = false }: StatsCardProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, delay: delay * 0.12, ease: [0.25, 0.46, 0.45, 0.94] });
    return controls.stop;
  }, [count, value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: delay * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`glass rounded-2xl p-4 card-hover ${highlight ? "border-yellow-500/20 bg-yellow-500/[0.03]" : ""}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded-xl bg-[#6C5CE7]/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#A29BFE]" />
        </div>
        {trendValue && (
          <div className={`flex items-center gap-0.5 text-[11px] font-medium ${trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-[#6b6b8a]"}`}>
            {trend === "up" && <TrendingUp className="w-3 h-3" />}
            {trend === "down" && <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <motion.span className="text-2xl font-bold text-white tracking-tight">{rounded}</motion.span>
        {suffix && <span className="text-xs text-[#6b6b8a]">{suffix}</span>}
      </div>
      <p className="label-text mt-1">{title}</p>
    </motion.div>
  );
}
