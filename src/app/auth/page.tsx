"use client";

import { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, User, ArrowRight, Building2, GraduationCap, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Starfield from "@/components/landing/Starfield";
import { signInWithEmail, signUpWithEmail, getCurrentUser, signOut } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [fieldErrors, setFieldErrors] = useState<{ fullName?: string; email?: string; password?: string }>({});

  // redirect if already logged in — try/catch handles stale/invalid refresh tokens
  useEffect(() => {
    (async () => {
      try {
        const profile = await getCurrentUser();
        if (profile) {
          router.replace(profile.role === "org" ? "/org/dashboard" : "/ambassador/dashboard");
        }
      } catch {
        // stale session — stay on auth page, Supabase will clear the bad token
      }
    })();
  }, [router]);

  function validate(): boolean {
    const errors: { fullName?: string; email?: string; password?: string } = {};
    if (mode === "signup" && !fullName.trim()) {
      errors.fullName = "Please enter your full name";
    }
    if (!EMAIL_RE.test(email)) {
      errors.email = "Please enter a valid email";
    }
    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
        const profile = await getCurrentUser();
        if (!profile) {
          toast.error("Account setup incomplete. Please sign up again.");
          await signOut();
          return;
        }
        // Enforce role toggle — block cross-role login attempts
        if (profile.role !== role) {
          await signOut();
          toast.error(
            profile.role === "org"
              ? "This account is registered as an Organization. Please select Organization to sign in."
              : "This account is registered as an Ambassador. Please select Ambassador to sign in."
          );
          return;
        }
        if (profile.role === "org") {
          router.push("/org/dashboard");
        } else if (profile.role === "ambassador") {
          router.push("/ambassador/dashboard");
        } else {
          toast.error("Unknown role. Please contact support.");
          await signOut();
        }
      } else {
        await signUpWithEmail(email, password, role, fullName.trim());
        // Fix 4: wait for session to be fully established before fetching profile
        await new Promise(resolve => setTimeout(resolve, 500));
        // Fix 2: verify profile was actually saved before redirecting
        const profile = await getCurrentUser();
        if (!profile) {
          toast.error("Account setup failed. Please try again.");
          return;
        }
        toast.success("Welcome to CampusConnect! 🎉");
        router.push(profile.role === "org" ? "/org/dashboard" : "/ambassador/dashboard");
      }
    } catch (err: unknown) {
      // SECURITY FIX: map raw Supabase error messages to safe user-facing strings
      const raw = (err instanceof Error ? err.message : "").toLowerCase();
      if (raw.includes("invalid login credentials") || raw.includes("invalid email or password")) {
        setError("Invalid email or password.");
      } else if (raw.includes("already registered") || raw.includes("user already registered")) {
        setError("already_registered");
      } else if (raw.includes("email not confirmed")) {
        setError("Please confirm your email before signing in.");
      } else if (raw.includes("password") && (raw.includes("length") || raw.includes("6 characters"))) {
        setError("Password must be at least 6 characters.");
      } else if (raw.includes("unable to validate email") || raw.includes("invalid email")) {
        setError("Please enter a valid email address.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const inputBase = "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white bg-white/[0.04] border focus:ring-1 focus:ring-[#6C5CE7]/30 outline-none placeholder:text-[#6b6b8a]/60 transition-all";
  const inputNormal = `${inputBase} border-white/[0.08] focus:border-[#6C5CE7]`;
  const inputInvalid = `${inputBase} border-red-500/50 focus:border-red-500`;

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
          {/* Role Toggle — always visible; on signup sets role, on signin purely cosmetic */}
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
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b8a]" />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); setFieldErrors((p) => ({ ...p, fullName: undefined })); }}
                    className={fieldErrors.fullName ? inputInvalid : inputNormal}
                  />
                </div>
                {fieldErrors.fullName && (
                  <p className="text-[11px] text-red-400 mt-1 ml-1">{fieldErrors.fullName}</p>
                )}
              </div>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b8a]" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: undefined })); }}
                  className={fieldErrors.email ? inputInvalid : inputNormal}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[11px] text-red-400 mt-1 ml-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b8a]" />
                <input
                  type="password"
                  placeholder={mode === "signin" ? "Password" : "Password (min 6 characters)"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: undefined })); }}
                  className={fieldErrors.password ? inputInvalid : inputNormal}
                />
              </div>
              {fieldErrors.password && (
                <p className="text-[11px] text-red-400 mt-1 ml-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Error message */}
            {error && error !== "already_registered" && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
              >
                <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-red-400">{error}</p>
              </motion.div>
            )}
            {error === "already_registered" && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
              >
                <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-red-400">
                  This email is already registered.{" "}
                  <button
                    type="button"
                    onClick={() => { setMode("signin"); setError(null); }}
                    className="underline hover:text-red-300 transition-colors"
                  >
                    Sign in instead?
                  </button>
                </p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-medium bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white transition-all glow-accent flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === "signup" ? "Creating account..." : "Signing in..."}
                </>
              ) : (
                <>
                  {mode === "signin" ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {mode === "signup" && (
            <div className="flex items-center gap-1 mt-3 text-[11px] text-[#6b6b8a]/50">
              <AlertCircle className="w-3 h-3" /> Role cannot be changed after signup
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-white/[0.04] text-center">
            <button
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setFieldErrors({}); }}
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
