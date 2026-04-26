"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";

interface PointsChartProps {
  data: { date: string; points: number }[];
  title?: string;
}

export default function PointsChart({ data, title = "Points Over Time" }: PointsChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass p-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-[#A29BFE]" />
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6b6b8a" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#6b6b8a" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(20,20,35,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="points"
              stroke="#6C5CE7"
              strokeWidth={2}
              dot={{ fill: "#6C5CE7", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#A29BFE" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
