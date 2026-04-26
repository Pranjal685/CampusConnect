"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Zap, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it Works" },
    { href: "#for-orgs", label: "For Orgs" },
    { href: "#for-ambassadors", label: "For Ambassadors" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-md shadow-lg shadow-black/20"
          : "bg-transparent border-b border-transparent"
      }`}
      style={{ borderRadius: 0 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-[#6C5CE7] flex items-center justify-center transition-transform group-hover:scale-110">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white tracking-tight">
              CampusConnect
            </span>
          </Link>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-1.5 text-[13px] text-[#6b6b8a] hover:text-white transition-colors duration-200 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-3 right-3 h-px bg-[#6C5CE7] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </div>

          {/* Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth?mode=signin"
              className="px-3 py-1.5 text-[13px] text-[#6b6b8a] hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth?role=org"
              className="px-4 py-1.5 text-[13px] font-medium rounded-lg bg-[#6C5CE7] hover:bg-[#5a4bd1] text-white transition-all duration-200 hover:shadow-lg hover:shadow-[#6C5CE7]/20"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-[#6b6b8a] hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass-md border-t border-white/5 px-6 py-4 flex flex-col gap-2"
          style={{ borderRadius: 0 }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] text-[#6b6b8a] hover:text-white py-1.5 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 mt-2 pt-2 border-t border-white/5">
            <Link href="/auth?mode=signin" className="flex-1 text-center py-2 text-[13px] text-[#6b6b8a] hover:text-white rounded-lg border border-white/8 transition-colors" onClick={() => setMobileOpen(false)}>
              Sign In
            </Link>
            <Link href="/auth?role=org" className="flex-1 text-center py-2 text-[13px] font-medium text-white bg-[#6C5CE7] rounded-lg" onClick={() => setMobileOpen(false)}>
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
