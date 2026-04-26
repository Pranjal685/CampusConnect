"use client";

import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, User, ArrowRight, Building2, GraduationCap, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Starfield from "@/components/landing/Starfield";
import { signInWithEmail, signUpWithEmail } from "@/lib/db";

export default function AuthPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#06060e] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#A29BFE]" /></div>}>
      <AuthPage />
    </Suspense>
  );
}

function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<"org" | "ambassador">(
    (searchParams.get("role") as "org" | "ambassador") || "org"
  );
  const [mode, setMode] = useState<"signin" | "signup">((searchParams.get("mode") as "signin" | "signup") || "signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
        // Middleware will redirect to correct dashboard
        router.push(role === "org" ? "/org/dashboard" : "/ambassador/dashboard");
      } else {
        if (!fullName.trim()) {
          setError("Full name is required.");
          return;
        }
        await signUpWithEmail(email, password, role, fullName.trim());
        // Supabase may require email confirmation — redirect with message
        router.push(role === "org" ? "/org/dashboard" : "/ambassador/dashboard");
      }
    } catch (err: unknown) {
      // SECURITY FIX: map raw Supabase error messages to safe user-facing strings
      const raw = (err instanceof Error ? err.message : "").toLowerCase();
      let message = "Something went wrong. Please try again.";
      if (raw.includes("invalid login credentials") || raw.includes("invalid email or password")) {
        message = "Invalid email or password.";
      } else if (raw.includes("already registered") || raw.includes("user already registered")) {
        message = "An account with this email already exists.";
      } else if (raw.includes("email not confirmed")) {
        message = "Please confirm your email before signing in.";
      } else if (raw.includes("password") && raw.includes("length")) {
        message = "Password must be at least 6 characters.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#06060e] flex items-center justify-center px-6 relative">
      <Starfield />
      <div className="blob-purple" style={{ top: "-200px", right: "-200px" }} />
      <div className="blob-indigo" style={{ bottom: "-200px", left: "-200px" }} />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8 group">
          <div className="w-8 h-8 rounded-xl bg-[#6C5CE7] flex items-center justify-center transition-transform group-hover:scale-110">
            <Zap className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-base font-semibold text-white tracking-tight">CampusConnect</span>
        </Link>

        <div className="glass-md rounded-2xl p-6">
          {/* Role Toggle */}
          <div className="glass rounded-xl p-1 flex gap-1 mb-5">
            <button
              type="button"
              onClick={() => setRole("org")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                role === "org" ? "bg-[#6C5CE7] text-white" : "text-[#6b6b8a] hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Organization
            </button>
            <button
              type="button"
              onClick={() => setRole("ambassador")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                role === "ambassador" ? "bg-[#6C5CE7] text-white" : "text-[#6b6b8a] hover:text-white"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Ambassador
            </button>
          </div>

          <h2 className="text-lg font-bold text-white mb-1">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-[13px] text-[#6b6b8a] mb-5">
            {mode === "signin"
              ? `Sign in as ${role === "org" ? "an organization" : "an ambassador"}`
              : `Get started as ${role === "org" ? "an organization" : "an ambassador"}`}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Full name — signup only */}
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b8a]" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white bg-white/[0.04] border border-white/[0.08] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7]/30 outline-none placeholder:text-[#6b6b8a]/60 transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b8a]" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white bg-white/[0.04] border border-white/[0.08] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7]/30 outline-none placeholder:text-[#6b6b8a]/60 transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b8a]" />
              <input
                type="password"
                placeholder={mode === "signin" ? "Password" : "Password (min 6 characters)"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white bg-white/[0.04] border border-white/[0.08] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7]/30 outline-none placeholder:text-[#6b6b8a]/60 transition-all"
              />
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
              >
                <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-red-400">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-medium bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white transition-all glow-accent flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === "signin" ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-1 mt-3 text-[11px] text-[#6b6b8a]/50">
            <AlertCircle className="w-3 h-3" /> Role cannot be changed after signup
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.04] text-center">
            <button
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
              className="text-[12px] text-[#6b6b8a] hover:text-[#A29BFE] transition-colors"
            >
              {mode === "signin" ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
