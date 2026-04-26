"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, ClipboardList, Award, Trophy, Zap, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser, supabase } from "@/lib/db";
import type { Profile } from "@/lib/db";

const navItems = [
  { href: "/ambassador/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ambassador/tasks", label: "My Tasks", icon: ClipboardList },
  { href: "/ambassador/achievements", label: "Achievements", icon: Award },
  { href: "/ambassador/leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function AmbassadorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    async function load() {
      const profile = await getCurrentUser();
      if (profile) setUser(profile);
    }
    load();
  }, []);

  async function handleSignOut() {
    if (supabase) {
      await supabase.auth.signOut();
      router.push("/auth?mode=signin");
    }
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] glass border-r border-white/[0.06] flex flex-col z-40" style={{ borderRadius: 0 }}>
      <div className="p-5 border-b border-white/[0.04]">
        <Link href="/ambassador/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-[#6C5CE7] flex items-center justify-center transition-transform group-hover:scale-110">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-semibold text-white tracking-tight block leading-tight">CampusConnect</span>
            <span className="text-[9px] label-text">Ambassador</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/ambassador/tasks" && pathname?.startsWith("/ambassador/tasks/"));
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#6C5CE7]/12 text-[#A29BFE] border border-[#6C5CE7]/15"
                    : "text-[#6b6b8a] hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1">{item.label}</span>
                {isActive && <div className="w-1 h-1 rounded-full bg-[#6C5CE7]" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/[0.04]">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-[#6C5CE7]/15 flex items-center justify-center text-[11px] font-bold text-[#A29BFE]">
            {user?.full_name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-white truncate">{user?.full_name || "Ambassador"}</p>
            <p className="text-[10px] text-[#6b6b8a] truncate">{user?.email || "Loading..."}</p>
          </div>
        </div>
        <button onClick={handleSignOut} className="w-full">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-[#6b6b8a] hover:text-white hover:bg-white/[0.03] transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </div>
        </button>
      </div>
    </aside>
  );
}
