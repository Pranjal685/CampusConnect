"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreateTaskFormProps {
  onClose: () => void;
  onSubmit: (task: {
    title: string;
    description: string;
    task_type: string;
    points_value: number;
    deadline: string;
  }) => void;
}

export default function CreateTaskForm({ onClose, onSubmit }: CreateTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState("referral");
  const [points, setPoints] = useState(50);
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, task_type: taskType, points_value: points, deadline });
  };

  const typeOptions = [
    { value: "referral", label: "Referral", color: "border-blue-500/30 text-blue-400" },
    { value: "content", label: "Content", color: "border-purple-500/30 text-purple-400" },
    { value: "promotion", label: "Promotion", color: "border-emerald-500/30 text-emerald-400" },
    { value: "event", label: "Event", color: "border-amber-500/30 text-amber-400" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-lg glass-strong p-6 z-10"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Create New Task</h2>
          <button onClick={onClose} className="text-[#6b6b8a] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="label-text mb-1.5">Task Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Share event on LinkedIn"
              className="glass border-white/10 text-white text-sm"
              required
              maxLength={200}
            />
          </div>

          <div>
            <Label className="label-text mb-1.5">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task requirements in detail..."
              className="glass border-white/10 text-white text-sm min-h-[80px]"
              required
              maxLength={2000}
            />
          </div>

          <div>
            <Label className="label-text mb-1.5">Task Type</Label>
            <div className="grid grid-cols-4 gap-2">
              {typeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTaskType(opt.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                    taskType === opt.value
                      ? `${opt.color} bg-white/5`
                      : "border-white/5 text-[#6b6b8a] hover:border-white/10"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="label-text mb-1.5">Points Value</Label>
              <Input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                min={10}
                max={500}
                className="glass border-white/10 text-white text-sm"
                required
              />
            </div>
            <div>
              <Label className="label-text mb-1.5">Deadline</Label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="glass border-white/10 text-white text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
