"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import TaskCard from "@/components/dashboard/TaskCard";
import CreateTaskForm from "@/components/forms/CreateTaskForm";
import {
  getCurrentUser,
  getTasksByOrg,
  createTask,
  closeTask,
} from "@/lib/db";
import type { Task } from "@/lib/db";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-white/[0.06] rounded-lg ${className}`} />
);

export default function OrgTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const profile = await getCurrentUser();
        if (!profile) return;
        if (!profile.org_id) {
          setLoading(false);
          return;
        }
        setOrgId(profile.org_id);
        const data = await getTasksByOrg(profile.org_id);
        setTasks(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (!loading && !orgId) {
    return (
      <div className="max-w-6xl text-center py-20">
        <p className="text-white mb-2">Please set up your organization first.</p>
        <a href="/org/dashboard" className="text-sm text-[#A29BFE] hover:text-white">Go to Dashboard</a>
      </div>
    );
  }

  async function handleCreateTask(taskData: {
    title: string;
    description: string;
    task_type: string;
    points_value: number;
    deadline: string;
  }) {
    if (!orgId) return;
    try {
      const newTask = await createTask({
        org_id: orgId,
        title: taskData.title,
        description: taskData.description,
        task_type: taskData.task_type as Task["task_type"],
        points_value: taskData.points_value,
        deadline: new Date(taskData.deadline).toISOString(),
      });
      setTasks((prev) => [newTask, ...prev]);
      setShowForm(false);
      toast.success("Task created successfully");
    } catch (err) {
      // SECURITY FIX: log full error server-side, show generic message to user
      console.error("createTask error:", err);
      toast.error("Failed to create task. Please try again.");
    }
  }

  async function handleToggleStatus(taskId: string) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    try {
      if (task.status === "active") {
        await closeTask(taskId);
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: "closed" as const } : t))
        );
        toast.success("Task closed");
      }
    } catch (err) {
      // SECURITY FIX: log full error, show generic message
      console.error("closeTask error:", err);
      toast.error("Failed to update task. Please try again.");
    }
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-bold text-white">Tasks</h1>
          {loading ? (
            <Skeleton className="h-3 w-24 mt-1" />
          ) : (
            <p className="text-xs text-[#6b6b8a] mt-0.5">{tasks.length} total tasks</p>
          )}
        </motion.div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Task
        </motion.button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass rounded-2xl flex flex-col items-center justify-center py-16 text-center">
          <Plus className="w-8 h-8 text-[#6b6b8a] mb-3" />
          <p className="text-sm font-medium text-white mb-1">No tasks yet</p>
          <p className="text-xs text-[#6b6b8a]">Create your first task to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <TaskCard
                task={task}
                onToggleStatus={handleToggleStatus}
              />
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <CreateTaskForm
            onClose={() => setShowForm(false)}
            onSubmit={handleCreateTask}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
