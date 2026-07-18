"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-display",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

// Boot sequence lines — each appears with a small delay, like a real
// system log. Timings are staggered by index below.
const BOOT_LINES = [
  { label: "CORE", text: "waking neural core...", ok: "ONLINE" },
  { label: "MEM", text: "restoring memory index...", ok: "SYNCED" },
  { label: "NET", text: "establishing secure link...", ok: "CONNECTED" },
  { label: "RSCH", text: "calibrating research module...", ok: "READY" },
  { label: "PLAN", text: "loading planner state...", ok: "READY" },
  { label: "WS", text: "mounting workspace...", ok: "READY" },
];

const REDIRECT_PATH = "/home"; // <- change to your actual home route

export default function InitPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const lineDelay = reduceMotion ? 120 : 420;
  const totalDuration = BOOT_LINES.length * lineDelay + 900;

  // Reveal boot lines one by one
  useEffect(() => {
    if (visibleLines >= BOOT_LINES.length) return;
    const t = setTimeout(() => setVisibleLines((n) => n + 1), lineDelay);
    return () => clearTimeout(t);
  }, [visibleLines, lineDelay]);

  // Progress bar tied to total duration
  useEffect(() => {
    const start = Date.now();
    const raf = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      setProgress(pct);
      if (pct < 100) requestAnimationFrame(raf);
      else setDone(true);
    };
    const id = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(id);
  }, [totalDuration]);

  // Redirect shortly after completion
  useEffect(() => {
  if (!done) return;

  const t = setTimeout(() => {
    router.replace("/home");
  }, 600);

  return () => clearTimeout(t);
}, [done, router]);

  return (
    <main
      className={`${display.variable} ${mono.variable} relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#04060B] text-white`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      {/* Ambient glow */}
      <motion.div
        animate={
          reduceMotion
            ? { opacity: 0.4 }
            : { opacity: [0.25, 0.5, 0.25], scale: [1, 1.06, 1] }
        }
        transition={{ duration: 4, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[150px]"
      />

      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(103,232,249,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.5)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Scan line */}
      {!reduceMotion && (
        <motion.div
          animate={{ top: ["-10%", "110%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute left-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent"
        />
      )}

      {/* HUD corners */}
      <div className="pointer-events-none absolute inset-4 hidden sm:block" style={{ fontFamily: "var(--font-mono)" }}>
        <span className="absolute left-0 top-0 h-6 w-6 border-l border-t border-cyan-400/40" />
        <span className="absolute right-0 top-0 h-6 w-6 border-r border-t border-cyan-400/40" />
        <span className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-cyan-400/40" />
        <span className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-cyan-400/40" />
        <span className="absolute left-3 top-3 text-[10px] tracking-[0.25em] text-cyan-400/50">
          NOVA://BOOT
        </span>
        <span className="absolute right-3 top-3 text-[10px] tracking-[0.25em] text-cyan-400/50">
          {progress.toString().padStart(3, "0")}%
        </span>
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6">
        {/* Pulsing core */}
        <div className="relative mb-10 h-20 w-20">
          <motion.div
            animate={
              reduceMotion
                ? { opacity: 0.7 }
                : { opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }
            }
            transition={{ duration: 1.4, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 blur-[6px]"
          />
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
          <motion.svg
            viewBox="0 0 80 80"
            className="absolute inset-0"
            animate={reduceMotion ? {} : { rotate: 360 }}
            transition={{ duration: 3, repeat: reduceMotion ? 0 : Infinity, ease: "linear" }}
          >
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="rgba(103,232,249,0.4)"
              strokeWidth="1"
              strokeDasharray="3 7"
            />
          </motion.svg>
        </div>

        {/* NOVA wordmark, small */}
        <h1 className="mb-1 text-2xl font-bold tracking-[0.3em]">NOVA</h1>
        <p
          className="mb-10 text-[11px] tracking-[0.3em] text-cyan-400/60"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          INITIALIZING AGENT
        </p>

        {/* Boot log */}
        <div
          className="mb-8 w-full space-y-2 text-left text-[13px]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <AnimatePresence>
            {BOOT_LINES.slice(0, visibleLines).map((line) => (
              <motion.div
                key={line.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between gap-4"
              >
                <span className="flex items-center gap-2 text-zinc-400">
                  <span className="text-cyan-500/50">[{line.label}]</span>
                  {line.text}
                </span>
                <span className="shrink-0 text-cyan-300/80">{line.ok}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full bg-cyan-400"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          <div
            className="mt-2 flex items-center justify-between text-[10px] tracking-[0.2em] text-zinc-600"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span>BOOT SEQUENCE</span>
            <span>{done ? "COMPLETE" : "IN PROGRESS"}</span>
          </div>
        </div>

        {/* Skip */}
        {!done && (
          <button
            onClick={() => router.replace("/home")}
            className="mt-10 text-[11px] tracking-[0.2em] text-zinc-600 underline decoration-zinc-700 underline-offset-4 transition-colors hover:text-cyan-300 focus-visible:text-cyan-300"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            SKIP →
          </button>
        )}
      </div>
    </main>
  );
}