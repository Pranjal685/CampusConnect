"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Starfield from "@/components/landing/Starfield";
import FloatingCards from "@/components/landing/FloatingCards";
import {
  Zap, Trophy, ClipboardCheck, Shield, Award, BarChart3, Bot,
  Puzzle, Eye, Medal, ArrowRight, ChevronRight, Flame, Users,
  CheckCircle, Diamond, Building2, GraduationCap,
} from "lucide-react";
import { useState } from "react";

const fadeInUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"org" | "amb">("org");

  return (
    <div className="min-h-screen bg-[#06060e] overflow-x-hidden">
      <Starfield />
      {/* Gradient blobs */}
      <div className="blob-purple" style={{ top: "-200px", right: "-200px" }} />
      <div className="blob-cyan" style={{ bottom: "-200px", left: "-150px" }} />
      <div className="blob-indigo" style={{ top: "50%", left: "30%", transform: "translate(-50%, -50%)" }} />

      <div className="relative z-10">
        <Navbar />

        {/* ═══ HERO ═══ */}
        <section className="relative min-h-screen flex items-center justify-center px-6 pt-14">
          <div className="dot-grid absolute inset-0 opacity-30" />
          <FloatingCards />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium text-[#A29BFE] glass-md mb-8">
                <Zap className="w-3 h-3" /> Now in Beta — Free for Early Adopters
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-[2.75rem] sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-[-0.03em] mb-5"
            >
              <span className="text-white">Your Campus Ambassador</span>
              <br />
              <span className="text-white">Program, </span>
              <span className="gradient-text">Finally Under Control.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-[15px] text-[#6b6b8a] max-w-xl mx-auto mb-8 leading-relaxed"
            >
              Centralize tasks, track performance, and reward your student ambassadors
              in real-time. The operating system for modern campus marketing.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link href="/auth?role=org" className="px-6 py-2.5 rounded-lg text-sm font-medium bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white transition-all glow-accent flex items-center gap-2 hover:scale-[1.02]">
                Start as Organization <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/auth?role=ambassador" className="px-6 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:text-white glass card-hover border border-white/8">
                Join as Ambassador
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ═══ SOCIAL PROOF MARQUEE ═══ */}
        <section className="border-y border-white/[0.04] py-4 overflow-hidden">
          <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
            {[...Array(2)].map((_, rep) => (
              <div key={rep} className="flex items-center gap-12">
                <span className="text-sm text-white/40 font-medium">500+ <span className="text-[#6b6b8a] text-xs">Campus Ambassadors</span></span>
                <Diamond className="w-2 h-2 text-white/10" />
                <span className="text-sm text-white/40 font-medium">2,400+ <span className="text-[#6b6b8a] text-xs">Tasks Completed</span></span>
                <Diamond className="w-2 h-2 text-white/10" />
                <span className="text-sm text-white/40 font-medium">48+ <span className="text-[#6b6b8a] text-xs">Organizations</span></span>
                <Diamond className="w-2 h-2 text-white/10" />
                <span className="text-sm text-white/40 font-medium">12,000+ <span className="text-[#6b6b8a] text-xs">Points Distributed</span></span>
                <Diamond className="w-2 h-2 text-white/10" />
              </div>
            ))}
          </div>
        </section>

        {/* ═══ PROBLEM SECTION ═══ */}
        <section className="py-24 px-6" id="for-orgs">
          <div className="max-w-5xl mx-auto">
            <motion.p {...fadeInUp} className="label-text text-center mb-3">The Problem</motion.p>
            <motion.h2 {...fadeInUp} className="text-2xl sm:text-3xl font-bold text-white text-center mb-14 tracking-tight">
              Why Ambassador Programs Fail
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Puzzle, title: "No Single Source of Truth", desc: "Scattered across WhatsApp groups, Google Sheets, and email threads. Nothing connects." },
                { icon: Medal, title: "Zero Recognition System", desc: "Top performers go unnoticed. Without gamification, ambassadors quickly disengage." },
                { icon: Eye, title: "Invisible ROI", desc: "Organizations pour budget into programs with no way to measure actual impact or attribution." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="glass rounded-2xl p-5 card-hover border-l-2 border-l-[#6C5CE7]/30"
                >
                  <item.icon className="w-6 h-6 text-[#6b6b8a] mb-3 stroke-[1.5]" />
                  <h3 className="text-sm font-semibold text-white mb-1.5">{item.title}</h3>
                  <p className="text-[13px] text-[#6b6b8a] leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section id="how-it-works" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.p {...fadeInUp} className="label-text text-center mb-3">How It Works</motion.p>
            <motion.h2 {...fadeInUp} className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 tracking-tight">
              Simple for Everyone
            </motion.h2>

            {/* Tab Toggle */}
            <motion.div {...fadeInUp} className="flex justify-center mb-12">
              <div className="glass rounded-xl p-1 flex gap-1">
                <button onClick={() => setActiveTab("org")} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === "org" ? "bg-[#6C5CE7] text-white" : "text-[#6b6b8a] hover:text-white"}`}>
                  <Building2 className="w-3.5 h-3.5" /> For Organizations
                </button>
                <button onClick={() => setActiveTab("amb")} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === "amb" ? "bg-[#6C5CE7] text-white" : "text-[#6b6b8a] hover:text-white"}`}>
                  <GraduationCap className="w-3.5 h-3.5" /> For Ambassadors
                </button>
              </div>
            </motion.div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(activeTab === "org" ? [
                { step: "01", title: "Define Tasks", desc: "Create tasks with clear objectives, point values, and deadlines for your ambassador network." },
                { step: "02", title: "Review Submissions", desc: "Ambassadors submit proof. You review, approve, or request revisions — all in one place." },
                { step: "03", title: "Track & Scale", desc: "Monitor ROI with real-time analytics. Leaderboards and badges keep ambassadors engaged." },
              ] : [
                { step: "01", title: "Browse Tasks", desc: "See all available tasks from your organization with clear point values and deadlines." },
                { step: "02", title: "Submit Proof", desc: "Complete tasks and submit proof — text descriptions, links, or media. Simple and fast." },
                { step: "03", title: "Earn & Rise", desc: "Earn points, unlock badges, and climb the leaderboard. Get recognized for your work." },
              ]).map((item, i) => (
                <motion.div
                  key={`${activeTab}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="glass rounded-2xl p-5 card-hover relative"
                >
                  <span className="text-4xl font-black text-[#6C5CE7]/10 absolute top-3 right-4 select-none">{item.step}</span>
                  <div className="w-8 h-8 rounded-lg bg-[#6C5CE7]/12 flex items-center justify-center mb-3">
                    <span className="text-xs font-bold text-[#A29BFE]">{item.step}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">{item.title}</h3>
                  <p className="text-[13px] text-[#6b6b8a] leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ BENTO FEATURES GRID ═══ */}
        <section id="features" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.p {...fadeInUp} className="label-text text-center mb-3">Features</motion.p>
            <motion.h2 {...fadeInUp} className="text-2xl sm:text-3xl font-bold text-white text-center mb-14 tracking-tight">
              Everything You Need to Scale
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[180px]">
              {/* Large: Leaderboard */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-2xl p-5 card-hover sm:col-span-2 row-span-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6C5CE7]/12 flex items-center justify-center"><Trophy className="w-4 h-4 text-[#A29BFE]" /></div>
                  <h3 className="text-sm font-semibold text-white">Real-time Leaderboard</h3>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-1.5">
                  {[{ r: "🥇", n: "Priya Sharma", p: 520, w: "100%" }, { r: "🥈", n: "Rohan Gupta", p: 525, w: "95%" }, { r: "🥉", n: "Ananya Reddy", p: 140, w: "55%" }].map((e) => (
                    <div key={e.n} className="flex items-center gap-2">
                      <span className="text-xs w-5">{e.r}</span>
                      <span className="text-[11px] text-white/70 w-24 truncate">{e.n}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: e.w }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} className="h-full rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE]" />
                      </div>
                      <span className="text-[10px] font-bold text-[#A29BFE] w-8 text-right">{e.p}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Task Assignment */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-5 card-hover flex flex-col">
                <div className="w-8 h-8 rounded-lg bg-[#6C5CE7]/12 flex items-center justify-center mb-3"><ClipboardCheck className="w-4 h-4 text-[#A29BFE]" /></div>
                <h3 className="text-sm font-semibold text-white mb-1">Task Assignment</h3>
                <p className="text-[11px] text-[#6b6b8a] leading-relaxed">Create tasks by type — referral, content, promotion, or events. Set points and deadlines.</p>
              </motion.div>

              {/* Proof Verification */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="glass rounded-2xl p-5 card-hover flex flex-col">
                <div className="w-8 h-8 rounded-lg bg-[#6C5CE7]/12 flex items-center justify-center mb-3"><Shield className="w-4 h-4 text-[#A29BFE]" /></div>
                <h3 className="text-sm font-semibold text-white mb-1">Proof Verification</h3>
                <div className="flex gap-1 mt-auto">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-yellow-500/10 text-yellow-400">pending</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-emerald-500/10 text-emerald-400">approved</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-red-500/10 text-red-400">rejected</span>
                </div>
              </motion.div>

              {/* Badge System */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-5 card-hover flex flex-col">
                <div className="w-8 h-8 rounded-lg bg-[#6C5CE7]/12 flex items-center justify-center mb-3"><Award className="w-4 h-4 text-[#A29BFE]" /></div>
                <h3 className="text-sm font-semibold text-white mb-1">Badge System</h3>
                <div className="flex gap-2 mt-auto text-xl">🎯 ⭐ 🏆</div>
              </motion.div>

              {/* Large: AI Scoring */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }} className="glass rounded-2xl p-5 card-hover sm:col-span-2 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6C5CE7]/12 flex items-center justify-center"><Bot className="w-4 h-4 text-[#A29BFE]" /></div>
                  <h3 className="text-sm font-semibold text-white">AI Auto-Scoring</h3>
                  <span className="ml-auto px-2 py-0.5 rounded text-[9px] font-medium bg-[#6C5CE7]/15 text-[#A29BFE]">Coming Soon</span>
                </div>
                <p className="text-[11px] text-[#6b6b8a] mb-3">AI reviews submissions, scores quality 0-100, and provides actionable feedback.</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: "87%" }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full rounded-full bg-gradient-to-r from-[#6C5CE7] to-emerald-400" />
                  </div>
                  <span className="text-sm font-bold text-white">87</span>
                </div>
              </motion.div>

              {/* Streak */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-5 card-hover flex flex-col items-center justify-center text-center">
                <Flame className="w-6 h-6 text-orange-400 mb-2" />
                <span className="text-2xl font-bold text-white">7</span>
                <span className="text-[11px] text-[#6b6b8a]">Day Streak</span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ FOR AMBASSADORS SECTION ═══ */}
        <section id="for-ambassadors" className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.p {...fadeInUp} className="label-text mb-3">For Ambassadors</motion.p>
            <motion.h2 {...fadeInUp} className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
              Get Recognized for Your Hustle
            </motion.h2>
            <motion.p {...fadeInUp} className="text-[15px] text-[#6b6b8a] max-w-xl mx-auto mb-10">
              No more working in the dark. Every task you complete earns you points, badges, and a spot on the leaderboard.
            </motion.p>
            <motion.div {...fadeInUp}>
              <Link href="/auth?role=ambassador" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white transition-all glow-accent">
                Join as Ambassador <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="border-t border-white/[0.04] py-8 px-6">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#6C5CE7] flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-white">CampusConnect</span>
              <span className="text-[11px] text-[#6b6b8a] ml-2">The OS for campus programs.</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-[11px] text-[#6b6b8a] hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="text-[11px] text-[#6b6b8a] hover:text-white transition-colors">Terms</Link>
              <span className="text-[11px] text-[#6b6b8a]">© 2026 CampusConnect</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
